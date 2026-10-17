import { editorialIndicatorDefaults } from '@/lib/editorial-indicators'
import { institutionalAffiliations } from '../institutions'
import { callPartners } from '@/lib/call-partners'
import { archiveCalls, archiveCard, archiveProfile } from '@/lib/call-archives'
import { callCopy } from '@/lib/call-copy'
import { callsListingHref } from '@/lib/calls'
import infrastructurePhotos from '@/data/infrastructure-photos.json' with { type: 'json' }
import { usefulLinks } from '@/lib/useful-links'
import { isAiGeneratedImage } from '@/lib/image-provenance'
import { networkLaboratories, laboratoryAnchor } from '@/lib/network'
import { researchPlatforms } from '@/lib/platforms'
import {
  governanceBoard,
  governanceScientists,
  governanceTeam,
  governanceBoardLogo,
} from '@/lib/governance'
import { publications, titleTopics, publicationAnchor } from '@/lib/publications'
import { mediaPhotos, mediaReports } from '@/lib/media-library'
import { samirBiographies, samirBiographyTexts, samirPhotoId } from '@/lib/samir-biography'
import {
  selectedNews,
  newsEvents,
  newsImages,
  eventImages,
  newsSocialLinks,
} from '@/lib/news-events'
import { createHash } from 'node:crypto'
import { patents, patentAnchor } from '@/lib/patents'
import { collaborationAudiences, engagementSearchText } from '@/lib/engagement'
import { roadmapMedia, roadmapMediaPath, roadmapDrawingPath, roadmapHeroPath } from '@/lib/roadmap'

import fr from '@/messages/fr.json' with { type: 'json' }
import en from '@/messages/en.json' with { type: 'json' }
import ar from '@/messages/ar.json' with { type: 'json' }
import { homeInnovationSectionId, innovationSteps } from '@/lib/home-innovation'
import { homeAchievements, homeAchievementsSectionId } from '@/lib/home-achievements'
import { homePlatforms, homePlatformsSectionId, platformPhotoPath } from '@/lib/home-platforms'
import { homeFigures, resolveHomeFigures } from '@/lib/figures'
import { footerContact } from '@/lib/footer'
import { heroes } from '@/lib/heroes'
import { heroImages } from '@/lib/hero-images'
import { homeMissions, homeMissionSectionId, homeCooperationAnchor } from '@/lib/home-missions'
import { homeNewsPosts, homeNewsSectionId } from '@/lib/home-news'
import { researchThemes, researchImages, homeResearchSectionId } from '@/lib/home-research'
import { missionImages } from '@/lib/mission-images'
import { pageSections } from '@/lib/page-sections'
import { pageHref, pageIds, newsListingHref } from '@/lib/site'
import { contentLocales } from '@/lib/content/publication'
import type { PublicSearchDocument, SearchLocale } from './types'

