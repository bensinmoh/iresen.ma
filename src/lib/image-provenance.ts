import inventory from '@/data/image-provenance.json'

/** Source evidence, not visual guesses. AI-assisted edits preserve a supplied subject. */
export const imageProvenance = inventory
const generatedPaths = new Set(
  inventory.filter((image) => image.category === 'ai-generated').map((image) => image.path),
)

export function isAiGeneratedImage(url: string): boolean {
  return generatedPaths.has(url.split(/[?#]/, 1)[0])
}
