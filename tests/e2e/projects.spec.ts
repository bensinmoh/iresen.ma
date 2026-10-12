import { expect, test } from './fixtures'
import { pageHref } from '../../src/lib/site'
import fr from '../../src/messages/fr.json' with { type: 'json' }
import en from '../../src/messages/en.json' with { type: 'json' }
import ar from '../../src/messages/ar.json' with { type: 'json' }
for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: withdrawn projects leave an accessible empty catalogue`, async ({
    page,
    request,
  }) => {
    await page.goto(`${pageHref('projects', locale)}?project=demo-001&year=2025`)
    await expect(
      page.getByRole('heading', { name: { fr, en, ar }[locale].Projects.updatingTitle }),
    ).toBeVisible()
    await expect(
      page.locator('[data-projects-page] form, [data-projects-page] dialog'),
    ).toHaveCount(0)
    for (const id of [
      'featured-results',
      'find-project',
      'project-catalogue',
      'understanding-results',
      'related-capabilities',
    ])
      await expect(page.locator(`#${id}`)).toHaveCount(1)
    expect((await request.get(`/api/projects/demo-001/note?locale=${locale}`)).status()).toBe(404)
    await page.setViewportSize({ width: 390, height: 844 })
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}
