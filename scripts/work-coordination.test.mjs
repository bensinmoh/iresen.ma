import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, copyFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'
import { assertCoordinated, readCoordination, updateCoordination } from './work-coordination.mjs'

const sourceRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function repository(t) {
  const root = mkdtempSync(path.join(os.tmpdir(), 'iresen-coordination-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  const git = (...args) => execFileSync('git', args, { cwd: root, stdio: 'pipe' })
  git('init')
  git('config', 'user.name', 'Coordination test')
  git('config', 'user.email', 'coordination@example.invalid')
  writeFileSync(path.join(root, '.gitignore'), '.local/\n')
  writeFileSync(path.join(root, 'source.txt'), 'initial\n')
  git('add', '.')
  git('commit', '-m', 'Initial test fixture')
  return { root, git }
}

function freeze(root) {
  updateCoordination(root, 'join', 'writer')
  updateCoordination(root, 'ready', 'writer')
  updateCoordination(root, 'freeze')
}

test('every reserved writer must acknowledge readiness; hold resets acknowledgements', (t) => {
  const { root } = repository(t)
  updateCoordination(root, 'reserve', 'projects', 'Unconfirmed writer')
  assert.throws(() => updateCoordination(root, 'ready', 'projects'), /joined/)
  assert.throws(() => updateCoordination(root, 'freeze'), /all expected chats/)
  assert.throws(() => assertCoordinated(root), /paused/)
  updateCoordination(root, 'join', 'projects')
  updateCoordination(root, 'join', 'calls')
  updateCoordination(root, 'ready', 'projects')
  assert.throws(() => updateCoordination(root, 'freeze'), /all expected chats/)
  updateCoordination(root, 'ready', 'calls')
  updateCoordination(root, 'freeze')
  assert.doesNotThrow(() => assertCoordinated(root))
  assert.throws(() => updateCoordination(root, 'join', 'projects'), /Run hold/)
  updateCoordination(root, 'hold')
  assert.equal(readCoordination(root).participants.projects.status, 'pending')
  assert.throws(() => updateCoordination(root, 'open'), /paused/)
})

for (const mutation of ['edit', 'untracked', 'stage', 'head']) {
  test(`frozen evidence is invalidated by ${mutation}`, (t) => {
    const { root, git } = repository(t)
    if (mutation === 'stage') writeFileSync(path.join(root, 'source.txt'), 'unstaged\n')
    freeze(root)
    if (mutation === 'edit') writeFileSync(path.join(root, 'source.txt'), 'changed\n')
    if (mutation === 'untracked') writeFileSync(path.join(root, 'new.txt'), 'new\n')
    if (mutation === 'stage') git('add', 'source.txt')
    if (mutation === 'head') git('commit', '--allow-empty', '-m', 'Changed head')
    assert.throws(() => assertCoordinated(root), /changed after freeze/)
    assert.throws(() => updateCoordination(root, 'open'), /changed after freeze/)
  })
}

test('fresh CI has no hold; local release requires a verified freeze', (t) => {
  const { root } = repository(t)
  assert.doesNotThrow(() => assertCoordinated(root))
  assert.throws(() => updateCoordination(root, 'freeze'), /all expected chats/)
  freeze(root)
  assert.doesNotThrow(() => assertCoordinated(root))
  updateCoordination(root, 'open')
  assert.equal(readCoordination(root).phase, 'open')
})

test('withdrawal needs evidence and cannot silently remove an active writer', (t) => {
  const { root } = repository(t)
  updateCoordination(root, 'reserve', 'placeholder')
  assert.throws(() => updateCoordination(root, 'withdraw', 'placeholder'), /explicit evidence/)
  updateCoordination(root, 'withdraw', 'placeholder', 'Owner confirmed this task was cancelled')
  const state = readCoordination(root)
  assert.equal(state.participants.placeholder, undefined)
  assert.equal(state.withdrawnParticipants[0].id, 'placeholder')
  updateCoordination(root, 'join', 'writer')
  assert.throws(
    () => updateCoordination(root, 'withdraw', 'writer', 'Not sufficient'),
    /explicit evidence/,
  )
})

test('concurrent registry lock and malformed state fail closed', (t) => {
  const { root } = repository(t)
  updateCoordination(root, 'hold')
  const state = path.join(root, '.local/orchestration/state.json')
  const before = readFileSync(state, 'utf8')
  const lock = path.join(root, '.local/orchestration/lock')
  mkdirSync(lock)
  assert.throws(() => updateCoordination(root, 'join', 'writer'), /Another coordinator/)
  assert.equal(readFileSync(state, 'utf8'), before)
  rmSync(lock, { recursive: true })
  writeFileSync(state, 'malformed')
  assert.throws(() => assertCoordinated(root))
  assert.throws(() => updateCoordination(root, 'hold'))
})

test('adopts the previous chat registry without losing its hold or PR evidence', (t) => {
  const { root } = repository(t)
  mkdirSync(path.join(root, '.local/orchestration'), { recursive: true })
  writeFileSync(
    path.join(root, '.local/orchestration/state.json'),
    JSON.stringify({
      integrationState: 'waiting-for-parallel-chats',
      ciAllowed: false,
      cancelledRun: 38820457337,
      participants: { governance: { status: 'ready-for-integration', pullRequest: 119 } },
    }),
  )
  assert.throws(() => assertCoordinated(root), /paused/)
  updateCoordination(root, 'hold')
  const state = readCoordination(root)
  assert.equal(state.participants.governance.pullRequest, 119)
  assert.equal(state.participants.governance.status, 'pending')
  assert.equal(state.previousState.cancelledRun, 38820457337)
})

test('actual local launcher refuses test/build commands before resolving dependencies', (t) => {
  const { root } = repository(t)
  mkdirSync(path.join(root, 'scripts'))
  for (const file of ['run.mjs', 'work-coordination.mjs']) {
    copyFileSync(path.join(sourceRoot, 'scripts', file), path.join(root, 'scripts', file))
  }
  updateCoordination(root, 'hold')
  for (const args of [
    ['vitest', 'run'],
    ['playwright', 'test'],
    ['next', 'build'],
  ]) {
    const result = spawnSync(process.execPath, [path.join(root, 'scripts/run.mjs'), ...args], {
      encoding: 'utf8',
    })
    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /Checks paused by the orchestrator/)
  }
})
