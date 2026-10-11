import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_calls_budget_currency" AS ENUM('MAD', 'EUR', 'USD');
  CREATE TYPE "public"."enum_calls_visibility" AS ENUM('private', 'public');
  CREATE TYPE "public"."enum_calls_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_calls_publication_status" AS ENUM('draft', 'review', 'published');
  CREATE TYPE "public"."enum__calls_v_version_budget_currency" AS ENUM('MAD', 'EUR', 'USD');
  CREATE TYPE "public"."enum__calls_v_version_visibility" AS ENUM('private', 'public');
  CREATE TYPE "public"."enum__calls_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__calls_v_published_locale" AS ENUM('fr', 'en', 'ar');
  CREATE TYPE "public"."enum__calls_v_version_publication_status" AS ENUM('draft', 'review', 'published');
  CREATE TABLE "calls" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference" varchar,
  	"acronym" varchar,
  	"launch_year" numeric,
  	"opening_at" timestamp(3) with time zone,
  	"deadline_at" timestamp(3) with time zone,
  	"evaluation_starts_at" timestamp(3) with time zone,
  	"evaluation_ends_at" timestamp(3) with time zone,
  	"results_at" timestamp(3) with time zone,
  	"budget_amount" numeric,
  	"budget_currency" "enum_calls_budget_currency" DEFAULT 'MAD',
  	"cancelled" boolean DEFAULT false,
  	"visibility" "enum_calls_visibility" DEFAULT 'private',
  	"editorial_owner_id" integer,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_calls_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "calls_locales" (
  	"title" varchar,
  	"description" varchar,
  	"calendar_note" varchar,
  	"budget_note" varchar,
  	"recipients" varchar,
  	"themes" varchar,
  	"funding_partners" varchar,
  	"conditions_document_id" integer,
  	"submission_url" varchar,
  	"publication_status" "enum_calls_publication_status" DEFAULT 'draft',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_calls_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_reference" varchar,
  	"version_acronym" varchar,
  	"version_launch_year" numeric,
  	"version_opening_at" timestamp(3) with time zone,
  	"version_deadline_at" timestamp(3) with time zone,
  	"version_evaluation_starts_at" timestamp(3) with time zone,
  	"version_evaluation_ends_at" timestamp(3) with time zone,
  	"version_results_at" timestamp(3) with time zone,
  	"version_budget_amount" numeric,
  	"version_budget_currency" "enum__calls_v_version_budget_currency" DEFAULT 'MAD',
  	"version_cancelled" boolean DEFAULT false,
  	"version_visibility" "enum__calls_v_version_visibility" DEFAULT 'private',
  	"version_editorial_owner_id" integer,
  	"version_internal_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__calls_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__calls_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_calls_v_locales" (
  	"version_title" varchar,
  	"version_description" varchar,
  	"version_calendar_note" varchar,
  	"version_budget_note" varchar,
  	"version_recipients" varchar,
  	"version_themes" varchar,
  	"version_funding_partners" varchar,
  	"version_conditions_document_id" integer,
  	"version_submission_url" varchar,
  	"version_publication_status" "enum__calls_v_version_publication_status" DEFAULT 'draft',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "calls_id" integer;
  ALTER TABLE "calls" ADD CONSTRAINT "calls_editorial_owner_id_users_id_fk" FOREIGN KEY ("editorial_owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "calls_locales" ADD CONSTRAINT "calls_locales_conditions_document_id_media_id_fk" FOREIGN KEY ("conditions_document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "calls_locales" ADD CONSTRAINT "calls_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."calls"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_calls_v" ADD CONSTRAINT "_calls_v_parent_id_calls_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."calls"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_calls_v" ADD CONSTRAINT "_calls_v_version_editorial_owner_id_users_id_fk" FOREIGN KEY ("version_editorial_owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_calls_v_locales" ADD CONSTRAINT "_calls_v_locales_version_conditions_document_id_media_id_fk" FOREIGN KEY ("version_conditions_document_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_calls_v_locales" ADD CONSTRAINT "_calls_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_calls_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "calls_reference_idx" ON "calls" USING btree ("reference");
  CREATE INDEX "calls_editorial_owner_idx" ON "calls" USING btree ("editorial_owner_id");
  CREATE INDEX "calls_updated_at_idx" ON "calls" USING btree ("updated_at");
  CREATE INDEX "calls_created_at_idx" ON "calls" USING btree ("created_at");
  CREATE INDEX "calls__status_idx" ON "calls" USING btree ("_status");
  CREATE INDEX "calls_conditions_document_idx" ON "calls_locales" USING btree ("conditions_document_id","_locale");
  CREATE UNIQUE INDEX "calls_locales_locale_parent_id_unique" ON "calls_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_calls_v_parent_idx" ON "_calls_v" USING btree ("parent_id");
  CREATE INDEX "_calls_v_version_version_reference_idx" ON "_calls_v" USING btree ("version_reference");
  CREATE INDEX "_calls_v_version_version_editorial_owner_idx" ON "_calls_v" USING btree ("version_editorial_owner_id");
  CREATE INDEX "_calls_v_version_version_updated_at_idx" ON "_calls_v" USING btree ("version_updated_at");
  CREATE INDEX "_calls_v_version_version_created_at_idx" ON "_calls_v" USING btree ("version_created_at");
  CREATE INDEX "_calls_v_version_version__status_idx" ON "_calls_v" USING btree ("version__status");
  CREATE INDEX "_calls_v_created_at_idx" ON "_calls_v" USING btree ("created_at");
  CREATE INDEX "_calls_v_updated_at_idx" ON "_calls_v" USING btree ("updated_at");
  CREATE INDEX "_calls_v_snapshot_idx" ON "_calls_v" USING btree ("snapshot");
  CREATE INDEX "_calls_v_published_locale_idx" ON "_calls_v" USING btree ("published_locale");
  CREATE INDEX "_calls_v_latest_idx" ON "_calls_v" USING btree ("latest");
  CREATE INDEX "_calls_v_version_version_conditions_document_idx" ON "_calls_v_locales" USING btree ("version_conditions_document_id","_locale");
  CREATE UNIQUE INDEX "_calls_v_locales_locale_parent_id_unique" ON "_calls_v_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_calls_fk" FOREIGN KEY ("calls_id") REFERENCES "public"."calls"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_calls_id_idx" ON "payload_locked_documents_rels" USING btree ("calls_id");
  ALTER TABLE search_documents DROP CONSTRAINT search_documents_origin_check;
  ALTER TABLE search_documents ADD CONSTRAINT search_documents_origin_check CHECK (origin IN ('static','pages','news','media','opportunities','calls'));
  ALTER TABLE search_index_jobs DROP CONSTRAINT search_index_jobs_origin_check;
  ALTER TABLE search_index_jobs ADD CONSTRAINT search_index_jobs_origin_check CHECK (origin IN ('pages','news','media','opportunities','calls'));
  ALTER VIEW search_public_sources RENAME TO search_public_before_calls_sources;
  CREATE VIEW search_public_sources AS SELECT * FROM search_public_before_calls_sources UNION ALL
    SELECT 'calls'::text AS origin, c.id::text AS source_id, l._locale::text AS locale,
      md5(jsonb_build_array(c.updated_at,c.reference,c.acronym,c.launch_year,c.opening_at,c.deadline_at,c.evaluation_starts_at,c.evaluation_ends_at,c.results_at,c.budget_amount,c.budget_currency,c.cancelled,l.title,l.description,l.calendar_note,l.budget_note,l.recipients,l.themes,l.funding_partners,l.submission_url,l.conditions_document_id)::text) AS source_revision,
      NULL::text AS page_id, l.title, c.reference AS slug,
      concat_ws(' ',c.acronym,l.description,c.launch_year,c.opening_at,c.deadline_at,c.evaluation_starts_at,c.evaluation_ends_at,c.results_at,l.calendar_note,c.budget_amount,c.budget_currency,l.budget_note,l.recipients,l.themes,l.funding_partners,'R&D&I RDI recherche développement innovation research development innovation البحث والتطوير والابتكار') AS body_text,
      NULL::jsonb AS rich_body,NULL::text AS filename,NULL::text AS mime_type,c.created_at AS published_at
    FROM calls c JOIN calls_locales l ON l._parent_id=c.id
    WHERE c._status='published' AND c.visibility='public' AND l.publication_status='published'
      AND length(trim(l.title))>0 AND length(trim(l.description))>0 AND length(trim(c.acronym))>0
      AND length(trim(l.recipients))>0 AND length(trim(l.themes))>0 AND length(trim(l.funding_partners))>0
      AND c.launch_year IS NOT NULL AND c.budget_amount IS NOT NULL AND c.opening_at IS NOT NULL
      AND c.deadline_at IS NOT NULL AND c.evaluation_starts_at IS NOT NULL AND c.results_at IS NOT NULL;
  CREATE INDEX calls_search_source_id_idx ON calls ((id::text));
  CREATE TRIGGER calls_search_job AFTER INSERT OR UPDATE OR DELETE ON calls FOR EACH ROW EXECUTE FUNCTION enqueue_search_index_job();
  CREATE TRIGGER calls_locales_search_job AFTER INSERT OR UPDATE OR DELETE ON calls_locales FOR EACH ROW EXECUTE FUNCTION enqueue_search_index_job();`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP VIEW search_public_sources;
  ALTER VIEW search_public_before_calls_sources RENAME TO search_public_sources;
  DELETE FROM search_documents WHERE origin='calls';
  DELETE FROM search_index_jobs WHERE origin='calls';
  ALTER TABLE search_documents DROP CONSTRAINT search_documents_origin_check;
  ALTER TABLE search_documents ADD CONSTRAINT search_documents_origin_check CHECK (origin IN ('static','pages','news','media','opportunities'));
  ALTER TABLE search_index_jobs DROP CONSTRAINT search_index_jobs_origin_check;
  ALTER TABLE search_index_jobs ADD CONSTRAINT search_index_jobs_origin_check CHECK (origin IN ('pages','news','media','opportunities'));
  ALTER TABLE "calls" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "calls_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_calls_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_calls_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "calls" CASCADE;
  DROP TABLE "calls_locales" CASCADE;
  DROP TABLE "_calls_v" CASCADE;
  DROP TABLE "_calls_v_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT IF EXISTS "payload_locked_documents_rels_calls_fk";
  
  DROP INDEX "payload_locked_documents_rels_calls_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "calls_id";
  DROP TYPE "public"."enum_calls_budget_currency";
  DROP TYPE "public"."enum_calls_visibility";
  DROP TYPE "public"."enum_calls_status";
  DROP TYPE "public"."enum_calls_publication_status";
  DROP TYPE "public"."enum__calls_v_version_budget_currency";
  DROP TYPE "public"."enum__calls_v_version_visibility";
  DROP TYPE "public"."enum__calls_v_version_status";
  DROP TYPE "public"."enum__calls_v_published_locale";
  DROP TYPE "public"."enum__calls_v_version_publication_status";`)
}
