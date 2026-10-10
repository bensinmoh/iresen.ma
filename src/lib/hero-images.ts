// Native photographic assets and their full-height mobile crops.
// Provenance, prompts, pixel sizes and hashes: docs/hero-assets.json.
export const heroImages = {
  'media-library': {
    src: '/images/media-library/media-library-hero.webp',
    width: 1536,
    height: 1024,
    mobile: { src: '/images/media-library/media-library-hero.webp', width: 1536, height: 1024 },
  },
  'careers-onboarding': {
    src: '/images/heroes/careers-onboarding-a0935b018aa6.webp',
    width: 1536,
    height: 1024,
    mobile: {
      src: '/images/heroes/careers-onboarding-mobile-3c9467d279e8.webp',
      width: 683,
      height: 1024,
    },
  },
  governance: {
    src: '/images/heroes/governance-598e07ec7988.webp',
    width: 1536,
    height: 1024,
    mobile: {
      src: '/images/heroes/governance-mobile-b489f3c97bd6.webp',
      width: 683,
      height: 1024,
    },
  },
  conference: {
    src: '/images/heroes/conference-d533b6ed6fb6.webp',
    width: 1536,
    height: 1024,
    mobile: {
      src: '/images/heroes/conference-mobile-d75f64dd6787.webp',
      width: 683,
      height: 1024,
    },
  },
  reading: {
    src: '/images/heroes/reading-9d347e0a2ed8.webp',
    width: 1536,
    height: 1024,
    mobile: {
      src: '/images/heroes/reading-mobile-d8b8e9112c6e.webp',
      width: 683,
      height: 1024,
    },
  },
  research: {
    src: '/images/heroes/research-1dc2b1d2ea42.webp',
    width: 1536,
    height: 1024,
    mobile: {
      src: '/images/heroes/research-mobile-5c0d5e7161f2.webp',
      width: 683,
      height: 1024,
    },
  },
  'solar-aerial': {
    src: '/images/heroes/solar-aerial-47f3d26a392b.webp',
    width: 1672,
    height: 941,
    mobile: {
      src: '/images/heroes/solar-aerial-mobile-836f21a73f2a.webp',
      width: 627,
      height: 941,
    },
  },
  'solar-city': {
    src: '/images/heroes/solar-city-79262d84a1ba.webp',
    width: 1536,
    height: 1024,
    mobile: {
      src: '/images/heroes/solar-city-mobile-7b4d48ba6244.webp',
      width: 683,
      height: 1024,
    },
  },
  'solar-detail': {
    src: '/images/heroes/solar-detail-898dc69d3900.webp',
    width: 1536,
    height: 1024,
    mobile: {
      src: '/images/heroes/solar-detail-mobile-85512902dfa3.webp',
      width: 683,
      height: 1024,
    },
  },
  'solar-expertise': {
    src: '/images/heroes/solar-expertise-d1a731bdb7ad.webp',
    width: 1536,
    height: 1024,
    mobile: {
      src: '/images/heroes/solar-expertise-mobile-ad3376396a3e.webp',
      width: 683,
      height: 1024,
    },
  },
  'solar-field': {
    src: '/images/heroes/solar-field-c7bf4e8c9199.webp',
    width: 1536,
    height: 1024,
    mobile: {
      src: '/images/heroes/solar-field-mobile-4b16d7844f5a.webp',
      width: 683,
      height: 1024,
    },
  },
  'solar-horizon': {
    src: '/images/heroes/solar-horizon-76a1a663a424.webp',
    width: 1536,
    height: 1024,
    mobile: {
      src: '/images/heroes/solar-horizon-mobile-e1d07bde00d8.webp',
      width: 683,
      height: 1024,
    },
  },
  'solar-sunset': {
    src: '/images/heroes/solar-sunset-a27f2d68ea29.webp',
    width: 1536,
    height: 1024,
    mobile: {
      src: '/images/heroes/solar-sunset-mobile-889101e3c5b4.webp',
      width: 683,
      height: 1024,
    },
  },
  team: {
    src: '/images/heroes/team-024481368fd7.webp',
    width: 1536,
    height: 1024,
    mobile: {
      src: '/images/heroes/team-mobile-657ccde90f41.webp',
      width: 683,
      height: 1024,
    },
  },
  'wind-detail': {
    src: '/images/heroes/wind-detail-7e64333aa06f.webp',
    width: 1536,
    height: 1024,
    mobile: {
      src: '/images/heroes/wind-detail-mobile-13d915f73e61.webp',
      width: 683,
      height: 1024,
    },
  },
  'partnership-handshake': {
    src: '/images/heroes/partnership-handshake-c6da03657725.webp',
    width: 1536,
    height: 1024,
    mobile: {
      src: '/images/heroes/partnership-handshake-mobile-cd8622b10825.webp',
      width: 683,
      height: 1024,
    },
  },
  'wind-landscape': {
    src: '/images/heroes/wind-landscape-f05d7711d8d0.webp',
    width: 1536,
    height: 1024,
    mobile: {
      src: '/images/heroes/wind-landscape-mobile-545006a7b08a.webp',
      width: 683,
      height: 1024,
    },
  },
  workshop: {
    src: '/images/heroes/workshop-f9504d1337a2.webp',
    width: 1536,
    height: 1024,
    mobile: {
      src: '/images/heroes/workshop-mobile-8e8c5c2cc11a.webp',
      width: 683,
      height: 1024,
    },
  },
} as const

export type HeroPhotoId = keyof typeof heroImages
