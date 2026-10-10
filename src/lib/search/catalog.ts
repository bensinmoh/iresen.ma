import { createHash } from 'node:crypto'
import { patents, patentAnchor } from '@/lib/patents'
import { engagementSearchText } from '@/lib/engagement'

import fr from '@/messages/fr.json'
import en from '@/messages/en.json'
import ar from '@/messages/ar.json'
import { homeInnovationSectionId, innovationSteps } from '@/lib/home-innovation'
import { collaborationCount } from '@/lib/home-collaboration'
import { homeAchievements, homeAchievementsSectionId } from '@/lib/home-achievements'
import { homePlatforms, homePlatformsSectionId } from '@/lib/home-platforms'
import { homeFigures } from '@/lib/figures'
import { footerContact } from '@/lib/footer'
import { heroes } from '@/lib/heroes'
import { heroImages } from '@/lib/hero-images'
import { homeMissions, homeMissionSectionId, homeCooperationAnchor } from '@/lib/home-missions'
import { homeNewsPosts, homeNewsSectionId } from '@/lib/home-news'
import { researchThemes, researchImages, homeResearchSectionId } from '@/lib/home-research'
import { missionImages } from '@/lib/mission-images'
import { pageSections } from '@/lib/page-sections'
import { pageHref, pageIds } from '@/lib/site'
import { contentLocales } from '@/lib/content/publication'
import type { PublicSearchDocument, SearchLocale } from './types'

const messages = { fr, en, ar }

export type PublicAssetReference = {
  id: string
  url: string
  type: 'document' | 'media' | 'publication' | 'report'
  /** All translations are explicit; no language fallback and no directory crawling. */
  text: Partial<Record<SearchLocale, { title: string; description: string }>>
}

const assetLabels = {
  fr: {
    image: 'Image d’introduction',
    video: 'Vidéo de présentation',
    brand: 'Identité IRESEN',
    logo: 'Logo IRESEN',
    apex: 'Symbole Apex Leaf',
    favicon: 'Icône IRESEN',
    solar: 'Illustration générée de panneaux solaires photovoltaïques dans un cadre fictif.',
    infrastructure: 'Illustration générée d’une infrastructure solaire dans un site fictif.',
    wind: 'Illustration générée d’une éolienne blanche dans un paysage rocheux fictif.',
    contactHeadquartersTitle: 'Photographie du siège IRESEN à Rabat',
    contactHeadquartersDescription:
      'Photographie de l’entrée du siège IRESEN à Rabat, avec un mur blanc portant l’identité IRESEN, un portail en bois et un jardin arboré.',
  },
  en: {
    image: 'Page introduction image',
    video: 'Introduction video',
    brand: 'IRESEN identity',
    logo: 'IRESEN logo',
    apex: 'Apex Leaf symbol',
    favicon: 'IRESEN icon',
    solar: 'Generated illustration of solar photovoltaic panels in a fictional setting.',
    infrastructure: 'Generated illustration of solar infrastructure at a fictional site.',
    wind: 'Generated illustration of a white wind turbine in a fictional rocky landscape.',
    contactHeadquartersTitle: 'Photograph of IRESEN headquarters in Rabat',
    contactHeadquartersDescription:
      'Photograph of the entrance to IRESEN headquarters in Rabat, with a white wall bearing the IRESEN identity, a wooden gate and a garden with trees.',
  },
  ar: {
    image: 'صورة تقديمية',
    video: 'فيديو تقديمي',
    brand: 'الهوية البصرية لـ IRESEN',
    logo: 'شعار IRESEN',
    apex: 'رمز Apex Leaf',
    favicon: 'أيقونة IRESEN',
    solar: 'صورة توضيحية مولّدة لألواح الطاقة الشمسية الكهروضوئية في موقع خيالي.',
    infrastructure: 'صورة توضيحية مولّدة لبنية تحتية للطاقة الشمسية في موقع خيالي.',
    wind: 'صورة توضيحية مولّدة لتوربين رياح أبيض في منظر صخري خيالي.',
    contactHeadquartersTitle: 'صورة مقر IRESEN في الرباط',
    contactHeadquartersDescription:
      'صورة مدخل مقر IRESEN في الرباط، مع جدار أبيض يحمل هوية IRESEN وبوابة خشبية وحديقة تضم أشجارًا.',
  },
}

