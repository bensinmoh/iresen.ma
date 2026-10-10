import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_opportunities_state" AS ENUM('open', 'closed');
  CREATE TYPE "public"."enum_opportunities_contract" AS ENUM('CDI', 'CDD', 'internship', 'apprenticeship');
  CREATE TYPE "public"."enum_opportunities_visibility" AS ENUM('private', 'public');
  CREATE TYPE "public"."enum_opportunities_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_opportunities_publication_status" AS ENUM('draft', 'review', 'published');
  CREATE TYPE "public"."enum__opportunities_v_version_state" AS ENUM('open', 'closed');
  CREATE TYPE "public"."enum__opportunities_v_version_contract" AS ENUM('CDI', 'CDD', 'internship', 'apprenticeship');
  CREATE TYPE "public"."enum__opportunities_v_version_visibility" AS ENUM('private', 'public');
  CREATE TYPE "public"."enum__opportunities_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__opportunities_v_published_locale" AS ENUM('fr', 'en', 'ar');
  CREATE TYPE "public"."enum__opportunities_v_version_publication_status" AS ENUM('draft', 'review', 'published');
  CREATE TABLE "opportunities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference" varchar,
  	"is_demo" boolean DEFAULT false,
  	"state" "enum_opportunities_state" DEFAULT 'open',
  	"contract" "enum_opportunities_contract",
  	"visibility" "enum_opportunities_visibility" DEFAULT 'private',
  	"editorial_owner_id" integer,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_opportunities_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "opportunities_locales" (
  	"title" varchar,
  	"department" varchar,
  	"location" varchar,
  	"experience" varchar,
  	"availability" varchar,
  	"summary" varchar,
  	"missions" varchar,
  	"profile" varchar,
  	"publication_status" "enum_opportunities_publication_status" DEFAULT 'draft',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_opportunities_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_reference" varchar,
  	"version_is_demo" boolean DEFAULT false,
  	"version_state" "enum__opportunities_v_version_state" DEFAULT 'open',
  	"version_contract" "enum__opportunities_v_version_contract",
  	"version_visibility" "enum__opportunities_v_version_visibility" DEFAULT 'private',
  	"version_editorial_owner_id" integer,
  	"version_internal_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__opportunities_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__opportunities_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_opportunities_v_locales" (
  	"version_title" varchar,
  	"version_department" varchar,
  	"version_location" varchar,
  	"version_experience" varchar,
  	"version_availability" varchar,
  	"version_summary" varchar,
  	"version_missions" varchar,
  	"version_profile" varchar,
  	"version_publication_status" "enum__opportunities_v_version_publication_status" DEFAULT 'draft',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "opportunities_id" integer;
  ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_editorial_owner_id_users_id_fk" FOREIGN KEY ("editorial_owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "opportunities_locales" ADD CONSTRAINT "opportunities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."opportunities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_opportunities_v" ADD CONSTRAINT "_opportunities_v_parent_id_opportunities_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."opportunities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_opportunities_v" ADD CONSTRAINT "_opportunities_v_version_editorial_owner_id_users_id_fk" FOREIGN KEY ("version_editorial_owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_opportunities_v_locales" ADD CONSTRAINT "_opportunities_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_opportunities_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "opportunities_reference_idx" ON "opportunities" USING btree ("reference");
  CREATE INDEX "opportunities_editorial_owner_idx" ON "opportunities" USING btree ("editorial_owner_id");
  CREATE INDEX "opportunities_updated_at_idx" ON "opportunities" USING btree ("updated_at");
  CREATE INDEX "opportunities_created_at_idx" ON "opportunities" USING btree ("created_at");
  CREATE INDEX "opportunities__status_idx" ON "opportunities" USING btree ("_status");
  CREATE UNIQUE INDEX "opportunities_locales_locale_parent_id_unique" ON "opportunities_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_opportunities_v_parent_idx" ON "_opportunities_v" USING btree ("parent_id");
  CREATE INDEX "_opportunities_v_version_version_reference_idx" ON "_opportunities_v" USING btree ("version_reference");
  CREATE INDEX "_opportunities_v_version_version_editorial_owner_idx" ON "_opportunities_v" USING btree ("version_editorial_owner_id");
  CREATE INDEX "_opportunities_v_version_version_updated_at_idx" ON "_opportunities_v" USING btree ("version_updated_at");
  CREATE INDEX "_opportunities_v_version_version_created_at_idx" ON "_opportunities_v" USING btree ("version_created_at");
  CREATE INDEX "_opportunities_v_version_version__status_idx" ON "_opportunities_v" USING btree ("version__status");
  CREATE INDEX "_opportunities_v_created_at_idx" ON "_opportunities_v" USING btree ("created_at");
  CREATE INDEX "_opportunities_v_updated_at_idx" ON "_opportunities_v" USING btree ("updated_at");
  CREATE INDEX "_opportunities_v_snapshot_idx" ON "_opportunities_v" USING btree ("snapshot");
  CREATE INDEX "_opportunities_v_published_locale_idx" ON "_opportunities_v" USING btree ("published_locale");
  CREATE INDEX "_opportunities_v_latest_idx" ON "_opportunities_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_opportunities_v_locales_locale_parent_id_unique" ON "_opportunities_v_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_opportunities_fk" FOREIGN KEY ("opportunities_id") REFERENCES "public"."opportunities"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_opportunities_id_idx" ON "payload_locked_documents_rels" USING btree ("opportunities_id");
  ALTER TABLE search_documents DROP CONSTRAINT search_documents_origin_check;
  ALTER TABLE search_documents ADD CONSTRAINT search_documents_origin_check CHECK (origin IN ('static','pages','news','media','opportunities'));
  ALTER TABLE search_index_jobs DROP CONSTRAINT search_index_jobs_origin_check;
  ALTER TABLE search_index_jobs ADD CONSTRAINT search_index_jobs_origin_check CHECK (origin IN ('pages','news','media','opportunities'));
  ALTER VIEW search_public_sources RENAME TO search_public_core_sources;
  CREATE VIEW search_public_sources AS SELECT * FROM search_public_core_sources UNION ALL
    SELECT 'opportunities'::text AS origin, o.id::text AS source_id, l._locale::text AS locale,
      md5(jsonb_build_array(o.updated_at,o.reference,o.contract,l.title,l.department,l.location,l.summary,l.experience,l.availability,l.missions,l.profile)::text) AS source_revision,
      NULL::text AS page_id, l.title, o.reference AS slug,
      concat_ws(' ',l.summary,l.department,o.contract,l.location,l.experience,l.availability,l.missions,l.profile) AS body_text,
      NULL::jsonb AS rich_body,NULL::text AS filename,NULL::text AS mime_type,o.created_at AS published_at
    FROM opportunities o JOIN opportunities_locales l ON l._parent_id=o.id
    WHERE o._status='published' AND o.visibility='public' AND l.publication_status='published'
      AND o.is_demo=false AND o.state='open'
      AND length(trim(l.title))>0 AND length(trim(l.summary))>0 AND length(trim(l.department))>0
      AND length(trim(l.location))>0 AND length(trim(l.experience))>0 AND length(trim(l.availability))>0
      AND length(trim(l.missions))>0 AND length(trim(l.profile))>0;
  CREATE INDEX opportunities_search_source_id_idx ON opportunities ((id::text));
  CREATE TRIGGER opportunities_search_job AFTER INSERT OR UPDATE OR DELETE ON opportunities FOR EACH ROW EXECUTE FUNCTION enqueue_search_index_job();
  CREATE TRIGGER opportunities_locales_search_job AFTER INSERT OR UPDATE OR DELETE ON opportunities_locales FOR EACH ROW EXECUTE FUNCTION enqueue_search_index_job();`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP VIEW search_public_sources;
  ALTER VIEW search_public_core_sources RENAME TO search_public_sources;
  DELETE FROM search_documents WHERE origin='opportunities';
  DELETE FROM search_index_jobs WHERE origin='opportunities';
  ALTER TABLE search_documents DROP CONSTRAINT search_documents_origin_check;
  ALTER TABLE search_documents ADD CONSTRAINT search_documents_origin_check CHECK (origin IN ('static','pages','news','media'));
  ALTER TABLE search_index_jobs DROP CONSTRAINT search_index_jobs_origin_check;
  ALTER TABLE search_index_jobs ADD CONSTRAINT search_index_jobs_origin_check CHECK (origin IN ('pages','news','media'));
  ALTER TABLE "opportunities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "opportunities_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_opportunities_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_opportunities_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "opportunities" CASCADE;
  DROP TABLE "opportunities_locales" CASCADE;
  DROP TABLE "_opportunities_v" CASCADE;
  DROP TABLE "_opportunities_v_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_opportunities_fk";
  
  DROP INDEX "payload_locked_documents_rels_opportunities_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "opportunities_id";
  DROP TYPE "public"."enum_opportunities_state";
  DROP TYPE "public"."enum_opportunities_contract";
  DROP TYPE "public"."enum_opportunities_visibility";
  DROP TYPE "public"."enum_opportunities_status";
  DROP TYPE "public"."enum_opportunities_publication_status";
  DROP TYPE "public"."enum__opportunities_v_version_state";
  DROP TYPE "public"."enum__opportunities_v_version_contract";
  DROP TYPE "public"."enum__opportunities_v_version_visibility";
  DROP TYPE "public"."enum__opportunities_v_version_status";
  DROP TYPE "public"."enum__opportunities_v_published_locale";
  DROP TYPE "public"."enum__opportunities_v_version_publication_status";`)
}
