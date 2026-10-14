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
  ['soukaina', 'samir'],
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

export const governanceScientistLinkedin = {
  ennaoui: 'https://www.linkedin.com/in/ahmed-ennaoui-94127854/',
  artiba: 'https://www.linkedin.com/in/abdelhakim-artiba-096aa836/',
  pavia: 'https://www.linkedin.com/in/diego-pavia-479b133b/',
  lambert: 'https://www.linkedin.com/in/florence-lambert-hognon-730b17105/',
  wehrspohn: 'https://www.linkedin.com/in/ralf-wehrspohn-b27a8072/',
  'pitz-paal': 'https://www.linkedin.com/in/robert-pitz-paal-14b797230/',
  bounahmidi: 'https://www.linkedin.com/in/tijani-bounahmidi-9a666018/',
  miranda: 'https://www.linkedin.com/in/vladimiro-miranda-a09a92133/',
} as const

export const governanceTeamLinkedin = {
  soukaina: 'https://www.linkedin.com/in/soukaina-boudoudouh-b58085152/',
  ayoub: 'https://www.linkedin.com/in/ayoub-hirt-244287100/',
  mouhcine: 'https://www.linkedin.com/in/mouhcine-benmeziane/',
  laila: null,
  imane: 'https://www.linkedin.com/in/imane-moubachir-a44a199a/',
  jamaleddine: 'https://www.linkedin.com/in/jamal-eddine-fouham-26563128a/',
  samir: 'https://www.linkedin.com/in/samir-rachidi-05129028/',
} as const
