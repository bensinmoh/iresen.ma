import { chromium } from 'playwright-core'

/** Each bounded render owns its browser, including cleanup on failure. No network input. */
export async function renderProjectNote(html: string) {
  const browser = await chromium.launch({
    headless: true,
    timeout: 15_000,
    ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH }
      : {}),
  })
  try {
    const context = await browser.newContext({ javaScriptEnabled: false, offline: true })
    await context.route('**/*', (route) => route.abort())
    const page = await context.newPage()
    page.setDefaultTimeout(15_000)
    await page.setContent(html, { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    let timer: ReturnType<typeof setTimeout> | undefined
    try {
      return await Promise.race([
        page.pdf({ format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true }),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => reject(new Error('Project PDF rendering timed out')), 15_000)
        }),
      ])
    } finally {
      clearTimeout(timer)
    }
  } finally {
    await browser.close()
  }
}