const messages = { fr, en, ar }
const defaultMessages = messages
const defaultCorpora = { publications, patents, reports: mediaReports, archives: archiveCalls }
// Original resource names/domain acronyms remain discoverable in translated interfaces.
const usefulToolAliases = [
  'Cadastre Solaire Maroc cartographie.ma',
  'Green H2 Atlas GreenH2Atlas greenh2atlas.ma',
  'Carte des Gîtes Minéraux du Maroc cartesgeoscientifiques.mem.gov.ma',
  'MASEN Solar Atlas solaratlas.masen.ma',
  'EVPLAN electric vehicle charging recharge véhicules électriques evplan.org',
  'PV Mapping photovoltaïque photovoltaic pvmapping.cartographie.ma',
  'SolarTwin solartwin-webiste.vercel.app',
]

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
    id: 'institute-green-energy-park-research',
    url: '/images/institute/green-energy-park-research.webp',
    type: 'media',
    text: {
      fr: {
        title: 'Green Energy Park — recherche en laboratoire',
        description:
          'Photographie fournie du Green Energy Park : un chercheur auprès d’un équipement de laboratoire, avec des modules photovoltaïques au premier plan. Visuel du bloc Recherche & Innovation de la page Institut.',
      },
      en: {
        title: 'Green Energy Park — laboratory research',
        description:
          'Supplied Green Energy Park photograph showing a researcher beside laboratory equipment, with photovoltaic modules in the foreground. Image used in the Institute page Research & Innovation block.',
      },
      ar: {
        title: 'Green Energy Park — البحث داخل المختبر',
        description:
          'صورة مقدّمة لـ Green Energy Park تُظهر باحثًا بجانب تجهيزات مختبرية وألواحًا كهروضوئية في المقدمة. تُستخدم في قسم البحث والابتكار ضمن صفحة المعهد.',
      },
    },
  },
  ...Object.values(callPartners)
    .filter((partner) => partner.id !== 'iresen')
    .map((partner) => ({
      id: `call-partner-${partner.id}`,
      url: partner.logo,
      type: 'media' as const,
      text: {
        fr: {
          title: `Logo ${partner.name}`,
          description: `Logo original de ${partner.name}, associé aux dispositifs et appels à projets IRESEN. Identification de l’organisme ou du programme, avec lien vers son site.`,
        },
        en: {
          title: `${partner.name} logo`,
          description: `Original ${partner.name} logo, associated with IRESEN programmes and calls. Identifies the organisation or programme and links to its website.`,
        },
        ar: {
          title: `شعار ${partner.name}`,
          description: `الشعار الأصلي لـ ${partner.name}، ضمن برامج ودعوات مشاريع IRESEN. تعريف بالهيئة أو البرنامج مع رابط إلى موقعه.`,
        },
      },
    })),
  {
    id: 'programmes-collaborative-prototyping',
    url: '/images/programmes/collaborative-prototyping.webp',
    type: 'media',
    text: Object.fromEntries(
      contentLocales.map((locale) => [
        locale,
        {
          title: messages[locale].Programmes.illustrationNote,
          description: messages[locale].Programmes.researchAlt,
        },
      ]),
    ) as PublicAssetReference['text'],
  },
  {
    id: 'institute-ambition-vision-portrait',
    url: '/images/institute/ambition-solar-scene-cool.webp',
    type: 'media',
    text: {
      fr: {
        title: 'Vision et ambition — portrait illustratif',
        description:
          'Scène solaire africaine générée par IA intégrant une personne pensive en couleurs, illustration symbolique de l’ambition 2035 et de l’innovation solaire en Afrique. Ne représente pas une collaboratrice réelle.',
      },
      en: {
        title: 'Vision and ambition — illustrative portrait',
        description:
          'AI-generated African solar landscape integrating a thoughtful person in full color, symbolizing the 2035 ambition and solar innovation in Africa. Does not depict a real staff member.',
      },
      ar: {
        title: 'الرؤية والطموح — صورة توضيحية',
        description:
          'مشهد شمسي أفريقي مولد بالذكاء الاصطناعي يتضمن شخصية متأملة بالألوان، ترمز إلى طموح 2035 والابتكار الشمسي في أفريقيا. لا تمثل موظفة حقيقية.',
      },
    },
  },
  {
    id: 'institute-fifteen-year-report-cover',
    url: '/images/institute/fifteen-year-report-cover-cutout.webp',
    type: 'media',
    text: Object.fromEntries(
      contentLocales.map((locale) => [
        locale,
        {
          title: messages[locale].Institute.coverAlt,
          description: messages[locale].Institute.coverSearchText,
        },
      ]),
    ) as PublicAssetReference['text'],
  },
  ...governanceBoard
    .filter((id) => !['min-finance', 'min-energie', 'minensup', 'micep'].includes(id))
    .map((id) => ({
      id: `governance-logo-${id}`,
      url: governanceBoardLogo(id),
      type: 'media' as const,
      text: Object.fromEntries(
        contentLocales.map((locale) => [
          locale,
          {
            title: messages[locale].Governance.board[id],
            description: `${messages[locale].Governance.councils.administration.membersTitle}. ${messages[locale].Governance.board[id]}`,
          },
        ]),
      ) as PublicAssetReference['text'],
    })),
  {
    id: 'governance-armoiries-maroc',
    url: '/images/governance/armoiries-maroc.svg',
    type: 'media',
    text: {
      fr: {
        title: 'Armoiries du Royaume du Maroc',
        description: 'Emblème des quatre ministères membres du conseil d’administration IRESEN.',
      },
      en: {
        title: 'Coat of arms of the Kingdom of Morocco',
        description: 'Emblem of the four ministries represented on the IRESEN board.',
      },
      ar: {
        title: 'شعار المملكة المغربية',
        description: 'شعار الوزارات الأربع الممثلة في مجلس إدارة IRESEN.',
      },
    },
  },
  ...governanceScientists.map((id) => ({
    id: `governance-scientist-${id}`,
    url: `/images/governance/${id}.png`,
    type: 'media' as const,
    text: Object.fromEntries(
      contentLocales.map((locale) => [
        locale,
        {
          title: messages[locale].Governance.scientists[id].name,
          description: `${messages[locale].Governance.councils.science.membersTitle}. ${messages[locale].Governance.scientists[id].role}. ${messages[locale].Governance.scientists[id].country}${locale === 'ar' ? ` ${messages.fr.Governance.scientists[id].name}` : ''}`,
        },
      ]),
    ) as PublicAssetReference['text'],
  })),
  ...governanceTeam.map((id) => ({
    id: `governance-portrait-${id}`,
    url: `/images/governance/${id}-portrait.png`,
    type: 'media' as const,
    text: Object.fromEntries(
      contentLocales.map((locale) => [
        locale,
        {
          title: messages[locale].Governance.team[id].name,
          description: `${messages[locale].Governance.teamTitle}. ${messages[locale].Governance.team[id].role}. ${messages[locale].Governance.team[id].biography}${locale === 'ar' ? ` ${messages.fr.Governance.team[id].name}` : ''}`,
        },
      ]),
    ) as PublicAssetReference['text'],
  })),
  {
    id: 'roadmap-hero-board',
    url: roadmapHeroPath,
    type: 'media',
    text: Object.fromEntries(
      contentLocales.map((locale) => {
        const copy = messages[locale].Roadmap
        return [
          locale,
          {
            title: copy.title,
            description: `${copy.heroAlt} ${copy.imageNote} ${roadmapMedia.map((id) => copy.chapters[id].title).join('. ')}`,
          },
        ]
      }),
    ) as PublicAssetReference['text'],
  },
  ...roadmapMedia.flatMap((id) =>
    ['original', 'drawing'].map((layer) => ({
      id: `roadmap-visual-${id}${layer === 'drawing' ? '-drawing' : ''}`,
      url: layer === 'drawing' ? roadmapDrawingPath(id) : roadmapMediaPath(id),
      type: 'media' as const,
      text: Object.fromEntries(
        contentLocales.map((locale) => {
          const copy = messages[locale].Roadmap
          const chapter = copy.chapters[id as keyof typeof copy.chapters]
          return [
            locale,
            {
              title: chapter ? chapter.title : copy.title,
              description: `${chapter?.imageAlt ?? copy.heroAlt} ${copy.imageNote} ${chapter?.description ?? copy.description}`,
            },
          ]
        }),
      ) as PublicAssetReference['text'],
    })),
  ),
  ...(['hero'] as const).map((id) => ({
    id: `projects-${id}`,
    url: `/images/projects/${id}.webp`,
    type: 'media' as const,
    text: Object.fromEntries(
      contentLocales.map((locale) => [
        locale,
        {
          title: `${messages[locale].Pages.projects} — ${messages[locale].Projects.photos[id]}`,
          description: messages[locale].Projects.photos[id],
        },
      ]),
    ) as PublicAssetReference['text'],
  })),
  {
    id: 'publications-hero',
    url: '/images/publications/hero.webp',
    type: 'media',
    text: Object.fromEntries(
      contentLocales.map((locale) => [
        locale,
        {
          title: messages[locale].Publications.label,
          description: messages[locale].Publications.description,
        },
      ]),
    ) as PublicAssetReference['text'],
  },
  {
    id: 'library-hero',
    url: '/images/media-library/media-library-hero.webp',
    type: 'media',
    text: Object.fromEntries(
      contentLocales.map((locale) => [
        locale,
        {
          title: messages[locale].MediaLibrary.heroTitle,
          description: messages[locale].MediaLibrary.heroDescription,
        },
      ]),
    ) as PublicAssetReference['text'],
  },
  ...['hero', 'learning', 'exchange'].map((id) => ({
    id: `news-reference-${id}`,
    url: `/images/news/${id}.webp`,
    type: 'media' as const,
    text: Object.fromEntries(
      contentLocales.map((locale) => [
        locale,
        {
          title:
            id === 'hero'
              ? messages[locale].NewsEvents.photos.hero
              : messages[locale].NewsEvents.trainingAlt,
          description:
            id === 'hero'
              ? messages[locale].NewsEvents.photos.hero
              : messages[locale].NewsEvents.trainingAlt,
        },
      ]),
    ) as PublicAssetReference['text'],
  })),
  ...Object.entries(newsImages).map(([id, image]) => ({
    id: `news-image-${id}`,
    url: image.src,
    type: 'media' as const,
    text: Object.fromEntries(
      contentLocales.map((locale) => [
        locale,
        {
          title:
            messages[locale].NewsEvents.newsTitles[
              id as keyof typeof messages.fr.NewsEvents.newsTitles
            ],
          description:
            messages[locale].NewsEvents.photos[
              image.altKey as keyof typeof messages.fr.NewsEvents.photos
            ],
        },
      ]),
    ) as PublicAssetReference['text'],
  })),
  ...Object.entries(eventImages)
    .filter(
      ([, image]) => !Object.values(newsImages).some((newsImage) => newsImage.src === image.src),
    )
    .map(([id, image]) => ({
      id: `news-event-image-${id}`,
      url: image.src,
      type: 'media' as const,
      text: Object.fromEntries(
        contentLocales.map((locale) => [
          locale,
          {
            title:
              messages[locale].NewsEvents.events[id as keyof typeof messages.fr.NewsEvents.events]
                .name,
            description: messages[locale].NewsEvents.photos[image.altKey],
          },
        ]),
      ) as PublicAssetReference['text'],
    })),
  ...newsSocialLinks
    .filter((social) => ['facebook', 'instagram', 'researchgate'].includes(social.id))
    .map((social) => ({
      id: `social-logo-${social.id}`,
      url: `/brand/social/${social.id}.svg`,
      type: 'media' as const,
      text: Object.fromEntries(
        contentLocales.map((locale) => [
          locale,
          {
            title: social.name,
            description: `${social.name} — ${messages[locale].NewsEvents.followDescription}`,
          },
        ]),
      ) as PublicAssetReference['text'],
    })),
  ...mediaPhotos.map((photo) => ({
    id: `library-photo-${photo.id}`,
    url: photo.src,
    type: 'media' as const,
    text: Object.fromEntries(
      contentLocales.map((locale) => [
        locale,
        {
          title: photo.title[locale],
          description: `${messages[locale].MediaLibrary.categories[photo.category as keyof typeof messages.fr.MediaLibrary.categories]} — ${photo.title[locale]}. IRESEN. ${messages[locale].MediaLibrary.rights}${photo.id === samirPhotoId ? ` ${samirBiographyTexts[locale]}` : ''}`,
        },
      ]),
    ),
  })),
  // Preserve source registrations for the four previous, still-served illustrations.
  // Their generated provenance keeps them outside public search results.
  ...(['industry', 'research', 'institutions', 'partners'] as const).map((id, index) => ({
    id: `collaborate-audience-${id}`,
    url: `/images/collaborate/${id}.webp`,
    type: 'media' as const,
    text: Object.fromEntries(
      contentLocales.map((locale) => [
        locale,
        {
          title:
            messages[locale].Engagement.workWithUs.sections['organisation-contributions'].items[
              [2, 1, 0, 4][index]
            ].title,
          description: messages[locale].Engagement.workWithUs.photos[id],
        },
      ]),
    ) as PublicAssetReference['text'],
  })),
  ...collaborationAudiences.map((id, index) => ({
    id: `collaborate-audience-${id}`,
    url: `/images/collaborate/audience-${id}.webp`,
    type: 'media' as const,
    text: Object.fromEntries(
      contentLocales.map((locale) => [
        locale,
        {
          title:
            messages[locale].Engagement.workWithUs.sections['organisation-contributions'].items[
              index
            ].title,
          description: messages[locale].Engagement.workWithUs.photos[id],
        },
      ]),
    ) as PublicAssetReference['text'],
  })),
  {
    id: 'collaborate-world-land',
    url: '/illustrations/world-land.svg',
    type: 'media',
    text: {
      fr: {
        title: 'Carte du monde — coopération et expertise scientifique',
        description:
          'Silhouette vectorielle décorative des terres émergées, sans frontières, pays partenaires ni données de couverture. Illustration de la section coopération IRESEN : partenariats, programmes LEAP-RE, LEAP-SE, MED-GEM, réseaux et échanges scientifiques. Également réutilisée pour le réseau illustratif du Conseil scientifique ; la disposition des membres ne représente pas leurs localisations.',
      },
      en: {
        title: 'World map — cooperation and scientific expertise',
        description:
          'Decorative vector land silhouette without borders, partner countries or coverage data. Illustration for IRESEN cooperation: partnerships, LEAP-RE, LEAP-SE, MED-GEM programmes, networks and scientific exchanges. Also reused for the illustrative Scientific Council network; member placement does not represent their locations.',
      },
      ar: {
        title: 'خريطة العالم — التعاون والخبرة العلمية',
        description:
          'صورة ظلية متجهية زخرفية لليابسة دون حدود أو بلدان شريكة أو بيانات تغطية. توضيح لقسم تعاون IRESEN: الشراكات وبرامج LEAP-RE، LEAP-SE، MED-GEM والشبكات والتبادلات العلمية. تُستخدم كذلك لتوضيح شبكة المجلس العلمي، ولا يعكس ترتيب الأعضاء مواقعهم الجغرافية.',
      },
    },
  },

  ...(['hero', 'environment', 'internship'] as const).map((id) => ({
    id: `careers-photo-${id}`,
    url: `/images/careers/${id}.webp`,
    type: 'media' as const,
    text: Object.fromEntries(
      contentLocales.map((locale) => [
        locale,
        {
          title: messages[locale].Careers.photos[id],
          description: messages[locale].Careers.photos[id],
        },
      ]),
    ) as PublicAssetReference['text'],
  })),
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
    id: 'laboratory-network-map',
    url: '/images/network/morocco.svg',
    type: 'media',
    text: Object.fromEntries(
      contentLocales.map((locale) => [
        locale,
        {
          title: messages[locale].Network.directory.map,
          description: messages[locale].Network.directory.description,
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
  {
    id: 'platform-logo-greenh2a-white',
    url: '/brand/platforms/greenh2a-white.svg',
    type: 'media',
    text: Object.fromEntries(
      contentLocales.map((locale) => [
        locale,
        {
          title: `${messages[locale].HomePlatforms.logoLabel} ${messages[locale].HomePlatforms.platforms.greenh2a.name}`,
          description: messages[locale].HomePlatforms.platforms.greenh2a.searchText,
        },
      ]),
    ) as PublicAssetReference['text'],
  },
  ...infrastructurePhotos.map((photo) => ({
    id: `infrastructure-photo-${photo.id}`,
    url: photo.src,
    type: 'media' as const,
    text: Object.fromEntries(
      contentLocales.map((locale) => {
        const platformId = photo.platform as keyof typeof messages.fr.Platforms.platforms
        const copy = messages[locale].Platforms.platforms[platformId]
        const item =
          photo.index === null ? undefined : Object.values(copy.infrastructure)[photo.index]
        return [
          locale,
          {
            title: item?.title ?? copy.name,
            description: item?.description ?? messages[locale].Platforms.imageAlt[platformId],
          },
        ]
      }),
    ) as PublicAssetReference['text'],
  })),
  {
    id: 'platform-photo-gep-mci-original',
    url: '/images/platforms/gep-mci.webp',
    type: 'media',
    text: Object.fromEntries(
      contentLocales.map((locale) => {
        const copy = messages[locale].HomePlatforms.platforms['gep-mci']
        return [
          locale,
          { title: copy.name, description: [copy.imageDescription, copy.searchText].join(' ') },
        ]
      }),
    ) as PublicAssetReference['text'],
  },
  ...homePlatforms.flatMap(({ id }) =>
    [false, true].map((logo) => ({
      id: `platform-${logo ? 'logo-' : 'photo-'}${id}`,
      url: logo ? `/brand/platforms/${id}.svg` : platformPhotoPath(id),
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
  {
    id: 'hero-platform-outdoor',
    url: '/images/heroes/platform-outdoor.webp',
    type: 'media',
    text: {
      fr: {
        title: 'Plateforme de test outdoor — Infrastructures & plateformes',
        description:
          'Photographie fournie par IRESEN de la plateforme de test en extérieur : installations photovoltaïques et équipements d’expérimentation solaire.',
      },
      en: {
        title: 'Outdoor test platform — Infrastructure & platforms',
        description:
          'IRESEN-supplied photograph of the outdoor test platform, with photovoltaic installations and solar experimentation equipment.',
      },
      ar: {
        title: 'منصة الاختبار الخارجية — البنيات التحتية والمنصات',
        description:
          'صورة مقدمة من IRESEN لمنصة الاختبار الخارجية، تضم تجهيزات كهروضوئية ومعدات للتجارب الشمسية.',
      },
    },
  },
  ...Object.entries(heroImages)
    .filter(
      ([id]) => !['media-library', 'headquarters', 'platform-gep', 'platform-outdoor'].includes(id),
    )
    .map(([id, image]) => {
      // Contact has a dedicated headquarters photograph; its former illustration is
      // still served, but must not be described as the current contact page image.
      const relatedPages = pageIds.filter(
        (pageId) =>
          pageId !== 'contact' &&
          !['legal', 'privacy', 'cookies', 'accessibility', 'sitemap', 'patents'].includes(
            pageId,
          ) &&
          (heroes[pageId].photo === id || (pageId === 'institute' && id === 'solar-horizon')),
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
                  : `${assetLabels[locale].image} — ${relatedPages.length ? relatedPages.map((pageId) => messages[locale].Pages[pageId]).join(' · ') : assetLabels[locale].solar}`,
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
function contactSearchDocuments(
  locale: SearchLocale,
  catalog = messages[locale],
): PublicSearchDocument[] {
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

export function staticSearchDocuments(
  localized = defaultMessages,
  corpora = defaultCorpora,
  editorial?: Record<
    SearchLocale,
    { collaborators: string | null; certification: string | null; youngResearchers?: string | null }
  >,
  totals?: {
    projects: number | null
    publications: number | null
    patents: number | null
    laboratories: number | null
  },
): PublicSearchDocument[] {
  const messages = localized
  const { publications, patents, reports: mediaReports, archives: archiveCalls } = corpora
  const documents: PublicSearchDocument[] = []
  for (const locale of contentLocales) {
    const catalog = messages[locale]
    const indicators = editorial?.[locale] ?? editorialIndicatorDefaults
    const figures = totals
      ? resolveHomeFigures(totals.projects, totals.publications, {
          ...totals,
          youngResearchers:
            indicators.youngResearchers === undefined
              ? editorialIndicatorDefaults.youngResearchers
              : indicators.youngResearchers,
        })
      : homeFigures
    for (const pageId of pageIds) {
      // Internal query/results pages must not recursively appear in their own results.
      if (pageId === 'search' || pageId === 'events' || pageId === 'usefulLinks') continue
      if (pageId === 'contact') {
        documents.push(...contactSearchDocuments(locale, catalog))
        continue
      }
      const body = [catalog.Hero.descriptions[pageId], catalog.Hero.stages[heroes[pageId].stage]]
      if (pageId === 'workWithUs' || pageId === 'transfer') {
        body.push(...engagementSearchText(catalog.Engagement[pageId]))
        body.push(...engagementSearchText(catalog.PageSections[pageId]))
      }
      if (pageId === 'news')
        body.push(
          catalog.NewsEvents.description,
          catalog.NewsEvents.trainingDescription,
          ...engagementSearchText(catalog.NewsEvents.summaries),
          ...engagementSearchText(catalog.NewsEvents.events),
        )
      if (pageId === 'patents')
        body.push(
          ...engagementSearchText(catalog.Transfer.catalog),
          ...engagementSearchText(catalog.Transfer.figures),
        )
      if (pageId === 'publications') body.push(...engagementSearchText(catalog.Publications))
      if (pageId === 'network') body.push(...engagementSearchText(catalog.Network))
      if (pageId === 'platforms') body.push(...engagementSearchText(catalog.Platforms))
      if (pageId === 'programmes') {
        const programmeCopy = Object.fromEntries(
          Object.entries(catalog.Programmes).filter(
            ([key]) => key !== 'current' && key !== 'history',
          ),
        )
        body.push(
          ...engagementSearchText(programmeCopy),
          catalog.Calls.active,
          catalog.Calls.discoveryDescription,
        )
      }
      if (pageId === 'institute')
        body.push(
          ...engagementSearchText({
            title: catalog.Institute.title,
            introduction: catalog.Institute.introduction,
            statement: catalog.Institute.statement,
            editorial: catalog.Institute.editorial,
            values: catalog.Institute.values,
            ambition: { statement: catalog.Institute.ambition.statement },
            timeline: catalog.Institute.timeline,
            report: catalog.Institute.report,
          }),
          ...engagementSearchText({
            core: catalog.Narrative.coreDescription,
            missions: catalog.Narrative.missions,
            dimensions: catalog.Narrative.dimensions,
            capabilities: {
              expertise: catalog.Narrative.capabilities.expertise,
              programmes: catalog.Narrative.capabilities.programmes,
              platforms: catalog.Narrative.capabilities.platforms,
              partnerships: catalog.Narrative.capabilities.partnerships,
            },
          }),
        )
      if (pageId === 'governance') {
        const governanceCopy = {
          ...catalog.Governance,
          organisation: {
            ...catalog.Governance.organisation,
            poles: catalog.Governance.organisation.poles.map(({ title, tagline }) => ({
              title,
              tagline,
            })),
          },
        }
        body.push(...engagementSearchText(governanceCopy), samirBiographyTexts[locale])
      }
      if (pageId === 'priorities') body.push(...engagementSearchText(catalog.Roadmap))
      if (pageId === 'transfer') body.push(...engagementSearchText(catalog.Transfer))
      if (pageId === 'opportunities')
        body.push(
          ...engagementSearchText({
            description: catalog.Careers.description,
            environment: catalog.Careers.environment,
            internship: catalog.Careers.internship,
            searchText: catalog.Careers.searchText,
            form: catalog.Careers.form.notice.replace(/<\/?privacy>/g, ''),
          }),
        )
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
          ...engagementSearchText(catalog.Narrative.missions),
          ...engagementSearchText(catalog.Narrative.dimensions),
          catalog.Narrative.coreDescription,
          ...engagementSearchText(catalog.HomeAchievements.items),
          catalog.Hero.homeTitle,
          indicators.certification ?? '',
          catalog.Hero.certification.label,
          catalog.Hero.certification.description,
          catalog.Footer.tagline,
          catalog.Footer.description,
          ...figures.map(({ id, value }) => `${value ?? ''} ${catalog.Hero.figures[id]}`),
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
          catalog.HomeResearch.eyebrow,
          catalog.HomeResearch.action,
          ...researchThemes.flatMap((id) => {
            const theme = catalog.HomeResearch.themes[id]
            return [theme.title, theme.description, ...theme.axes, theme.searchText]
          }),
        )
      if (pageId === 'institute') body.push('2011', catalog.Hero.founded)
      if (pageId === 'projects') body.push(catalog.Projects.description)
      if (['legal', 'privacy', 'cookies', 'accessibility'].includes(pageId))
        body.push(...engagementSearchText(catalog.PageSections[pageId]))
      if (pageId === 'sitemap')
        body.push(
          ...Object.values(catalog.Pages),
          catalog.NewsEvents.allNews,
          catalog.Navigation.patents,
        )
      if (pageId === 'cookies') body.push(...Object.values(catalog.CookieConsent))
      documents.push({
        id: `page:${pageId}:${locale}`,
        locale,
        title: catalog.Pages[pageId],
        body: body.join(' '),
        url: pageHref(pageId, locale),
        type: 'page',
      })
      if (pageId === 'network') {
        for (const { id, topic } of networkLaboratories) {
          const lab = catalog.Network.labs[id]
          documents.push({
            id: `section:network:laboratory-${id}:${locale}`,
            locale,
            title: `${lab.title} — ${lab.institution}`,
            body: [
              lab.title,
              lab.institution,
              'city' in lab ? lab.city : '',
              catalog.Network.directory.topics[topic],
              ...engagementSearchText(messages.fr.Network.labs[id]),
              id === 'power-electronics' ? catalog.Network.directory.name : '',
              id === 'solar-energy' ? catalog.Network.directory.gepName : '',
            ].join(' '),
            url: pageHref('network', locale, laboratoryAnchor(id)),
            type: 'section',
          })
        }
      }
      const sectionCopy = catalog.PageSections[pageId] as Record<
        string,
        { title: string; description: string }
      >
      for (const section of pageSections[pageId]) {
        for (const entry of [section, ...(section.children ?? [])]) {
          const copy = sectionCopy[entry.id]
          const body = [copy.description]
          if (['legal', 'privacy', 'cookies', 'accessibility'].includes(pageId))
            body.push(...engagementSearchText(copy))
          if (pageId === 'sitemap')
            body.push(
              ...Object.values(catalog.Pages),
              catalog.NewsEvents.allNews,
              catalog.Navigation.patents,
            )
          if (pageId === 'programmes') {
            const programmeCopy = {
              'programmes-collaborations': catalog.Programmes.intro,
              'research-results': {
                ...catalog.Programmes.impact,
                label: catalog.Programmes.figureLabel,
                reference: catalog.Programmes.reference,
              },
              'project-lifecycle': {
                ...catalog.Programmes.process,
                note: catalog.Programmes.processNote,
              },
              'calls-for-projects': {
                title: catalog.Programmes.history.title,
                description: catalog.Programmes.history.description,
                items: archiveCalls.map((call) => {
                  const card = archiveCard(call, locale)
                  return { title: card.title, description: card.summary }
                }),
              },
              participate: {
                title: catalog.Calls.active,
                description: callCopy[locale].description,
              },
              'practical-questions': catalog.Programmes.final,
            }
            body.push(
              ...engagementSearchText(programmeCopy[entry.id as keyof typeof programmeCopy]),
            )
            body.push(
              'R&D&I RDI research development innovation recherche développement innovation البحث والتطوير والابتكار',
            )
          }
          if (pageId === 'platforms') {
            const platform = researchPlatforms.find(({ anchor }) => anchor === entry.id)
            if (platform) {
              const platformCopy = catalog.Platforms.platforms[platform.id]
              body.push(
                ...engagementSearchText(platformCopy),
                catalog.Platforms.imageAlt[platform.id],
              )
              if (platform.id === 'greenh2a')
                body.push(catalog.Platforms.development, catalog.Platforms.visualization)
              // Names and established acronyms remain discovery aliases in Arabic.
              body.push(
                messages.fr.Platforms.platforms[platform.id].name,
                platform.id === 'gep-mci' ? 'GEPMCI GEP-MCI' : platform.id.toUpperCase(),
              )
            } else {
              const copy = {
                'choose-by-need': catalog.Platforms.intro,
                'platform-network': catalog.Platforms.platforms,
                'capabilities-availability': catalog.Platforms.platforms.gep.infrastructure,
                'testing-demonstration': catalog.Platforms.platforms.gsbp,
                'access-platforms': catalog.Platforms.network,
                'projects-resources': catalog.Platforms.network,
              }
              body.push(...engagementSearchText(copy[entry.id as keyof typeof copy]))
            }
          }
          if (pageId === 'governance' && entry.id === 'scientific-council')
            body.push(...engagementSearchText(catalog.Governance.scientists))
          if (pageId === 'governance' && entry.id === 'bodies-responsibilities')
            body.push(...engagementSearchText(catalog.Governance.diagrams))
          if (pageId === 'governance' && entry.id === 'leadership-organisation')
            body.push(
              catalog.Governance.organisation.description,
              ...engagementSearchText(catalog.Governance.team),
            )
          if (pageId === 'governance' && locale === 'ar') {
            if (entry.id === 'scientific-council')
              body.push(
                ...governanceScientists.map((id) => messages.fr.Governance.scientists[id].name),
              )
            if (
              entry.id === 'department-responsibilities' ||
              entry.id === 'leadership-organisation'
            )
              body.push(
                messages.fr.Governance.directorGeneralName,
                ...governanceTeam.map((id) => messages.fr.Governance.team[id].name),
              )
          }
          if (pageId === 'network') {
            const networkCopy = {
              'competence-domains': catalog.Network.domains,
              'intervention-modes': catalog.Network.modes,
              'scientific-network': { ...catalog.Network.directory, labs: catalog.Network.labs },
              'skills-training': catalog.Network.skills,
              'expertise-in-action': catalog.Network.examples,
            }
            body.push(...engagementSearchText(networkCopy[entry.id as keyof typeof networkCopy]))
          }
          if (pageId === 'institute') {
            const instituteCopy = {
              about: catalog.Institute.introduction,
              'institute-positioning': {
                title: catalog.Institute.editorial.positionTitle,
                body: catalog.Institute.editorial.positionBody,
                interface: catalog.Institute.editorial.interface,
                capabilities: {
                  expertise: catalog.Narrative.capabilities.expertise,
                  programmes: catalog.Narrative.capabilities.programmes,
                  platforms: catalog.Narrative.capabilities.platforms,
                  partnerships: catalog.Narrative.capabilities.partnerships,
                },
              },
              mission: {
                statement: catalog.Institute.statement,
                title: catalog.Institute.editorial.missionTitle,
                accent: catalog.Institute.editorial.missionAccent,
                slogan: catalog.Institute.editorial.slogan,
              },
              capabilities: {
                editorial: catalog.Institute.editorial,
                core: catalog.Narrative.coreDescription,
                missions: catalog.Narrative.missions,
                dimensions: catalog.Narrative.dimensions,
              },
              'institute-studies': {
                ...catalog.Narrative.dimensions.studies,
                activities: catalog.Institute.editorial.dimensions.studies,
              },
              'institute-research': {
                core: catalog.Narrative.coreDescription,
                missions: catalog.Narrative.missions,
                pathway: catalog.Institute.editorial.pathwayTitle,
                verbs: catalog.Institute.editorial.verbs,
              },
              'institute-skills': {
                ...catalog.Narrative.dimensions.skills,
                activities: catalog.Institute.editorial.dimensions.skills,
              },
              'institute-cooperation': {
                ...catalog.Narrative.dimensions.cooperation,
                activities: catalog.Institute.editorial.dimensions.cooperation,
              },
              'institute-values': catalog.Institute.values,
              'ambition-2035': {
                statement: catalog.Institute.ambition.statement,
              },
              'key-figures': catalog.Institute.historyIntro,
              'institute-history': catalog.Institute.timeline,
              'more-resources': catalog.Institute.report,
            }
            body.push(
              ...engagementSearchText(instituteCopy[entry.id as keyof typeof instituteCopy]),
            )
          }
          if (pageId === 'news') {
            if (entry.id === 'news')
              body.push(...engagementSearchText(catalog.NewsEvents.summaries))
            if (entry.id === 'events') body.push(...engagementSearchText(catalog.NewsEvents.events))
            if (entry.id === 'follow-iresen')
              body.push(
                catalog.NewsEvents.followDescription,
                ...newsSocialLinks.map((social) => social.name),
              )
          }
          if (pageId === 'opportunities') {
            const keys = {
              'working-at-iresen': catalog.Careers.environment,
              'apply-respond': catalog.Careers.internship,
              'questions-unsolicited-applications': {
                notice: catalog.Careers.form.notice.replace(/<\/?privacy>/g, ''),
                searchText: catalog.Careers.searchText,
              },
              'open-opportunities': catalog.Careers.searchText,
              'find-opportunity': catalog.Careers.searchText,
            }
            body.push(...engagementSearchText(keys[entry.id as keyof typeof keys]))
          }
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
              body.push(item.category, item.searchText, ...engagementSearchText(item.proof))
            }
          }
          if (pageId === 'home' && entry.id === homeMissionSectionId)
            body.push(
              catalog.Narrative.coreLabel,
              catalog.Narrative.coreTitle,
              catalog.Narrative.coreDescription,
              catalog.Narrative.dimensionsLabel,
              ...engagementSearchText(catalog.Narrative.missions),
              ...engagementSearchText(catalog.Narrative.dimensions),
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
              catalog.HomeResearch.eyebrow,
              catalog.HomeResearch.action,
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
          if (pageId === 'institute' && entry.id.startsWith('institute-model-')) {
            const id = entry.id.replace('institute-model-', '')
            if (id === 'research') body.push(catalog.Narrative.coreDescription)
            if (id === 'develop' || id === 'test' || id === 'transfer')
              body.push(...engagementSearchText(catalog.Institute.editorial.verbs[id]))
            if (id === 'studies' || id === 'skills' || id === 'cooperation')
              body.push(
                ...engagementSearchText({
                  ...catalog.Narrative.dimensions[id],
                  activities: catalog.Institute.editorial.dimensions[id],
                }),
              )
          }
          if (pageId === 'home' && entry.id === 'collaboration') {
            const collaboration = catalog.HomeCollaboration
            body.push(
              collaboration.searchText,
              `${indicators.collaborators ?? ''} ${collaboration.collaborators}`,
              indicators.certification ?? '',
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
            if (entry.id === 'mission-research')
              body.push(
                catalog.HomeMissions.functions,
                ...engagementSearchText(catalog.Narrative.missions),
              )
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
    for (const publication of publications) {
      documents.push({
        id: `publication:${publication.id}:${locale}`,
        locale,
        title: publication.title,
        body: [
          catalog.Publications.articles,
          publication.authors,
          publication.year,
          publication.doiUrl,
          publication.theme,
          publication.journal,
          publication.type,
          ...titleTopics(publication.title).map((id) => catalog.Publications.topics[id]),
        ]
          .filter(Boolean)
          .join(' '),
        url: `${pageHref('publications', locale)}?publication=${encodeURIComponent(publication.id)}#${publicationAnchor(publication.id)}`,
        type: 'publication',
      })
    }
    for (const patent of patents) {
      documents.push({
        id: `section:transfer:patent-${patent.reference}:${locale}`,
        locale,
        title: `${catalog.Transfer.catalog.reference} ${patent.reference} — ${patent.title[locale]}`,
        body: [
          patent.reference,
          catalog.Transfer.figures.filed,
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
        url: pageHref('patents', locale, patentAnchor(patent.reference)),
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
    {
      documents.push({
        id: `section:library:samir-biography:${locale}`,
        locale,
        title: `${samirBiographies[locale].name} — ${messages[locale].MediaLibrary.biography}`,
        body: samirBiographyTexts[locale],
        url: pageHref('media', locale, `photo-${samirPhotoId}`),
        type: 'section',
      })
    }
    documents.push(
      ...mediaReports.map((report) => ({
        id: `report:library:${report.id}:${locale}`,
        locale,
        title: report.title,
        body: `${report.description[locale]} MTEDD Ministère de la Transition Énergétique et du Développement Durable PDF ${report.language === 'fr' ? 'CDN NDC Contribution déterminée au niveau national Nationally Determined Contribution' : ''}`,
        url: pageHref('media', locale, `report-${report.id}`),
        type: 'report' as const,
      })),
      ...usefulLinks.map((link, index) => ({
        id: `section:library:link-${link.id}:${locale}`,
        locale,
        title: catalog.UsefulLinks.items[index].title,
        body: `${catalog.UsefulLinks.items[index].description} ${usefulToolAliases[index]}`,
        url: pageHref('media', locale, `link-${link.id}`),
        type: 'section' as const,
      })),
    )
    documents.push({
      id: `page:news-listing:${locale}`,
      locale,
      title: catalog.NewsEvents.allNews,
      body: `${catalog.NewsEvents.description} ${Object.values(catalog.NewsEvents.summaries).join(' ')}`,
      url: newsListingHref(locale),
      type: 'page',
    })
    for (const post of selectedNews) {
      const key = post.id.split(':').at(-1)! as keyof typeof catalog.NewsEvents.newsTitles
      documents.push({
        id: `section:news:linkedin:${post.id}:${locale}`,
        locale,
        title: catalog.NewsEvents.newsTitles[key],
        body: `IRESEN LinkedIn ${catalog.NewsEvents.summaries[key]}`,
        url: pageHref('news', locale, `news-${key}`),
        type: 'news',
      })
    }
    for (const event of newsEvents) {
      const copy = catalog.NewsEvents.events[event.id]
      documents.push({
        id: `section:news:event-${event.id}:${locale}`,
        locale,
        title: copy.name,
        body: engagementSearchText(copy).join(' '),
        url: pageHref('news', locale, `event-${event.id}`),
        type: 'section',
      })
    }
    for (const asset of publicAssetReferences) {
      if (isAiGeneratedImage(asset.url)) continue
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
  for (const locale of contentLocales) {
    documents.push({
      id: `page:calls-listing:${locale}`,
      locale,
      title: callCopy[locale].all,
      body: callCopy[locale].description,
      url: callsListingHref(locale),
      type: 'page',
    })
    for (const call of archiveCalls) {
      const card = archiveCard(call, locale)
      const profile = archiveProfile(call)
      documents.push({
        id: `page:call-archive:${call.reference}:${locale}`,
        locale,
        title: card.title,
        body: [
          card.summary,
          card.period,
          callCopy[locale].states.closed,
          ...card.themes,
          profile.audience[locale],
          ...(call.partners || profile.partners),
        ].join(' '),
        url: card.href,
        type: 'page',
      })
    }
  }
  return documents.map((document) => ({
    ...document,
    body:
      document.body + ' ' + institutionalAffiliations(document.body, document.locale).searchText,
  }))
}

export function catalogRevision(documents = staticSearchDocuments()): string {
  return createHash('sha256').update(JSON.stringify(documents)).digest('hex')
}
