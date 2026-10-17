import { getPayload } from 'payload'
import config from '../src/payload.config'
import { searchDatabase } from '../src/lib/search/database'
import { processSearchJobs, rebuildSearchIndex, stopSearchWorker } from '../src/lib/search/indexer'

const command = process.argv[2]
if (!['rebuild', 'work'].includes(command)) throw new Error('Usage: search-index.ts rebuild|work')
// This process drains jobs explicitly; a concurrent in-process worker can race cleanup.
process.env.SEARCH_WORKER_DISABLED = 'true'
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
  // Indicator projections reuse the access-controlled Payload queries. Close
  // their pool/worker as well as the independent search pool in this CLI process.
  try {
    const payload = await getPayload({ config })
    stopSearchWorker()
    await payload.destroy()
  } finally {
    await searchDatabase().end()
  }
}

// All writes and teardown have completed; terminate remaining Payload library timers.
process.exit(0)
