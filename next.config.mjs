import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    qualities: [75, 90],
    // Published CMS bytes must recheck access on every request; Next's image
    // cache can outlive withdrawal even when the upstream response is no-store.
    localPatterns: [
      { pathname: '/images/heroes/**', search: '' },
      { pathname: '/images/missions/**', search: '' },
      { pathname: '/images/domains/**', search: '' },
      { pathname: '/images/platforms/**', search: '' },
      { pathname: '/images/achievements/**', search: '' },
      { pathname: '/images/transfer/ismart-product.webp', search: '' },
      { pathname: '/images/contact/contact-background-venue.jpg', search: '' },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          ...(process.env.SITE_INDEXING_ENABLED === 'true'
            ? []
            : [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]),
        ],
      },
      {
        source: '/admin/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      {
        source: '/api/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
      ...['/fr/recherche', '/en/search', '/ar/البحث', '/fr/search', '/ar/search'].map((source) => ({
        source,
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, follow' }],
      })),
    ]
  },
}

export default withPayload(withNextIntl(nextConfig))
