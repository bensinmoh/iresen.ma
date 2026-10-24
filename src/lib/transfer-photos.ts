// Real photographs selected from the 2026-10-23 collection.
// Source fingerprints and reuse evidence: docs/transfer-photo-assets.json.
export const transferPhotos = {
  hero: {
    src: '/images/transfer/research-team-pv.webp',
    width: 1920,
    height: 1280,
    mobile: {
      src: '/images/transfer/research-team-pv-mobile.webp',
      width: 720,
      height: 1080,
    },
  },
  intro: {
    src: '/images/transfer/laboratory-collaboration.webp',
    width: 1600,
    height: 1067,
  },
  innovation: {
    src: '/images/heroes/transfer-researcher-sample.webp',
    width: 720,
    height: 900,
  },
  technology: {
    src: '/images/heroes/transfer-technology-discussion-070.webp',
    width: 1200,
    height: 802,
  },
  pathways: {
    src: '/images/infrastructure/ismart.webp',
    width: 1258,
    height: 1080,
  },
} as const

export const transferContactPhotoDescriptions = {
  innovation: {
    fr: 'Un chercheur manipule un échantillon en laboratoire de chimie verte.',
    en: 'A researcher handling a sample in a green chemistry laboratory.',
    ar: 'باحث يتعامل مع عينة داخل مختبر الكيمياء الخضراء.',
  },
  technology: {
    fr: 'Discussion technique entre quatre participants, avec des casques de chantier sur la table.',
    en: 'A technical discussion between four participants, with construction helmets on the table.',
    ar: 'نقاش تقني بين أربعة مشاركين، مع خوذات السلامة على الطاولة.',
  },
} as const
