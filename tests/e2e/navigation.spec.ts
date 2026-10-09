import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { locales } from '../../src/i18n/locales'
import { navigationGroups, pageHref } from '../../src/lib/site'
import ar from '../../src/messages/ar.json' with { type: 'json' }
import en from '../../src/messages/en.json' with { type: 'json' }
import fr from '../../src/messages/fr.json' with { type: 'json' }

const catalogs = { ar, en, fr }

test('desktop disclosures support keyboard navigation, exclusivity and Escape focus restoration', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(pageHref('governance', 'fr'))
  const navigation = page.locator('.desktop-navigation')
  const groups = navigation.locator('.desktop-navigation-group')
  const institute = groups.nth(0)
  const research = groups.nth(1)
  const instituteTrigger = institute.locator(':scope > summary')
  const researchTrigger = research.locator(':scope > summary')

  await expect(navigation).toHaveAccessibleName(fr.Navigation.label)
  await expect(page.locator('.site-menu')).toBeHidden()
  await instituteTrigger.focus()
  await page.keyboard.press('Enter')
  await expect(institute).toHaveAttribute('open', '')
  await page.keyboard.press('Space')
  await expect(institute).not.toHaveAttribute('open', '')

  await page.keyboard.press('ArrowDown')
  await expect(institute).toHaveAttribute('open', '')
  await expect(institute.locator('.mega-menu-links a').first()).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(institute).not.toHaveAttribute('open', '')
  await expect(instituteTrigger).toBeFocused()

  await page.keyboard.press('Enter')
  await researchTrigger.focus()
  await page.keyboard.press('Enter')
  await expect(research).toHaveAttribute('open', '')
  await expect(institute).not.toHaveAttribute('open', '')
  await expect(groups.locator('summary')).toHaveCount(navigationGroups.length)
  await expect(navigation.locator('.desktop-navigation-group[open]')).toHaveCount(1)
  await page.keyboard.press('Escape')
  await expect(research).not.toHaveAttribute('open', '')
  await expect(researchTrigger).toBeFocused()
})

test('desktop panels dismiss on Escape, outside pointer and focus without moving outside focus', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(pageHref('home', 'fr'))
  const group = page.locator('.desktop-navigation-group').first()
  const trigger = group.locator(':scope > summary')

  await trigger.hover()
  await expect(group).toHaveAttribute('open', '')
  await expect(page.locator('body')).toBeFocused()
  // The connected tab must let the pointer reach both destination columns.
  await group.locator('.mega-menu-links a').first().hover()
  await expect(group).toHaveAttribute('open', '')
  await group.locator('.mega-menu-feature').hover()
  await expect(group).toHaveAttribute('open', '')
  await page.keyboard.press('Escape')
  await expect(group).not.toHaveAttribute('open', '')
  await expect(page.locator('body')).toBeFocused()

  await page.mouse.move(1, 899)
  await trigger.hover()
  await expect(group).toHaveAttribute('open', '')
  await page.mouse.click(1, 899)
  await expect(group).not.toHaveAttribute('open', '')

  await trigger.focus()
  await page.keyboard.press('ArrowDown')
  await expect(group).toHaveAttribute('open', '')
  await page.locator('#main-content').focus()
  await expect(group).not.toHaveAttribute('open', '')
  await expect(page.locator('#main-content')).toBeFocused()
})

test('crossing the navigation breakpoint preserves visible keyboard focus in both directions', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto(pageHref('home', 'fr'))
  const desktop = page.locator('.desktop-navigation')
  const desktopExpertise = desktop.locator('.desktop-navigation-group').nth(2)
  const desktopTrigger = desktopExpertise.locator(':scope > summary')
  const compact = page.locator('.site-menu')
  const compactTrigger = compact.locator(':scope > summary')
  const compactExpertise = compact.locator('.navigation-group').nth(2)

  await desktopTrigger.focus()
  await page.keyboard.press('ArrowDown')
  await expect(desktopExpertise).toHaveAttribute('open', '')
  await expect(desktopExpertise.locator('.mega-menu-links a').first()).toBeFocused()
  await page.setViewportSize({ width: 1024, height: 900 })
  await expect(desktop).toBeHidden()
  await expect(desktopExpertise).not.toHaveAttribute('open', '')
  await expect(compactTrigger).toBeVisible()
  await expect(compactTrigger).toBeFocused()

  await page.keyboard.press('Enter')
  await compactExpertise.locator(':scope > summary').focus()
  await page.keyboard.press('Enter')
  const network = compactExpertise.locator(`a[href="${pageHref('network', 'fr')}"]`)
  await network.focus()
  await expect(network).toBeFocused()
  await page.setViewportSize({ width: 1440, height: 900 })
  await expect(compact).toBeHidden()
  await expect(compact).not.toHaveAttribute('open', '')
  await expect(compactExpertise).not.toHaveAttribute('open', '')
  await expect(desktopTrigger).toBeVisible()
  await expect(desktopTrigger).toBeFocused()
  await expect(desktopExpertise).not.toHaveAttribute('open', '')

  await page.locator('#main-content').focus()
  await page.setViewportSize({ width: 1024, height: 900 })
  await expect(page.locator('#main-content')).toBeFocused()
})

