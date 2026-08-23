type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogPayload {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: string;
  [key: string]: unknown;
}

class Logger {
  private formatMessage(level: LogLevel, message: string, context?: string, meta?: Record<string, unknown>): string {
    const payload: LogPayload = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(context ? { context } : {}),
      ...(meta ? this.sanitizeMeta(meta) : {}),
    };

    if (process.env.NODE_ENV === 'production') {
      return JSON.stringify(payload);
    }

    const colorMap: Record<LogLevel, string> = {
      debug: '\x1b[34m[DEBUG]\x1b[0m',
      info: '\x1b[32m[INFO]\x1b[0m',
      warn: '\x1b[33m[WARN]\x1b[0m',
      error: '\x1b[31m[ERROR]\x1b[0m',
    };

    const ctx = context ? ` \x1b[36m[${context}]\x1b[0m` : '';
    const metaStr = meta && Object.keys(meta).length > 0 ? ` ${JSON.stringify(this.sanitizeMeta(meta))}` : '';
    return `${payload.timestamp} ${colorMap[level]}${ctx} ${message}${metaStr}`;
  }

  private sanitizeMeta(meta: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    const sensitiveKeys = ['password', 'secret', 'token', 'authorization', 'cookie', 'key'];

    for (const [key, value] of Object.entries(meta)) {
      if (sensitiveKeys.some((s) => key.toLowerCase().includes(s))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeMeta(value as Record<string, unknown>);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  debug(message: string, context?: string, meta?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== 'production' || process.env.DEBUG === 'true') {
      console.debug(this.formatMessage('debug', message, context, meta));
    }
  }

  info(message: string, context?: string, meta?: Record<string, unknown>) {
    console.info(this.formatMessage('info', message, context, meta));
  }

  warn(message: string, context?: string, meta?: Record<string, unknown>) {
    console.warn(this.formatMessage('warn', message, context, meta));
  }

  error(message: string, context?: string, meta?: Record<string, unknown>) {
    console.error(this.formatMessage('error', message, context, meta));
  }
}

export const logger = new Logger();
