-- Preparation contract only. NOT a Payload migration; do not execute against CMS.
-- Implement through Payload collections/migrations when the populated source arrives.
CREATE TABLE expert_programmes (
  id text PRIMARY KEY,
  source_label text NOT NULL,
  label_fr text NOT NULL
);
CREATE TABLE expert_specialties (
  id text PRIMARY KEY,
  programme_id text NOT NULL REFERENCES expert_programmes(id),
  source_label text NOT NULL,
  label_fr text NOT NULL
);
CREATE TABLE expert_organisations (
  id text PRIMARY KEY,
  name text NOT NULL
);
CREATE TABLE network_experts (
  id text PRIMARY KEY,
  source_id text UNIQUE NOT NULL,
  family_name text NOT NULL,
  given_name text NOT NULL,
  organisation_id text REFERENCES expert_organisations(id),
  team text,
  city text,
  country_code text,
  geographic_scope text CHECK (geographic_scope IN ('national','international')),
  expert_type text CHECK (expert_type IN ('internal','external','partner','consultant','doctoral-postdoctoral')),
  job_title text,
  experience_years numeric CHECK (experience_years >= 0),
  degree_specialty text,
  gender text CHECK (gender IN ('F','H','unspecified')),
  professional_email text,
  professional_phone text,
  availability text CHECK (availability IN ('available','partial','unavailable','to-confirm')),
  record_status text NOT NULL DEFAULT 'incomplete'
    CHECK (record_status IN ('incomplete','review','validated','refresh','inactive')),
  last_verified_at timestamptz,
  next_review_at timestamptz,
  internal_notes text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE expert_specialty_assignments (
  id text PRIMARY KEY,
  expert_id text NOT NULL REFERENCES network_experts(id),
  specialty_id text NOT NULL REFERENCES expert_specialties(id),
  expertise_level text CHECK (expertise_level IN ('beginner','intermediate','advanced','expert')),
  keywords text[],
  intervention_domains text[],
  project_references text,
  publication_doi_cv_references text,
  equipment_platforms text,
  validation_status text NOT NULL DEFAULT 'review'
    CHECK (validation_status IN ('review','validated','refresh','inactive')),
  validated_by text,
  validated_at timestamptz,
  source_sheet text NOT NULL,
  source_row integer NOT NULL CHECK (source_row > 1),
  import_batch_id text NOT NULL,
  UNIQUE (expert_id, specialty_id)
);
-- Public copy is explicitly separate from internal identity/contact/assessment.
CREATE TABLE expert_public_profiles (
  expert_id text NOT NULL REFERENCES network_experts(id),
  locale text NOT NULL CHECK (locale IN ('fr','en','ar')),
  display_name text,
  role_label text,
  biography text,
  approval_status text NOT NULL DEFAULT 'draft'
    CHECK (approval_status IN ('draft','review','approved')),
  publication_authorized_at timestamptz,
  authorization_reference text,
  withdrawn_at timestamptz,
  PRIMARY KEY (expert_id, locale)
);
CREATE INDEX expert_assignments_specialty ON expert_specialty_assignments(specialty_id, expert_id);
CREATE INDEX expert_identity_filters ON network_experts(organisation_id, city, expert_type);
