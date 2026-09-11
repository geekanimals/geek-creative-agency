import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_services_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__services_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_projects_project_kind" AS ENUM('campaign', 'ongoing-program', 'platform', 'activation');
  CREATE TYPE "public"."enum__projects_v_version_project_kind" AS ENUM('campaign', 'ongoing-program', 'platform', 'activation');
  CREATE TYPE "public"."enum_business_categories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__business_categories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_companies_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__companies_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_brands_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__brands_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_solutions_solution_type" AS ENUM('proprietary-ip', 'methodology', 'program-model', 'solution');
  CREATE TYPE "public"."enum_solutions_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__solutions_v_version_solution_type" AS ENUM('proprietary-ip', 'methodology', 'program-model', 'solution');
  CREATE TYPE "public"."enum__solutions_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "services_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "_services_v_version_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_label" varchar,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 100,
  	"version_hero_heading" varchar,
  	"version_hero_short_summary" varchar,
  	"version_introduction" varchar,
  	"version_approach" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_noindex" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__services_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "business_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"short_summary" varchar,
  	"introduction" varchar,
  	"hero_media_id" integer,
  	"hero_legacy_src" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_noindex" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_business_categories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_business_categories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_short_summary" varchar,
  	"version_introduction" varchar,
  	"version_hero_media_id" integer,
  	"version_hero_legacy_src" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_noindex" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__business_categories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "companies" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"logo_id" integer,
  	"legacy_logo_src" varchar,
  	"website" varchar,
  	"short_summary" varchar,
  	"introduction" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_noindex" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_companies_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "companies_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"business_categories_id" integer
  );
  
  CREATE TABLE "_companies_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_logo_id" integer,
  	"version_legacy_logo_src" varchar,
  	"version_website" varchar,
  	"version_short_summary" varchar,
  	"version_introduction" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_noindex" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__companies_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_companies_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"business_categories_id" integer
  );
  
  CREATE TABLE "brands" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"company_id" integer,
  	"portfolio_group" varchar,
  	"logo_id" integer,
  	"legacy_logo_src" varchar,
  	"short_summary" varchar,
  	"introduction" varchar,
  	"hero_media_id" integer,
  	"hero_legacy_src" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_noindex" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_brands_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "brands_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"business_categories_id" integer
  );
  
  CREATE TABLE "_brands_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_company_id" integer,
  	"version_portfolio_group" varchar,
  	"version_logo_id" integer,
  	"version_legacy_logo_src" varchar,
  	"version_short_summary" varchar,
  	"version_introduction" varchar,
  	"version_hero_media_id" integer,
  	"version_hero_legacy_src" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_noindex" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__brands_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_brands_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"business_categories_id" integer
  );
  
  CREATE TABLE "solutions_methodology" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "solutions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"solution_type" "enum_solutions_solution_type" DEFAULT 'solution',
  	"short_summary" varchar,
  	"introduction" varchar,
  	"what_it_solves_heading" varchar,
  	"what_it_solves_body" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_noindex" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_solutions_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "solutions_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "_solutions_v_version_methodology" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_solution_type" "enum__solutions_v_version_solution_type" DEFAULT 'solution',
  	"version_short_summary" varchar,
  	"version_introduction" varchar,
  	"version_what_it_solves_heading" varchar,
  	"version_what_it_solves_body" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_noindex" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__solutions_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_solutions_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  ALTER TABLE "services" ALTER COLUMN "label" DROP NOT NULL;
  ALTER TABLE "services" ALTER COLUMN "slug" DROP NOT NULL;
  ALTER TABLE "services" ADD COLUMN "hero_heading" varchar;
  ALTER TABLE "services" ADD COLUMN "hero_short_summary" varchar;
  ALTER TABLE "services" ADD COLUMN "introduction" varchar;
  ALTER TABLE "services" ADD COLUMN "approach" varchar;
  ALTER TABLE "services" ADD COLUMN "seo_meta_title" varchar;
  ALTER TABLE "services" ADD COLUMN "seo_meta_description" varchar;
  ALTER TABLE "services" ADD COLUMN "seo_og_image_id" integer;
  ALTER TABLE "services" ADD COLUMN "seo_noindex" boolean;
  ALTER TABLE "services" ADD COLUMN "_status" "enum_services_status" DEFAULT 'draft';
  ALTER TABLE "projects" ADD COLUMN "project_kind" "enum_projects_project_kind" DEFAULT 'campaign';
  ALTER TABLE "projects" ADD COLUMN "company_id" integer;
  ALTER TABLE "projects" ADD COLUMN "brand_id" integer;
  ALTER TABLE "projects_rels" ADD COLUMN "business_categories_id" integer;
  ALTER TABLE "projects_rels" ADD COLUMN "solutions_id" integer;
  ALTER TABLE "_projects_v" ADD COLUMN "version_project_kind" "enum__projects_v_version_project_kind" DEFAULT 'campaign';
  ALTER TABLE "_projects_v" ADD COLUMN "version_company_id" integer;
  ALTER TABLE "_projects_v" ADD COLUMN "version_brand_id" integer;
  ALTER TABLE "_projects_v_rels" ADD COLUMN "business_categories_id" integer;
  ALTER TABLE "_projects_v_rels" ADD COLUMN "solutions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "business_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "companies_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "brands_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "solutions_id" integer;
  ALTER TABLE "services_capabilities" ADD CONSTRAINT "services_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_capabilities" ADD CONSTRAINT "_services_v_version_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_parent_id_services_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_services_v" ADD CONSTRAINT "_services_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "business_categories" ADD CONSTRAINT "business_categories_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "business_categories" ADD CONSTRAINT "business_categories_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_business_categories_v" ADD CONSTRAINT "_business_categories_v_parent_id_business_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."business_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_business_categories_v" ADD CONSTRAINT "_business_categories_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_business_categories_v" ADD CONSTRAINT "_business_categories_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "companies" ADD CONSTRAINT "companies_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "companies" ADD CONSTRAINT "companies_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "companies_rels" ADD CONSTRAINT "companies_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "companies_rels" ADD CONSTRAINT "companies_rels_business_categories_fk" FOREIGN KEY ("business_categories_id") REFERENCES "public"."business_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_companies_v" ADD CONSTRAINT "_companies_v_parent_id_companies_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_companies_v" ADD CONSTRAINT "_companies_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_companies_v" ADD CONSTRAINT "_companies_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_companies_v_rels" ADD CONSTRAINT "_companies_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_companies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_companies_v_rels" ADD CONSTRAINT "_companies_v_rels_business_categories_fk" FOREIGN KEY ("business_categories_id") REFERENCES "public"."business_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands" ADD CONSTRAINT "brands_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands_rels" ADD CONSTRAINT "brands_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_rels" ADD CONSTRAINT "brands_rels_business_categories_fk" FOREIGN KEY ("business_categories_id") REFERENCES "public"."business_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_brands_v" ADD CONSTRAINT "_brands_v_parent_id_brands_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_brands_v" ADD CONSTRAINT "_brands_v_version_company_id_companies_id_fk" FOREIGN KEY ("version_company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_brands_v" ADD CONSTRAINT "_brands_v_version_logo_id_media_id_fk" FOREIGN KEY ("version_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_brands_v" ADD CONSTRAINT "_brands_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_brands_v" ADD CONSTRAINT "_brands_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_brands_v_rels" ADD CONSTRAINT "_brands_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_brands_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_brands_v_rels" ADD CONSTRAINT "_brands_v_rels_business_categories_fk" FOREIGN KEY ("business_categories_id") REFERENCES "public"."business_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_methodology" ADD CONSTRAINT "solutions_methodology_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions" ADD CONSTRAINT "solutions_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_rels" ADD CONSTRAINT "solutions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_rels" ADD CONSTRAINT "solutions_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_version_methodology" ADD CONSTRAINT "_solutions_v_version_methodology_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v" ADD CONSTRAINT "_solutions_v_parent_id_solutions_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."solutions"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v" ADD CONSTRAINT "_solutions_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_rels" ADD CONSTRAINT "_solutions_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_rels" ADD CONSTRAINT "_solutions_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "services_capabilities_order_idx" ON "services_capabilities" USING btree ("_order");
  CREATE INDEX "services_capabilities_parent_id_idx" ON "services_capabilities" USING btree ("_parent_id");
  CREATE INDEX "_services_v_version_capabilities_order_idx" ON "_services_v_version_capabilities" USING btree ("_order");
  CREATE INDEX "_services_v_version_capabilities_parent_id_idx" ON "_services_v_version_capabilities" USING btree ("_parent_id");
  CREATE INDEX "_services_v_parent_idx" ON "_services_v" USING btree ("parent_id");
  CREATE INDEX "_services_v_version_version_slug_idx" ON "_services_v" USING btree ("version_slug");
  CREATE INDEX "_services_v_version_seo_version_seo_og_image_idx" ON "_services_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_services_v_version_version_updated_at_idx" ON "_services_v" USING btree ("version_updated_at");
  CREATE INDEX "_services_v_version_version_created_at_idx" ON "_services_v" USING btree ("version_created_at");
  CREATE INDEX "_services_v_version_version__status_idx" ON "_services_v" USING btree ("version__status");
  CREATE INDEX "_services_v_created_at_idx" ON "_services_v" USING btree ("created_at");
  CREATE INDEX "_services_v_updated_at_idx" ON "_services_v" USING btree ("updated_at");
  CREATE INDEX "_services_v_latest_idx" ON "_services_v" USING btree ("latest");
  CREATE UNIQUE INDEX "business_categories_slug_idx" ON "business_categories" USING btree ("slug");
  CREATE INDEX "business_categories_hero_media_idx" ON "business_categories" USING btree ("hero_media_id");
  CREATE INDEX "business_categories_seo_seo_og_image_idx" ON "business_categories" USING btree ("seo_og_image_id");
  CREATE INDEX "business_categories_updated_at_idx" ON "business_categories" USING btree ("updated_at");
  CREATE INDEX "business_categories_created_at_idx" ON "business_categories" USING btree ("created_at");
  CREATE INDEX "business_categories__status_idx" ON "business_categories" USING btree ("_status");
  CREATE INDEX "_business_categories_v_parent_idx" ON "_business_categories_v" USING btree ("parent_id");
  CREATE INDEX "_business_categories_v_version_version_slug_idx" ON "_business_categories_v" USING btree ("version_slug");
  CREATE INDEX "_business_categories_v_version_version_hero_media_idx" ON "_business_categories_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_business_categories_v_version_seo_version_seo_og_image_idx" ON "_business_categories_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_business_categories_v_version_version_updated_at_idx" ON "_business_categories_v" USING btree ("version_updated_at");
  CREATE INDEX "_business_categories_v_version_version_created_at_idx" ON "_business_categories_v" USING btree ("version_created_at");
  CREATE INDEX "_business_categories_v_version_version__status_idx" ON "_business_categories_v" USING btree ("version__status");
  CREATE INDEX "_business_categories_v_created_at_idx" ON "_business_categories_v" USING btree ("created_at");
  CREATE INDEX "_business_categories_v_updated_at_idx" ON "_business_categories_v" USING btree ("updated_at");
  CREATE INDEX "_business_categories_v_latest_idx" ON "_business_categories_v" USING btree ("latest");
  CREATE UNIQUE INDEX "companies_slug_idx" ON "companies" USING btree ("slug");
  CREATE INDEX "companies_logo_idx" ON "companies" USING btree ("logo_id");
  CREATE INDEX "companies_seo_seo_og_image_idx" ON "companies" USING btree ("seo_og_image_id");
  CREATE INDEX "companies_updated_at_idx" ON "companies" USING btree ("updated_at");
  CREATE INDEX "companies_created_at_idx" ON "companies" USING btree ("created_at");
  CREATE INDEX "companies__status_idx" ON "companies" USING btree ("_status");
  CREATE INDEX "companies_rels_order_idx" ON "companies_rels" USING btree ("order");
  CREATE INDEX "companies_rels_parent_idx" ON "companies_rels" USING btree ("parent_id");
  CREATE INDEX "companies_rels_path_idx" ON "companies_rels" USING btree ("path");
  CREATE INDEX "companies_rels_business_categories_id_idx" ON "companies_rels" USING btree ("business_categories_id");
  CREATE INDEX "_companies_v_parent_idx" ON "_companies_v" USING btree ("parent_id");
  CREATE INDEX "_companies_v_version_version_slug_idx" ON "_companies_v" USING btree ("version_slug");
  CREATE INDEX "_companies_v_version_version_logo_idx" ON "_companies_v" USING btree ("version_logo_id");
  CREATE INDEX "_companies_v_version_seo_version_seo_og_image_idx" ON "_companies_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_companies_v_version_version_updated_at_idx" ON "_companies_v" USING btree ("version_updated_at");
  CREATE INDEX "_companies_v_version_version_created_at_idx" ON "_companies_v" USING btree ("version_created_at");
  CREATE INDEX "_companies_v_version_version__status_idx" ON "_companies_v" USING btree ("version__status");
  CREATE INDEX "_companies_v_created_at_idx" ON "_companies_v" USING btree ("created_at");
  CREATE INDEX "_companies_v_updated_at_idx" ON "_companies_v" USING btree ("updated_at");
  CREATE INDEX "_companies_v_latest_idx" ON "_companies_v" USING btree ("latest");
  CREATE INDEX "_companies_v_rels_order_idx" ON "_companies_v_rels" USING btree ("order");
  CREATE INDEX "_companies_v_rels_parent_idx" ON "_companies_v_rels" USING btree ("parent_id");
  CREATE INDEX "_companies_v_rels_path_idx" ON "_companies_v_rels" USING btree ("path");
  CREATE INDEX "_companies_v_rels_business_categories_id_idx" ON "_companies_v_rels" USING btree ("business_categories_id");
  CREATE UNIQUE INDEX "brands_slug_idx" ON "brands" USING btree ("slug");
  CREATE INDEX "brands_company_idx" ON "brands" USING btree ("company_id");
  CREATE INDEX "brands_logo_idx" ON "brands" USING btree ("logo_id");
  CREATE INDEX "brands_hero_media_idx" ON "brands" USING btree ("hero_media_id");
  CREATE INDEX "brands_seo_seo_og_image_idx" ON "brands" USING btree ("seo_og_image_id");
  CREATE INDEX "brands_updated_at_idx" ON "brands" USING btree ("updated_at");
  CREATE INDEX "brands_created_at_idx" ON "brands" USING btree ("created_at");
  CREATE INDEX "brands__status_idx" ON "brands" USING btree ("_status");
  CREATE INDEX "brands_rels_order_idx" ON "brands_rels" USING btree ("order");
  CREATE INDEX "brands_rels_parent_idx" ON "brands_rels" USING btree ("parent_id");
  CREATE INDEX "brands_rels_path_idx" ON "brands_rels" USING btree ("path");
  CREATE INDEX "brands_rels_business_categories_id_idx" ON "brands_rels" USING btree ("business_categories_id");
  CREATE INDEX "_brands_v_parent_idx" ON "_brands_v" USING btree ("parent_id");
  CREATE INDEX "_brands_v_version_version_slug_idx" ON "_brands_v" USING btree ("version_slug");
  CREATE INDEX "_brands_v_version_version_company_idx" ON "_brands_v" USING btree ("version_company_id");
  CREATE INDEX "_brands_v_version_version_logo_idx" ON "_brands_v" USING btree ("version_logo_id");
  CREATE INDEX "_brands_v_version_version_hero_media_idx" ON "_brands_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_brands_v_version_seo_version_seo_og_image_idx" ON "_brands_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_brands_v_version_version_updated_at_idx" ON "_brands_v" USING btree ("version_updated_at");
  CREATE INDEX "_brands_v_version_version_created_at_idx" ON "_brands_v" USING btree ("version_created_at");
  CREATE INDEX "_brands_v_version_version__status_idx" ON "_brands_v" USING btree ("version__status");
  CREATE INDEX "_brands_v_created_at_idx" ON "_brands_v" USING btree ("created_at");
  CREATE INDEX "_brands_v_updated_at_idx" ON "_brands_v" USING btree ("updated_at");
  CREATE INDEX "_brands_v_latest_idx" ON "_brands_v" USING btree ("latest");
  CREATE INDEX "_brands_v_rels_order_idx" ON "_brands_v_rels" USING btree ("order");
  CREATE INDEX "_brands_v_rels_parent_idx" ON "_brands_v_rels" USING btree ("parent_id");
  CREATE INDEX "_brands_v_rels_path_idx" ON "_brands_v_rels" USING btree ("path");
  CREATE INDEX "_brands_v_rels_business_categories_id_idx" ON "_brands_v_rels" USING btree ("business_categories_id");
  CREATE INDEX "solutions_methodology_order_idx" ON "solutions_methodology" USING btree ("_order");
  CREATE INDEX "solutions_methodology_parent_id_idx" ON "solutions_methodology" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "solutions_slug_idx" ON "solutions" USING btree ("slug");
  CREATE INDEX "solutions_seo_seo_og_image_idx" ON "solutions" USING btree ("seo_og_image_id");
  CREATE INDEX "solutions_updated_at_idx" ON "solutions" USING btree ("updated_at");
  CREATE INDEX "solutions_created_at_idx" ON "solutions" USING btree ("created_at");
  CREATE INDEX "solutions__status_idx" ON "solutions" USING btree ("_status");
  CREATE INDEX "solutions_rels_order_idx" ON "solutions_rels" USING btree ("order");
  CREATE INDEX "solutions_rels_parent_idx" ON "solutions_rels" USING btree ("parent_id");
  CREATE INDEX "solutions_rels_path_idx" ON "solutions_rels" USING btree ("path");
  CREATE INDEX "solutions_rels_services_id_idx" ON "solutions_rels" USING btree ("services_id");
  CREATE INDEX "_solutions_v_version_methodology_order_idx" ON "_solutions_v_version_methodology" USING btree ("_order");
  CREATE INDEX "_solutions_v_version_methodology_parent_id_idx" ON "_solutions_v_version_methodology" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_parent_idx" ON "_solutions_v" USING btree ("parent_id");
  CREATE INDEX "_solutions_v_version_version_slug_idx" ON "_solutions_v" USING btree ("version_slug");
  CREATE INDEX "_solutions_v_version_seo_version_seo_og_image_idx" ON "_solutions_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_solutions_v_version_version_updated_at_idx" ON "_solutions_v" USING btree ("version_updated_at");
  CREATE INDEX "_solutions_v_version_version_created_at_idx" ON "_solutions_v" USING btree ("version_created_at");
  CREATE INDEX "_solutions_v_version_version__status_idx" ON "_solutions_v" USING btree ("version__status");
  CREATE INDEX "_solutions_v_created_at_idx" ON "_solutions_v" USING btree ("created_at");
  CREATE INDEX "_solutions_v_updated_at_idx" ON "_solutions_v" USING btree ("updated_at");
  CREATE INDEX "_solutions_v_latest_idx" ON "_solutions_v" USING btree ("latest");
  CREATE INDEX "_solutions_v_rels_order_idx" ON "_solutions_v_rels" USING btree ("order");
  CREATE INDEX "_solutions_v_rels_parent_idx" ON "_solutions_v_rels" USING btree ("parent_id");
  CREATE INDEX "_solutions_v_rels_path_idx" ON "_solutions_v_rels" USING btree ("path");
  CREATE INDEX "_solutions_v_rels_services_id_idx" ON "_solutions_v_rels" USING btree ("services_id");
  ALTER TABLE "services" ADD CONSTRAINT "services_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_company_id_companies_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_business_categories_fk" FOREIGN KEY ("business_categories_id") REFERENCES "public"."business_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_company_id_companies_id_fk" FOREIGN KEY ("version_company_id") REFERENCES "public"."companies"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_brand_id_brands_id_fk" FOREIGN KEY ("version_brand_id") REFERENCES "public"."brands"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_business_categories_fk" FOREIGN KEY ("business_categories_id") REFERENCES "public"."business_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_business_categories_fk" FOREIGN KEY ("business_categories_id") REFERENCES "public"."business_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_companies_fk" FOREIGN KEY ("companies_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_solutions_fk" FOREIGN KEY ("solutions_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "services_seo_seo_og_image_idx" ON "services" USING btree ("seo_og_image_id");
  CREATE INDEX "services__status_idx" ON "services" USING btree ("_status");
  CREATE INDEX "projects_company_idx" ON "projects" USING btree ("company_id");
  CREATE INDEX "projects_brand_idx" ON "projects" USING btree ("brand_id");
  CREATE INDEX "projects_rels_business_categories_id_idx" ON "projects_rels" USING btree ("business_categories_id");
  CREATE INDEX "projects_rels_solutions_id_idx" ON "projects_rels" USING btree ("solutions_id");
  CREATE INDEX "_projects_v_version_version_company_idx" ON "_projects_v" USING btree ("version_company_id");
  CREATE INDEX "_projects_v_version_version_brand_idx" ON "_projects_v" USING btree ("version_brand_id");
  CREATE INDEX "_projects_v_rels_business_categories_id_idx" ON "_projects_v_rels" USING btree ("business_categories_id");
  CREATE INDEX "_projects_v_rels_solutions_id_idx" ON "_projects_v_rels" USING btree ("solutions_id");
  CREATE INDEX "payload_locked_documents_rels_business_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("business_categories_id");
  CREATE INDEX "payload_locked_documents_rels_companies_id_idx" ON "payload_locked_documents_rels" USING btree ("companies_id");
  CREATE INDEX "payload_locked_documents_rels_brands_id_idx" ON "payload_locked_documents_rels" USING btree ("brands_id");
  CREATE INDEX "payload_locked_documents_rels_solutions_id_idx" ON "payload_locked_documents_rels" USING btree ("solutions_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services_capabilities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v_version_capabilities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_services_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "business_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_business_categories_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "companies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "companies_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_companies_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_companies_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "brands" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "brands_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_brands_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_brands_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_methodology" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "solutions_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_version_methodology" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_solutions_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "services_capabilities" CASCADE;
  DROP TABLE "_services_v_version_capabilities" CASCADE;
  DROP TABLE "_services_v" CASCADE;
  DROP TABLE "business_categories" CASCADE;
  DROP TABLE "_business_categories_v" CASCADE;
  DROP TABLE "companies" CASCADE;
  DROP TABLE "companies_rels" CASCADE;
  DROP TABLE "_companies_v" CASCADE;
  DROP TABLE "_companies_v_rels" CASCADE;
  DROP TABLE "brands" CASCADE;
  DROP TABLE "brands_rels" CASCADE;
  DROP TABLE "_brands_v" CASCADE;
  DROP TABLE "_brands_v_rels" CASCADE;
  DROP TABLE "solutions_methodology" CASCADE;
  DROP TABLE "solutions" CASCADE;
  DROP TABLE "solutions_rels" CASCADE;
  DROP TABLE "_solutions_v_version_methodology" CASCADE;
  DROP TABLE "_solutions_v" CASCADE;
  DROP TABLE "_solutions_v_rels" CASCADE;
  ALTER TABLE "services" DROP CONSTRAINT "services_seo_og_image_id_media_id_fk";
  
  ALTER TABLE "projects" DROP CONSTRAINT "projects_company_id_companies_id_fk";
  
  ALTER TABLE "projects" DROP CONSTRAINT "projects_brand_id_brands_id_fk";
  
  ALTER TABLE "projects_rels" DROP CONSTRAINT "projects_rels_business_categories_fk";
  
  ALTER TABLE "projects_rels" DROP CONSTRAINT "projects_rels_solutions_fk";
  
  ALTER TABLE "_projects_v" DROP CONSTRAINT "_projects_v_version_company_id_companies_id_fk";
  
  ALTER TABLE "_projects_v" DROP CONSTRAINT "_projects_v_version_brand_id_brands_id_fk";
  
  ALTER TABLE "_projects_v_rels" DROP CONSTRAINT "_projects_v_rels_business_categories_fk";
  
  ALTER TABLE "_projects_v_rels" DROP CONSTRAINT "_projects_v_rels_solutions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_business_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_companies_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_brands_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_solutions_fk";
  
  DROP INDEX "services_seo_seo_og_image_idx";
  DROP INDEX "services__status_idx";
  DROP INDEX "projects_company_idx";
  DROP INDEX "projects_brand_idx";
  DROP INDEX "projects_rels_business_categories_id_idx";
  DROP INDEX "projects_rels_solutions_id_idx";
  DROP INDEX "_projects_v_version_version_company_idx";
  DROP INDEX "_projects_v_version_version_brand_idx";
  DROP INDEX "_projects_v_rels_business_categories_id_idx";
  DROP INDEX "_projects_v_rels_solutions_id_idx";
  DROP INDEX "payload_locked_documents_rels_business_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_companies_id_idx";
  DROP INDEX "payload_locked_documents_rels_brands_id_idx";
  DROP INDEX "payload_locked_documents_rels_solutions_id_idx";
  ALTER TABLE "services" ALTER COLUMN "label" SET NOT NULL;
  ALTER TABLE "services" ALTER COLUMN "slug" SET NOT NULL;
  ALTER TABLE "services" DROP COLUMN "hero_heading";
  ALTER TABLE "services" DROP COLUMN "hero_short_summary";
  ALTER TABLE "services" DROP COLUMN "introduction";
  ALTER TABLE "services" DROP COLUMN "approach";
  ALTER TABLE "services" DROP COLUMN "seo_meta_title";
  ALTER TABLE "services" DROP COLUMN "seo_meta_description";
  ALTER TABLE "services" DROP COLUMN "seo_og_image_id";
  ALTER TABLE "services" DROP COLUMN "seo_noindex";
  ALTER TABLE "services" DROP COLUMN "_status";
  ALTER TABLE "projects" DROP COLUMN "project_kind";
  ALTER TABLE "projects" DROP COLUMN "company_id";
  ALTER TABLE "projects" DROP COLUMN "brand_id";
  ALTER TABLE "projects_rels" DROP COLUMN "business_categories_id";
  ALTER TABLE "projects_rels" DROP COLUMN "solutions_id";
  ALTER TABLE "_projects_v" DROP COLUMN "version_project_kind";
  ALTER TABLE "_projects_v" DROP COLUMN "version_company_id";
  ALTER TABLE "_projects_v" DROP COLUMN "version_brand_id";
  ALTER TABLE "_projects_v_rels" DROP COLUMN "business_categories_id";
  ALTER TABLE "_projects_v_rels" DROP COLUMN "solutions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "business_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "companies_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "brands_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "solutions_id";
  DROP TYPE "public"."enum_services_status";
  DROP TYPE "public"."enum__services_v_version_status";
  DROP TYPE "public"."enum_projects_project_kind";
  DROP TYPE "public"."enum__projects_v_version_project_kind";
  DROP TYPE "public"."enum_business_categories_status";
  DROP TYPE "public"."enum__business_categories_v_version_status";
  DROP TYPE "public"."enum_companies_status";
  DROP TYPE "public"."enum__companies_v_version_status";
  DROP TYPE "public"."enum_brands_status";
  DROP TYPE "public"."enum__brands_v_version_status";
  DROP TYPE "public"."enum_solutions_solution_type";
  DROP TYPE "public"."enum_solutions_status";
  DROP TYPE "public"."enum__solutions_v_version_solution_type";
  DROP TYPE "public"."enum__solutions_v_version_status";`)
}
