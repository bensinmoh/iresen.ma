import { expect, test } from '@playwright/test'
import { pageHref } from '../../src/lib/site'
import ar from '../../src/messages/ar.json' with { type: 'json' }
import en from '../../src/messages/en.json' with { type: 'json' }
import fr from '../../src/messages/fr.json' with { type: 'json' }

const catalogs = { ar, en, fr }
const queries = {
  fr: { interview: 'demander une interview', media: 'courbes abstraites' },
  en: { interview: 'request an interview', media: 'abstract cyan' },
  ar: { interview: 'أطلب مقابلة', media: 'منحنيات تجريدية' },
}

for (const locale of ['fr', 'en', 'ar'] as const) {
  test(`${locale}: current contact text is searchable and opens its rendered sections`, async ({
    page,
    request,
  }) => {
    const copy = catalogs[locale].Contact
    const destinations = [
      { query: 'Green H2A', anchor: 'page-sections', visible: copy.platforms.title },
      {
        query: queries[locale].interview,
        anchor: 'practical-questions',
        visible: copy.faq.questions.press.question,
      },
      { query: copy.location.title, anchor: 'locations', visible: copy.location.title },
      { query: copy.form.topics.partnerships, anchor: 'send-request', visible: copy.form.title },
    ]
    for (const { query, anchor, visible } of destinations) {
      await page.goto(
        `${pageHref('search', locale)}?${new URLSearchParams({ q: query, type: 'section' })}`,
      )
      const destination = pageHref('contact', locale, anchor)
      const link = page.locator(`.search-results a[href="${destination}"]`)
      await expect(link).toBeVisible()
      await expect(link.locator('..')).not.toContainText(/À prévoir|Content to add|محتوى مرتقب/)
      await link.click()
      await expect(page).toHaveURL((url) => `${decodeURI(url.pathname)}${url.hash}` === destination)
      await expect(page.locator(`#${anchor}`)).toContainText(visible)
      await expect(page.locator(`#${anchor}`)).toBeVisible()
    }

    const response = await request.get(
      `/api/search?${new URLSearchParams({ locale, q: queries[locale].media, type: 'media' })}`,
    )
    expect(response.status()).toBe(200)
    const results = await response.json()
    expect(results.items).toContainEqual(
      expect.objectContaining({
        id: `asset:contact-background:${locale}`,
        url: '/images/contact/contact-background-79bad501a298.png',
        type: 'media',
      }),
    )
  })
}
