import { test as base } from '@playwright/test'
import { createHash } from 'node:crypto'
export * from '@playwright/test'
// A browser journey represents one visitor. The isolated test proxy contract
// assigns separate synthetic addresses so parallel visitors do not share loopback's quota.
export const test = base.extend({
  extraHTTPHeaders: async ({ extraHTTPHeaders }, use, testInfo) => {
    const key = createHash('sha256').update(testInfo.testId).digest()
    await use({ ...extraHTTPHeaders, 'x-real-ip': `198.18.${key[0]}.${key[1]}` })
  },
})
