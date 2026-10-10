import { expect, test } from '@playwright/test'
import { locales, type Locale } from '../../src/i18n/locales'
import { footerContact, footerSocialLinks } from '../../src/lib/footer'
import { footerNavigationGroups, footerPageIds, pageHref, pageLinkHref } from '../../src/lib/site'
import ar from '../../src/messages/ar.json' with { type: 'json' }
import en from '../../src/messages/en.json' with { type: 'json' }
import fr from '../../src/messages/fr.json' with { type: 'json' }

const catalogs = { ar, en, fr }
const languageNames = { fr: 'Français', en: 'English', ar: 'العربية' }
const navigationPageIds = footerNavigationGroups.flatMap((group) => [...group.pages])

for (const locale of locales) {
  test(`${locale}: footer exposes localized institutional, collaboration and utility destinations`, async ({
    page,
  }) => {
    await page.goto(pageHref('home', locale))
    const footer = page.getByRole('contentinfo')
    const navigation = footer.locator('.footer-navigation')
    const utilities = footer.locator('.footer-utilities')
    const messages = catalogs[locale]

    await expect(navigation).toHaveAccessibleName(messages.Navigation.footer)
    await expect(utilities).toHaveAccessibleName(messages.Navigation.usefulLinks)
    await expect(footer.getByRole('link', { name: 'IRESEN', exact: true })).toHaveAttribute(
      'href',
      pageHref('home', locale),
    )

    for (const group of footerNavigationGroups) {
      await expect(
        navigation.getByRole('heading', {
          name: messages.Footer.navigation[group.id],
          exact: true,
        }),
      ).toBeVisible()
    }
    expect(
      await navigation
        .getByRole('link')
        .evaluateAll((links) => links.map((link) => link.getAttribute('href')).sort()),
    ).toEqual(navigationPageIds.map((id) => pageLinkHref(id, locale)).sort())

    for (const id of navigationPageIds) {
      await expect(
        navigation.getByRole('link', { name: messages.Pages[id], exact: true }),
      ).toHaveAttribute('href', pageLinkHref(id, locale))
    }
    for (const id of footerPageIds) {
      await expect(
        utilities.getByRole('link', { name: messages.Pages[id], exact: true }),
      ).toHaveAttribute('href', pageLinkHref(id, locale))
    }

    await expect(footer.locator('address')).toContainText(messages.Footer.address)
    const address = footer.getByRole('link', { name: messages.Footer.address, exact: true })
    await expect(address).toHaveAttribute('href', footerContact.mapsHref)
    await expect(
      footer.getByRole('link', { name: messages.Pages.privacy, exact: true }),
    ).toHaveCount(1)
    const phone = footer.getByRole('link', { name: footerContact.phone, exact: true })
    const email = footer.getByRole('link', { name: footerContact.email, exact: true })
    await expect(phone).toHaveAttribute('href', footerContact.phoneHref)
    await expect(email).toHaveAttribute('href', `mailto:${footerContact.email}`)
    await expect(phone.locator('bdi')).toHaveAttribute('dir', 'ltr')
    await expect(email.locator('bdi')).toHaveAttribute('dir', 'ltr')
    const social = footer.getByRole('navigation', {
      name: messages.Footer.socialLabel,
      exact: true,
    })
    await expect(social.getByRole('link')).toHaveCount(3)
    for (const link of footerSocialLinks) {
      await expect(social.getByRole('link', { name: new RegExp(link.name) })).toHaveAttribute(
        'href',
        link.href,
      )
    }

    await navigation.getByRole('link', { name: messages.Pages.publications, exact: true }).click()
    await expect(page).toHaveURL(
      (url) => decodeURI(url.pathname) === pageHref('publications', locale),
    )
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(messages.Pages.publications)
    await utilities.getByRole('link', { name: messages.Pages.privacy, exact: true }).click()
    await expect(page).toHaveURL((url) => decodeURI(url.pathname) === pageHref('privacy', locale))
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(messages.Pages.privacy)
  })
}

