import { sql, type MigrateUpArgs, type MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE search_documents ADD COLUMN vocabulary_version smallint NOT NULL DEFAULT 0;
    CREATE TABLE search_vocabulary_terms (
      locale text NOT NULL CHECK (locale IN ('fr', 'en', 'ar')),
      term text NOT NULL,
      PRIMARY KEY (locale, term)
    );
    CREATE INDEX search_vocabulary_trgm_idx ON search_vocabulary_terms USING gin (term gin_trgm_ops);
    CREATE INDEX search_vocabulary_prefix_idx ON search_vocabulary_terms (locale, term text_pattern_ops);
    CREATE TABLE search_document_vocabulary (
      document_id text NOT NULL REFERENCES search_documents(id) ON DELETE CASCADE,
      locale text NOT NULL,
      term text NOT NULL,
      surface text NOT NULL,
      PRIMARY KEY (document_id, term),
      FOREIGN KEY (locale, term) REFERENCES search_vocabulary_terms(locale, term) ON DELETE CASCADE
    );
    CREATE INDEX search_document_vocabulary_term_idx ON search_document_vocabulary (locale, term, document_id);
    -- Rebuild only current CMS projections asynchronously; request queries do not scan CMS copy.
    INSERT INTO search_index_jobs (origin, source_id)
      SELECT 'pages', id::text FROM pages UNION ALL SELECT 'news', id::text FROM news UNION ALL SELECT 'media', id::text FROM media
      ON CONFLICT (origin, source_id) DO UPDATE SET next_try=now(), attempts=0;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE search_document_vocabulary;
    DROP TABLE search_vocabulary_terms;
    ALTER TABLE search_documents DROP COLUMN vocabulary_version;
  `)
}
