import 'server-only'
import { getPayload } from 'payload'
import config from '@/payload.config'
import type { Locale } from '@/i18n/locales'
import { type CareerOffer } from '@/lib/careers'

export async function findCareerOffers(locale: Locale): Promise<CareerOffer[]> {
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'opportunities',
    locale,
    fallbackLocale: false,
    overrideAccess: false,
    draft: false,
    depth: 0,
    limit: 100,
    sort: 'reference',
    where: { state: { equals: 'open' } },
    select: {
      reference: true,
      title: true,
      department: true,
      contract: true,
      location: true,
      summary: true,
      experience: true,
      availability: true,
      missions: true,
      profile: true,
      isDemo: true,
    },
  })
  // No incomplete translation or language fallback enters the rendered collection.
  return docs
    .filter((doc) =>
      [
        'title',
        'department',
        'location',
        'summary',
        'experience',
        'availability',
        'missions',
        'profile',
      ].every(
        (key) =>
          typeof doc[key as keyof typeof doc] === 'string' &&
          String(doc[key as keyof typeof doc]).trim(),
      ),
    )
    .map((doc) => ({
      id: doc.id,
      reference: doc.reference,
      title: doc.title!,
      department: doc.department!,
      contract: doc.contract,
      location: doc.location!,
      summary: doc.summary!,
      experience: doc.experience!,
      availability: doc.availability!,
      missions: doc.missions!,
      profile: doc.profile!,
      isDemo: Boolean(doc.isDemo),
    }))
}
