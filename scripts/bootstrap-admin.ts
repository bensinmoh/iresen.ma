import { getPayload } from 'payload'

import config from '../src/payload.config'

const email = process.env.CMS_BOOTSTRAP_EMAIL
const password = process.env.CMS_BOOTSTRAP_PASSWORD

if (!email || !password) {
  throw new Error('Set CMS_BOOTSTRAP_EMAIL and CMS_BOOTSTRAP_PASSWORD securely for this command.')
}
if (password.length < 16)
  throw new Error('Use an administrator password with at least 16 characters.')

const payload = await getPayload({ config })
try {
  const { totalDocs } = await payload.count({ collection: 'users', overrideAccess: true })
  if (totalDocs !== 0)
    throw new Error('Users already exist. An existing administrator must manage accounts.')
  await payload.create({
    collection: 'users',
    overrideAccess: true,
    context: { bootstrapInitialAdministrator: true },
    data: { email, password, role: 'admin' },
  })
  console.info('Initial administrator created. Sign in at /admin.')
} finally {
  await payload.destroy()
}

// This one-shot CLI has completed all writes and teardown; terminate remaining library timers.
process.exit(0)
