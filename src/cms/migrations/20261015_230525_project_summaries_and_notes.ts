import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_locales" ADD COLUMN "summary" varchar;
  ALTER TABLE "_projects_v_locales" ADD COLUMN "version_summary" varchar;`)
  await db.execute(sql`
    CREATE TABLE project_notes (
      project_id integer NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
      locale varchar(2) NOT NULL CHECK(locale IN ('fr','en','ar')),
      content_revision varchar(32) NOT NULL, filename text NOT NULL,
      sha256 varchar(64) NOT NULL, generated_at timestamptz NOT NULL DEFAULT now(),
      PRIMARY KEY(project_id,locale)
    );
    CREATE FUNCTION project_content_revision(p projects,l projects_locales) RETURNS text LANGUAGE SQL IMMUTABLE AS $$
      SELECT md5(jsonb_build_array(p.reference,p.acronym,p.programme,p.launch_year,p.project_status,p.duration_months,p.budget_m_a_d,p.coordinator_email,p.coordinator_phone,p.source_url,l._locale,l.title,l.description,l.summary,l.theme,l.start_text,l.location,l.hosting_platform,l.coordinator_name,l.coordinator_affiliation,l.objectives,l.consortium)::text)
    $$;
    CREATE OR REPLACE VIEW search_public_sources AS SELECT * FROM search_public_before_projects_sources UNION ALL
      SELECT 'projects'::text AS origin,p.id::text AS source_id,l._locale::text AS locale,
        md5(jsonb_build_array(p.updated_at,project_content_revision(p,l),CASE WHEN n.content_revision=project_content_revision(p,l) THEN n.sha256 END,p.image_path,p.portrait_path)::text) AS source_revision,
        NULL::text AS page_id,concat_ws(' — ',p.acronym,l.title) AS title,p.reference AS slug,
        concat_ws(' ',p.acronym,p.programme,p.launch_year,l.description,l.summary,l.theme,l.start_text,l.location,l.hosting_platform,l.coordinator_name,l.coordinator_affiliation,l.objectives,l.consortium) AS body_text,
        jsonb_build_object('imagePath',p.image_path,'portraitPath',p.portrait_path,'coordinatorName',l.coordinator_name,'notePath',CASE WHEN n.content_revision=project_content_revision(p,l) THEN '/api/projects/'||p.reference||'/note' END) AS rich_body,
        NULL::text AS filename,NULL::text AS mime_type,NULL::timestamptz AS published_at
      FROM projects p JOIN projects_locales l ON l._parent_id=p.id
        LEFT JOIN project_notes n ON n.project_id=p.id AND n.locale=l._locale::text
      WHERE p._status='published' AND p.visibility='public' AND l.publication_status='published'
        AND length(trim(l.title))>0 AND length(trim(l.description))>0 AND length(trim(p.acronym))>0;
    CREATE FUNCTION enqueue_project_note_index_job() RETURNS trigger LANGUAGE plpgsql AS $$
    DECLARE project_id_text text;
    BEGIN
      IF TG_OP='DELETE' THEN project_id_text:=OLD.project_id::text; ELSE project_id_text:=NEW.project_id::text; END IF;
      INSERT INTO search_index_jobs(origin,source_id) VALUES('projects',project_id_text)
      ON CONFLICT(origin,source_id) DO UPDATE SET next_try=now(),attempts=0,queued_at=now();
      RETURN NULL;
    END $$;
    CREATE TRIGGER project_notes_search_job AFTER INSERT OR UPDATE OR DELETE ON project_notes FOR EACH ROW EXECUTE FUNCTION enqueue_project_note_index_job();
  `)

}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP VIEW search_public_sources;
    CREATE VIEW search_public_sources AS SELECT * FROM search_public_before_projects_sources UNION ALL
      SELECT 'projects'::text AS origin, p.id::text AS source_id, l._locale::text AS locale,
        md5(jsonb_build_array(p.updated_at,p.reference,p.acronym,p.programme,p.launch_year,p.project_status,p.duration_months,p.budget_m_a_d,p.image_path,p.portrait_path,l.title,l.description,l.theme,l.start_text,l.location,l.hosting_platform,l.coordinator_name,l.coordinator_affiliation,l.objectives,l.consortium)::text) AS source_revision,
        NULL::text AS page_id, concat_ws(' — ',p.acronym,l.title) AS title, p.reference AS slug,
        concat_ws(' ',p.acronym,p.programme,p.launch_year,l.description,l.theme,l.start_text,l.location,l.hosting_platform,l.coordinator_name,l.coordinator_affiliation,l.objectives,l.consortium) AS body_text,
        jsonb_build_object('imagePath',p.image_path,'portraitPath',p.portrait_path,'coordinatorName',l.coordinator_name) AS rich_body,
        NULL::text AS filename,NULL::text AS mime_type,NULL::timestamptz AS published_at
      FROM projects p JOIN projects_locales l ON l._parent_id=p.id
      WHERE p._status='published' AND p.visibility='public' AND l.publication_status='published'
        AND length(trim(l.title))>0 AND length(trim(l.description))>0 AND length(trim(p.acronym))>0;

    DROP TABLE project_notes;
    DROP FUNCTION enqueue_project_note_index_job();
    DROP FUNCTION project_content_revision(projects,projects_locales);
    INSERT INTO search_index_jobs(origin,source_id) SELECT 'projects',id::text FROM projects ON CONFLICT(origin,source_id) DO UPDATE SET next_try=now(),attempts=0;
  `)

  await db.execute(sql`
   ALTER TABLE "projects_locales" DROP COLUMN "summary";
  ALTER TABLE "_projects_v_locales" DROP COLUMN "version_summary";`)
}
