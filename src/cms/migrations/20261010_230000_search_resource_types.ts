import { sql, type MigrateUpArgs, type MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE search_documents DROP CONSTRAINT search_documents_type_check;
    ALTER TABLE search_documents ADD CONSTRAINT search_documents_type_check
      CHECK (type IN ('page', 'section', 'news', 'publication', 'report', 'patent', 'project', 'document', 'media'));
    -- Keep existing identities and destinations; the catalogue revision refreshes text/vocabulary.
    UPDATE search_documents SET type='patent'
      WHERE origin='static' AND id LIKE 'section:transfer:patent-%';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- Search is a rebuildable projection, never the source records.
    DELETE FROM search_documents WHERE type IN ('publication', 'report', 'patent', 'project');
    ALTER TABLE search_documents DROP CONSTRAINT search_documents_type_check;
    ALTER TABLE search_documents ADD CONSTRAINT search_documents_type_check
      CHECK (type IN ('page', 'section', 'news', 'document', 'media'));
  `)
}
