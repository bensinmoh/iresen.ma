import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { locales } from '../../src/i18n/locales'
import { contactLocation } from '../../src/lib/contact'
import { footerContact } from '../../src/lib/footer'
import { pageHref } from '../../src/lib/site'
import ar from '../../src/messages/ar.json' with { type: 'json' }
import en from '../../src/messages/en.json' with { type: 'json' }
import fr from '../../src/messages/fr.json' with { type: 'json' }

const catalogs = { ar, en, fr }
const googleUrls =
  /^https:\/\/(?:[^/]+\.)?(?:google\.com|gstatic\.com|googleapis\.com|maps\.app\.goo\.gl)(?:\/|$)/

test.beforeEach(async ({ page }) => {
  await page.route(googleUrls, (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><html><body><p>Local map test response</p></body></html>',
    }),
  )
})
const sectionAnchors = [
  'route-request',
  'send-request',
  'information-use',
  'locations',
  'practical-questions',
  'request-follow-up',
]

async function settleLayout(page: Page) {
  await page.evaluate(async () => {
    await document.fonts.ready
    await new Promise<void>((resolve) =>
      requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
    )
  })
}

async function expectContained(page: Page, description: string) {
  const overflow = await page.evaluate(() => ({
    viewport: window.innerWidth,
    document: document.documentElement.scrollWidth,
    clipped: [
      ...document.querySelectorAll(
        '.contact-page h1, .contact-page h2, .contact-page h3, .contact-page p, .contact-page summary, .contact-page label',
      ),
    ]
      .filter((element) => {
        // Glyphs can extend beyond a heading's line box without being clipped.
        // Check the actual text against ancestors that hide overflow.
        const range = document.createRange()
        range.selectNodeContents(element)
        const text = [...range.getClientRects()]
        for (let ancestor: Element | null = element; ancestor; ancestor = ancestor.parentElement) {
          const style = getComputedStyle(ancestor)
          const bounds = ancestor.getBoundingClientRect()
          if (
            (['hidden', 'clip'].includes(style.overflowX) &&
              text.some((rect) => rect.left < bounds.left - 1 || rect.right > bounds.right + 1)) ||
            (['hidden', 'clip'].includes(style.overflowY) &&
              text.some((rect) => rect.top < bounds.top - 1 || rect.bottom > bounds.bottom + 1))
          )
            return true
        }
        return false
      })
      .map((element) => element.textContent),
  }))
  expect(
    overflow.document,
    `${description}: page must reflow within the viewport`,
  ).toBeLessThanOrEqual(overflow.viewport)
  expect(overflow.clipped, `${description}: contact text must remain readable`).toEqual([])
}

