import { createHash } from 'node:crypto'
import { readFileSync, readdirSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { imageProvenance, isAiGeneratedImage } from '@/lib/image-provenance'
import { staticSearchDocuments, publicAssetReferences } from '@/lib/search/catalog'

describe('site-wide image provenance and search withdrawal', () => {
  it('covers every served raster image with current fingerprints and source evidence', () => {
    const paths = readdirSync('public/images', { recursive: true })
      .filter((file) => /\.(png|jpe?g|webp|avif|gif)$/i.test(String(file)))
      .map((file) => `/images/${file}`)
    expect(imageProvenance.map((image) => image.path).sort()).toEqual(paths.sort())
    for (const image of imageProvenance) {
      expect(image.sha256).toBe(
        createHash('sha256')
          .update(readFileSync(`public${image.path}`))
          .digest('hex'),
      )
      if (image.category !== 'unverified') expect(image.references.length).toBeGreaterThan(0)
    }
  })
  it('withdraws generated originals, crops and reused copies in every locale, retaining real source images', () => {
    const documents = staticSearchDocuments()
    const generated = imageProvenance.filter((image) => image.category === 'ai-generated')
    expect(generated.length).toBeGreaterThan(0)
    for (const image of generated) {
      expect(isAiGeneratedImage(`${image.path}?size=small`)).toBe(true)
      expect(documents.some((doc) => doc.url === image.path)).toBe(false)
    }
    for (const locale of ['fr', 'en', 'ar']) {
      expect(documents.some((doc) => doc.id === `asset:contact-venue:${locale}`)).toBe(true)
      expect(
        documents.some(
          (doc) => doc.id === `asset:library-photo-portrait-dg-iresen-samir-rachidi:${locale}`,
        ),
      ).toBe(true)
      expect(
        documents.some((doc) => doc.id === `asset:institute-fifteen-year-report-cover:${locale}`),
      ).toBe(true)
      for (const asset of publicAssetReferences.filter((asset) => isAiGeneratedImage(asset.url)))
        expect(documents.some((doc) => doc.id === `asset:${asset.id}:${locale}`)).toBe(false)
    }
  })
})
