import { sql, type MigrateUpArgs, type MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE cms_account_avatars (
      user_id integer PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      display_name text NOT NULL,
      content bytea NOT NULL CHECK(octet_length(content) BETWEEN 1 AND 1000000),
      mime text NOT NULL CHECK(mime='image/webp'),
      sha256 text NOT NULL CHECK(length(sha256)=64),
      provenance jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    );
  `)
}
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS cms_account_avatars`)
}
