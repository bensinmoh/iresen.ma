import { searchDatabase } from '../src/lib/search/database'
import { processSearchJobs, rebuildSearchIndex } from '../src/lib/search/indexer'

const command = process.argv[2]
if (!['rebuild', 'work'].includes(command)) throw new Error('Usage: search-index.ts rebuild|work')
try {
  if (command === 'rebuild')
    console.log(
      `Rebuilt ${await rebuildSearchIndex()} public CMS records; static catalog synchronized.`,
    )
  else {
    // One bounded drain, suitable for a scheduler; the application also runs its own worker.
    const processed = await processSearchJobs(50)
    console.log(`Processed ${processed} search index jobs.`)
  }
} finally {
  await searchDatabase().end()
}