test('newsletter explains its availability only after an attempt without sending data in every locale', async ({
  page,
}) => {
  for (const locale of locales) {
    await page.goto(pageHref('home', locale))
    const messages = catalogs[locale]
    const newsletter = page
      .getByRole('contentinfo')
      .getByRole('region', { name: messages.Footer.newsletterTitle, exact: true })
    const email = newsletter.getByRole('textbox', {
      name: messages.Footer.newsletterEmail,
      exact: true,
    })
    const consent = newsletter.getByRole('checkbox')
    const subscribe = newsletter.getByRole('button', {
      name: messages.Footer.newsletterSubscribe,
      exact: true,
    })

    const unavailable = newsletter.getByText(messages.Footer.newsletterUnavailable, { exact: true })
    const attempt = newsletter.locator('.footer-newsletter-attempt')

    await expect(unavailable).toBeHidden()
    await expect(email).toHaveAttribute('type', 'email')
    await expect(email).toBeEnabled()
    await expect(email).toHaveValue('')
    await expect(consent).toHaveAccessibleName(
      messages.Footer.newsletterConsent.replace(/<\/?brand>/g, ''),
    )
    await expect(consent).toBeEnabled()
    await expect(consent).not.toBeChecked()
    await expect(subscribe).toBeEnabled()
    await expect(
      newsletter.getByRole('link', { name: messages.Pages.privacy, exact: true }),
    ).toHaveCount(0)

    await email.fill('newsletter-check@example.test')
    await consent.check()
    await expect(consent).toBeChecked()
    const submitted: string[] = []
    const recordSubmission = (request: import('@playwright/test').Request) => {
      if (
        request.isNavigationRequest() ||
        request.method() !== 'GET' ||
        ['fetch', 'xhr'].includes(request.resourceType())
      ) {
        submitted.push(`${request.method()} ${request.url()}`)
      }
    }
    page.on('request', recordSubmission)
    const previousUrl = page.url()

    await subscribe.focus()
    await page.keyboard.press('Enter')
    await expect(attempt).toHaveAttribute('open', '')
    await expect(subscribe).toBeFocused()
    await expect(subscribe).toHaveCSS('outline-style', 'solid')
    await expect(newsletter.getByRole('status')).toHaveText(messages.Footer.newsletterUnavailable)
    await expect(unavailable).toBeVisible()
    await expect(email).toHaveValue('newsletter-check@example.test')
    expect(page.url()).toBe(previousUrl)
    expect(submitted).toEqual([])
    page.off('request', recordSubmission)

    await page.keyboard.press('Space')
    await expect(attempt).not.toHaveAttribute('open', '')
    await expect(unavailable).toBeHidden()

    // Availability feedback does not depend on accepting or validating an email.
    await email.fill('not-an-email')
    page.on('request', recordSubmission)
    await subscribe.click()
    await expect(unavailable).toBeVisible()
    await expect(email).toHaveValue('not-an-email')
    expect(page.url()).toBe(previousUrl)
    expect(submitted).toEqual([])
    page.off('request', recordSubmission)
  }
})

test('newsletter action keeps its label and arrow inside the button at 200% text in every locale', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 })

  for (const locale of locales) {
    await page.goto(pageHref('home', locale))
    await page.evaluate(async () => {
      document.documentElement.style.fontSize = '200%'
      await document.fonts.ready
    })
    const subscribe = page.getByRole('contentinfo').getByRole('button', {
      name: catalogs[locale].Footer.newsletterSubscribe,
      exact: true,
    })
    await subscribe.scrollIntoViewIfNeeded()
    await expect(subscribe).toBeVisible()
    await expect
      .poll(() => subscribe.evaluate((element) => element.scrollWidth - element.clientWidth), {
        message: `${locale}: the subscription action must contain its enlarged content`,
      })
      .toBeLessThanOrEqual(1)

    const children = subscribe.locator(':scope > span, :scope > svg')
    await expect(children).toHaveCount(2)
    for (const child of await children.all()) {
      await expect(child).toBeVisible()
    }
    const layout = await subscribe.evaluate((element) => {
      const button = element.getBoundingClientRect()
      const outside = [...element.querySelectorAll(':scope > span, :scope > svg')]
        .filter((child) => {
          const bounds = child.getBoundingClientRect()
          return (
            bounds.left < button.left - 1 ||
            bounds.right > button.right + 1 ||
            bounds.top < button.top - 1 ||
            bounds.bottom > button.bottom + 1
          )
        })
        .map((child) => child.tagName.toLowerCase())
      return { height: button.height, outside }
    })
    expect(layout.height).toBeGreaterThanOrEqual(44)
    expect(layout.outside, `${locale}: the label and arrow must remain inside Subscribe`).toEqual(
      [],
    )
  }
})

