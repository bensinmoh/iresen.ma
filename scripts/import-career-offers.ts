import { getPayload } from 'payload'
import config from '../src/payload.config'
import offers from '../src/data/career-offers-fr.json' with { type: 'json' }
import { searchDatabase } from '../src/lib/search/database'
import { rebuildSearchIndex } from '../src/lib/search/indexer'

// This owner-requested import is local only. Never target a hosted database.
const hostname = new URL(process.env.DATABASE_URL!).hostname
if (!['localhost', '127.0.0.1', '[::1]'].includes(hostname))
  throw new Error('Career offer import requires a local database.')

const payload = await getPayload({ config })
try {
  const users = await payload.find({
    collection: 'users',
    where: { role: { equals: 'admin' } },
    limit: 1,
    overrideAccess: true,
  })
  const user = users.docs[0]
  if (!user) throw new Error('An existing local administrator is required.')
  const actor = { ...user, collection: 'users' as const }
  for (const { source, ...offer } of offers) {
    const existing = await payload.find({
      collection: 'opportunities',
      locale: 'fr',
      fallbackLocale: false,
      overrideAccess: false,
      user: actor,
      where: { reference: { equals: offer.reference } },
      limit: 1,
    })
    // Updating these two sourced records requires an explicit command flag.
    if (existing.docs.length) {
      if (process.argv.includes('--update')) {
        await payload.update({
          collection: 'opportunities',
          id: existing.docs[0]!.id,
          locale: 'fr',
          fallbackLocale: false,
          overrideAccess: false,
          user: actor,
          draft: false,
          data: {
            ...offer,
            contract: 'CDI',
            _status: 'published',
            internalNotes: `Owner-requested compact FR copy, 2026-10-16. Source: ${source.filename}; SHA-256 ${source.sha256}. Publication: ${source.publicationDate}; deadline: ${source.applicationDeadline}. References derive from filenames. EN/AR unapproved. Applications use owner-supplied Tally destinations in career-application-links.json.`,
          },
        })
        console.log(`Updated ${offer.reference} (FR)`)
        continue
      }
      console.log(`Preserved existing ${offer.reference}`)
      continue
    }
    await payload.create({
      collection: 'opportunities',
      locale: 'fr',
      fallbackLocale: false,
      overrideAccess: false,
      user: actor,
      draft: false,
      data: {
        ...offer,
        contract: 'CDI',
        isDemo: false,
        state: 'open',
        visibility: 'public',
        publicationStatus: 'published',
        _status: 'published',
        internalNotes: `Owner-requested local integration, 2026-10-16. Source: ${source.filename}; SHA-256 ${source.sha256}. Published in source: ${source.publicationDate}; deadline: ${source.applicationDeadline}. References derive from source filenames. FR only; no approved EN/AR translation. Owner-supplied Tally destinations are recorded in career-application-links.json.`,
      },
    })
    console.log(`Imported ${offer.reference} (FR)`)
  }
  console.log(`Search synchronized: ${await rebuildSearchIndex()} public CMS records`)
  for (const locale of ['fr', 'en', 'ar'] as const) {
    const result = await payload.find({
      collection: 'opportunities',
      locale,
      fallbackLocale: false,
      overrideAccess: false,
      draft: false,
      where: { reference: { in: offers.map((offer) => offer.reference) } },
    })
    const expected = locale === 'fr' ? 2 : 0
    if (result.docs.length !== expected) throw new Error(`Unexpected ${locale} offer visibility`)
    console.log(`Verified ${locale}: ${result.docs.length} eligible offers`)
  }
} finally {
  await payload.destroy()
  await searchDatabase().end()
}
process.exit(0)
