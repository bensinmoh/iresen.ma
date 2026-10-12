import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'retain-on-failure',
    // Existing journeys begin after an explicit refusal; first-visit consent has its own suite.
    storageState: {
      cookies: [
        {
          name: 'iresen_consent',
          value: encodeURIComponent(
            JSON.stringify({
              version: 1,
              external: false,
              expires: Date.now() + 180 * 86400 * 1000,
            }),
          ),
          domain: '127.0.0.1',
          path: '/',
          expires: Math.floor(Date.now() / 1000) + 180 * 86400,
          httpOnly: false,
          secure: false,
          sameSite: 'Lax',
        },
      ],
      origins: [],
    },
    launchOptions: process.env.PLAYWRIGHT_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH }
      : undefined,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm start',
    url: 'http://127.0.0.1:3000/fr',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
