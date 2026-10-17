import { cache } from 'react'
import type { Language } from '@/lib/cms-preview/model'
import {
  publicModuleCount,
  filedPatentReferences,
  grantedPatents,
} from '@/lib/cms-preview/indicators'
import { totalProjects } from '@/lib/project-count'
import { totalPublications } from '@/lib/publication-count'
import { totalPatents } from '@/lib/patent-count'
import { filedPatents } from '@/lib/patents'
import { totalLaboratories } from '@/lib/network'
import { archiveCalls } from '@/lib/call-archives'
import { totalPublicCalls } from '@/lib/call-count'
import { siteArchivedCalls, sitePublications } from './public-corpora'
import { siteContent } from './site-content'
import { siteEditorialIndicators } from './editorial-indicators'

/** One canonical FR-approved census; locale affects only editorial display values. */
export const siteIndicatorTotals = cache(async (locale: Language = 'fr') => {
  const projects = await totalProjects()
  try {
    const [rows, editorial, publications, archivedCalls] = await Promise.all([
      siteContent(),
      siteEditorialIndicators(locale),
      sitePublications(),
      siteArchivedCalls(),
    ])
    const entries = rows.map((row) => ({
      module: row.module,
      shared: row.shared,
      publicVariants: row.public_variants,
    }))
    const connected = process.env.SITE_CONTENT_DATABASE_ENABLED === 'true'
    return {
      publications: connected ? publications.length : totalPublications,
      patents: connected ? filedPatentReferences(entries) : totalPatents,
      grantedPatents: connected
        ? grantedPatents(entries)
        : filedPatents.filter((patent) => patent.granted).length,
      calls: connected
        ? await totalPublicCalls(archivedCalls.map((call) => call.reference))
        : archiveCalls.length,
      laboratories: connected ? publicModuleCount(entries, 'laboratories') : totalLaboratories,
      projects,
      youngResearchers: editorial.youngResearchers,
    }
  } catch {
    return {
      publications: null,
      patents: null,
      grantedPatents: null,
      calls: null,
      laboratories: null,
      projects,
      youngResearchers: null,
    }
  }
})
