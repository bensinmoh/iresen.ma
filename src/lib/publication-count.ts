import records from '@/data/publications.json' with { type: 'json' }

/** Complete owner-retained bibliographic database, independent of catalogue filters. */
export const totalPublications = records.length