for (const locale of locales) {
  const messages = catalogs[locale].Contact

  test(`${locale}: contact introduction, expanded questions and location reflow at every target width`, async ({
    page,
  }) => {
    await page.goto(pageHref('contact', locale))
    await expect(page.locator('html')).toHaveAttribute('lang', locale)
    await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      `${messages.hero.title} ${messages.hero.accent}`,
    )
    await expect(page.locator('.page-hero')).toHaveCount(0)
    await expect(page.getByRole('banner')).toHaveCSS('background-color', 'rgb(255, 255, 255)')
    await expect(page.getByLabel(messages.form.fullName.label, { exact: true })).toBeEnabled()
    await page
      .locator('.contact-intro-image')
      .evaluate((element) => (element as HTMLImageElement).decode())
    for (const anchor of sectionAnchors) {
      await expect(page.locator(`#${anchor}`)).toHaveCount(1)
      await expect(page.locator(`#${anchor}`)).toBeVisible()
    }
    await page.locator('.contact-faq-list details').evaluateAll((items) => {
      for (const item of items) (item as HTMLDetailsElement).open = true
    })

    for (const width of [320, 390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      for (const textSize of ['100%', '200%']) {
        await page.evaluate((size) => {
          document.documentElement.style.fontSize = size
        }, textSize)
        await settleLayout(page)
        await expectContained(page, `${locale}, ${width}px, ${textSize} text`)
        const map = (await page.locator('.contact-map').boundingBox())!
        expect(map.x).toBeCloseTo(0, 0)
        expect(map.width).toBeCloseTo(width, 0)
      }
    }

    await page.evaluate(() => {
      document.documentElement.style.fontSize = '100%'
    })
    await settleLayout(page)
    const header = (await page.getByRole('banner').boundingBox())!
    const copy = (await page.locator('.contact-intro-copy').boundingBox())!
    const headquarters = (await page.locator('.contact-headquarters').boundingBox())!
    expect(copy.y).toBeGreaterThanOrEqual(header.y + header.height - 1)
    expect(copy.y).toBeCloseTo(headquarters.y, 0)
    if (locale === 'ar') expect(headquarters.x + headquarters.width).toBeLessThanOrEqual(copy.x + 1)
    else expect(copy.x + copy.width).toBeLessThanOrEqual(headquarters.x + 1)
    await page.locator('.contact-intro').getByRole('link', { name: messages.hero.action }).click()
    await expect(page).toHaveURL(/#send-request$/)
    await expect(
      page.getByRole('heading', { name: messages.form.title, exact: true }),
    ).toBeInViewport()
  })

  test(`${locale}: FAQs expose their answers and destination links with the keyboard`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(pageHref('contact', locale))
    const questions = page.locator('.contact-faq-list details')
    await expect(questions).toHaveCount(6)
    const destinations = [
      pageHref('programmes', locale),
      pageHref('platforms', locale),
      `${pageHref('contact', locale)}?subject=platforms#send-request`,
      pageHref('opportunities', locale),
      `${pageHref('contact', locale)}?subject=press#send-request`,
      pageHref('publications', locale),
    ]
    for (const [index, question] of Object.values(messages.faq.questions).entries()) {
      const item = questions.nth(index)
      const summary = item.locator('summary')
      await expect(summary).toHaveAccessibleName(question.question)
      await summary.focus()
      await page.keyboard.press('Enter')
      await expect(item).toHaveAttribute('open', '')
      await expect(summary).toBeFocused()
      await expect(summary).toHaveCSS('outline-style', 'solid')
      await expect(item.locator('.contact-faq-answer p')).toHaveText(question.answer)
      await expect(item.getByRole('link', { name: question.action })).toHaveAttribute(
        'href',
        destinations[index],
      )
      await page.keyboard.press('Tab')
      await expect(item.getByRole('link', { name: question.action })).toBeFocused()
      await page.keyboard.press('Shift+Tab')
      await page.keyboard.press('Space')
      await expect(item).not.toHaveAttribute('open', '')
    }
    const results = await new AxeBuilder({ page })
      .include('.site-header')
      .include('.contact-page')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze()
    expect(results.violations).toEqual([])
  })

  test(`${locale}: department links preselect the request topic and unknown topics stay unselected`, async ({
    page,
  }) => {
    for (const topic of ['agency', 'partnerships', 'press', 'careers']) {
      await page.goto(pageHref('contact', locale))
      const link = page
        .locator('.contact-departments')
        .locator(`a[href$="?subject=${topic}#send-request"]`)
      await link.click()
      await expect(page).toHaveURL(new RegExp(`\\?subject=${topic}#send-request$`))
      await expect(page.getByLabel(messages.form.subject.label, { exact: true })).toHaveValue(topic)
      await expect(page.getByLabel(messages.form.fullName.label, { exact: true })).toBeEnabled()
    }
    await page.goto(`${pageHref('contact', locale)}?subject=unexpected#send-request`)
    await expect(page.getByLabel(messages.form.fullName.label, { exact: true })).toBeEnabled()
    await expect(page.getByLabel(messages.form.subject.label, { exact: true })).toHaveValue('')
  })

  test(`${locale}: validation prepares an encoded local email draft and edits invalidate it`, async ({
    page,
  }) => {
    await page.goto(pageHref('contact', locale))
    const form = page.locator('.contact-form')
    const fullName = form.getByLabel(messages.form.fullName.label, { exact: true })
    const email = form.getByLabel(messages.form.email.label, { exact: true })
    const subject = form.getByLabel(messages.form.subject.label, { exact: true })
    const message = form.getByLabel(messages.form.message.label, { exact: true })
    const submit = form.getByRole('button', { name: messages.form.action, exact: true })
    const openEmail = form.getByRole('link', { name: messages.form.openEmail, exact: true })
    await expect(fullName).toBeEnabled()
    const storageBefore = await page.evaluate(() => [localStorage.length, sessionStorage.length])
    const submissions: string[] = []
    page.on('request', (request) => {
      if (!['GET', 'HEAD'].includes(request.method())) submissions.push(request.url())
    })

    await submit.click()
    await expect(fullName).toBeFocused()
    expect(
      await fullName.evaluate((element) => (element as HTMLInputElement).validity.valueMissing),
    ).toBe(true)
    await expect(openEmail).toHaveCount(0)
    await fullName.fill('   ')
    await email.fill('invalid-email')
    await subject.selectOption('partnerships')
    await message.fill('   ')
    await submit.click()
    await expect(email).toBeFocused()
    expect(
      await email.evaluate((element) => (element as HTMLInputElement).validity.typeMismatch),
    ).toBe(true)
    await email.fill('amina+contact@example.invalid')
    await submit.click()
    await expect(fullName).toBeFocused()
    expect(
      await fullName.evaluate((element) => (element as HTMLInputElement).validationMessage),
    ).toBe(messages.form.requiredHint)
    await expect(openEmail).toHaveCount(0)

    const name = 'Amina أحمد & Partners'
    const body = 'Bonjour / مرحبًا\nProjet: Power-to-X? 50% & réponses #1'
    await fullName.fill(name)
    await submit.click()
    await expect(message).toBeFocused()
    expect(
      await message.evaluate((element) => (element as HTMLTextAreaElement).validationMessage),
    ).toBe(messages.form.requiredHint)
    await expect(openEmail).toHaveCount(0)
    await form.locator('[name="organisation"]').fill('Lab & R&D #1')
    await form.locator('[name="phone"]').fill('+212 600 00 00 00')
    await message.fill(body)
    await submit.click()
    await expect(form.getByRole('status')).toContainText(messages.form.prepared)
    await expect(openEmail).toBeVisible()
    const draft = new URL((await openEmail.getAttribute('href'))!)
    expect(draft.pathname).toBe(footerContact.email)
    expect([...draft.searchParams.keys()]).toEqual(['subject', 'body'])
    expect(draft.searchParams.get('subject')).toBe(
      messages.form.mailSubject.replace('{subject}', messages.form.topics.partnerships),
    )
    expect(draft.searchParams.get('body')).toContain(`${messages.form.fullName.label}: ${name}`)
    expect(draft.searchParams.get('body')).toContain('amina+contact@example.invalid')
    expect(draft.searchParams.get('body')).toContain('Lab & R&D #1')
    expect(draft.searchParams.get('body')).toContain('+212 600 00 00 00')
    expect(draft.searchParams.get('body')).toContain(body)
    expect(draft.hash).toBe('')
    expect(submissions).toEqual([])
    expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual(
      storageBefore,
    )
    await message.fill(`${body}\nMerci`)
    await expect(openEmail).toHaveCount(0)
    await form.locator('[name="organisation"]').fill('')
    await form.locator('[name="phone"]').fill('')
    await submit.click()
    const amended = new URL((await openEmail.getAttribute('href'))!)
    expect(amended.searchParams.get('body')).not.toContain(`${messages.form.organisation.label}:`)
    expect(amended.searchParams.get('body')).not.toContain(`${messages.form.phone.label}:`)
    expect(amended.searchParams.get('body')).toContain(`${body}\nMerci`)
  })

  test(`${locale}: Google Maps displays directly and retains keyboard access to directions`, async ({
    page,
  }) => {
    const requests: string[] = []
    await page.route(googleUrls, async (route) => {
      requests.push(route.request().url())
      await route.fulfill({
        contentType: 'text/html',
        body: '<!doctype html><html><body><p>Local map test response</p></body></html>',
      })
    })
    await page.goto(pageHref('contact', locale))
    await expect(page.getByLabel(messages.form.fullName.label, { exact: true })).toBeEnabled()
    const location = page.locator('.contact-location')
    const map = location.locator('iframe')
    await map.scrollIntoViewIfNeeded()
    await settleLayout(page)
    await expect(map).toHaveAttribute('title', messages.location.mapTitle)
    await expect(map).toHaveAttribute('src', contactLocation.embedHref)
    await expect(map).toHaveAttribute('loading', 'lazy')
    await expect(map).toHaveAttribute('referrerpolicy', 'no-referrer')
    await expect(location.getByRole('button')).toHaveCount(0)
    await expect(location.locator('.contact-map-placeholder, .contact-map-note')).toHaveCount(0)
    await expect.poll(() => requests).toEqual([contactLocation.embedHref])
    const directions = location.getByRole('link', { name: messages.location.externalLink })
    await expect(directions).toHaveAttribute('href', contactLocation.directionsHref)
    await directions.focus()
    await expect(directions).toBeFocused()
    const mapBounds = (await map.boundingBox())!
    const sectionBounds = (await location.boundingBox())!
    expect(sectionBounds.y + sectionBounds.height).toBeCloseTo(mapBounds.y + mapBounds.height, 0)
    await page.reload()
    await expect(page.getByLabel(messages.form.fullName.label, { exact: true })).toBeEnabled()
    await map.scrollIntoViewIfNeeded()
    await expect
      .poll(() => requests)
      .toEqual([contactLocation.embedHref, contactLocation.embedHref])
  })
}

