import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_domain" AS ENUM('thermal', 'grids', 'efficiency', 'photovoltaic', 'wind', 'hydrogen', 'storage', 'biomass', 'materials', 'water', 'other');
  CREATE TYPE "public"."enum_projects_project_status" AS ENUM('active', 'completed', 'planned');
  CREATE TYPE "public"."enum_projects_visibility" AS ENUM('private', 'public');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_projects_translation_review" AS ENUM('source', 'pending', 'approved');
  CREATE TYPE "public"."enum_projects_publication_status" AS ENUM('draft', 'review', 'published');
  CREATE TYPE "public"."enum__projects_v_version_domain" AS ENUM('thermal', 'grids', 'efficiency', 'photovoltaic', 'wind', 'hydrogen', 'storage', 'biomass', 'materials', 'water', 'other');
  CREATE TYPE "public"."enum__projects_v_version_project_status" AS ENUM('active', 'completed', 'planned');
  CREATE TYPE "public"."enum__projects_v_version_visibility" AS ENUM('private', 'public');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_published_locale" AS ENUM('fr', 'en', 'ar');
  CREATE TYPE "public"."enum__projects_v_version_translation_review" AS ENUM('source', 'pending', 'approved');
  CREATE TYPE "public"."enum__projects_v_version_publication_status" AS ENUM('draft', 'review', 'published');
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reference" varchar,
  	"acronym" varchar,
  	"programme" varchar,
  	"selection_call_reference" varchar,
  	"launch_year" numeric,
  	"domain" "enum_projects_domain",
  	"project_status" "enum_projects_project_status",
  	"duration_months" numeric,
  	"budget_m_a_d" numeric,
  	"coordinator_email" varchar,
  	"coordinator_phone" varchar,
  	"image_path" varchar,
  	"portrait_path" varchar,
  	"consortium_logos" jsonb,
  	"source_url" varchar,
  	"source_hash" varchar,
  	"retrieved_at" timestamp(3) with time zone,
  	"visibility" "enum_projects_visibility" DEFAULT 'private',
  	"editorial_owner_id" integer,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_locales" (
  	"title" varchar,
  	"description" varchar,
  	"theme" varchar,
  	"start_text" varchar,
  	"location" varchar,
  	"hosting_platform" varchar,
  	"coordinator_name" varchar,
  	"coordinator_affiliation" varchar,
  	"objectives" varchar,
  	"consortium" varchar,
  	"translation_review" "enum_projects_translation_review" DEFAULT 'pending',
  	"publication_status" "enum_projects_publication_status" DEFAULT 'draft',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_reference" varchar,
  	"version_acronym" varchar,
  	"version_programme" varchar,
  	"version_selection_call_reference" varchar,
  	"version_launch_year" numeric,
  	"version_domain" "enum__projects_v_version_domain",
  	"version_project_status" "enum__projects_v_version_project_status",
  	"version_duration_months" numeric,
  	"version_budget_m_a_d" numeric,
  	"version_coordinator_email" varchar,
  	"version_coordinator_phone" varchar,
  	"version_image_path" varchar,
  	"version_portrait_path" varchar,
  	"version_consortium_logos" jsonb,
  	"version_source_url" varchar,
  	"version_source_hash" varchar,
  	"version_retrieved_at" timestamp(3) with time zone,
  	"version_visibility" "enum__projects_v_version_visibility" DEFAULT 'private',
  	"version_editorial_owner_id" integer,
  	"version_internal_notes" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__projects_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_projects_v_locales" (
  	"version_title" varchar,
  	"version_description" varchar,
  	"version_theme" varchar,
  	"version_start_text" varchar,
  	"version_location" varchar,
  	"version_hosting_platform" varchar,
  	"version_coordinator_name" varchar,
  	"version_coordinator_affiliation" varchar,
  	"version_objectives" varchar,
  	"version_consortium" varchar,
  	"version_translation_review" "enum__projects_v_version_translation_review" DEFAULT 'pending',
  	"version_publication_status" "enum__projects_v_version_publication_status" DEFAULT 'draft',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_editorial_owner_id_users_id_fk" FOREIGN KEY ("editorial_owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_editorial_owner_id_users_id_fk" FOREIGN KEY ("version_editorial_owner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_locales" ADD CONSTRAINT "_projects_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "projects_reference_idx" ON "projects" USING btree ("reference");
  CREATE INDEX "projects_editorial_owner_idx" ON "projects" USING btree ("editorial_owner_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_reference_idx" ON "_projects_v" USING btree ("version_reference");
  CREATE INDEX "_projects_v_version_version_editorial_owner_idx" ON "_projects_v" USING btree ("version_editorial_owner_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_snapshot_idx" ON "_projects_v" USING btree ("snapshot");
  CREATE INDEX "_projects_v_published_locale_idx" ON "_projects_v" USING btree ("published_locale");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_projects_v_locales_locale_parent_id_unique" ON "_projects_v_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");`)
  await db.execute(sql`
    ALTER TABLE search_documents DROP CONSTRAINT search_documents_origin_check;
    ALTER TABLE search_documents ADD CONSTRAINT search_documents_origin_check CHECK (origin IN ('static','pages','news','media','opportunities','calls','projects'));
    ALTER TABLE search_index_jobs DROP CONSTRAINT search_index_jobs_origin_check;
    ALTER TABLE search_index_jobs ADD CONSTRAINT search_index_jobs_origin_check CHECK (origin IN ('pages','news','media','opportunities','calls','projects'));
    ALTER VIEW search_public_sources RENAME TO search_public_before_projects_sources;
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
    CREATE INDEX projects_search_source_id_idx ON projects ((id::text));
    CREATE TRIGGER projects_search_job AFTER INSERT OR UPDATE OR DELETE ON projects FOR EACH ROW EXECUTE FUNCTION enqueue_search_index_job();
    CREATE TRIGGER projects_locales_search_job AFTER INSERT OR UPDATE OR DELETE ON projects_locales FOR EACH ROW EXECUTE FUNCTION enqueue_search_index_job();
  `)

}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP VIEW search_public_sources;
    ALTER VIEW search_public_before_projects_sources RENAME TO search_public_sources;
    DELETE FROM search_documents WHERE origin='projects';
    DELETE FROM search_index_jobs WHERE origin='projects';
    ALTER TABLE search_documents DROP CONSTRAINT search_documents_origin_check;
    ALTER TABLE search_documents ADD CONSTRAINT search_documents_origin_check CHECK (origin IN ('static','pages','news','media','opportunities','calls'));
    ALTER TABLE search_index_jobs DROP CONSTRAINT search_index_jobs_origin_check;
    ALTER TABLE search_index_jobs ADD CONSTRAINT search_index_jobs_origin_check CHECK (origin IN ('pages','news','media','opportunities','calls'));
  `)

  await db.execute(sql`
   ALTER TABLE "projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_locales" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";
  
  DROP INDEX "payload_locked_documents_rels_projects_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  DROP TYPE "public"."enum_projects_domain";
  DROP TYPE "public"."enum_projects_project_status";
  DROP TYPE "public"."enum_projects_visibility";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum_projects_translation_review";
  DROP TYPE "public"."enum_projects_publication_status";
  DROP TYPE "public"."enum__projects_v_version_domain";
  DROP TYPE "public"."enum__projects_v_version_project_status";
  DROP TYPE "public"."enum__projects_v_version_visibility";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum__projects_v_published_locale";
  DROP TYPE "public"."enum__projects_v_version_translation_review";
  DROP TYPE "public"."enum__projects_v_version_publication_status";`)
}
