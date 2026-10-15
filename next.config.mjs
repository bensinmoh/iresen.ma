import { withPayload } from '@payloadcms/next/withPayload'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
if (
  process.env.NODE_ENV === 'production' &&
  process.env.CMS_LOCAL_REVIEW === 'true' &&
  process.env.PUBLIC_RELEASE === 'true'
) {
  throw new Error('Local CMS review cannot be enabled for a public release.')
}
const nextConfig = {
  output: 'standalone',
  outputFileTracingExcludes: {
    '*': ['./.env*', './docs/**', './private-references/**', './tests/**'],
  },
  // Allow a production review build while the owner's development server keeps running.
  distDir: process.env.NEXT_BUILD_DIRECTORY || '.next',
  // The existing loopback review URL must receive dev assets and hot updates too.
  allowedDevOrigins: ['127.0.0.1'],
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    qualities: [60, 75, 90],
    // Published CMS bytes must recheck access on every request; Next's image
    // cache can outlive withdrawal even when the upstream response is no-store.
    localPatterns: [
      { pathname: '/images/heroes/**', search: '' },
      { pathname: '/images/media-library/**', search: '' },
      { pathname: '/images/news/**', search: '' },
      { pathname: '/images/publications/**', search: '' },
      { pathname: '/images/projects/**', search: '' },
      { pathname: '/images/careers/**', search: '' },
      { pathname: '/images/missions/**', search: '' },
      { pathname: '/images/domains/**', search: '' },
      { pathname: '/images/roadmap/**', search: '' },
      { pathname: '/images/governance/**', search: '' },
      { pathname: '/images/institute/fifteen-year-report-cover-cutout.webp', search: '' },
      { pathname: '/images/platforms/**', search: '' },
      { pathname: '/images/infrastructure/**', search: '' },
      { pathname: '/images/programmes/**', search: '' },
      { pathname: '/images/achievements/**', search: '' },
      { pathname: '/images/collaborate/**', search: '' },
      { pathname: '/images/transfer/ismart-product.webp', search: '' },
      { pathname: '/images/contact/contact-background-venue.jpg', search: '' },
    ],
  },
  async redirects() {
    return [
      {
        source: '/fr/travailler-avec-nous',
        destination: '/fr/collaborer-avec-nous',
        permanent: true,
      },
      { source: '/en/work-with-us', destination: '/en/collaborate-with-us', permanent: true },
      { source: '/travailler-avec-nous', destination: '/fr/collaborer-avec-nous', permanent: true },
      { source: '/work-with-us', destination: '/en/collaborate-with-us', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          ...(process.env.SITE_INDEXING_ENABLED === 'true'
            ? []
            : [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]),
        ],
      },
      {
        source: '/cms-preview/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          { key: 'Cache-Control', value: 'private, no-store' },
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
