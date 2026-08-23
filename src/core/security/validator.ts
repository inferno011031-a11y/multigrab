import { z } from 'zod';

export const AnalyzeRequestSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, { message: 'URL cannot be empty' })
    .max(2048, { message: 'URL exceeds maximum permitted length' })
    .url({ message: 'Invalid URL format' }),
});

export const DownloadRequestSchema = z.object({
  url: z
    .string()
    .trim()
    .min(1, { message: 'URL cannot be empty' })
    .max(2048, { message: 'URL exceeds maximum permitted length' })
    .url({ message: 'Invalid URL format' }),
  formatId: z
    .string()
    .trim()
    .min(1, { message: 'Format ID cannot be empty' })
    .max(128, { message: 'Format ID too long' })
    .regex(/^[a-zA-Z0-9_+/.-]+$/, { message: 'Format ID contains invalid characters' }),
  quality: z.string().optional(),
});
