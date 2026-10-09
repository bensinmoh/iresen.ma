import { sql, type MigrateUpArgs, type MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE EXTENSION IF NOT EXISTS pg_trgm;
    ALTER TABLE media_locales ADD COLUMN search_text varchar;
    ALTER TABLE _media_v_locales ADD COLUMN version_search_text varchar;

    CREATE TABLE search_documents (
      id text PRIMARY KEY,
      origin text NOT NULL CHECK (origin IN ('static', 'pages', 'news', 'media')),
      source_id text,
      locale text NOT NULL CHECK (locale IN ('fr', 'en', 'ar')),
      source_revision text NOT NULL,
      title text NOT NULL,
      body text NOT NULL,
      url text NOT NULL,
      type text NOT NULL CHECK (type IN ('page', 'section', 'news', 'document', 'media')),
      published_at timestamptz,
      title_norm text NOT NULL,
      body_norm text NOT NULL,
      search_vector tsvector GENERATED ALWAYS AS (
        setweight(to_tsvector(CASE locale WHEN 'fr' THEN 'french'::regconfig WHEN 'en' THEN 'english'::regconfig ELSE 'simple'::regconfig END, title_norm), 'A') ||
        setweight(to_tsvector(CASE locale WHEN 'fr' THEN 'french'::regconfig WHEN 'en' THEN 'english'::regconfig ELSE 'simple'::regconfig END, body_norm), 'B') ||
        to_tsvector('simple'::regconfig, title_norm || ' ' || body_norm)
      ) STORED
    );
    CREATE INDEX search_documents_vector_idx ON search_documents USING gin (search_vector);
    CREATE INDEX search_documents_title_trgm_idx ON search_documents USING gin (title_norm gin_trgm_ops);
    CREATE INDEX search_documents_locale_type_idx ON search_documents (locale, type);
    CREATE INDEX search_documents_source_idx ON search_documents (origin, source_id);
    -- Public-source IDs are text at the adapter boundary; preserve indexed canonical lookups.
    CREATE INDEX pages_search_source_id_idx ON pages ((id::text));
    CREATE INDEX news_search_source_id_idx ON news ((id::text));
    CREATE INDEX media_search_source_id_idx ON media ((id::text));

    CREATE TABLE search_index_jobs (
      origin text NOT NULL CHECK (origin IN ('pages', 'news', 'media')),
      source_id text NOT NULL,
      queued_at timestamptz NOT NULL DEFAULT now(),
      attempts integer NOT NULL DEFAULT 0,
      next_try timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY (origin, source_id)
    );

    -- This view selects canonical live rows only, never draft revisions or private fields.
    -- Fingerprints gate old index text immediately when either localized or shared copy changes.
    CREATE VIEW search_public_sources AS
      SELECT 'pages'::text AS origin, p.id::text AS source_id, l._locale::text AS locale,
        md5(jsonb_build_array(p.updated_at, p.page_id, l.title, l.slug, l.summary, l.body)::text) AS source_revision,
        p.page_id, l.title, l.slug, l.summary AS body_text, l.body AS rich_body,
        NULL::text AS filename, NULL::text AS mime_type, NULL::timestamptz AS published_at
      FROM pages p JOIN pages_locales l ON l._parent_id = p.id
      WHERE p._status = 'published' AND p.visibility = 'public' AND l.publication_status = 'published' AND length(trim(l.title)) > 0
      UNION ALL
      SELECT 'news', n.id::text, l._locale::text,
        md5(jsonb_build_array(n.updated_at, n.type, n.published_at, l.title, l.slug, l.summary, l.body)::text),
        NULL::text, l.title, l.slug, l.summary, l.body,
        NULL::text, NULL::text, n.published_at
      FROM news n JOIN news_locales l ON l._parent_id = n.id
      WHERE n._status = 'published' AND n.visibility = 'public' AND l.publication_status = 'published' AND length(trim(l.title)) > 0
        AND NOT EXISTS (
          SELECT 1 FROM news duplicate JOIN news_locales translated ON translated._parent_id = duplicate.id
          WHERE duplicate.id <> n.id AND duplicate._status = 'published' AND duplicate.visibility = 'public'
            AND translated._locale = l._locale AND translated.slug = l.slug AND translated.publication_status = 'published'
        )
      UNION ALL
      SELECT 'media', m.id::text, l._locale::text,
        md5(jsonb_build_array(m.updated_at, m.filename, m.mime_type, l.title, l.alt, l.caption, l.search_text)::text),
        NULL::text, l.title, NULL::text, concat_ws(' ', l.alt, l.caption, l.search_text, m.filename), NULL::jsonb,
        m.filename, m.mime_type, NULL::timestamptz
      FROM media m JOIN media_locales l ON l._parent_id = m.id
      WHERE m._status = 'published' AND m.visibility = 'public' AND l.publication_status = 'published' AND length(trim(l.title)) > 0 AND length(trim(m.filename)) > 0;

    CREATE FUNCTION enqueue_search_index_job() RETURNS trigger LANGUAGE plpgsql AS $$
    DECLARE collection_name text; document_id text; old_slug text; new_slug text; changed_locale text;
    BEGIN
      collection_name := replace(TG_TABLE_NAME, '_locales', '');
      IF TG_TABLE_NAME LIKE '%_locales' THEN
        IF TG_OP = 'DELETE' THEN document_id := OLD._parent_id::text; ELSE document_id := NEW._parent_id::text; END IF;
      ELSE
        IF TG_OP = 'DELETE' THEN document_id := OLD.id::text; ELSE document_id := NEW.id::text; END IF;
      END IF;
      INSERT INTO search_index_jobs (origin, source_id) VALUES (collection_name, document_id)
        ON CONFLICT (origin, source_id) DO UPDATE SET queued_at = now(), attempts = 0, next_try = now();
      -- A duplicate slug blocks its whole locale destination. Reindex peers when
      -- publication/rename/deletion resolves that ambiguity, even after their old rows were removed.
      IF collection_name = 'news' THEN
        IF TG_TABLE_NAME = 'news_locales' THEN
          IF TG_OP <> 'INSERT' THEN old_slug := OLD.slug; changed_locale := OLD._locale::text; END IF;
          IF TG_OP <> 'DELETE' THEN new_slug := NEW.slug; changed_locale := NEW._locale::text; END IF;
          INSERT INTO search_index_jobs (origin, source_id)
            SELECT DISTINCT 'news', peer._parent_id::text FROM news_locales peer
            WHERE peer._locale::text = changed_locale AND (peer.slug = old_slug OR peer.slug = new_slug)
            ON CONFLICT (origin, source_id) DO UPDATE SET queued_at = now(), attempts = 0, next_try = now();
        ELSE
          INSERT INTO search_index_jobs (origin, source_id)
            SELECT DISTINCT 'news', peer._parent_id::text FROM news_locales own
              JOIN news_locales peer ON peer._locale = own._locale AND peer.slug = own.slug
            WHERE own._parent_id::text = document_id
            ON CONFLICT (origin, source_id) DO UPDATE SET queued_at = now(), attempts = 0, next_try = now();
        END IF;
      END IF;
      RETURN NULL;
    END $$;
    CREATE TRIGGER pages_search_index AFTER INSERT OR UPDATE OR DELETE ON pages FOR EACH ROW EXECUTE FUNCTION enqueue_search_index_job();
    CREATE TRIGGER pages_locales_search_index AFTER INSERT OR UPDATE OR DELETE ON pages_locales FOR EACH ROW EXECUTE FUNCTION enqueue_search_index_job();
    CREATE TRIGGER news_search_index AFTER INSERT OR UPDATE OR DELETE ON news FOR EACH ROW EXECUTE FUNCTION enqueue_search_index_job();
    CREATE TRIGGER news_locales_search_index AFTER INSERT OR UPDATE OR DELETE ON news_locales FOR EACH ROW EXECUTE FUNCTION enqueue_search_index_job();
    CREATE TRIGGER media_search_index AFTER INSERT OR UPDATE OR DELETE ON media FOR EACH ROW EXECUTE FUNCTION enqueue_search_index_job();
    CREATE TRIGGER media_locales_search_index AFTER INSERT OR UPDATE OR DELETE ON media_locales FOR EACH ROW EXECUTE FUNCTION enqueue_search_index_job();

    INSERT INTO search_index_jobs (origin, source_id)
      SELECT 'pages', id::text FROM pages UNION ALL SELECT 'news', id::text FROM news UNION ALL SELECT 'media', id::text FROM media
      ON CONFLICT DO NOTHING;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TRIGGER pages_search_index ON pages;
    DROP TRIGGER pages_locales_search_index ON pages_locales;
    DROP TRIGGER news_search_index ON news;
    DROP TRIGGER news_locales_search_index ON news_locales;
    DROP TRIGGER media_search_index ON media;
    DROP TRIGGER media_locales_search_index ON media_locales;
    DROP FUNCTION enqueue_search_index_job();
    DROP VIEW search_public_sources;
    DROP TABLE search_index_jobs;
    DROP TABLE search_documents;
    DROP INDEX pages_search_source_id_idx;
    DROP INDEX news_search_source_id_idx;
    DROP INDEX media_search_source_id_idx;
    ALTER TABLE media_locales DROP COLUMN search_text;
    ALTER TABLE _media_v_locales DROP COLUMN version_search_text;
  `)
}
