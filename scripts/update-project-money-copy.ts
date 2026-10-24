import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { getPayload } from 'payload'
import config from '../src/payload.config'
import { searchDatabase } from '../src/lib/search/database'
import fr from '../src/data/project-editorial-fr.json' with { type: 'json' }
import en from '../src/data/project-editorial-en.json' with { type: 'json' }
import ar from '../src/data/project-editorial-ar.json' with { type: 'json' }

if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(process.env.DATABASE_URL!).hostname))
  throw new Error('Money format reconciliation requires the local database.')
const references = ['solrshemsy'] as const
const locales = ['fr', 'en', 'ar'] as const
const payload = await getPayload({ config })
try {
  const users = await payload.find({
    collection: 'users',
    overrideAccess: true,
    limit: 1,
    where: { role: { equals: 'admin' } },
  })
  if (!users.docs[0]) throw new Error('An existing local administrator is required.')
  const actor = { ...users.docs[0], collection: 'users' as const }
  const current = await payload.find({
    collection: 'projects',
    locale: 'all',
    fallbackLocale: false,
    overrideAccess: false,
    user: actor,
    depth: 0,
    limit: 100,
    where: { reference: { in: [...references] } },
  })
  if (current.docs.length !== references.length)
    throw new Error('Expected the existing SOLR’SHEMSY record.')
  const root = path.resolve(
    '.local/projects/money-format',
    new Date().toISOString().replaceAll(':', '-'),
  )
  await mkdir(root, { recursive: true, mode: 0o700 })
  await writeFile(path.join(root, 'before.json'), JSON.stringify(current.docs, null, 2), {
    mode: 0o600,
    flag: 'wx',
  })
  const plan = []
  for (const reference of references) {
    const id = current.docs.find((project) => project.reference === reference)!.id
    for (const locale of locales) {
      const before = await payload.findByID({
        collection: 'projects',
        id,
        locale,
        fallbackLocale: false,
        depth: 0,
        overrideAccess: false,
        user: actor,
      })
      const next = { fr, en, ar }[locale][reference]
      const oldMoney = { fr: '4 000 DH', en: '4,000 DH', ar: '4000 درهم' }[locale]
      const objectives = before.objectives?.replace(oldMoney, '4\u00a0000\u00a0MAD')
      if (objectives !== next.objectives.join('\n\n'))
        throw new Error(`Preserve separately edited objectives: ${reference}/${locale}`)
      plan.push({ id, reference, locale, before, next })
    }
  }
  if (!process.argv.includes('--apply'))
    console.log(`Validated ${plan.length} localized monetary objectives. Use --apply to reconcile.`)
  else {
    const transactionID = await payload.db.beginTransaction()
    if (transactionID == null) throw new Error('A transaction is required.')
    try {
      for (const { id, reference, locale, before, next } of plan) {
        const data = { objectives: next.objectives.join('\n\n') }
        if (before.objectives === data.objectives) continue
        const after = await payload.update({
          collection: 'projects',
          id,
          locale,
          overrideAccess: false,
          user: actor,
          req: { transactionID },
          data,
        })
        for (const key of [
          'visibility',
          '_status',
          'publicationStatus',
          'translationReview',
        ] as const)
          if (before[key] !== after[key])
            throw new Error(`Publication gate changed: ${reference}/${locale}/${key}`)
        console.log(`Updated ${reference}/${locale}`)
      }
      await payload.db.commitTransaction(transactionID)
    } catch (error) {
      await payload.db.rollbackTransaction(transactionID)
      throw error
    }
  }
} finally {
  await payload.destroy()
  await searchDatabase().end()
}

// Teardown is complete; stop residual library timers for this one-shot command.
process.exit(0)