test('without JavaScript, the map, contact links and native FAQ disclosures remain available in every language', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  })
  try {
    const page = await context.newPage()
    const googleRequests: string[] = []
    await page.route(googleUrls, async (route) => {
      googleRequests.push(route.request().url())
      await route.fulfill({
        contentType: 'text/html',
        body: '<!doctype html><html><body><p>Local map test response</p></body></html>',
      })
    })
    for (const locale of locales) {
      const messages = catalogs[locale].Contact
      await page.goto(pageHref('contact', locale))
      await expect(page.locator('.contact-form-fallback a')).toHaveAttribute(
        'href',
        `mailto:${footerContact.email}`,
      )
      await expect(
        page
          .locator('.contact-location')
          .getByRole('link', { name: messages.location.externalLink }),
      ).toHaveAttribute('href', contactLocation.directionsHref)
      await expect(page.locator('.contact-form button[type="submit"]')).toBeDisabled()
      const question = page.locator('.contact-faq-list details').first()
      await question.locator('summary').focus()
      await page.keyboard.press('Enter')
      await expect(question).toHaveAttribute('open', '')
      await expect(question.locator('.contact-faq-answer')).toContainText(
        messages.faq.questions.calls.answer,
      )
      const map = page.locator('.contact-location iframe')
      await expect(map).toHaveAttribute('title', messages.location.mapTitle)
      await expect(map).toHaveAttribute('src', contactLocation.embedHref)
      await map.scrollIntoViewIfNeeded()
      await expect.poll(() => googleRequests.length).toBe(locales.indexOf(locale) + 1)
      await expectContained(page, `${locale}, no JavaScript`)
    }
    expect(googleRequests).toEqual(locales.map(() => contactLocation.embedHref))
  } finally {
    await context.close()
  }
})
