// Owner-supplied laboratory list: screenshot received 2026-10-11.
// No inferred capacity availability, equipment, outcomes or additional people.
export const laboratoryTopics = [
  'solar',
  'storage',
  'grid',
  'materials',
  'mobility',
  'bioenergy',
] as const
export type LaboratoryTopic = (typeof laboratoryTopics)[number]
export const networkLaboratories = [
  { id: 'power-electronics', topic: 'grid' },
  { id: 'battery-testing', topic: 'storage' },
  { id: 'nanoparticles', topic: 'materials' },
  { id: 'phase-change', topic: 'materials' },
  { id: 'concentrated-pv', topic: 'solar' },
  { id: 'smart-grids', topic: 'grid' },
  { id: 'methanisation', topic: 'bioenergy' },
  { id: 'low-temperature-solar', topic: 'solar' },
  { id: 'thermal-storage', topic: 'storage' },
  { id: 'solar-thermal', topic: 'solar' },
  { id: 'nanolubricants', topic: 'materials' },
  { id: 'electric-mobility', topic: 'mobility' },
  { id: 'solar-energy', topic: 'solar' },
  { id: 'thermal-production', topic: 'solar' },
] as const
export type LaboratoryId = (typeof networkLaboratories)[number]['id']
export const suppliedLaboratoryContact = {
  id: 'power-electronics',
  email: 'elomari.hamid@gmail.com',
} as const
export function laboratoryAnchor(id: LaboratoryId) {
  return `laboratory-${id}`
}
export function normalizeLaboratoryQuery(value: string) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f\u064b-\u065f\u0670\u0640]/g, '')
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .toLocaleLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}
