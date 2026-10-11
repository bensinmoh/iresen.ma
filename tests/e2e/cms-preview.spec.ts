import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const enabled = process.env.CMS_INTERFACE_PREVIEW_ENABLED === 'true'
if (process.env.CMS_PREVIEW_TEST_URL) test.use({ baseURL: process.env.CMS_PREVIEW_TEST_URL })

test('CMS design tool is opt-in in production', async ({ request }) => {
  test.skip(enabled, 'Enabled only for the local interface review.')
  const response = await request.get('/cms-preview')
  expect(response.status()).toBe(404)
  expect(response.headers()['x-robots-tag']).toContain('noindex')
})

test.describe('local CMS interface', () => {
  test.skip(!enabled, 'The design tool is disabled in normal production builds.')
  test('edits, saves, reviews and previews without content API calls', async ({ page }) => {
    const contentRequests: string[] = []
    page.on('request', (request) => {
      if (new URL(request.url()).pathname.startsWith('/api/')) contentRequests.push(request.url())
    })
    await page.goto('/cms-preview')
    await expect(page.getByRole('heading', { name: 'Tableau de bord', exact: true })).toBeVisible()
    await page
      .locator('nav')
      .getByRole('button', { name: /^Actualités/ })
      .click()
    await page.getByRole('button', { name: 'Ajouter', exact: true }).click()
    await page.getByLabel('Titre requis', { exact: true }).fill('Exemple — rédaction de test')
    await page
      .getByLabel('Texte / présentation')
      .fill('Texte de validation local, sans publication sur le site.')
    await page.getByRole('button', { name: 'Enregistrer le brouillon', exact: true }).click()
    await expect(page.getByRole('status').filter({ hasText: 'Brouillon enregistré' })).toBeVisible()
    await page.getByRole('button', { name: 'Soumettre à validation', exact: true }).click()
    await page.getByRole('button', { name: 'Valider cette langue', exact: true }).click()
    await page.getByRole('button', { name: 'Simuler la publication', exact: true }).click()
    await page.getByRole('button', { name: 'Publier dans l’atelier', exact: true }).click()
    await page.getByRole('button', { name: /^AR(?: |$)/ }).click()
    await expect(page.getByLabel('Titre requis', { exact: true })).toHaveAttribute('dir', 'rtl')
    await expect(page.getByLabel('Titre requis', { exact: true })).toHaveValue('')
    await page.getByRole('button', { name: /^FR(?: |$)/ }).click()
    await page.getByRole('button', { name: 'Prévisualiser', exact: true }).click()
    const preview = page.getByRole('dialog', { name: 'Aperçu de la révision locale' })
    await expect(
      preview.getByRole('heading', { name: 'Exemple — rédaction de test' }),
    ).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(preview).not.toBeVisible()
    await page.reload()
    await page
      .locator('nav')
      .getByRole('button', { name: /^Actualités/ })
      .click()
    await expect(
      page.getByRole('button', { name: 'Exemple — rédaction de test', exact: true }),
    ).toBeVisible()
    await page.getByRole('searchbox', { name: 'Rechercher dans Actualités' }).fill('rédaction')
    await page.getByRole('button', { name: 'Exemple — rédaction de test', exact: true }).click()
    await page.getByRole('button', { name: /Retour à actualités/ }).click()
    await expect(page.getByRole('searchbox', { name: 'Rechercher dans Actualités' })).toHaveValue(
      'rédaction',
    )
    expect(contentRequests).toEqual([])
  })
  test('protects unsaved work and supports reader role and mobile navigation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/cms-preview')
    await page.getByRole('button', { name: 'Ouvrir la navigation' }).click()
    await page.getByRole('button', { name: 'Carrières', exact: true }).click()
    await expect(
      page.getByRole('heading', { name: 'Aucun contenu dans cet atelier' }),
    ).toBeVisible()
    await page.getByRole('button', { name: 'Ajouter', exact: true }).click()
    await page.getByLabel('Titre requis', { exact: true }).fill('Brouillon local non enregistré')
    await page.getByRole('button', { name: /Retour à carrières/ }).click()
    await expect(page.getByRole('dialog', { name: 'Conserver vos modifications ?' })).toBeVisible()
    await page.getByRole('button', { name: 'Revenir', exact: true }).click()
    await expect(page.getByLabel('Titre requis', { exact: true })).toHaveValue(
      'Brouillon local non enregistré',
    )
    await page.getByLabel('Profil de test').selectOption('reader')
    await page.getByRole('button', { name: 'Abandonner les modifications' }).click()
    await expect(page.getByRole('button', { name: 'Ajouter', exact: true })).toHaveCount(0)
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    )
    expect(overflow).toBe(false)
    await page.getByRole('button', { name: 'Ouvrir la navigation' }).click()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Ouvrir la navigation' })).toBeFocused()
  })
  test('rehearses an idempotent CSV import and exposes local audit', async ({ page }) => {
    await page.goto('/cms-preview#imports')
    await page.getByLabel('Fichier CSV').setInputFiles({
      name: 'test.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from(
        'reference,title,body\nLOCAL-1,Exemple importé,Texte de test\nLOCAL-2,,Ligne ignorée\n',
      ),
    })
    await page.getByRole('button', { name: 'Vérifier les lignes' }).click()
    await expect(
      page.getByText('1 ligne(s) retenue(s) · 0 mise(s) à jour · 1 création(s)'),
    ).toBeVisible()
    await page.getByRole('button', { name: 'Continuer vers la confirmation' }).click()
    await page.getByRole('button', { name: 'Importer dans cet atelier' }).click()
    await page.getByRole('button', { name: 'Préparer un autre import' }).click()
    await page.getByLabel('Fichier CSV').setInputFiles({
      name: 'test.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from('reference,title,body\nLOCAL-1,Exemple corrigé,Nouveau texte\n'),
    })
    await page.getByRole('button', { name: 'Vérifier les lignes' }).click()
    await expect(
      page.getByText('1 ligne(s) retenue(s) · 1 mise(s) à jour · 0 création(s)'),
    ).toBeVisible()
    await page.getByRole('button', { name: 'Continuer vers la confirmation' }).click()
    await page.getByRole('button', { name: 'Importer dans cet atelier' }).click()
    await page
      .locator('nav')
      .getByRole('button', { name: /^Actualités/ })
      .click()
    await expect(page.getByRole('button', { name: 'Exemple corrigé', exact: true })).toHaveCount(1)
    await page.getByRole('button', { name: 'Journaux', exact: true }).click()
    await expect(page.getByRole('cell', { name: 'Import CSV local', exact: true })).toHaveCount(2)
  })
  test('dashboard and editor pass scoped automated accessibility checks', async ({ page }) => {
    await page.goto('/cms-preview')
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
        .violations,
    ).toEqual([])
    await page
      .locator('nav')
      .getByRole('button', { name: /^Actualités/ })
      .click()
    await page.getByRole('button', { name: 'Ajouter', exact: true }).click()
    expect(
      (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
        .violations,
    ).toEqual([])
  })
})
