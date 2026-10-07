import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Media } from './cms/collections/Media'
import { News } from './cms/collections/News'
import { Pages } from './cms/collections/Pages'
import { Users } from './cms/collections/Users'

const sourceDirectory = path.dirname(fileURLToPath(import.meta.url))

function requiredEnvironmentVariable(name: string): string {
  const value = process.env[name]
  if (!value)
    throw new Error(`${name} is required. Follow README local setup before starting the CMS.`)
  return value
}

const siteURL = process.env.NEXT_PUBLIC_SITE_URL

export default buildConfig({
  admin: { user: 'users', importMap: { baseDir: path.resolve(sourceDirectory, '..') } },
  collections: [Users, Pages, News, Media],
  db: postgresAdapter({
    pool: { connectionString: requiredEnvironmentVariable('DATABASE_URL') },
    migrationDir: path.resolve(sourceDirectory, 'cms/migrations'),
    push: false,
  }),
  editor: lexicalEditor(),
  email: () => ({
    name: 'unconfigured',
    defaultFromAddress: 'no-reply@example.invalid',
    defaultFromName: 'IRESEN',
    sendEmail: async () => {
      throw new Error('CMS email delivery is not configured. Contact an administrator.')
    },
  }),
  secret: requiredEnvironmentVariable('PAYLOAD_SECRET'),
  sharp,
  localization: {
    locales: [
      { code: 'fr', label: 'Français' },
      { code: 'en', label: 'English' },
      { code: 'ar', label: 'العربية', rtl: true },
    ],
    defaultLocale: 'fr',
    fallback: false,
  },
  graphQL: { disable: true },
  upload: { limits: { fileSize: 10_000_000 } },
  typescript: { outputFile: path.resolve(sourceDirectory, 'payload-types.ts') },
  ...(siteURL ? { serverURL: siteURL, cors: [siteURL], csrf: [siteURL] } : {}),
  telemetry: false,
})
