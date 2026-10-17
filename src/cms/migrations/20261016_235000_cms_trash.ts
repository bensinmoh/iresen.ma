import { sql, type MigrateUpArgs, type MigrateDownArgs } from '@payloadcms/db-postgres'
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`CREATE TABLE cms_deleted_entries (
    entry_id text PRIMARY KEY REFERENCES cms_authoring_entries(id),
    snapshot jsonb NOT NULL, deleted_by integer NOT NULL REFERENCES users(id),
    deleted_at timestamptz NOT NULL DEFAULT now()
  )`)
}
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS cms_deleted_entries`)
}
