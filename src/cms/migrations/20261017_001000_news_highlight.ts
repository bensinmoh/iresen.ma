import { sql, type MigrateUpArgs, type MigrateDownArgs } from '@payloadcms/db-postgres'
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`UPDATE cms_authoring_entries SET shared=jsonb_set(shared,'{highlight}','"false"'::jsonb) WHERE module='news'`)
  await db.execute(sql`UPDATE cms_authoring_entries SET shared=jsonb_set(shared,'{highlight}','"true"'::jsonb) WHERE id=(SELECT id FROM cms_authoring_entries WHERE module='news' AND reference='7514300639057797120' AND NOT EXISTS(SELECT 1 FROM cms_deleted_entries d WHERE d.entry_id=cms_authoring_entries.id) ORDER BY id LIMIT 1)`)
  await db.execute(sql`CREATE UNIQUE INDEX cms_news_single_highlight ON cms_authoring_entries ((shared->>'highlight')) WHERE module='news' AND shared->>'highlight'='true'`)
  await db.execute(sql`UPDATE cms_workspace_meta SET revision=revision+1,updated_at=now() WHERE scope='content'`)
}
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP INDEX IF EXISTS cms_news_single_highlight`)
  await db.execute(sql`UPDATE cms_authoring_entries SET shared=shared-'highlight' WHERE module='news'`)
}
