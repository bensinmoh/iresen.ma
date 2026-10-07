import type { MetadataRoute } from 'next'
import { getSiteUrl, isIndexingEnabled } from '@/lib/site'

// Next recognizes robots.ts only at the app root, unlike nested sitemap routes.
export default function robots(): MetadataRoute.Robots {
  if (!isIndexingEnabled()) {
    return { rules: { userAgent: '*', disallow: '/' } }
  }

  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: new URL('/sitemap.xml', getSiteUrl()).toString(),
  }
}