for (const locale of locales) {
  test(`${locale}: desktop navigation exposes equivalent destinations, the current page and accessible open panels`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto(pageHref('governance', locale))
    const header = page.getByRole('banner')
    const navigation = header.locator('.desktop-navigation')
    const messages = catalogs[locale]

    await expect(navigation).toHaveAccessibleName(messages.Navigation.label)
    for (const id of ['home', 'transfer', 'workWithUs'] as const) {
      await expect(
        navigation.locator(`a.navigation-trigger[href="${pageHref(id, locale)}"]`),
      ).toBeVisible()
    }
    const headerSearch = header.locator('.header-search-form')
    await expect(headerSearch).toHaveAttribute('action', pageHref('search', locale))
    await expect(headerSearch).toHaveJSProperty('method', 'get')
    await expect(header.locator('.header-search')).toBeVisible()
    await expect(header.locator('.header-search')).toHaveAccessibleName(messages.Pages.search)
    await expect(
      header.locator('.header-tools').locator(`a[href="${pageHref('contact', locale)}"]`),
    ).toBeVisible()

    for (const [index, definition] of navigationGroups.entries()) {
      const group = navigation.locator('.desktop-navigation-group').nth(index)
      const trigger = group.locator(':scope > summary')
      await expect(trigger).toHaveAccessibleName(new RegExp(messages.Navigation[definition.id]))
      await trigger.focus()
      await page.keyboard.press('Enter')
      await expect(group).toHaveAttribute('open', '')
      for (const id of definition.pages) {
        const link = group.locator('.mega-menu-links').locator(`a[href="${pageHref(id, locale)}"]`)
        await expect(link).toBeVisible()
        await expect(link).toContainText(messages.Pages[id])
        if (id === 'governance') await expect(link).toHaveAttribute('aria-current', 'page')
      }
      if (definition.id === 'institute' || definition.id === 'research') {
        await expect(group.locator('.mega-menu-feature')).toBeVisible()
      } else {
        await expect(group.locator('.mega-menu-feature')).toHaveCount(0)
      }
      await page.keyboard.press('Escape')
    }

    const institute = navigation.locator('.desktop-navigation-group').first()
    await institute.locator(':scope > summary').focus()
    await page.keyboard.press('Enter')
    const results = await new AxeBuilder({ page })
      .include('.site-header')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(results.violations).toEqual([])
    await institute.locator(`.mega-menu-links a[href="${pageHref('institute', locale)}"]`).click()
    await expect(page).toHaveURL((url) => decodeURI(url.pathname) === pageHref('institute', locale))
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(messages.Pages.institute)
  })
}

test('compact Arabic navigation preserves the hierarchy, current page and nested Escape focus', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(pageHref('governance', 'ar'))
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  const menu = page.locator('.site-menu')
  const menuTrigger = menu.locator(':scope > summary')
  const institute = menu.locator('.navigation-group').first()
  const instituteTrigger = institute.locator(':scope > summary')

  await expect(page.locator('.desktop-navigation')).toBeHidden()
  await menuTrigger.focus()
  await page.keyboard.press('Enter')
  await expect(menu).toHaveAttribute('open', '')
  await instituteTrigger.focus()
  await page.keyboard.press('Enter')
  await expect(institute).toHaveAttribute('open', '')
  const current = institute.locator(`a[href="${pageHref('governance', 'ar')}"]`)
  await expect(current).toHaveAttribute('aria-current', 'page')
  await current.focus()
  await page.keyboard.press('Escape')
  await expect(institute).not.toHaveAttribute('open', '')
  await expect(menu).toHaveAttribute('open', '')
  await expect(instituteTrigger).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(menu).not.toHaveAttribute('open', '')
  await expect(menuTrigger).toBeFocused()

  await page.keyboard.press('Enter')
  await instituteTrigger.focus()
  await page.keyboard.press('Enter')
  const results = await new AxeBuilder({ page })
    .include('.site-header')
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze()
  expect(results.violations).toEqual([])
})