test('all footer content and open language options fit mobile, tablet and desktop in every locale', async ({
  page,
}) => {
  test.setTimeout(60_000)

  for (const locale of locales) {
    for (const width of [320, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto(pageHref('home', locale))
      const footer = page.getByRole('contentinfo')
      await footer.scrollIntoViewIfNeeded()
      await footer.locator('.locale-dropdown > summary').click()
      for (const name of Object.values(languageNames)) {
        await expect(footer.getByRole('link', { name, exact: true })).toBeVisible()
      }

      const layout = await footer.evaluate((element) => {
        const bounds = element.getBoundingClientRect()
        const overflowing = [...element.querySelectorAll<HTMLElement>('*')]
          .filter((child) => {
            const rect = child.getBoundingClientRect()
            const style = getComputedStyle(child)
            return (
              rect.width > 0 &&
              rect.height > 0 &&
              style.visibility !== 'hidden' &&
              (rect.left < bounds.left - 1 ||
                rect.right > bounds.right + 1 ||
                rect.top < bounds.top - 1 ||
                rect.bottom > bounds.bottom + 1)
            )
          })
          .map((child) => `${child.tagName.toLowerCase()}.${child.className}`)
        return {
          pageFits: document.documentElement.scrollWidth <= window.innerWidth,
          overflowing,
        }
      })
      expect(layout, `${locale} at ${width}px`).toEqual({ pageFits: true, overflowing: [] })
    }
  }
})

test('Arabic mirrors the footer reading order and heading alignment', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })

  for (const locale of ['fr', 'ar'] as const) {
    await page.goto(pageHref('home', locale))
    await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
    const layout = await page.getByRole('contentinfo').evaluate((footer) => {
      const identity = footer.querySelector('.footer-identity')!.getBoundingClientRect()
      const navigation = footer.querySelector('.footer-navigation')!.getBoundingClientRect()
      const heading = footer.querySelector('.footer-navigation h2')!
      const headingBounds = heading.getBoundingClientRect()
      const text = document.createRange()
      text.selectNodeContents(heading)
      const textBounds = text.getBoundingClientRect()
      return {
        identityLeft: identity.left,
        identityRight: identity.right,
        navigationLeft: navigation.left,
        navigationRight: navigation.right,
        textStartGap: textBounds.left - headingBounds.left,
        textEndGap: headingBounds.right - textBounds.right,
      }
    })

    if (locale === 'ar') {
      expect(layout.identityLeft).toBeGreaterThanOrEqual(layout.navigationRight)
      expect(layout.textEndGap).toBeLessThanOrEqual(1)
    } else {
      expect(layout.identityRight).toBeLessThanOrEqual(layout.navigationLeft)
      expect(layout.textStartGap).toBeLessThanOrEqual(1)
    }
  }
})

