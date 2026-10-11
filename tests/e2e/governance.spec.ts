import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { pageHref } from '../../src/lib/site'
import {
  governanceBoardSites,
  governanceScientistLinkedin,
  governanceTeamLinkedin,
} from '../../src/lib/governance'
import fr from '../../src/messages/fr.json' with { type: 'json' }
import en from '../../src/messages/en.json' with { type: 'json' }
import ar from '../../src/messages/ar.json' with { type: 'json' }
import { pageSections } from '../../src/lib/page-sections'

const catalogs = { fr, en, ar }

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: governance councils, owner roles and responsive organisation`, async ({
    page,
  }) => {
    await page.goto(pageHref('governance', locale))
    await page.evaluate(() => document.fonts.ready)
    const governance = page.locator('[data-governance-page]')
    await expect(governance.locator('h1')).toHaveCount(1)
    await expect(governance.locator('#council-representatives li')).toHaveCount(16)
    for (const url of Object.values(governanceBoardSites))
      await expect(governance.locator(`#council-representatives a[href="${url}"]`)).toHaveCount(1)
    await expect(governance.locator('[id^="scientific-member-"]')).toHaveCount(8)
    await expect(governance.locator('#department-responsibilities article')).toHaveCount(7)
    await expect(governance.locator('#council-representatives')).not.toContainText(
      'Société d’Ingénierie Énergétique',
    )
    await expect(governance.locator('#council-representatives')).toContainText('UM6P')
    for (const entry of pageSections.governance) {
      for (const { id } of [entry, ...(entry.children ?? [])])
        await expect(governance.locator(`#${id}`)).toHaveCount(1)
    }
    for (const { name } of Object.values(catalogs[locale].Governance.team)) {
      await expect(governance.locator('#department-responsibilities')).toContainText(name)
    }
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const width of [1440, 1024, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 })
      await expect
        .poll(() =>
          governance.locator('#council-representatives li img').evaluateAll((images) =>
            images.every((image) => {
              const imageBox = image.getBoundingClientRect()
              const slot = image.parentElement!.getBoundingClientRect()
              const label = image.parentElement!.nextElementSibling!.getBoundingClientRect()
              return (
                imageBox.width <= slot.width + 1 &&
                imageBox.height <= slot.height + 1 &&
                imageBox.bottom <= label.top + 1
              )
            }),
          ),
        )
        .toBe(true)
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
        .toBe(true)
    }
    await page.setViewportSize({ width: 390, height: 844 })
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%'
    })
    await expect
      .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
      .toBe(true)
    await page.evaluate(() => {
      document.documentElement.style.fontSize = ''
    })
    await governance.locator('nav a[href="#leadership-organisation"]').click()
    await expect(page).toHaveURL(/#leadership-organisation$/)
    await expect(governance.locator('#organisation-title')).toBeVisible()
  })
}

test('French roles omit director titles for strategy and IT; page has no serious axe violations', async ({
  page,
}) => {
  await page.goto(pageHref('governance', 'fr'))
  for (const [name, role] of [
    ['Imane MOUBACHIR', 'Strat & Orga'],
    ['Jamaleddine FOUHAM', 'IT et SI'],
  ]) {
    const card = page.locator('#department-responsibilities article').filter({ hasText: name })
    await expect(
      card.locator('button[aria-haspopup="dialog"]').getByText(role, { exact: true }),
    ).toBeVisible()
  }
  const result = await new AxeBuilder({ page }).include('[data-governance-page]').analyze()
  expect(
    result.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical'),
  ).toEqual([])
})

test('governance remains readable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false })
  const page = await context.newPage()
  await page.goto(pageHref('governance', 'fr'))
  await expect(page.locator('#scientific-council')).toContainText('Ahmed ENNAOUI')
  await expect(page.locator('#department-responsibilities')).toContainText('Soukaina BOUDOUDOU')
  await context.close()
})

test('scientific council and portraits are discoverable in all three locales', async ({ page }) => {
  for (const locale of ['fr', 'en', 'ar'] as const) {
    const query = new URLSearchParams({ q: 'Ahmed ENNAOUI', type: 'section' })
    await page.goto(`${pageHref('search', locale)}?${query}`)
    await expect(
      page.locator(
        `.search-results a[href="${pageHref('governance', locale, 'scientific-council')}"]`,
      ),
    ).toBeVisible()
    if (locale === 'ar') {
      query.set('q', catalogs.ar.Governance.scientists.ennaoui.name)
      await page.goto(`${pageHref('search', locale)}?${query}`)
      await expect(
        page.locator(
          `.search-results a[href="${pageHref('governance', locale, 'scientific-council')}"]`,
        ),
      ).toBeVisible()
    }
    query.set('q', 'Soukaina BOUDOUDOU')
    query.set('type', 'media')
    await page.goto(`${pageHref('search', locale)}?${query}`)
    await expect(
      page.locator(
        '.search-results a[href="/images/governance/soukaina-portrait.png"]:not([aria-hidden])',
      ),
    ).toBeVisible()
  }
})

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: scientist LinkedIn links and colleague biography dialogs`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto(pageHref('governance', locale))
    for (const [id, url] of Object.entries(governanceScientistLinkedin)) {
      await expect(page.locator(`#scientific-member-${id} a`)).toHaveAttribute('href', url)
      await expect(page.locator(`#scientific-member-${id} h4`)).toHaveText(
        catalogs[locale].Governance.scientists[id as keyof typeof catalogs.fr.Governance.scientists]
          .name,
      )
    }
    for (const [id, url] of Object.entries(governanceTeamLinkedin)) {
      const trigger = page.locator(`#team-member-${id}`)
      await trigger.click()
      const dialog = page.getByRole('dialog')
      await expect(dialog).toBeVisible()
      await expect(dialog.locator('h2')).toHaveText(
        id === 'samir'
          ? catalogs[locale].Governance.directorGeneralName
          : catalogs[locale].Governance.team[id as keyof typeof catalogs.fr.Governance.team].name,
      )
      await expect(dialog.locator('img')).toHaveCount(1)
      await expect(dialog.locator('p')).toHaveCount(id === 'samir' ? 7 : id === 'mouhcine' ? 5 : 3)
      if (url) await expect(dialog.locator('a')).toHaveAttribute('href', url)
      else await expect(dialog.locator('a')).toHaveCount(0)
      if (id === 'samir') await dialog.getByRole('button').click()
      else await page.keyboard.press('Escape')
      await expect(dialog).not.toBeVisible()
      await expect(trigger).toBeFocused()
    }
    await page.setViewportSize({ width: 390, height: 844 })
    await page.locator('#team-member-soukaina').click()
    const dialog = page.getByRole('dialog')
    await page.evaluate(() => (document.documentElement.style.fontSize = '200%'))
    await expect.poll(() => dialog.evaluate((e) => e.scrollWidth <= e.clientWidth + 1)).toBe(true)
    const axe = await new AxeBuilder({ page }).include('dialog[open]').analyze()
    expect(axe.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')).toEqual(
      [],
    )
    await page.evaluate(() => (document.documentElement.style.fontSize = ''))
    const box = await dialog.boundingBox()
    await page.mouse.click(1, (box?.y ?? 0) + 10)
    await expect(dialog).not.toBeVisible()
    await expect(page.locator('#team-member-soukaina')).toBeFocused()
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden')
  })
}
