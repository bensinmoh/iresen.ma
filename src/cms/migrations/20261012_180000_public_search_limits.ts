import { sql, type MigrateUpArgs, type MigrateDownArgs } from '@payloadcms/db-postgres'
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`CREATE TABLE public_search_limits (
    client_key varchar(64) NOT NULL, window_start timestamptz NOT NULL,
    requests smallint NOT NULL CHECK (requests BETWEEN 1 AND 61), expires_at timestamptz NOT NULL,
    PRIMARY KEY (client_key, window_start)
  ); CREATE INDEX public_search_limits_expiry ON public_search_limits(expires_at);`)
}
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS public_search_limits;`)
}