/** Register every meaningful approved public file here; responsive crops are one result. */
export const publicAssetReferences: readonly PublicAssetReference[] = [
  {
    id: 'transfer-ismart-logo',
    url: '/brand/transfer/ismart-iresen.svg',
    type: 'media',
    text: Object.fromEntries(
      contentLocales.map((locale) => [
        locale,
        {
          title: messages[locale].Transfer.example.logoAlt,
          description: `iSmart ${messages[locale].Transfer.example.description} ${messages[locale].Transfer.example.origin}`,
        },
      ]),
    ) as PublicAssetReference['text'],
  },
  {
    id: 'transfer-ismart-product',
    url: '/images/transfer/ismart-product.webp',
    type: 'media',
    text: Object.fromEntries(
      contentLocales.map((locale) => [
        locale,
        {
          title: `iSmart — ${messages[locale].Transfer.example.title}`,
          description: Object.values(messages[locale].Transfer.example).join(' '),
        },
      ]),
    ) as PublicAssetReference['text'],
  },
  ...homeAchievements.map(({ id }) => ({
    id: `achievement-photo-${id}`,
    url: `/images/achievements/${id}.webp`,
    type: 'media' as const,
    text: Object.fromEntries(
      contentLocales.map((locale) => {
        const copy = messages[locale].HomeAchievements.items[id]
        return [
          locale,
          { title: copy.name, description: `${copy.imageDescription} ${copy.searchText}` },
        ]
      }),
    ) as PublicAssetReference['text'],
  })),
  {
    id: 'platform-network-consulting',
    url: '/brand/platforms/consulting.svg',
    type: 'media',
    text: Object.fromEntries(
      contentLocales.map((locale) => [
        locale,
        {
          title: messages[locale].HomePlatforms.expertiseIconLabel,
          description: [
            messages[locale].HomePlatforms.network.expertise.title,
            messages[locale].HomePlatforms.network.expertise.description,
          ].join(' '),
        },
      ]),
    ) as PublicAssetReference['text'],
  },
  {
    id: 'platform-network-morocco',
    url: '/brand/platforms/morocco.svg',
    type: 'media',
    text: Object.fromEntries(
      contentLocales.map((locale) => [
        locale,
        {
          title: messages[locale].HomePlatforms.mapLabel,
          description: [
            messages[locale].HomePlatforms.network.laboratories.title,
            messages[locale].HomePlatforms.network.laboratories.description,
          ].join(' '),
        },
      ]),
    ) as PublicAssetReference['text'],
  },
  {
    id: 'platform-outdoor',
    url: '/images/platforms/outdoor.webp',
    type: 'media',
    text: Object.fromEntries(
      contentLocales.map((locale) => [
        locale,
        {
          title: messages[locale].HomePlatforms.outdoorTitle,
          description: messages[locale].HomePlatforms.outdoorDescription,
        },
      ]),
    ) as PublicAssetReference['text'],
  },
  ...homePlatforms.flatMap(({ id }) =>
    [false, true].map((logo) => ({
      id: `platform-${logo ? 'logo-' : 'photo-'}${id}`,
      url: logo ? `/brand/platforms/${id}.svg` : `/images/platforms/${id}.webp`,
      type: 'media' as const,
      text: Object.fromEntries(
        contentLocales.map((locale) => {
          const copy = messages[locale].HomePlatforms.platforms[id]
          return [
            locale,
            {
              title: logo ? `${messages[locale].HomePlatforms.logoLabel} ${copy.name}` : copy.name,
              description: [
                logo
                  ? `${messages[locale].HomePlatforms.logoLabel} ${copy.name}`
                  : copy.imageDescription,
                copy.searchText,
              ].join(' '),
            },
          ]
        }),
      ) as PublicAssetReference['text'],
    })),
  ),

  ...researchThemes
    .filter((id) => id !== 'renewables')
    .map((id) => ({
      id: `research-${id}`,
      url: researchImages[id].src,
      type: 'media' as const,
      text: Object.fromEntries(
        contentLocales.map((locale) => [
          locale,
          {
            title: messages[locale].HomeResearch.themes[id].imageTitle,
            description: [
              messages[locale].HomeResearch.themes[id].imageDescription,
              messages[locale].HomeResearch.themes[id].searchText,
            ].join(' '),
          },
        ]),
      ) as PublicAssetReference['text'],
    })),
  ...homeMissions.map(({ id, imageId }) => ({
    id: `mission-${imageId}`,
    url: missionImages[imageId].src,
    type: 'media' as const,
    text: Object.fromEntries(
      contentLocales.map((locale) => [
        locale,
        {
          title: messages[locale].HomeMissions[id].imageTitle,
          description: messages[locale].HomeMissions[id].imageDescription,
        },
      ]),
    ) as PublicAssetReference['text'],
  })),
  ...Object.entries(heroImages).map(([id, image]) => {
    // Contact has a dedicated headquarters photograph; its former illustration is
    // still served, but must not be described as the current contact page image.
    const relatedPages = pageIds.filter(
      (pageId) => pageId !== 'contact' && heroes[pageId].photo === id,
    )
    return {
      id: `hero-${id}`,
      url: image.src,
      type: 'media' as const,
      text: Object.fromEntries(
        contentLocales.map((locale) => [
          locale,
          {
            title:
              id === 'wind-detail'
                ? assetLabels[locale].wind
                : `${assetLabels[locale].image} — ${relatedPages.map((pageId) => messages[locale].Pages[pageId]).join(' · ')}`,
            description: [
              ...(id.startsWith('solar-') ? [assetLabels[locale].solar] : []),
              ...(id === 'solar-field' ? [assetLabels[locale].infrastructure] : []),
              ...(id === 'wind-detail' ? [assetLabels[locale].wind] : []),
              ...relatedPages.map((pageId) => messages[locale].Hero.descriptions[pageId]),
            ].join(' '),
          },
        ]),
      ) as PublicAssetReference['text'],
    }
  }),
  {
    id: 'contact-venue',
    url: '/images/contact/contact-background-venue.jpg',
    type: 'media',
    text: Object.fromEntries(
      contentLocales.map((locale) => [
        locale,
        {
          title: assetLabels[locale].contactHeadquartersTitle,
          description: assetLabels[locale].contactHeadquartersDescription,
        },
      ]),
    ) as PublicAssetReference['text'],
  },
  {
    id: 'home-video',
    url: '/videos/hero.mp4',
    type: 'media',
    text: Object.fromEntries(
      contentLocales.map((locale) => [
        locale,
        {
          title: `${assetLabels[locale].video} — IRESEN`,
          description: messages[locale].Hero.descriptions.home,
        },
      ]),
    ) as PublicAssetReference['text'],
  },
  ...[
    'logo-primary',
    'logo-color',
    'logo-white',
    'logo-dark',
    'logo-monochrome',
    'apex-leaf',
    'favicon',
  ].map((id) => ({
    id: `brand-${id}`,
    url: `/brand/${id}.svg`,
    type: 'media' as const,
    text: Object.fromEntries(
      contentLocales.map((locale) => [
        locale,
        {
          title: `${id === 'apex-leaf' ? assetLabels[locale].apex : id === 'favicon' ? assetLabels[locale].favicon : assetLabels[locale].logo} — ${id}`,
          description: assetLabels[locale].brand,
        },
      ]),
    ) as PublicAssetReference['text'],
  })),
]

