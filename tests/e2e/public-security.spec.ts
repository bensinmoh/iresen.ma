import { expect, test } from './fixtures'
import { pages, pageHref } from '../../src/lib/site'
import { usefulLinks } from '../../src/lib/useful-links'
test('public production closes administrative and private resources', async ({ request }) => {
  for (const path of [
    '/admin',
    '/api/users',
    '/api/users/login',
    '/api/pages',
    '/api/media',
    '/.env.local',
    '/docs/references/strategy/README.md',
    '/src/data/patents.json',
    '/api/projects/demo-001/note?locale=fr',
  ]) {
    expect((await request.get(path)).status(), path).toBe(404)
  }
  expect(
    (
      await request.post('/api/users/login', {
        data: { email: 'unauthorized@example.invalid', password: 'no-password' },
      })
    ).status(),
  ).toBe(404)
})
test('HTML has an unpredictable CSP nonce and hydrates without script violations', async ({
  page,
  request,
}) => {
  const first = await request.get('/fr')
  const second = await request.get('/fr')
  const csp = first.headers()['content-security-policy']
  expect(csp).toContain("object-src 'none'")
  expect(csp).toContain("frame-ancestors 'none'")
  expect(csp).not.toContain('unsafe-eval')
  expect(csp).not.toBe(second.headers()['content-security-policy'])
  const errors: string[] = []
  page.on('console', (m) => {
    if (/Refused to execute|violates.*script-src/.test(m.text())) errors.push(m.text())
  })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/fr')
  await page.locator('.menu-toggle').click()
  await expect(page.locator('#main-content')).toHaveAttribute('inert', '')
  expect(errors).toEqual([])
})
for (const locale of ['fr', 'en', 'ar'] as const)
  test(`${locale}: useful tools preserve URLs and never embed providers`, async ({ page }) => {
    await page.goto(`/${locale}${pages.usefulLinks.pathnames[locale]}`)
    await expect(page).toHaveURL(
      (url) => decodeURI(url.pathname) + url.hash === pageHref('media', locale, 'press-resources'),
    )
    await expect(page.locator('#press-resources a')).toHaveCount(7)
    for (const link of usefulLinks)
      await expect(page.locator(`#link-${link.id}`)).toHaveAttribute('href', link.href)
    await expect(page.locator('iframe')).toHaveCount(0)
    await page.locator('#press-resources').scrollIntoViewIfNeeded()
    await page.screenshot({ path: `/tmp/useful-links-${locale}-desktop.png` })
    for (const width of [390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.locator('#press-resources').scrollIntoViewIfNeeded()
      await page.screenshot({ path: `/tmp/useful-links-${locale}-${width}.png` })
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
    }
  })
