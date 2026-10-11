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
  { id: 'power-electronics', topic: 'grid', location: 'settat' },
  { id: 'battery-testing', topic: 'storage', location: 'marrakech' },
  { id: 'nanoparticles', topic: 'materials', location: 'ifrane' },
  { id: 'phase-change', topic: 'materials', location: 'casablanca' },
  { id: 'concentrated-pv', topic: 'solar', location: 'fes' },
  { id: 'smart-grids', topic: 'grid', location: 'kenitra' },
  { id: 'methanisation', topic: 'bioenergy', location: 'kenitra' },
  { id: 'low-temperature-solar', topic: 'solar', location: 'fes' },
  { id: 'thermal-storage', topic: 'storage', location: 'agadir' },
  { id: 'solar-thermal', topic: 'solar', location: 'rabat' },
  { id: 'nanolubricants', topic: 'materials', location: 'tanger' },
  { id: 'electric-mobility', topic: 'mobility', location: 'marrakech' },
  { id: 'solar-energy', topic: 'solar', location: 'benguerir' },
  { id: 'thermal-production', topic: 'solar', location: 'marrakech' },
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

// Approximate display positions on the supplied map, deliberately spread for touch access.
// Geography is never mirrored, including in Arabic.
export const laboratoryLocations = {
  settat: { x: 57, y: 33 },
  marrakech: { x: 59, y: 45 },
  ifrane: { x: 72, y: 29 },
  casablanca: { x: 46, y: 29 },
  fes: { x: 81, y: 22 },
  kenitra: { x: 65, y: 14 },
  agadir: { x: 39, y: 48 },
  rabat: { x: 57, y: 23 },
  tanger: { x: 72, y: 3 },
  benguerir: { x: 47, y: 40 },
} as const
export type LaboratoryLocation = keyof typeof laboratoryLocations
