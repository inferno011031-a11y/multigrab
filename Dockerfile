# Multi-stage production build for MediaDrop
FROM node:20-alpine AS base

# Install Python3, yt-dlp, and ffmpeg
RUN apk add --no-cache \
    python3 \
    py3-pip \
    ffmpeg \
    curl \
    && pip install --no-cache-dir --break-system-packages yt-dlp

WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci

# Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npx prisma generate
RUN npm run build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Create temp download storage directory with proper permissions
RUN mkdir -p /app/tmp/downloads && chown -R nextjs:nodejs /app/tmp

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
