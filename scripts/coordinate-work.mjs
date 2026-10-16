import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { assertCoordinated, readCoordination, updateCoordination } from './work-coordination.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const [command = 'status', id, ...words] = process.argv.slice(2)
try {
  if (command === 'verify') {
    if (readCoordination(root)?.phase !== 'frozen') throw new Error('No frozen batch to verify.')
    assertCoordinated(root)
    console.log('Frozen batch verified. Check the exact PR head before CI/merge.')
  } else {
    const state =
      command === 'status'
        ? readCoordination(root)
        : updateCoordination(root, command, id, words.join(' '))
    console.log(`Coordination: ${state?.phase ?? 'not initialized'}`)
    for (const [key, participant] of Object.entries(state?.participants ?? {})) {
      console.log(`${key}: ${participant.status} — ${participant.note}`)
    }
  }
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