/** The contact template replaces its earlier, no-longer-rendered editorial scaffolds. */
function contactSearchDocuments(locale: SearchLocale): PublicSearchDocument[] {
  const catalog = messages[locale]
  const copy = catalog.Contact
  const heroTitle = `${copy.hero.title} ${copy.hero.accent}`
  const headquarters = [
    copy.headquarters.eyebrow,
    copy.headquarters.title,
    copy.headquarters.addressLabel,
    catalog.Footer.address,
    copy.headquarters.phoneLabel,
    footerContact.phone,
    copy.headquarters.emailLabel,
    footerContact.email,
  ]
  const departmentText = Object.values(copy.departments).flatMap((value) =>
    typeof value === 'string' ? [value] : [value.title, value.description],
  )
  const platformText = Object.values(copy.platforms).flatMap((value) =>
    typeof value === 'string' ? [value] : [value.title, value.description],
  )
  const fallback = `${copy.form.fallback} ${footerContact.email}`
  const sections = [
    {
      anchor: 'route-request',
      title: copy.departments.label,
      body: [
        heroTitle,
        copy.hero.description,
        copy.hero.action,
        ...headquarters,
        ...departmentText,
      ],
    },
    {
      anchor: 'page-sections',
      title: copy.platforms.title,
      body: platformText,
    },
    {
      anchor: 'send-request',
      title: copy.form.title,
      body: [
        copy.form.eyebrow,
        copy.form.description,
        copy.form.requiredHint,
        copy.form.fullName.label,
        copy.form.organisation.label,
        copy.form.email.label,
        copy.form.phone.label,
        copy.form.subject.label,
        copy.form.message.label,
        ...Object.values(copy.form.topics),
        copy.form.action,
        copy.form.disclosure,
        copy.form.privacyLink,
        fallback,
      ],
    },
    {
      anchor: 'information-use',
      title: copy.form.privacyLink,
      body: [copy.form.disclosure],
    },
    {
      anchor: 'locations',
      title: copy.location.title,
      body: [
        copy.location.eyebrow,
        catalog.Footer.address,
        copy.location.mapTitle,
        copy.location.externalLink,
      ],
    },
    {
      anchor: 'practical-questions',
      title: copy.faq.title,
      body: [
        copy.faq.eyebrow,
        copy.faq.description,
        ...Object.values(copy.faq.questions).flatMap(({ question, answer, action }) => [
          question,
          answer,
          action,
        ]),
      ],
    },
    {
      anchor: 'request-follow-up',
      title: fallback,
      body: [fallback],
    },
  ]
  return [
    {
      id: `page:contact:${locale}`,
      locale,
      title: heroTitle,
      body: [catalog.Pages.contact, copy.hero.description, ...headquarters].join(' '),
      url: pageHref('contact', locale),
      type: 'page',
    },
    ...sections.map(({ anchor, title, body }) => ({
      id: `section:contact:${anchor}:${locale}`,
      locale,
      title,
      body: body.join(' '),
      url: pageHref('contact', locale, anchor),
      type: 'section' as const,
    })),
  ]
}

