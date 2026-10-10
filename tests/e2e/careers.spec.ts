import { test, expect } from '@playwright/test'
import { Pool } from 'pg'
import { randomUUID } from 'node:crypto'
test.describe.configure({ mode: 'serial' })
import AxeBuilder from '@axe-core/playwright'
import { pageHref } from '../../src/lib/site'
import { pageSections } from '../../src/lib/page-sections'
import fr from '../../src/messages/fr.json' with { type: 'json' }
import en from '../../src/messages/en.json' with { type: 'json' }
import ar from '../../src/messages/ar.json' with { type: 'json' }
const messages = { fr, en, ar }

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale} careers reflow, dynamic offers and application`, async ({ page }) => {
    const copy = messages[locale].Careers
    for (const width of [320, 390, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(pageHref('opportunities', locale))
      await expect(page.locator('[data-careers-page]')).toBeVisible()
      await expect(page.locator('h1')).toHaveCount(1)
      for (const { id } of pageSections.opportunities)
        await expect(page.locator(`[id="${id}"]`)).toHaveCount(1)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
        true,
      )
      for (const image of await page.locator('[data-careers-page] img').all()) {
        await image.scrollIntoViewIfNeeded()
        await expect(image).toHaveJSProperty('complete', true)
        expect(
          await image.evaluate((element) => (element as HTMLImageElement).naturalWidth),
        ).toBeGreaterThan(0)
      }
      const offers = page.locator('#open-opportunities details')
      if (!(await offers.count())) {
        await expect(page.locator('#offers-title')).toBeVisible()
        await expect(page.getByText(copy.offers.emptyTitle)).toBeVisible()
      }
      await page.getByRole('button', { name: copy.internship.action }).click()
      await expect(
        page.getByRole('radio', { name: copy.form.internship, exact: true }),
      ).toBeChecked()
    }
    const violations = (await new AxeBuilder({ page }).include('[data-careers-page]').analyze())
      .violations
    expect(violations).toEqual([])
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%'
    })
    const overflow = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[data-careers-page] *'))
        .filter((element) => {
          const rect = element.getBoundingClientRect()
          return rect.width > 0 && (rect.right > innerWidth + 1 || rect.left < -1)
        })
        .map((element) => ({
          tag: element.tagName,
          className: element.className,
          text: element.textContent?.slice(0, 60),
        })),
    )
    expect(overflow).toEqual([])
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  })
}

test('CV selection stays local and invalid files are rejected', async ({ page }) => {
  await page.goto(pageHref('opportunities', 'fr'))
  const input = page.locator('#career-cv')
  await input.setInputFiles({
    name: 'invalid.exe',
    mimeType: 'application/octet-stream',
    buffer: Buffer.from('example'),
  })
  await expect(page.locator('[data-careers-page]').getByRole('alert')).toContainText(
    fr.Careers.form.fileError,
  )
  await input.setInputFiles({
    name: 'preview.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.from('%PDF-1.4\nLocal example'),
  })
  await expect(page.getByText('preview.pdf', { exact: true })).toBeVisible()
  await expect(page.locator('[data-careers-page]').getByRole('alert')).toHaveCount(0)
  await input.setInputFiles({
    name: 'oversize.pdf',
    mimeType: 'application/pdf',
    buffer: Buffer.alloc(5_000_001),
  })
  await expect(page.locator('[data-careers-page]').getByRole('alert')).toBeVisible()
})

test('career references and actions navigate with normal and reduced motion', async ({ page }) => {
  for (const reducedMotion of ['no-preference', 'reduce'] as const) {
    await page.emulateMedia({ reducedMotion })
    await page.goto(pageHref('opportunities', 'fr'))
    await page.getByRole('link', { name: fr.Careers.offersAction }).click()
    await expect(page).toHaveURL(/#open-opportunities$/)
    await expect
      .poll(() =>
        page
          .locator('#open-opportunities')
          .evaluate((element) => Math.abs(element.getBoundingClientRect().top)),
      )
      .toBeLessThan(32)
    await page.getByRole('button', { name: fr.Careers.internship.action }).click()
    await expect(page.locator('#career-firstName')).toBeFocused()
    await expect
      .poll(() =>
        page
          .locator('#questions-unsolicited-applications')
          .evaluate((element) => Math.abs(element.getBoundingClientRect().top)),
      )
      .toBeLessThan(32)
  }
})

test('published database offers appear dynamically, then disappear after closure', async ({
  page,
}) => {
  const database = new Pool({ connectionString: process.env.DATABASE_URL, allowExitOnIdle: true })
  let id: number | undefined
  const reference = `qa-${randomUUID()}`
  try {
    id = (
      await database.query<{ id: number }>(
        "INSERT INTO opportunities (reference,contract,state,is_demo,visibility,_status) VALUES ($1,'CDD','open',false,'public','published') RETURNING id",
        [reference],
      )
    ).rows[0].id
    for (const locale of ['fr', 'en', 'ar'] as const) {
      await database.query(
        "INSERT INTO opportunities_locales (_parent_id,_locale,title,department,location,experience,availability,summary,missions,profile,publication_status) VALUES ($1,$2,$3,'QA','QA','QA','QA','Temporary local browser validation','Validate measurements','Instrumentation expertise','published')",
        [id, locale, `QA ${locale}`],
      )
      await page.goto(pageHref('opportunities', locale))
      const offer = page.locator(`#offer-${reference}`)
      await expect(offer).toBeVisible()
      await offer.locator('summary').press('Enter')
      await expect(offer).toHaveAttribute('open', '')
      const href = await offer
        .getByRole('link', { name: messages[locale].Careers.offers.download })
        .getAttribute('href')
      expect((await page.request.get(href!)).status()).toBe(200)
      await offer.getByRole('button', { name: messages[locale].Careers.offers.apply }).click()
      await expect(page.locator('#career-offer')).toHaveValue(reference)
      await expect(page.locator('#career-firstName')).toBeFocused()
      await page.locator('#career-firstName').fill('QA')
      await page.locator('#career-lastName').fill('Local')
      await page.locator('#career-email').fill('qa@example.invalid')
      await page.locator('#career-message').fill('Temporary local validation')
      await page.getByRole('button', { name: messages[locale].Careers.form.action }).click()
      await expect(
        page.getByRole('link', { name: messages[locale].Careers.form.openEmail }),
      ).toHaveAttribute('href', /^mailto:/)
    }
    await database.query("UPDATE opportunities SET state='closed' WHERE id=$1", [id])
    await page.reload()
    await expect(page.locator(`#offer-${reference}`)).toHaveCount(0)
    expect((await page.request.get(`/api/careers/${reference}?locale=ar`)).status()).toBe(404)
  } finally {
    if (id) await database.query('DELETE FROM opportunities WHERE id=$1', [id])
    await database.end()
  }
})
