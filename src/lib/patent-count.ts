import records from '@/data/patents.json' with { type: 'json' }

/** All filed references in the versioned patent database, including ungranted filings. */
export const totalPatents = records.length
