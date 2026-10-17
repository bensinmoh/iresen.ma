import { expect, test } from './fixtures'
import AxeBuilder from '@axe-core/playwright'
import { retainedContentEntries } from '../../src/lib/cms-workspace/retained-content'
import { createEntry } from '../../src/lib/cms-preview/model'

const enabled =
  process.env.CMS_INTERFACE_PREVIEW_ENABLED === 'true' &&
  process.env.CMS_WORKSPACE_ENABLED === 'true' &&
  process.env.PUBLIC_RELEASE !== 'true'
if (process.env.CMS_PREVIEW_TEST_URL) test.use({ baseURL: process.env.CMS_PREVIEW_TEST_URL })

test('administration is closed outside an explicit authenticated workspace', async ({
  request,
}) => {
  test.skip(enabled, 'Local database workspace is explicitly enabled.')
  expect((await request.get('/admin')).status()).toBe(404)
})

test.describe('authenticated CMS shell with retained site corpus', () => {
  test.skip(!enabled, 'Requires the explicit local administration flags.')
  // Browser fixtures are intercepted in this isolated browser context. Never write
  // test articles, offers, applicants or credentials into the shared local database.
  test.beforeEach(async ({ page }) => {
    const workspace = {
      version: 1,
      entries: retainedContentEntries('2026-10-16T20:00:00Z'),
      logs: [],
    }
    workspace.entries.find((entry) => entry.reference === '7514300639057797120')!.shared.highlight =
      'true'
    await page.route('**/admin/api/actions*', (route) => {
      const request = route.request()
      const url = new URL(request.url())
      if (request.method() !== 'GET' || url.searchParams.get('action') !== 'delete-impact')
        throw new Error('This cancellation journey must never mutate content.')
      const entry = workspace.entries.find((entry) => entry.id === url.searchParams.get('id'))!
      return route.fulfill({
        json: {
          id: entry.id,
          title: entry.variants.fr.title,
          module: entry.module,
          revision: 1,
          languages: (['fr', 'en', 'ar'] as const).map((language) => ({
            language,
            status: entry.variants[language].status,
            published: Boolean(entry.publicVariants[language]),
          })),
          inbound: [],
          outgoing: [],
          applications: 0,
          effects: ['Retrait des listes actives ; fichiers et historique conservés.'],
          blockers: [],
          token: '0'.repeat(64),
        },
      })
    })
    await page.route('**/admin/api/session', (route) =>
      route.fulfill({ json: { actor: { id: 1, name: 'Administration', role: 'admin' } } }),
    )
    await page.route('**/admin/api/content', (route) =>
      route.fulfill({ json: { workspace, revision: 1 } }),
    )
    await page.route('**/admin/api/recruitment', (route) =>
      route.fulfill({
        json: {
          state: {
            version: 1,
            candidates: [],
            applications: [],
            documents: [],
            interviews: [],
            evaluations: [],
          },
          revision: 1,
        },
      }),
    )
  })
  test('redirects the previous entry while preserving query parameters', async ({ request }) => {
    const response = await request.get('/cms-preview?review=1', { maxRedirects: 0 })
    expect(response.status()).toBe(308)
    expect(response.headers().location).toMatch(/\/admin\?review=1$/)
  })
  test('shows real corpora and an authenticated role without runtime demonstrations', async ({
    page,
  }) => {
    await page.goto('/admin#integrations')
    await expect(
      page.locator('.cms-account-identity').getByText('Administration', { exact: true }),
    ).toBeVisible()
    await expect(
      page.locator('.cms-account-identity').getByText('Administrateur', { exact: true }),
    ).toBeVisible()
    await expect(page.locator('.cms-connected-session')).toHaveCount(0)
    const sidebar = page.getByRole('complementary', { name: 'Navigation de l’administration' })
    await expect(sidebar.getByRole('button', { name: /^Publications 1199(?: |$)/ })).toBeVisible()
    await expect(sidebar.getByRole('button', { name: /^Brevets 59(?: |$)/ })).toBeVisible()
    await expect(sidebar.getByRole('button', { name: /^Laboratoires 14(?: |$)/ })).toBeVisible()
    await expect(page.getByLabel('Rôle du compte')).toHaveCount(0)
    await expect(page.getByText('Mode démonstration', { exact: true })).toHaveCount(0)
    await expect(page.getByText('Réinitialiser les exemples', { exact: true })).toHaveCount(0)
    await expect(sidebar.getByRole('button', { name: 'Organismes', exact: true })).toHaveCount(0)
  })
  test('opens complete page copy and preserves Arabic direction', async ({ page }) => {
    await page.goto('/admin#pages')
    await page
      .getByRole('button', { name: 'Institute Contenu FR / EN / AR · PostgreSQL', exact: true })
      .click()
    const field = page.getByLabel('Contenu structuré du site (JSON)', { exact: false })
    await expect(field).toHaveValue(/ambition/)
    await page.getByRole('button', { name: /^AR(?: |$)/ }).click()
    await expect(field).toHaveAttribute('dir', 'rtl')
    expect(JSON.parse(await field.inputValue()).timeline).toHaveLength(8)
  })
  test('shows one highlighted article and opens a replacement confirmation without saving', async ({
    page,
  }) => {
    await page.goto('/admin#news')
    const current = page.getByRole('row').filter({
      has: page.getByRole('button', {
        name: 'Samir RACHIDI évoque le rôle des compétences locales dans le développement industriel.',
        exact: true,
      }),
    })
    await expect(current.getByRole('button', { name: 'À la une', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    for (const order of ['title', 'recent']) {
      await page
        .getByRole('combobox', { name: 'Trier les contenus', exact: true })
        .selectOption(order)
      await expect(
        page.locator('.cms-list-toolbar').locator('..').locator('tbody tr').first(),
      ).toContainText('Samir RACHIDI évoque')
    }
    await expect(page.getByRole('button', { name: 'À la une', exact: true })).toHaveCount(1)
    await expect(page.getByRole('columnheader', { name: 'À la une', exact: true })).toHaveCount(0)
    await expect(
      current.getByRole('button', { name: 'À la une', exact: true }).locator('svg'),
    ).toHaveAttribute('data-icon-weight', 'fill')
    await page.getByRole('button', { name: 'Mettre à la une', exact: true }).first().click()
    await expect(
      page.getByRole('dialog', { name: 'Mettre cet article à la une ?', exact: true }),
    ).toBeVisible()
    await page.getByRole('button', { name: 'Annuler', exact: true }).click()
    await expect(current.getByRole('button', { name: 'À la une', exact: true })).toBeVisible()
  })
  test('exposes safe entry actions in the list and editor without changing data on cancel', async ({
    page,
  }) => {
    await page.goto('/admin#faq')
    const title = 'Comment demander un accès aux plateformes de recherche ?'
    const row = page
      .getByRole('row')
      .filter({ has: page.getByRole('button', { name: title, exact: true }) })
    await expect(page.getByRole('columnheader', { name: 'Actions', exact: true })).toBeVisible()
    await expect(row.getByRole('button', { name: `Ouvrir ${title}`, exact: true })).toBeVisible()
    await row.getByRole('button', { name: 'Supprimer', exact: true }).click()
    await expect(
      page.getByRole('dialog', { name: 'Supprimer cette fiche ?', exact: true }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Ce qui sera impacté', exact: true }),
    ).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'Langues concernées', exact: true }),
    ).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Confirmer la suppression', exact: true }),
    ).toBeEnabled()
    await page.getByRole('button', { name: 'Annuler', exact: true }).click()
    await expect(row).toBeVisible()
    await page.getByRole('button', { name: title, exact: true }).click()
    await expect(page.getByRole('button', { name: 'Supprimer', exact: true })).toBeVisible()
    await expect(
      page.getByRole('button', { name: 'Remettre en brouillon', exact: true }),
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'Remettre en revue', exact: true })).toBeVisible()
  })
  test('reveals logout from the avatar and closes on Escape or outside click', async ({ page }) => {
    await page.goto('/admin')
    const avatar = page.getByRole('button', { name: 'Compte de Administration', exact: true })
    const logout = page.getByRole('button', { name: 'Se déconnecter', exact: true })
    await expect(logout).toBeHidden()
    await avatar.click()
    await expect(avatar).toHaveAttribute('aria-expanded', 'true')
    await expect(logout).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(logout).toBeHidden()
    await expect(avatar).toBeFocused()
    await avatar.click()
    await page.getByRole('heading', { name: 'Tableau de bord', exact: true }).click()
    await expect(logout).toBeHidden()
    let signedOut = false
    await page.route('**/admin/api/session', async (route) => {
      if (route.request().method() === 'DELETE') {
        signedOut = true
        await route.fulfill({ json: { ok: true } })
      } else {
        await route.fulfill({ status: 401, json: { error: 'Session terminée.' } })
      }
    })
    await avatar.click()
    await logout.click()
    await expect(page.getByRole('heading', { name: 'Connexion au CMS', exact: true })).toBeVisible()
    expect(signedOut).toBe(true)
  })
  test('separates gallery media, video, reports, links and site assets', async ({ page }) => {
    await page.goto('/admin#media')
    for (const [label, count] of [
      ['Photos', 20],
      ['Vidéos', 0],
      ['Rapports & stratégies', 10],
      ['Liens utiles', 7],
    ] as const) {
      const choice = page.getByRole('button', { name: `${label} ${count}`, exact: true })
      await choice.click()
      await expect(choice).toHaveAttribute('aria-pressed', 'true')
      await expect(page.locator('.cms-list-count')).toContainText(`${count} contenu(s)`)
    }
    await page.getByRole('button', { name: 'Ouvrir EVPLAN', exact: true }).click()
    await expect(page.getByRole('textbox', { name: /^Adresse externe / })).toHaveValue(
      'https://evplan.org/',
    )
    await expect(page.locator('input[type="file"]')).toHaveCount(0)
  })
  test('finds a person through the hierarchy and opens the matching editor', async ({ page }) => {
    await page.goto('/admin#organigram')
    await page.getByRole('button', { name: 'Tout replier', exact: true }).click()
    await expect(page.locator('.cms-org-row')).toHaveCount(3)
    await page
      .getByRole('searchbox', { name: 'Rechercher une unité ou une personne', exact: true })
      .fill('mouhcine')
    await expect(page.locator('.cms-org-row')).toHaveCount(3)
    await expect(page.locator('.cms-org-tree')).toContainText('Pôle Développement')
    await page
      .getByRole('button', { name: 'Ouvrir la fiche de Mouhcine BENMEZIANE', exact: true })
      .click()
    await expect(
      page.getByRole('heading', { name: 'Mouhcine BENMEZIANE', exact: true }),
    ).toBeVisible()
  })
  test('keeps recruitment genuinely empty when no real application has arrived', async ({
    page,
  }) => {
    await page.goto('/admin#careers')
    await page.getByRole('button', { name: 'Stages', exact: true }).click()
    await expect(page.getByRole('heading', { name: 'Aucun dossier dans cette vue' })).toBeVisible()
    await expect(page.getByText(/preview@example.invalid/)).toHaveCount(0)
    await expect(page.getByText(/dossiers et CV privés enregistrés en base/)).toBeVisible()
  })
  test('uploads a photo directly and preserves edits made while its request is in flight', async ({
    page,
  }) => {
    const photo = createEntry('media', 'media-upload-test', '2026-10-16T20:00:00Z')
    photo.shared.fileName = 'portrait.png'
    photo.shared.mimeType = 'image/png'
    const entries = retainedContentEntries('2026-10-16T20:00:00Z')
    let release!: () => void
    const gate = new Promise<void>((resolve) => {
      release = resolve
    })
    await page.route('**/admin/api/media', async (route) => {
      const body = route.request().postDataBuffer()!.toString()
      expect(body).toContain('name="kind"\r\n\r\nimage')
      expect(body).toContain('filename="portrait.png"')
      await gate
      await route.fulfill({
        json: {
          workspace: { version: 1, entries: [...entries, photo], logs: [] },
          revision: 2,
          entry: photo,
        },
      })
    })
    await page.goto('/admin#platforms')
    await page.getByRole('button', { name: 'Green Energy Park', exact: true }).click()
    await expect(page.getByRole('combobox', { name: /^Photo/ })).toHaveCount(0)
    const input = page.getByLabel('Photo / miniature', { exact: true })
    await expect(input).toHaveAttribute('type', 'file')
    await input.setInputFiles({
      name: 'portrait.png',
      mimeType: 'image/png',
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aR1sAAAAASUVORK5CYII=',
        'base64',
      ),
    })
    await expect(page.getByText('Téléversement en cours…', { exact: true })).toBeVisible()
    const location = page.getByRole('textbox', { name: /^Lieu / })
    await location.fill('Modification pendant le téléversement')
    release()
    await expect(page.getByText('Image associée : portrait.png', { exact: true })).toBeVisible()
    await expect(location).toHaveValue('Modification pendant le téléversement')
    let savedPhoto = ''
    await page.route('**/admin/api/content', async (route) => {
      const updates = route.request().postDataJSON().workspace.entries
      savedPhoto = updates.find((entry: { module: string }) => entry.module === 'platforms').shared
        .heroImage
      await route.fulfill({
        json: {
          workspace: {
            version: 1,
            entries: [
              ...entries.filter(
                (entry) => !updates.some((updated: { id: string }) => updated.id === entry.id),
              ),
              ...updates,
              photo,
            ],
            logs: [],
          },
          revision: 3,
        },
      })
    })
    await page.getByRole('button', { name: 'Enregistrer le brouillon', exact: true }).click()
    await expect(page.getByText('Modifications non enregistrées', { exact: false })).toHaveCount(0)
    expect(savedPhoto).toBe(photo.id)
    await page.getByRole('button', { name: 'Retirer l’image de cette fiche', exact: true }).click()
    await expect(page.getByText('Image associée : portrait.png', { exact: true })).toHaveCount(0)
    await expect(page.getByText('Image dissociée du brouillon.', { exact: false })).toBeVisible()
  })
  test('reflows the connected menu on mobile and keeps its focus behavior', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/admin')
    await page.getByRole('button', { name: 'Ouvrir la navigation' }).click()
    await page.getByRole('button', { name: /^FAQ 6(?: |$)/ }).click()
    await expect(page.getByRole('heading', { name: 'FAQ', exact: true })).toBeVisible()
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth),
    ).toBe(false)
    await page.getByRole('button', { name: 'Ouvrir la navigation' }).click()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Ouvrir la navigation' })).toBeFocused()
  })
  test('keeps the connected dashboard accessible', async ({ page }) => {
    await page.goto('/admin')
    await expect(page.getByRole('heading', { name: 'Tableau de bord', exact: true })).toBeVisible()
    const result = await new AxeBuilder({ page }).include('#cms-main').analyze()
    expect(result.violations).toEqual([])
  })
})
