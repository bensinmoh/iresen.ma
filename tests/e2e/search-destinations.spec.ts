import { randomUUID } from 'node:crypto'
import { mkdir, writeFile, rm } from 'node:fs/promises'
import path from 'node:path'
import { Pool } from 'pg'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { expect, test } from '@playwright/test'

// Disposable local/CI database only, as with the CMS integration suite. Every
// temporary record/file is removed; no administrator or real content is used.
test('published CMS search destinations render and withdrawn files/articles are inaccessible', async ({
  page,
  request,
}) => {
  const database = new Pool({ connectionString: process.env.DATABASE_URL, allowExitOnIdle: true })
  const token = `destination${randomUUID().replaceAll('-', '')}`
  const slug = `search-${token}`
  const filename = `${token}.txt`
  const file = path.resolve(process.env.CMS_UPLOAD_DIRECTORY ?? '.local/uploads', filename)
  let articleID: number | undefined
  let mediaID: number | undefined
  const body = {
    root: {
      type: 'root',
      version: 1,
      format: '',
      direction: null,
      indent: 0,
      children: [
        {
          type: 'heading',
          tag: 'h2',
          version: 1,
          format: '',
          indent: 0,
          direction: null,
          children: [{ type: 'text', version: 1, text: `${token} section`, format: 0 }],
        },
        {
          type: 'paragraph',
          version: 1,
          format: '',
          indent: 0,
          direction: null,
          children: [{ type: 'text', version: 1, text: `${token} approved body`, format: 0 }],
        },
      ],
    },
  }
  const drain = async () => {
    for (let batch = 0; batch < 20; batch++) {
      const { stdout } = await promisify(execFile)(
        process.execPath,
        ['scripts/run.mjs', 'tsx', 'scripts/search-index.ts', 'work'],
        { timeout: 30_000 },
      )
      if (stdout.includes('Processed 0 search index jobs.')) return
    }
    throw new Error('Disposable test search queue did not drain within its batch limit.')
  }
  try {
    articleID = (
      await database.query<{ id: number }>(
        "INSERT INTO news (type,visibility,_status,published_at) VALUES ('news','public','published',now()) RETURNING id",
      )
    ).rows[0]!.id
    await database.query(
      "INSERT INTO news_locales (_parent_id,_locale,title,slug,summary,body,publication_status) VALUES ($1,'fr',$2,$3,$4,$5,'published')",
      [articleID, `${token} article`, slug, `${token} summary`, JSON.stringify(body)],
    )
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, `${token} public document text`)
    mediaID = (
      await database.query<{ id: number }>(
        "INSERT INTO media (visibility,_status,filename,mime_type,rights) VALUES ('public','published',$1,'text/plain','Disposable test fixture') RETURNING id",
        [filename],
      )
    ).rows[0]!.id
    await database.query(
      "INSERT INTO media_locales (_parent_id,_locale,title,alt,publication_status) VALUES ($1,'fr',$2,$2,'published')",
      [mediaID, `${token} document`],
    )
    await drain()
    const result = await request.get(`/api/search?locale=fr&q=${token}`)
    expect(result.status()).toBe(200)
    const data = await result.json()
    const article = data.items.find((item: { type: string }) => item.type === 'news')
    const section = data.items.find((item: { type: string }) => item.type === 'section')
    const document = data.items.find((item: { type: string }) => item.type === 'document')
    expect(article.url).toBe(`/fr/ressources/actualites/${slug}`)
    expect(section.url).toBe(`${article.url}#content-section-0`)
    expect(document.url).toContain(`/${filename}?locale=fr`)
    expect((await request.get(article.url)).status()).toBe(200)
    await page.goto(section.url)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(`${token} article`)
    await expect(page.locator('#content-section-0')).toHaveText(`${token} section`)
    await expect(page.locator('.published-rich-text')).toContainText(`${token} approved body`)
    expect((await request.get(`/en/resources/news/${slug}`)).status()).toBe(404)
    const publicFile = await request.get(document.url)
    expect(publicFile.status()).toBe(200)
    expect(publicFile.headers()['cache-control']).toContain('no-store')
    expect(await publicFile.text()).toContain(`${token} public document text`)
    // CMS file endpoints must never enter Next's independently cached optimizer.
    // The URL gate applies before MIME detection, including to real CMS images.
    const optimizedFile = await request.get(
      `/_next/image?url=${encodeURIComponent(document.url)}&w=640&q=75`,
    )
    expect(optimizedFile.status()).toBe(400)
    expect(await optimizedFile.text()).toContain('not allowed')
    expect([403, 404]).toContain(
      (await request.get(document.url.replace('locale=fr', 'locale=ar'))).status(),
    )
    await database.query("UPDATE news SET visibility='private' WHERE id=$1", [articleID])
    await database.query("UPDATE media SET visibility='private' WHERE id=$1", [mediaID])
    // Immediate live gates, before queue processing, protect snippets and bytes.
    expect((await (await request.get(`/api/search?locale=fr&q=${token}`)).json()).items).toEqual([])
    expect((await request.get(article.url)).status()).toBe(404)
    expect([403, 404]).toContain((await request.get(document.url)).status())
  } finally {
    if (articleID) await database.query('DELETE FROM news WHERE id=$1', [articleID])
    if (mediaID) await database.query('DELETE FROM media WHERE id=$1', [mediaID])
    await drain()
    await rm(file, { force: true })
    await database.end()
  }
})
