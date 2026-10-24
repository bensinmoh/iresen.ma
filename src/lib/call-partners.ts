/** Official marks identify the recorded programme partners; no new role is inferred.
 * Logo frames exclude uneven blank margins for centering, preserving original files.
 */
export const callPartners: Record<
  string,
  {
    id: string
    name: string
    logo: string
    website: string
    logoFrame?: { width: number; height: number; viewBox: string }
  }
> = {
  IRESEN: {
    id: 'iresen',
    name: 'IRESEN',
    logo: '/brand/logo-primary.svg',
    website: 'https://iresen.org/',
  },
  'Groupe Al Omrane': {
    id: 'omrane',
    name: 'Groupe Al Omrane',
    logo: '/images/call-partners/omrane.svg',
    website: 'https://www.alomrane.gov.ma/',
  },
  Tamwilcom: {
    id: 'tamwilcom',
    name: 'Tamwilcom',
    logo: '/images/call-partners/tamwilcom.png',
    website: 'https://www.tamwilcom.ma/',
  },
  CDTI: {
    id: 'cdti',
    name: 'CDTI',
    logo: '/images/call-partners/cdti.svg',
    website: 'https://www.cdti.es/',
  },
  'KIC InnoEnergy': {
    id: 'innoenergy',
    name: 'KIC InnoEnergy',
    logo: '/images/call-partners/innoenergy.png',
    website: 'https://innoenergy.com/',
  },
  'ERA-Net Smart Energy Systems': {
    id: 'ses',
    name: 'ERA-Net Smart Energy Systems',
    logo: '/images/call-partners/smart-energy-systems.png',
    website: 'https://www.eranet-smartenergysystems.eu/',
  },
  'Mission Innovation': {
    id: 'mission',
    name: 'Mission Innovation',
    logo: '/images/call-partners/mission-innovation.png',
    website: 'https://mission-innovation.net/',
  },
  'LEAP-RE': {
    id: 'leapre',
    name: 'LEAP-RE',
    logo: '/images/call-partners/leap-re.png',
    website: 'https://leap-energy.eu/',
  },
  'LEAP-SE': {
    id: 'leapse',
    name: 'LEAP-SE',
    logo: '/images/call-partners/leap-se.png',
    website: 'https://leap-energy.eu/call-funding',
  },
  'SATT Paris-Saclay': {
    id: 'satt',
    name: 'SATT Paris-Saclay',
    logo: '/images/call-partners/satt.png',
    website: 'https://satt-paris-saclay.fr/',
  },
  AFD: {
    id: 'afd',
    name: 'AFD',
    logo: '/images/call-partners/afd.png',
    website: 'https://www.afd.fr/',
  },
}
