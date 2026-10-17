import { z } from 'zod'
export const variantSchema = z.object({
  title: z.string().max(5000),
  body: z.string().max(200000),
  status: z.enum(['draft', 'review', 'published']),
  seoTitle: z.string().max(5000),
  seoDescription: z.string().max(20000),
  fields: z.record(z.string(), z.string().max(200000)).default({}),
})
export const sourceSchema = z.object({
  collection: z.enum(['news', 'projects', 'calls', 'opportunities', 'pages', 'media']),
  id: z.number().int().positive(),
  revision: z.string(),
})
export const entrySchema = z.object({
  id: z.string().min(1).max(200),
  module: z.string().min(1).max(100),
  reference: z.string().min(1).max(500),
  shared: z.record(z.string(), z.string().max(200000)),
  variants: z.object({ fr: variantSchema, en: variantSchema, ar: variantSchema }),
  updatedAt: z.string(),
  history: z
    .array(
      z.object({
        id: z.string(),
        at: z.string(),
        language: z.enum(['fr', 'en', 'ar']),
        variant: variantSchema,
        note: z.string(),
        shared: z.record(z.string(), z.string()).optional(),
      }),
    )
    .max(30),
  comment: z.string().max(20000),
  publicVariants: z.object({
    fr: variantSchema.optional(),
    en: variantSchema.optional(),
    ar: variantSchema.optional(),
  }),
  source: sourceSchema.optional(),
})
export const workspaceSchema = z.object({
  version: z.literal(1),
  entries: z.array(entrySchema).max(5000),
  logs: z
    .array(
      z.object({
        id: z.string(),
        at: z.string(),
        action: z.string(),
        resource: z.string(),
        language: z.enum(['fr', 'en', 'ar']).optional(),
        actor: z.enum(['admin', 'editor']),
        kind: z.enum(['audit', 'technical']),
      }),
    )
    .max(200),
})