test('mobile menu covers the viewport, contains keyboard focus and restores background access on close', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(pageHref('governance', 'fr'))
  const header = page.getByRole('banner')
  const menu = header.locator('.site-menu')
  const trigger = menu.locator(':scope > summary')
  const identity = header.locator('.site-identity')
  const background = page.locator('#main-content, .site-footer, .skip-link')

  await expect(header.locator('.header-tools')).toBeHidden()
  await expect(header.locator('.header-meta')).toBeHidden()
  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(menu).toHaveAttribute('open', '')
  await expect(trigger).toHaveAccessibleName(fr.Navigation.closeMenu)
  await expect
    .poll(() =>
      header.evaluate((element) => {
        const bounds = element.getBoundingClientRect()
        const style = getComputedStyle(element)
        return (
          style.position === 'fixed' &&
          style.backgroundColor === 'rgb(255, 255, 255)' &&
          bounds.top <= 1 &&
          bounds.left <= 1 &&
          bounds.right >= window.innerWidth - 1 &&
          bounds.bottom >= window.innerHeight - 1
        )
      }),
    )
    .toBe(true)
  for (const element of await background.all()) {
    await expect.poll(() => element.evaluate((node) => (node as HTMLElement).inert)).toBe(true)
  }

  const contact = header.locator('.header-contact')
  const legal = header.locator('.menu-legal')
  const languages = header.locator('.locale-selector a')
  await expect(header.locator('.header-search')).toHaveAccessibleName(fr.Pages.search)
  await expect(contact).toHaveAccessibleName(fr.Header.contact)
  await expect(contact).toHaveAttribute('href', pageHref('contact', 'fr'))
  await expect(legal).toHaveAccessibleName(fr.Pages.legal)
  await expect(legal).toHaveAttribute('href', pageHref('legal', 'fr'))
  await expect(languages).toHaveCount(locales.length)
  for (const control of [contact, legal, ...(await languages.all())]) {
    await expect(control).toBeVisible()
    await control.focus()
    await expect(control).toBeFocused()
  }

  await page.keyboard.press('Tab')
  await expect(identity).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(languages.last()).toBeFocused()
  await identity.focus()
  await page.locator('#main-content').focus()
  await expect(identity).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(trigger).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(menu).not.toHaveAttribute('open', '')
  await expect(trigger).toBeFocused()
  for (const element of await background.all()) {
    await expect.poll(() => element.evaluate((node) => (node as HTMLElement).inert)).toBe(false)
  }
  await page.locator('#main-content').focus()
  await expect(page.locator('#main-content')).toBeFocused()
})

test('desktop disclosures remain exclusive and navigable without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  })
  const page = await context.newPage()

  try {
    await page.goto(pageHref('home', 'fr'))
    const groups = page.locator('.desktop-navigation-group')
    await groups.nth(0).locator(':scope > summary').focus()
    await page.keyboard.press('Enter')
    await expect(groups.nth(0)).toHaveAttribute('open', '')
    await groups.nth(1).locator(':scope > summary').focus()
    await page.keyboard.press('Enter')
    await expect(groups.nth(1)).toHaveAttribute('open', '')
    await expect(groups.nth(0)).not.toHaveAttribute('open', '')
    await groups
      .nth(1)
      .locator(`.mega-menu-links a[href="${pageHref('programmes', 'fr')}"]`)
      .click()
    await expect(page).toHaveURL((url) => url.pathname === pageHref('programmes', 'fr'))
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(fr.Pages.programmes)
  } finally {
    await context.close()
  }
})

