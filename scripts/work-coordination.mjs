import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import {
  closeSync,
  existsSync,
  lstatSync,
  mkdirSync,
  openSync,
  readFileSync,
  readlinkSync,
  readSync,
  renameSync,
  rmdirSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'

const directory = (root) => path.join(root, '.local/orchestration')
const statePath = (root) => path.join(directory(root), 'state.json')

export function readCoordination(root) {
  if (!existsSync(statePath(root))) return null
  const state = JSON.parse(readFileSync(statePath(root), 'utf8'))
  // Preserve the earlier chat's hold and evidence when adopting its registry.
  if (
    !state.version &&
    state.integrationState === 'waiting-for-parallel-chats' &&
    state.ciAllowed === false
  ) {
    return {
      version: 1,
      phase: 'hold',
      participants: Object.fromEntries(
        Object.entries(state.participants).map(([id, participant]) => [
          id,
          {
            ...participant,
            status: 'pending',
            note: `Previous status: ${participant.status}; fresh acknowledgement required`,
          },
        ]),
      ),
      previousState: state,
    }
  }
  if (
    state.version !== 1 ||
    !state.participants ||
    !['hold', 'frozen', 'open'].includes(state.phase)
  ) {
    throw new Error('Invalid coordination state; inspect .local/orchestration/state.json.')
  }
  return state
}

export function fingerprint(root) {
  const git = (...args) => execFileSync('git', args, { cwd: root, maxBuffer: 32 * 1024 * 1024 })
  const hash = createHash('sha256')
  hash.update(git('rev-parse', 'HEAD'))
  hash.update(git('ls-files', '--stage', '-z'))
  const names = [
    ...new Set(
      git('ls-files', '--cached', '--others', '--exclude-standard', '-z')
        .toString()
        .split('\0')
        .filter(Boolean),
    ),
  ].sort()
  const buffer = Buffer.alloc(1024 * 1024)
  for (const name of names) {
    hash.update(`${name}\0`)
    const file = path.join(root, name)
    if (!existsSync(file)) {
      hash.update('missing\0')
      continue
    }
    const stat = lstatSync(file)
    hash.update(`${stat.mode}\0${stat.size}\0`)
    if (stat.isSymbolicLink()) hash.update(readlinkSync(file))
    else if (stat.isFile()) {
      const fd = openSync(file, 'r')
      try {
        let count
        while ((count = readSync(fd, buffer, 0, buffer.length, null)) > 0) {
          hash.update(buffer.subarray(0, count))
        }
      } finally {
        closeSync(fd)
      }
    }
    hash.update('\0')
  }
  return hash.digest('hex')
}

export function assertCoordinated(root) {
  const state = readCoordination(root)
  // A fresh CI checkout has no local coordination state: retain the full CI suite.
  if (!state || state.phase === 'open') return
  if (state.phase !== 'frozen')
    throw new Error(
      'Checks paused by the orchestrator. Run: node scripts/coordinate-work.mjs status',
    )
  if (
    !Object.keys(state.participants).length ||
    Object.values(state.participants).some((p) => p.status !== 'ready')
  ) {
    throw new Error('Every registered chat must explicitly report ready before checks.')
  }
  if (fingerprint(root) !== state.fingerprint)
    throw new Error('Files, index or HEAD changed after freeze. Hold, reconcile and freeze again.')
}

export function updateCoordination(root, command, id, note = '') {
  mkdirSync(directory(root), { recursive: true })
  const lock = path.join(directory(root), 'lock')
  try {
    mkdirSync(lock)
  } catch (error) {
    if (error.code === 'EEXIST')
      throw new Error(
        'Another coordinator command is running (or a stale lock needs inspection).',
        {
          cause: error,
        },
      )
    throw error
  }
  try {
    const state = readCoordination(root) ?? { version: 1, phase: 'hold', participants: {} }
    const now = new Date().toISOString()
    if (['reserve', 'join', 'ready'].includes(command)) {
      if (!id || !/^[a-z0-9][a-z0-9-]{0,79}$/.test(id))
        throw new Error('Supply a lowercase participant ID (letters, digits, hyphens).')
      if (state.phase !== 'hold')
        throw new Error('Run hold before changing participants or resuming edits.')
      const previous = state.participants[id]
      if (command === 'reserve' && previous)
        throw new Error('Participant already registered; its status was preserved.')
      if (command === 'ready' && previous?.status !== 'editing')
        throw new Error('Only a joined, editing participant can report ready.')
      state.participants[id] = {
        status: { reserve: 'pending', join: 'editing', ready: 'ready' }[command],
        note: note || previous?.note || '',
        updatedAt: now,
      }
    } else if (command === 'withdraw') {
      if (state.phase !== 'hold' || state.participants[id]?.status !== 'pending' || !note.trim()) {
        throw new Error(
          'Withdraw requires a pending participant, a held batch and explicit evidence that this reservation is no longer needed.',
        )
      }
      state.withdrawnParticipants ??= []
      state.withdrawnParticipants.push({
        id,
        ...state.participants[id],
        evidence: note,
        withdrawnAt: now,
      })
      delete state.participants[id]
    } else if (command === 'hold') {
      state.phase = 'hold'
      delete state.fingerprint
      // A new editing round requires fresh acknowledgements from every participant.
      for (const participant of Object.values(state.participants)) participant.status = 'pending'
    } else if (command === 'freeze') {
      if (state.phase !== 'hold') throw new Error('Only a held batch can be frozen.')
      const entries = Object.entries(state.participants)
      if (!entries.length || entries.some(([, p]) => p.status !== 'ready'))
        throw new Error('Freeze refused: all expected chats must explicitly join and report ready.')
      const first = fingerprint(root)
      if (first !== fingerprint(root))
        throw new Error('Files changed during freeze; wait for writers to finish.')
      state.phase = 'frozen'
      state.fingerprint = first
    } else if (command === 'open') {
      assertCoordinated(root)
      if (state.phase !== 'frozen')
        throw new Error('Open requires a verified frozen batch. Do not clear an active hold.')
      state.phase = 'open'
    } else throw new Error(`Unknown command: ${command}`)
    state.updatedAt = now
    const temporary = `${statePath(root)}.${process.pid}.tmp`
    writeFileSync(temporary, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 })
    renameSync(temporary, statePath(root))
    return state
  } finally {
    rmdirSync(lock)
  }
}