export function staticSearchDocuments(): PublicSearchDocument[] {
  const documents: PublicSearchDocument[] = []
  for (const locale of contentLocales) {
    const catalog = messages[locale]
    for (const pageId of pageIds) {
      // Internal query/results pages must not recursively appear in their own results.
      if (pageId === 'search') continue
      if (pageId === 'contact') {
        documents.push(...contactSearchDocuments(locale))
        continue
      }
      const body = [catalog.Hero.descriptions[pageId], catalog.Hero.stages[heroes[pageId].stage]]
      if (pageId === 'workWithUs' || pageId === 'transfer') {
        body.push(...engagementSearchText(catalog.Engagement[pageId]))
        body.push(...engagementSearchText(catalog.PageSections[pageId]))
      }
      if (pageId === 'transfer') body.push(...engagementSearchText(catalog.Transfer))
      if (pageId === 'home') {
        body.push(
          catalog.HomeAchievements.title,
          ...Object.values(catalog.HomeAchievements.items).flatMap((item) => [
            item.name,
            item.category,
            item.description,
            item.searchText,
          ]),
          catalog.HomeInnovation.title,
          catalog.HomeInnovation.searchText,
          catalog.HomeNews.title,
          catalog.HomeNews.searchText,
          catalog.HomeCollaboration.searchText,
          catalog.HomePlatforms.title,
          catalog.HomePlatforms.description,
          ...Object.values(catalog.HomePlatforms.network).flatMap(({ title, description }) => [
            title,
            description,
          ]),
          ...Object.values(catalog.HomePlatforms.platforms).flatMap((platform) => [
            platform.name,
            platform.description,
            platform.searchText,
          ]),
        )
      }
      if (pageId === 'home')
        body.push(
          catalog.Hero.homeTitle,
          'ISO 9001:2015',
          catalog.Hero.certification.label,
          catalog.Hero.certification.description,
          catalog.Footer.tagline,
          catalog.Footer.description,
          ...homeFigures.map(({ id, value }) => `${value} ${catalog.Hero.figures[id]}`),
          catalog.HomeMissions.eyebrow,
          catalog.HomeMissions.functions,
          catalog.PageSections.home[homeCooperationAnchor].title,
          catalog.PageSections.home[homeCooperationAnchor].description,
          catalog.PageSections.home[homeMissionSectionId].title,
          catalog.PageSections.home[homeMissionSectionId].description,
          ...homeMissions.flatMap(({ id, anchor }) => [
            catalog.PageSections.home[anchor].title,
            catalog.PageSections.home[anchor].description,
            catalog.HomeMissions[id].link,
            catalog.HomeMissions[id].purpose,
          ]),
        )
      if (pageId === 'home')
        body.push(
          catalog.HomeResearch.title,
          ...researchThemes.flatMap((id) => {
            const theme = catalog.HomeResearch.themes[id]
            return [theme.title, theme.description, ...theme.axes, theme.searchText]
          }),
        )
      if (pageId === 'institute') body.push('2011', catalog.Hero.founded)
      if (pageId === 'cookies') body.push(catalog.States.thirdPartyMap)
      documents.push({
        id: `page:${pageId}:${locale}`,
        locale,
        title: catalog.Pages[pageId],
        body: body.join(' '),
        url: pageHref(pageId, locale),
        type: 'page',
      })
      const sectionCopy = catalog.PageSections[pageId] as Record<
        string,
        { title: string; description: string }
      >
      for (const section of pageSections[pageId]) {
        for (const entry of [section, ...(section.children ?? [])]) {
          const copy = sectionCopy[entry.id]
          const body = [copy.description]
          if (pageId === 'workWithUs' || pageId === 'transfer') {
            const engagementCopy = catalog.Engagement[pageId].sections as Record<string, unknown>
            body.push(...engagementSearchText(engagementCopy[entry.id]))
          }
          if (pageId === 'transfer') {
            const keys = {
              'results-to-transfer': ['title', 'intro'],
              'research-to-use': ['process'],
              'intellectual-property': ['ip', 'example'],
              'transfer-pathways': ['pathways'],
              'adoption-initiatives': ['catalog', 'figures', 'themes'],
              'build-transfer': ['doors'],
            } as const
            for (const key of keys[entry.id as keyof typeof keys] ?? [])
              body.push(...engagementSearchText(catalog.Transfer[key]))
            if (entry.id === 'results-to-transfer') body.push(catalog.Transfer.photos.intro)
            if (entry.id === 'build-transfer')
              body.push(catalog.Transfer.photos.innovation, catalog.Transfer.photos.technology)
          }
          if (pageId === 'home' && entry.id === homeAchievementsSectionId)
            body.push(
              ...Object.values(catalog.HomeAchievements.items).flatMap((item) => [
                item.name,
                item.category,
                item.description,
                item.searchText,
              ]),
            )
          if (pageId === 'home') {
            const achievementId = homeAchievements.find(
              ({ id }) => entry.id === `achievement-${id}`,
            )?.id
            if (achievementId) {
              const item = catalog.HomeAchievements.items[achievementId]
              body.push(item.category, item.searchText)
            }
          }
          if (pageId === 'home' && entry.id === homeMissionSectionId)
            body.push(
              catalog.HomeMissions.eyebrow,
              catalog.HomeMissions.functions,
              catalog.PageSections.home[homeCooperationAnchor].title,
              catalog.PageSections.home[homeCooperationAnchor].description,
              ...homeMissions.flatMap(({ id, anchor }) => [
                catalog.PageSections.home[anchor].title,
                catalog.PageSections.home[anchor].description,
                catalog.HomeMissions[id].link,
                catalog.HomeMissions[id].purpose,
              ]),
            )
          if (pageId === 'home' && entry.id === homeResearchSectionId)
            body.push(
              ...researchThemes.flatMap((id) => {
                const theme = catalog.HomeResearch.themes[id]
                return [theme.title, theme.description, ...theme.axes, theme.searchText]
              }),
            )
          if (pageId === 'home' && entry.id === homeInnovationSectionId)
            body.push(
              catalog.HomeInnovation.searchText,
              catalog.HomeInnovation.support,
              catalog.HomeInnovation.feedback,
              ...innovationSteps.flatMap((id) => [
                catalog.HomeInnovation.steps[id].title,
                catalog.HomeInnovation.steps[id].description,
              ]),
            )
          if (pageId === 'home' && entry.id === homePlatformsSectionId)
            body.push(
              ...Object.values(catalog.HomePlatforms.network).flatMap(({ title, description }) => [
                title,
                description,
              ]),
              ...Object.values(catalog.HomePlatforms.platforms).flatMap((platform) => [
                platform.name,
                platform.description,
                platform.searchText,
              ]),
            )
          if (pageId === 'home') {
            const platformId = homePlatforms.find(({ id }) => entry.id === `platform-${id}`)?.id
            if (platformId) body.push(catalog.HomePlatforms.platforms[platformId].searchText)
          }
          if (pageId === 'home' && entry.id === 'collaboration') {
            const collaboration = catalog.HomeCollaboration
            body.push(
              collaboration.searchText,
              `${collaborationCount} ${collaboration.collaborators}`,
              'ISO 9001:2015',
              collaboration.certification,
              ...Object.values(collaboration.paths).flatMap((path) => [
                path.audience,
                path.title,
                path.description,
                path.action,
              ]),
            )
          }
          if (pageId === 'home' && entry.id === homeNewsSectionId)
            body.push(catalog.HomeNews.searchText)
          if (pageId === 'home') {
            const themeId = researchThemes.find((id) => entry.id === `research-${id}`)
            if (themeId) {
              const theme = catalog.HomeResearch.themes[themeId]
              body.push(...theme.axes, theme.searchText)
            }
            const mission = homeMissions.find(({ anchor }) => anchor === entry.id)
            if (mission)
              body.push(
                catalog.HomeMissions[mission.id].link,
                catalog.HomeMissions[mission.id].purpose,
              )
            if (entry.id === 'mission-research') body.push(catalog.HomeMissions.functions)
            if (entry.id === homeCooperationAnchor) body.push(catalog.HomeMissions.cooperation.link)
          }
          documents.push({
            id: `section:${pageId}:${entry.id}:${locale}`,
            locale,
            title: copy.title,
            body: body.join(' '),
            url: pageHref(pageId, locale, entry.id),
            type: 'section',
          })
        }
      }
    }
    documents.push({
      id: `section:transfer:valorisation-figures:${locale}`,
      locale,
      title: catalog.Transfer.figures.label,
      body: `${patents.length} ${engagementSearchText(catalog.Transfer.figures).join(' ')}`,
      url: pageHref('transfer', locale, 'valorisation-figures'),
      type: 'section',
    })
    documents.push({
      id: `section:transfer:ismart-example:${locale}`,
      locale,
      title: `iSmart — ${catalog.Transfer.example.title}`,
      body: `iSmart ${engagementSearchText(catalog.Transfer.example).join(' ')}`,
      url: pageHref('transfer', locale, 'ismart-example'),
      type: 'section',
    })
    for (const patent of patents) {
      documents.push({
        id: `section:transfer:patent-${patent.reference}:${locale}`,
        locale,
        title: `${catalog.Transfer.catalog.reference} ${patent.reference} — ${patent.title[locale]}`,
        body: [
          patent.reference,
          patent.title[locale],
          patent.description[locale],
          patent.depositor,
          patent.filingYear,
          patent.filingDate,
          ...patent.themes.map((id) => catalog.Transfer.themes[id]),
          catalog.Transfer.catalog.label,
          'OMPIC Office Marocain de la Propriété Industrielle et Commerciale PatentRegister PI propriété intellectuelle',
        ]
          .filter(Boolean)
          .join(' '),
        url: pageHref('transfer', locale, patentAnchor(patent.reference)),
        type: 'patent',
      })
    }
    // Owner-requested localized editorial headings; no full-post translation fallback.
    for (const post of homeNewsPosts) {
      const key = post.id.split(':').at(-1)! as keyof typeof catalog.HomeNews.posts
      const title = catalog.HomeNews.posts[key]?.title
      if (!title?.trim()) continue
      documents.push({
        id: `section:home:linkedin:${post.id}:${locale}`,
        locale,
        title,
        body: `IRESEN LinkedIn ${title}`,
        url: pageHref('home', locale, `news-${post.id.split(':').at(-1)}`),
        type: 'section',
        ...(post.publishedAt ? { publishedAt: post.publishedAt } : {}),
      })
    }
    for (const asset of publicAssetReferences) {
      const copy = asset.text[locale]
      if (copy?.title.trim() && copy.description.trim())
        documents.push({
          id: `asset:${asset.id}:${locale}`,
          locale,
          title: copy.title,
          body: copy.description,
          url: asset.url,
          type: asset.type,
        })
    }
  }
  return documents
}

export function catalogRevision(documents = staticSearchDocuments()): string {
  return createHash('sha256').update(JSON.stringify(documents)).digest('hex')
}
