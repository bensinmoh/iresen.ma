import { editorialIndicatorDefaults } from '@/lib/editorial-indicators'
import { publicAssetReferences } from '@/lib/search/catalog'
import { usefulLinks } from '@/lib/useful-links'
import mediaPhotos from '@/data/media-photos.json' with { type: 'json' }
import mediaReports from '@/data/media-reports.json' with { type: 'json' }
import { topicAliases } from '@/lib/search/concepts'
import publicationRecords from '@/data/publications.json' with { type: 'json' }
import patentRecords from '@/data/patents.json' with { type: 'json' }
import callRecords from '@/data/call-archives.json' with { type: 'json' }
import fr from '@/messages/fr.json' with { type: 'json' }
import en from '@/messages/en.json' with { type: 'json' }
import ar from '@/messages/ar.json' with { type: 'json' }
import {
  governanceBoard,
  governanceBoardLogo,
  governanceBoardSites,
  governanceScientists,
  governanceScientistLinkedin,
  governanceScientistRegions,
  governanceDepartments,
  governanceTeamLinkedin,
} from '@/lib/governance'
import { networkLaboratories, suppliedLaboratoryContact } from '@/lib/network'
import { homePlatforms, platformPhotoPath } from '@/lib/home-platforms'
import { newsEvents, newsImages, eventImages, selectedNews } from '@/lib/news-events'
import { linkedInPostHref } from '@/lib/home-news'
import { samirBiographies, samirCutout } from '@/lib/samir-biography'
import { footerContact } from '@/lib/footer'
import { pageIds } from '@/lib/site'
import { pageSections } from '@/lib/page-sections'
import { createEntry, languages, type Entry, type Language } from '@/lib/cms-preview/model'

const catalogs = { fr, en, ar }
export const retainedContentVersion = '2026-10-16-v3'
const stringify = (value: unknown): string =>
  value == null
    ? ''
    : Array.isArray(value)
      ? value.join('\n')
      : typeof value === 'object'
        ? JSON.stringify(value, null, 2)
        : String(value)
