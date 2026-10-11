export const governanceBoard = [
  'min-finance',
  'min-energie',
  'minensup',
  'micep',
  'ocp',
  'amee',
  'nareva',
  'um6p',
  'onhym',
  'federation-de-lener',
  'cnesten',
  'masen',
  'onee',
  'rd-maroc',
  'managem',
  'fenelec',
] as const
export const governanceScientists = [
  'ennaoui',
  'artiba',
  'pavia',
  'lambert',
  'wehrspohn',
  'pitz-paal',
  'bounahmidi',
  'miranda',
] as const
export const governanceTeam = [
  'soukaina',
  'ayoub',
  'mouhcine',
  'laila',
  'imane',
  'jamaleddine',
] as const
export const governanceDepartments = [
  ['ayoub', 'mouhcine', 'imane'],
  ['soukaina', null],
  ['laila', 'jamaleddine'],
] as const

export const governanceBoardLogo = (id: (typeof governanceBoard)[number]) =>
  `/images/governance/${['min-finance', 'min-energie', 'minensup', 'micep'].includes(id) ? 'armoiries-maroc' : id}.svg`

export const governanceBoardSites = {
  'min-finance': 'https://www.finances.gov.ma/',
  'min-energie': 'https://www.mtedd.gov.ma/',
  minensup: 'https://www.enssup.gov.ma/',
  micep: 'https://www.mcinet.gov.ma/',
  ocp: 'https://www.ocpgroup.ma/',
  amee: 'https://www.amee.ma/',
  nareva: 'https://www.nareva.ma/',
  um6p: 'https://www.um6p.ma/',
  onhym: 'https://www.onhym.com/',
  'federation-de-lener': 'https://www.fedenerg.ma/',
  cnesten: 'https://www.cnesten.org.ma/',
  masen: 'https://www.masen.ma/',
  onee: 'https://www.one.org.ma/',
  'rd-maroc': 'https://www.rdmaroc.com/',
  managem: 'https://www.managemgroup.com/',
  fenelec: 'https://fenelec.com/',
} as const