test('footer language dropdown works by keyboard and preserves the current page and supported anchor', async ({
  page,
}) => {
  await page.goto(pageHref('institute', 'fr', 'mission'))
  const footer = page.getByRole('contentinfo')
  const dropdown = footer.locator('.locale-dropdown')
  const trigger = dropdown.locator('summary')

  await trigger.focus()
  await page.keyboard.press('Enter')
  await expect(dropdown).toHaveAttribute('open', '')
  await page.keyboard.press('Tab')
  await expect(dropdown.getByRole('link', { name: 'Français', exact: true })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dropdown).not.toHaveAttribute('open', '')
  await expect(trigger).toBeFocused()

  await page.keyboard.press('Enter')
  const english = dropdown.getByRole('link', { name: 'English', exact: true })
  await expect(english).toHaveAttribute('href', pageHref('institute', 'en', 'mission'))
  await english.focus()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(
    (url) => url.pathname === pageHref('institute', 'en') && url.hash === '#mission',
  )
  await expect(trigger).toContainText(languageNames.en)

  await trigger.click()
  await expect(dropdown.getByRole('link', { name: 'English', exact: true })).toHaveAttribute(
    'aria-current',
    'true',
  )
  const arabic = dropdown.getByRole('link', { name: 'العربية', exact: true })
  await expect(arabic).toHaveAttribute('href', pageHref('institute', 'ar', 'mission'))
  await arabic.click()
  await expect(page).toHaveURL(
    (url) => decodeURI(url.pathname) === pageHref('institute', 'ar') && url.hash === '#mission',
  )
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await expect(trigger).toContainText(languageNames.ar)

  await page.goto(`${pageHref('institute', 'ar')}#unsupported-section`)
  await trigger.click()
  await expect(dropdown.getByRole('link', { name: 'English', exact: true })).toHaveAttribute(
    'href',
    pageHref('institute', 'en'),
  )
})

test('newsletter attempts, footer language switching and mobile navigation work without JavaScript', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 320, height: 844 },
  })
  const page = await context.newPage()

  try {
    for (const locale of locales) {
      const targetLocale: Locale = locale === 'fr' ? 'en' : locale === 'en' ? 'ar' : 'fr'
      await page.goto(pageHref('workWithUs', locale))
      const footer = page.getByRole('contentinfo')
      const newsletter = footer.getByRole('region', {
        name: catalogs[locale].Footer.newsletterTitle,
        exact: true,
      })
      await expect(newsletter.getByRole('status')).toHaveCount(0)
      await newsletter
        .getByRole('textbox', { name: catalogs[locale].Footer.newsletterEmail, exact: true })
        .fill('newsletter-check@example.test')
      await newsletter.getByRole('checkbox').check()
      const subscribe = newsletter.getByRole('button', {
        name: catalogs[locale].Footer.newsletterSubscribe,
        exact: true,
      })
      const submitted: string[] = []
      const recordSubmission = (request: import('@playwright/test').Request) => {
        if (
          request.isNavigationRequest() ||
          request.method() !== 'GET' ||
          ['fetch', 'xhr'].includes(request.resourceType())
        ) {
          submitted.push(`${request.method()} ${request.url()}`)
        }
      }
      page.on('request', recordSubmission)
      const previousUrl = page.url()
      await subscribe.focus()
      await page.keyboard.press('Enter')
      await expect(newsletter.getByRole('status')).toHaveText(
        catalogs[locale].Footer.newsletterUnavailable,
      )
      await expect(subscribe).toBeFocused()
      expect(page.url()).toBe(previousUrl)
      expect(submitted).toEqual([])
      page.off('request', recordSubmission)
      const dropdown = footer.locator('.locale-dropdown')
      await dropdown.locator('summary').focus()
      await page.keyboard.press('Enter')
      await expect(dropdown).toHaveAttribute('open', '')
      await dropdown.getByRole('link', { name: languageNames[targetLocale], exact: true }).click()
      await expect(page).toHaveURL(
        (url) => decodeURI(url.pathname) === pageHref('workWithUs', targetLocale),
      )

      await footer
        .locator('.footer-utilities')
        .getByRole('link', { name: catalogs[targetLocale].Pages.sitemap, exact: true })
        .click()
      await expect(page).toHaveURL(
        (url) => decodeURI(url.pathname) === pageHref('sitemap', targetLocale),
      )

      const menu = page.locator('.site-menu')
      await menu.locator(':scope > summary').focus()
      await page.keyboard.press('Enter')
      await expect(menu).toHaveAttribute('open', '')
      const institute = menu.locator('.navigation-group').first()
      await institute.locator(':scope > summary').click()
      await institute
        .getByRole('link', { name: catalogs[targetLocale].Pages.institute, exact: true })
        .click()
      await expect(page).toHaveURL(
        (url) => decodeURI(url.pathname) === pageHref('institute', targetLocale),
      )
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(
        catalogs[targetLocale].Pages.institute,
      )
    }
  } finally {
    await context.close()
  }
})