export function retainedContentEntries(at: string): Entry[] {
  const entries: Entry[] = []
  function record(
    module: string,
    key: string,
    dataset: string,
    raw: unknown,
    shared: Record<string, unknown>,
    local: (locale: Language) => { title: string; body?: string; fields?: Record<string, unknown> },
    publicFR = true,
  ) {
    const entry = createEntry(module, `retained-${module}-${key}`, at)
    entry.reference = key
    entry.shared = Object.fromEntries(
      Object.entries({
        ...shared,
        _sourceDataset: dataset,
        _sourceKey: key,
        _sourceVersion: retainedContentVersion,
        sourceRecord: JSON.stringify(raw, null, 2),
        visibility: publicFR ? 'public' : 'private',
      }).map(([key, value]) => [key, stringify(value)]),
    )
    for (const locale of languages) {
      const value = local(locale)
      const variant = entry.variants[locale]
      variant.title = value.title
      variant.body = value.body ?? ''
      variant.fields = Object.fromEntries(
        Object.entries(value.fields ?? {}).map(([key, value]) => [key, stringify(value)]),
      )
      // Mirror existing editorial content; never infer approval of working translations
      // or a new public projection from the act of importing it into the CMS.
      variant.status = 'review'
      if (publicFR && locale === 'fr') {
        variant.status = 'published'
        entry.publicVariants.fr = structuredClone(variant)
        entry.publicVariants.fr.fields._publishedShared = JSON.stringify(shared)
      }
    }
    entries.push(entry)
    return entry
  }
  for (const publication of publicationRecords)
    record(
      'publications',
      publication.id,
      'src/data/publications.json',
      publication,
      {
        doi: publication.doiUrl,
        authors: publication.authors,
        year: publication.year,
        journal: publication.journal,
        bibliographicTheme: publication.theme,
        publicationType: publication.type,
        quartile: publication.quartile,
        quartileStatus: publication.quartileStatus,
        quartileYear: publication.quartileYear,
        quartileEvidence: publication.quartileEvidence,
        quartileSourceUrl: publication.quartileSourceUrl,
        citations: publication.scopusCitations,
        citationsAsOf: publication.scopusCitationsAsOf,
        historicalQuartile: publication.historicalQuartile,
        historicalQuartileYear: publication.historicalQuartileYear,
        historicalQuartileSourceUrl: publication.historicalQuartileSourceUrl,
        historicalQuartileEvidence: publication.historicalQuartileEvidence,
      },
      () => ({ title: publication.title }),
    )
  for (const patent of patentRecords)
    record(
      'patents',
      patent.reference,
      'src/data/patents.json',
      patent,
      {
        reference: patent.reference,
        applicants: patent.depositor,
        year: patent.filingYear,
        filingDate: 'filingDate' in patent ? patent.filingDate : '',
        registry: patent.registerUrl,
        granted: patent.granted,
        theme: patent.themes.map((id) => `retained-themes-${id}`),
      },
      (locale) => ({ title: patent.title[locale], body: patent.description[locale] }),
      patent.granted,
    )
  for (const call of callRecords.records) {
    const profile = callRecords.profiles[call.profile as keyof typeof callRecords.profiles]
    record(
      'calls',
      call.reference,
      'src/data/call-archives.json',
      { ...call, profile },
      {
        reference: call.reference,
        launchYear: call.year,
        archivePeriod: call.period,
        archiveState: call.state,
        kind: call.kind,
        funders: profile.partners,
        sourceUrl: call.sources[0]?.url,
        sources: JSON.stringify(call.sources, null, 2),
      },
      (locale) => ({
        title: call.title,
        body: profile.summary[locale],
        fields: {
          eligibility: profile.audience[locale],
          archiveThemes: profile.themes[locale],
          calendarNote: 'note' in call ? call.note?.[locale] : '',
          periodLabel: 'periodLabel' in call ? call.periodLabel?.[locale] : '',
        },
      }),
    )
  }
  for (const lab of networkLaboratories)
    record(
      'laboratories',
      lab.id,
      'src/lib/network.ts + messages.Network.labs',
      lab,
      {
        subject: lab.topic,
        locationCode: lab.location,
        contact:
          lab.id === suppliedLaboratoryContact.id
            ? suppliedLaboratoryContact.email
            : lab.id === 'solar-energy'
              ? 'ghennioui@iresen.org'
              : '',
      },
      (locale) => {
        const value = catalogs[locale].Network.labs[lab.id]
        return { title: value.title, fields: { institution: value.institution, city: value.city } }
      },
    )
  for (const [index, id] of governanceBoard.entries())
    record(
      'board',
      id,
      'src/lib/governance.ts + messages.Governance.board',
      { id, website: governanceBoardSites[id] },
      {
        website: governanceBoardSites[id],
        sortOrder: index,
        sourceImagePath: governanceBoardLogo(id),
      },
      (locale) => ({
        title: catalogs[locale].Governance.board[id],
        fields: { institution: catalogs[locale].Governance.board[id] },
      }),
    )
  for (const [index, id] of governanceScientists.entries())
    record(
      'scientific-council',
      id,
      'src/lib/governance.ts + messages.Governance.scientists',
      { id, region: governanceScientistRegions[id] },
      {
        profile: governanceScientistLinkedin[id],
        sortOrder: index,
        sourceImagePath: `/images/governance/${id}.webp`,
        region: governanceScientistRegions[id],
      },
      (locale) => {
        const value = catalogs[locale].Governance.scientists[id]
        return {
          title: value.name,
          fields: { professionalRole: value.role, country: value.country },
        }
      },
    )
  const personParents = new Map<string, string>()
  for (const [poleIndex, pole] of fr.Governance.organisation.poles.entries()) {
    const poleId = `pole-${poleIndex}`
    record(
      'organigram',
      poleId,
      'messages.Governance.organisation',
      pole,
      { recordType: 'pole', sortOrder: poleIndex },
      (locale) => {
        const value = catalogs[locale].Governance.organisation.poles[poleIndex]
        return { title: value.title, body: value.tagline }
      },
    )
    for (const [departmentIndex, department] of pole.directions.entries()) {
      const departmentId = `department-${poleIndex}-${departmentIndex}`
      const person = governanceDepartments[poleIndex][departmentIndex]
      personParents.set(person, `retained-organigram-${departmentId}`)
      record(
        'organigram',
        departmentId,
        'messages.Governance.organisation',
        department,
        {
          recordType: 'department',
          parentId: `retained-organigram-${poleId}`,
          headId: `retained-organigram-${person}`,
          sortOrder: departmentIndex,
        },
        (locale) => {
          const value =
            catalogs[locale].Governance.organisation.poles[poleIndex].directions[departmentIndex]
          return { title: value.title, body: value.description }
        },
      )
    }
  }
  for (const [id, parentId] of personParents)
    record(
      'organigram',
      id,
      'messages.Governance.team + supplied biography',
      { id },
      {
        recordType: 'person',
        parentId,
        profile: governanceTeamLinkedin[id as keyof typeof governanceTeamLinkedin],
        sourceImagePath: id === 'samir' ? samirCutout : `/images/governance/${id}-portrait.png`,
      },
      (locale) => {
        const value = catalogs[locale].Governance.team[id as keyof typeof fr.Governance.team]
        const biography =
          id === 'samir'
            ? samirBiographies[locale].paragraphs.join('\n\n')
            : 'biography' in value
              ? value.biography
              : ''
        return {
          title: value.name,
          body: biography,
          fields: { function: value.role, shortBiography: biography },
        }
      },
    )
  for (const post of selectedNews) {
    const id = post.id.split(':').at(-1)!
    record(
      'news',
      id,
      'src/lib/news-events.ts + messages.NewsEvents',
      post,
      {
        type: 'news',
        publicationMonth: post.publicationMonth,
        sourceUrl: linkedInPostHref(post.id),
        sourceImagePath: newsImages[id]?.src,
      },
      (locale) => ({
        title: catalogs[locale].NewsEvents.newsTitles[id as keyof typeof fr.NewsEvents.newsTitles],
        body: catalogs[locale].NewsEvents.summaries[id as keyof typeof fr.NewsEvents.summaries],
      }),
    )
  }
  for (const event of newsEvents)
    record(
      'events',
      event.id,
      'src/lib/news-events.ts + messages.NewsEvents.events',
      event,
      {
        eventStatus: event.past ? 'completed' : 'preparation',
        registration: event.href,
        role: event.role,
        sourceImagePath: eventImages[event.id].src,
      },
      (locale) => {
        const value = catalogs[locale].NewsEvents.events[event.id]
        return {
          title: value.name,
          body: [value.description, value.detail].join('\n\n'),
          fields: { place: value.place, dateLabel: value.meta },
        }
      },
    )
  for (const platform of homePlatforms)
    record(
      'platforms',
      platform.id,
      'src/lib/home-platforms.ts + messages.Platforms',
      platform,
      {
        maturity: platform.id === 'greenh2a' ? 'in-development' : '',
        sourceImagePath: platformPhotoPath(platform.id),
        logoPath: `/brand/platforms/${platform.id}.svg`,
        destination: platform.id === 'gep' ? 'https://www.greenenergypark.ma/' : '',
      },
      (locale) => {
        const value = catalogs[locale].Platforms.platforms[platform.id]
        return {
          title: value.name,
          body: value.paragraphs.join('\n\n'),
          fields: {
            location: value.location,
            infrastructure: JSON.stringify(value.infrastructure, null, 2),
          },
        }
      },
    )
  for (const [index, key] of Object.keys(fr.Contact.faq.questions).entries())
    record(
      'faq',
      `contact-${key}`,
      'messages.Contact.faq.questions',
      { key },
      { category: 'contact', placement: 'contact', sortOrder: index },
      (locale) => {
        const value =
          catalogs[locale].Contact.faq.questions[key as keyof typeof fr.Contact.faq.questions]
        return { title: value.question, body: value.answer }
      },
    )
  const themeKeys = [...new Set(patentRecords.flatMap((patent) => patent.themes))]
  for (const key of themeKeys)
    record(
      'themes',
      key,
      'messages.Transfer.themes',
      { key },
      {},
      (locale) => ({
        title: catalogs[locale].Transfer.themes[key as keyof typeof fr.Transfer.themes],
      }),
      false,
    )
  record(
    'coordinates',
    'headquarters',
    'src/lib/footer.ts + messages.Footer',
    footerContact,
    { email: footerContact.email, phone: footerContact.phone, usage: 'footer\ncontact' },
    (locale) => ({
      title: catalogs[locale].Contact.headquarters.title,
      fields: { address: catalogs[locale].Footer.address },
    }),
  )
  for (const pageId of pageIds) {
    const sections = pageSections[pageId]
    const addSection = (section: { id: string; children?: readonly { id: string }[] }) => {
      const localized = (locale: Language) =>
        (
          catalogs[locale].PageSections as Record<
            string,
            Record<string, { title?: string; description?: string }>
          >
        )[pageId]?.[section.id]
      if (localized('fr')?.title)
        record(
          'pages',
          `${pageId}-${section.id}`,
          'messages.PageSections',
          { pageId, sectionId: section.id },
          { pageId, sectionId: section.id },
          (locale) => ({
            title: localized(locale)?.title ?? '',
            body: localized(locale)?.description ?? '',
          }),
        )
      for (const child of section.children ?? []) addSection(child)
    }
    for (const section of sections) addSection(section)
  }
  const registeredUrls = new Set([
    ...mediaPhotos.map((photo) => photo.src),
    ...mediaReports.map((report) => report.url),
  ])
  for (const asset of publicAssetReferences) {
    if (registeredUrls.has(asset.url) || !['media', 'document', 'report'].includes(asset.type))
      continue
    registeredUrls.add(asset.url)
    const pathname = asset.url.split('?')[0]
    const extension = pathname.split('.').at(-1)
    const mime =
      (
        {
          webp: 'image/webp',
          png: 'image/png',
          jpg: 'image/jpeg',
          jpeg: 'image/jpeg',
          svg: 'image/svg+xml',
          pdf: 'application/pdf',
          mp4: 'video/mp4',
        } as Record<string, string>
      )[extension ?? ''] ?? ''
    record(
      'media',
      `asset-${asset.id}`,
      'publicAssetReferences',
      asset,
      {
        fileName: pathname.split('/').at(-1),
        assetPath: asset.url,
        mimeType: mime,
        sourceImagePath: mime.startsWith('image/') ? asset.url : '',
        category: 'site-assets',
        usage: asset.id,
      },
      (locale) => ({
        title: asset.text[locale]?.title ?? '',
        body: asset.text[locale]?.description ?? '',
        fields: {
          alt: asset.text[locale]?.title ?? '',
          caption: asset.text[locale]?.description ?? '',
        },
      }),
      Boolean(asset.text.fr),
    )
  }
  // The complete delivered catalogue, including nested arrays (missions, biographies,
  // roadmap axes, chronology, links…). Section summaries alone are insufficient.
  for (const namespace of Object.keys(fr)) {
    record(
      'pages',
      `catalog-${namespace}`,
      'messages/catalog',
      Object.fromEntries(
        languages.map((locale) => [locale, catalogs[locale][namespace as keyof typeof fr]]),
      ),
      { pageId: 'catalog', sectionId: namespace, catalogNamespace: namespace },
      (locale) => ({
        title: namespace,
        body: `Contenus structurés : ${namespace}`,
        fields: {
          structuredContent: JSON.stringify(
            catalogs[locale][namespace as keyof typeof fr],
            null,
            2,
          ),
        },
      }),
    )
  }
  for (const link of usefulLinks) {
    record(
      'media',
      `link-${link.id}`,
      'src/lib/useful-links.ts',
      link,
      { resourceKind: 'links', sourceUrl: link.href, usage: 'media/links' },
      (locale) => {
        const copy = catalogs[locale].UsefulLinks.items.find((item) => item.id === link.id)!
        return { title: copy.title, body: copy.description }
      },
    )
    // Existing owner-approved public links and exact localized copy, split into
    // individual records without changing their current publication state.
    const entry = entries.at(-1)!
    for (const locale of languages) {
      entry.variants[locale].status = 'published'
      entry.publicVariants[locale] = structuredClone(entry.variants[locale])
      entry.publicVariants[locale]!.fields._publishedShared = JSON.stringify(entry.shared)
    }
  }
  for (const photo of mediaPhotos)
    record(
      'media',
      `photo-${photo.id}`,
      'src/data/media-photos.json',
      photo,
      {
        fileName: photo.src.split('/').at(-1),
        sourceImagePath: photo.src,
        assetPath: photo.src,
        mimeType: 'image/webp',
        category: photo.category,
        width: photo.width,
        height: photo.height,
        usage: 'media/photos',
      },
      (locale) => ({
        title: photo.title[locale],
        body: photo.title[locale],
        fields: { alt: photo.title[locale], caption: photo.title[locale] },
      }),
    )
  for (const report of mediaReports)
    record(
      'media',
      `report-${report.id}`,
      'src/data/media-reports.json',
      report,
      {
        fileName: report.id + '.pdf',
        sourceUrl: report.url,
        mimeType: 'application/pdf',
        sizeBytes: report.bytes,
        category: 'reports',
        usage: 'media/reports',
      },
      (locale) => ({
        title: report.title,
        body: report.description[locale],
        fields: { caption: report.description[locale] },
      }),
    )
  for (const [index, terms] of topicAliases.entries())
    record(
      'glossary',
      `search-topic-${index + 1}`,
      'src/lib/search/concepts.ts',
      terms,
      {
        source:
          'Vocabulaire de recherche du site — associations thématiques, pas équivalences scientifiques',
      },
      (locale) => ({
        title: terms[locale][0],
        body: terms[locale].join(' · '),
        fields: { relatedTerms: terms[locale].join('\n') },
      }),
      false,
    )
  record(
    'figures',
    'young-researchers',
    'src/lib/figures.ts + messages',
    { value: '+1000' },
    {
      value: '+1000',
      source: 'src/lib/figures.ts',
      period: 'Référence actuelle du site',
      usage: 'home/key-figures',
    },
    (locale) => ({
      title: catalogs[locale].Hero.figures.youngResearchers,
      body: catalogs[locale].Hero.figures.youngResearchers,
    }),
  )
  for (const key of ['collaborators', 'certification'] as const) {
    const value = editorialIndicatorDefaults[key]
    const entry = record(
      'figures',
      key,
      'Contenu existant du site · collaboration et carrières',
      { value },
      {
        value,
        source:
          key === 'collaborators'
            ? 'src/lib/home-collaboration.ts · valeur fournie par le propriétaire'
            : 'Norme ISO affichée sur le site · version confirmée par le propriétaire',
        period: 'Référence actuelle du site',
        usage:
          key === 'collaborators'
            ? 'home/collaboration · opportunities/environment'
            : 'home/hero · home/collaboration · opportunities/environment',
      },
      (locale) => ({
        title:
          key === 'collaborators'
            ? catalogs[locale].HomeCollaboration.collaborators
            : `${catalogs[locale].HomeCollaboration.certified} ISO`,
        body:
          key === 'collaborators'
            ? catalogs[locale].HomeCollaboration.collaborators
            : catalogs[locale].HomeCollaboration.certification,
      }),
    )
    // Exact existing public values/labels, under the owner's retained-corpus approval;
    // future edits still use the normal per-locale review/publication workflow.
    for (const locale of languages) {
      entry.variants[locale].status = 'published'
      entry.publicVariants[locale] = structuredClone(entry.variants[locale])
      entry.publicVariants[locale]!.fields._publishedShared = JSON.stringify(entry.shared)
    }
  }
  return entries
}