test('open navigation fits translated content across responsive widths and enlarged text', async ({
  page,
}) => {
  test.setTimeout(90_000)

  for (const locale of locales) {
    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(pageHref('home', locale))
      for (const textSize of width === 320 || width === 1440 ? [100, 200] : [100]) {
        await page.evaluate((size) => {
          document.documentElement.style.fontSize = `${size}%`
        }, textSize)
        const desktop = page.locator('.desktop-navigation')
        if (await desktop.isVisible()) {
          const resources = desktop.locator('.desktop-navigation-group').last()
          if ((await resources.getAttribute('open')) === null) {
            await resources.locator(':scope > summary').focus()
            await page.keyboard.press('Enter')
          }
          await expect(resources).toHaveAttribute('open', '')
        } else {
          const menu = page.locator('.site-menu')
          if ((await menu.getAttribute('open')) === null) {
            await menu.locator(':scope > summary').focus()
            await page.keyboard.press('Enter')
          }
          const resources = menu.locator('.navigation-group').last()
          if ((await resources.getAttribute('open')) === null) {
            await resources.locator(':scope > summary').focus()
            await page.keyboard.press('Enter')
          }
          await expect(menu).toHaveAttribute('open', '')
          await expect(resources).toHaveAttribute('open', '')
        }

        const layout = await page.getByRole('banner').evaluate((header) => ({
          pageFits: document.documentElement.scrollWidth <= window.innerWidth,
          overflowingControls: [...header.querySelectorAll<HTMLElement>('a, summary')]
            .filter((control) => {
              const bounds = control.getBoundingClientRect()
              const style = getComputedStyle(control)
              return (
                bounds.width > 0 &&
                bounds.height > 0 &&
                style.visibility !== 'hidden' &&
                (bounds.left < -1 || bounds.right > window.innerWidth + 1)
              )
            })
            .map((control) => control.textContent?.trim()),
        }))
        expect(layout, `${locale}, ${width}px, ${textSize}% text`).toEqual({
          pageFits: true,
          overflowingControls: [],
        })
      }
    }
  }
})

test('compact navigation remains contained and usable at 200% text in every locale', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 })

  for (const locale of locales) {
    await page.goto(pageHref('home', locale))
    await page.evaluate(async () => {
      document.documentElement.style.fontSize = '200%'
      await document.fonts.ready
    })
    const menu = page.locator('.site-menu')
    await menu.locator(':scope > summary').focus()
    await page.keyboard.press('Enter')
    await expect(menu).toHaveAttribute('open', '')
    const panel = menu.locator('.menu-panel')

    await expect
      .poll(() => panel.evaluate((element) => element.scrollWidth - element.clientWidth), {
        message: `${locale}: the compact menu must not require horizontal scrolling`,
      })
      .toBeLessThanOrEqual(1)

    const summaries = menu.locator('.navigation-group > summary')
    await expect(summaries).toHaveCount(navigationGroups.length)
    for (const summary of await summaries.all()) {
      await expect(summary).toBeVisible()
      await expect
        .poll(() => summary.evaluate((element) => element.scrollWidth - element.clientWidth), {
          message: `${locale}: ${await summary.innerText()} must fit its disclosure control`,
        })
        .toBeLessThanOrEqual(1)
    }

    const utilities = page.locator(
      '.site-header .header-tools summary, .site-header .header-contact, ' +
        '.site-header .menu-legal, .site-header .header-meta .locale-selector a',
    )
    for (const control of await utilities.all()) {
      await expect(control).toBeVisible()
      expect(
        await control.evaluate((element) => element.getBoundingClientRect().height),
      ).toBeGreaterThanOrEqual(44)
    }

    for (const group of await menu.locator('.navigation-group').all()) {
      const summary = group.locator(':scope > summary')
      await summary.focus()
      await page.keyboard.press('Enter')
      await expect(group).toHaveAttribute('open', '')
      for (const link of await group.locator('ul a').all()) {
        await expect(link).toBeVisible()
        expect(
          await link.evaluate((element) => element.getBoundingClientRect().height),
        ).toBeGreaterThanOrEqual(44)
      }
      await page.keyboard.press('Enter')
      await expect(group).not.toHaveAttribute('open', '')
    }
  }
})

test('wide header keyboard order follows navigation before language controls in every locale', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 900 })

  for (const locale of locales) {
    await page.goto(pageHref('home', locale))
    const header = page.getByRole('banner')
    const triggers = header.locator('.desktop-navigation .navigation-trigger')
    await expect(triggers).toHaveCount(7)
    await header.getByRole('link', { name: 'IRESEN', exact: true }).focus()

    for (const trigger of await triggers.all()) {
      await page.keyboard.press('Tab')
      await expect(trigger).toBeFocused()
    }
    await page.keyboard.press('Tab')
    await expect(header.locator('.locale-selector a').first()).toBeFocused()
  }
})
