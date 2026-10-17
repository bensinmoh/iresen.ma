import { editorialIndicatorDefaults } from './editorial-indicators'
import { totalPatents } from './patent-count'
import { totalLaboratories } from './network'

// Catalogue figures derive from their databases; other supplied figures retain their notation.
export const homeFigures = [
  { id: 'collaborativeProjects', value: null },
  { id: 'patents', value: totalPatents.toString() },
  { id: 'youngResearchers', value: editorialIndicatorDefaults.youngResearchers },
  { id: 'publications', value: null },
  { id: 'universityLaboratories', value: totalLaboratories.toString() },
] as const

/** Keep the + threshold at or below the actual count; small totals remain exact. */
export function roundedPublicationTotal(total: number | null) {
  if (total === null) return '—'
  return total < 100 ? String(total) : `+${Math.floor(total / 100) * 100}`
}

export type HomeFigureOverrides = {
  patents?: number | null
  laboratories?: number | null
  youngResearchers?: string | null
}
export function resolveHomeFigures(
  totalProjects: number | null,
  totalPublications: number | null,
  overrides: HomeFigureOverrides = {},
) {
  return homeFigures.map((figure) => ({
    ...figure,
    value:
      figure.id === 'patents' && 'patents' in overrides
        ? (overrides.patents?.toString() ?? '—')
        : figure.id === 'universityLaboratories' && 'laboratories' in overrides
          ? (overrides.laboratories?.toString() ?? '—')
          : figure.id === 'youngResearchers' && 'youngResearchers' in overrides
            ? (overrides.youngResearchers ?? '—')
            : figure.id === 'collaborativeProjects'
              ? (totalProjects?.toString() ?? '—')
              : figure.id === 'publications'
                ? roundedPublicationTotal(totalPublications)
                : figure.value,
  }))
}
