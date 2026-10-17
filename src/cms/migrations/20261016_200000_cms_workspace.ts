import { sql, type MigrateUpArgs, type MigrateDownArgs } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE cms_workspace_meta (
      scope text PRIMARY KEY CHECK (scope IN ('content','recruitment')),
      revision bigint NOT NULL DEFAULT 0,
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    INSERT INTO cms_workspace_meta(scope) VALUES ('content'),('recruitment');
    CREATE TABLE cms_authoring_entries (
      id text PRIMARY KEY, module text NOT NULL, reference text NOT NULL,
      shared jsonb NOT NULL DEFAULT '{}', variants jsonb NOT NULL,
      comment text NOT NULL DEFAULT '', public_variants jsonb NOT NULL DEFAULT '{}',
      updated_at timestamptz NOT NULL DEFAULT now(),
      source_collection text, source_id text, source_revision text,
      UNIQUE(module,reference), UNIQUE(source_collection,source_id)
    );
    CREATE INDEX cms_authoring_module ON cms_authoring_entries(module);
    CREATE TABLE cms_authoring_revisions (
      id bigserial PRIMARY KEY, entry_id text NOT NULL REFERENCES cms_authoring_entries(id),
      language text NOT NULL CHECK(language IN ('fr','en','ar')),
      variant jsonb NOT NULL, shared jsonb NOT NULL, note text NOT NULL DEFAULT '',
      actor_id integer NOT NULL REFERENCES users(id), created_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE INDEX cms_authoring_history ON cms_authoring_revisions(entry_id,created_at DESC);
    CREATE TABLE cms_private_audit (
      id bigserial PRIMARY KEY, scope text NOT NULL, resource_id text NOT NULL,
      action text NOT NULL, actor_id integer NOT NULL REFERENCES users(id),
      actor_role text NOT NULL CHECK(actor_role IN ('admin','editor')),
      detail jsonb NOT NULL DEFAULT '{}', created_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE INDEX cms_private_audit_scope ON cms_private_audit(scope,created_at DESC);
    CREATE TABLE cms_candidate_profiles (
      id text PRIMARY KEY, normalized_email text NOT NULL UNIQUE,
      data jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE cms_applications (
      id text PRIMARY KEY, candidate_id text NOT NULL REFERENCES cms_candidate_profiles(id),
      kind text NOT NULL CHECK(kind IN ('offer','internship','spontaneous')),
      offer_entry_id text REFERENCES cms_authoring_entries(id),
      status text NOT NULL CHECK(status IN ('received','screening','shortlisted','interview','accepted','rejected','withdrawn')),
      data jsonb NOT NULL, updated_at timestamptz NOT NULL DEFAULT now(),
      CHECK(kind <> 'offer' OR offer_entry_id IS NOT NULL)
    );
    CREATE UNIQUE INDEX cms_one_offer_application ON cms_applications(candidate_id,offer_entry_id) WHERE kind='offer';
    CREATE INDEX cms_application_stage ON cms_applications(status,updated_at DESC);
    CREATE TABLE cms_candidate_documents (
      id text PRIMARY KEY, candidate_id text NOT NULL REFERENCES cms_candidate_profiles(id),
      name text NOT NULL, mime text NOT NULL CHECK(mime IN ('application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document')),
      size integer NOT NULL CHECK(size BETWEEN 1 AND 5000000), content bytea NOT NULL,
      metadata jsonb NOT NULL, actor_id integer NOT NULL REFERENCES users(id),
      created_at timestamptz NOT NULL DEFAULT now(), CHECK(octet_length(content)=size)
    );
    CREATE INDEX cms_candidate_document_owner ON cms_candidate_documents(candidate_id);
    CREATE TABLE cms_recruitment_interviews (
      id text PRIMARY KEY, application_id text NOT NULL REFERENCES cms_applications(id),
      start_at timestamptz NOT NULL, data jsonb NOT NULL,
      updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE INDEX cms_interview_calendar ON cms_recruitment_interviews(start_at);
    CREATE TABLE cms_recruitment_evaluations (
      id text PRIMARY KEY, application_id text NOT NULL REFERENCES cms_applications(id),
      actor_id integer NOT NULL REFERENCES users(id), rating integer NOT NULL CHECK(rating BETWEEN 1 AND 5),
      data jsonb NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE cms_auth_limits (
      key text PRIMARY KEY, attempts integer NOT NULL DEFAULT 1,
      expires_at timestamptz NOT NULL
    );
    UPDATE users SET role='editor' WHERE role::text NOT IN ('admin','editor');
    ALTER TABLE users ADD CONSTRAINT cms_two_editorial_roles CHECK(role::text IN ('admin','editor'));
  `)
}
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE users DROP CONSTRAINT cms_two_editorial_roles;
    DROP TABLE cms_auth_limits,cms_recruitment_evaluations,cms_recruitment_interviews,
      cms_candidate_documents,cms_applications,cms_candidate_profiles,cms_private_audit,
      cms_authoring_revisions,cms_authoring_entries,cms_workspace_meta;
  `)
}
