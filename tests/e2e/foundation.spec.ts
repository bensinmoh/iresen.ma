import { randomUUID } from 'node:crypto'
import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { pageHref, pageIds } from '../../src/lib/site'
import { locales } from '../../src/i18n/locales'

test('unprefixed root redirects deterministically to French', async ({ request }) => {
  const response = await request.get('/', { maxRedirects: 0 })
  expect([307, 308]).toContain(response.status())
  expect(new URL(response.headers().location, 'http://localhost:3000').pathname).toBe('/fr')
})

for (const locale of locales) {
  test(`${locale}: every approved empty route resolves with the correct language and direction`, async ({
    request,
  }) => {
    for (const id of pageIds) {
      const response = await request.get(pageHref(id, locale))
      expect(response.status(), `${locale}:${id}`).toBe(200)
      const html = await response.text()
      expect(html).toContain(`lang="${locale}"`)
      expect(html).toContain(`dir="${locale === 'ar' ? 'rtl' : 'ltr'}"`)
      expect(html).toContain('id="main-content"')
      expect(response.headers()['x-robots-tag']).toContain('noindex')
    }
  })
  test(`${locale}: homepage shell passes automated accessibility checks`, async ({ page }) => {
    await page.goto(`/${locale}`)
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(results.violations).toEqual([])
  })
}

test('language switching retains the equivalent page and supported anchor', async ({ page }) => {
  await page.goto('/fr/institut#mission')
  const header = page.locator('header')
  const english = header.getByRole('link', { name: 'English', exact: true })
  await expect(english).toHaveAttribute('href', '/en/institute#mission')
  await english.click()
  await expect(page).toHaveURL(/\/en\/institute#mission$/)
  await header.getByRole('link', { name: 'العربية', exact: true }).click()
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  expect(decodeURI(page.url())).toContain('/ar/المعهد#mission')
})

test('menu opens by keyboard, Escape restores focus, and mobile Arabic fits the viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/ar')
  const summary = page.locator('.site-menu > summary')
  await summary.focus()
  await page.keyboard.press('Enter')
  await expect(page.locator('.site-menu')).toHaveAttribute('open', '')
  await page.keyboard.press('Escape')
  await expect(page.locator('.site-menu')).not.toHaveAttribute('open', '')
  await expect(summary).toBeFocused()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})

test('CMS rejects anonymous account access and public first-administrator registration', async ({
  request,
}) => {
  const accounts = await request.get('/api/users')
  expect([401, 403]).toContain(accounts.status())
  const register = await request.post('/api/users/first-register', {
    data: {
      email: `blocked-${randomUUID()}@example.invalid`,
      password: randomUUID(),
      role: 'admin',
    },
  })
  expect([400, 401, 403]).toContain(register.status())
  const draftQuery = await request.get('/api/pages?locale=ar&fallback-locale=fr&draft=true')
  expect(draftQuery.ok()).toBe(true)
  expect((await draftQuery.json()).docs).toEqual([])
})

test('unknown locale/page paths return 404 and development robots disallow crawling', async ({
  request,
}) => {
  for (const locale of locales) {
    const unknown = await request.get(`/${locale}/not-a-real-page`)
    expect(unknown.status()).toBe(404)
    expect(await unknown.text()).toContain(`lang="${locale}"`)
  }
  expect((await request.get('/es')).status()).toBe(404)
  const robots = await request.get('/robots.txt')
  expect(await robots.text()).toContain('Disallow: /')
})
