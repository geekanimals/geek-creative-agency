import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_services_search_strategy_intent" AS ENUM('informational', 'commercial', 'branded', 'transactional', 'mixed');
  CREATE TYPE "public"."enum__services_v_version_search_strategy_intent" AS ENUM('informational', 'commercial', 'branded', 'transactional', 'mixed');
  CREATE TYPE "public"."enum_projects_press_coverage_source_type" AS ENUM('independent-editorial', 'official-brand', 'partner-ngo', 'campaign-archive', 'trade-publication', 'other');
  CREATE TYPE "public"."enum_projects_search_strategy_intent" AS ENUM('informational', 'commercial', 'branded', 'transactional', 'mixed');
  CREATE TYPE "public"."enum__projects_v_version_press_coverage_source_type" AS ENUM('independent-editorial', 'official-brand', 'partner-ngo', 'campaign-archive', 'trade-publication', 'other');
  CREATE TYPE "public"."enum__projects_v_version_search_strategy_intent" AS ENUM('informational', 'commercial', 'branded', 'transactional', 'mixed');
  CREATE TYPE "public"."enum_business_categories_search_strategy_intent" AS ENUM('informational', 'commercial', 'branded', 'transactional', 'mixed');
  CREATE TYPE "public"."enum__business_categories_v_version_search_strategy_intent" AS ENUM('informational', 'commercial', 'branded', 'transactional', 'mixed');
  CREATE TYPE "public"."enum_companies_press_coverage_source_type" AS ENUM('independent-editorial', 'official-brand', 'partner-ngo', 'campaign-archive', 'trade-publication', 'other');
  CREATE TYPE "public"."enum_companies_search_strategy_intent" AS ENUM('informational', 'commercial', 'branded', 'transactional', 'mixed');
  CREATE TYPE "public"."enum__companies_v_version_press_coverage_source_type" AS ENUM('independent-editorial', 'official-brand', 'partner-ngo', 'campaign-archive', 'trade-publication', 'other');
  CREATE TYPE "public"."enum__companies_v_version_search_strategy_intent" AS ENUM('informational', 'commercial', 'branded', 'transactional', 'mixed');
  CREATE TYPE "public"."enum_brands_press_coverage_source_type" AS ENUM('independent-editorial', 'official-brand', 'partner-ngo', 'campaign-archive', 'trade-publication', 'other');
  CREATE TYPE "public"."enum_brands_search_strategy_intent" AS ENUM('informational', 'commercial', 'branded', 'transactional', 'mixed');
  CREATE TYPE "public"."enum__brands_v_version_press_coverage_source_type" AS ENUM('independent-editorial', 'official-brand', 'partner-ngo', 'campaign-archive', 'trade-publication', 'other');
  CREATE TYPE "public"."enum__brands_v_version_search_strategy_intent" AS ENUM('informational', 'commercial', 'branded', 'transactional', 'mixed');
  CREATE TYPE "public"."enum_solutions_press_coverage_source_type" AS ENUM('independent-editorial', 'official-brand', 'partner-ngo', 'campaign-archive', 'trade-publication', 'other');
  CREATE TYPE "public"."enum_solutions_search_strategy_intent" AS ENUM('informational', 'commercial', 'branded', 'transactional', 'mixed');
  CREATE TYPE "public"."enum__solutions_v_version_press_coverage_source_type" AS ENUM('independent-editorial', 'official-brand', 'partner-ngo', 'campaign-archive', 'trade-publication', 'other');
  CREATE TYPE "public"."enum__solutions_v_version_search_strategy_intent" AS ENUM('informational', 'commercial', 'branded', 'transactional', 'mixed');
  CREATE TABLE "services_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "services_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_services_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_services_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "projects_press_coverage" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"publisher" varchar,
  	"publication_date" timestamp(3) with time zone,
  	"headline" varchar,
  	"url" varchar,
  	"archive_url" varchar,
  	"source_type" "enum_projects_press_coverage_source_type" DEFAULT 'independent-editorial',
  	"geek_mentioned" boolean,
  	"featured" boolean,
  	"validation_note" varchar,
  	"thumbnail_id" integer
  );
  
  CREATE TABLE "projects_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"award_body" varchar,
  	"program_name" varchar,
  	"category" varchar,
  	"result" varchar,
  	"year" numeric,
  	"url" varchar,
  	"geek_credited" boolean,
  	"validation_note" varchar
  );
  
  CREATE TABLE "projects_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "projects_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_projects_v_version_press_coverage" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"publisher" varchar,
  	"publication_date" timestamp(3) with time zone,
  	"headline" varchar,
  	"url" varchar,
  	"archive_url" varchar,
  	"source_type" "enum__projects_v_version_press_coverage_source_type" DEFAULT 'independent-editorial',
  	"geek_mentioned" boolean,
  	"featured" boolean,
  	"validation_note" varchar,
  	"thumbnail_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"award_body" varchar,
  	"program_name" varchar,
  	"category" varchar,
  	"result" varchar,
  	"year" numeric,
  	"url" varchar,
  	"geek_credited" boolean,
  	"validation_note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "business_categories_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "business_categories_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_business_categories_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_business_categories_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "companies_press_coverage" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"publisher" varchar,
  	"publication_date" timestamp(3) with time zone,
  	"headline" varchar,
  	"url" varchar,
  	"archive_url" varchar,
  	"source_type" "enum_companies_press_coverage_source_type" DEFAULT 'independent-editorial',
  	"geek_mentioned" boolean,
  	"featured" boolean,
  	"validation_note" varchar,
  	"thumbnail_id" integer
  );
  
  CREATE TABLE "companies_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"award_body" varchar,
  	"program_name" varchar,
  	"category" varchar,
  	"result" varchar,
  	"year" numeric,
  	"url" varchar,
  	"geek_credited" boolean,
  	"validation_note" varchar
  );
  
  CREATE TABLE "companies_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "companies_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_companies_v_version_press_coverage" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"publisher" varchar,
  	"publication_date" timestamp(3) with time zone,
  	"headline" varchar,
  	"url" varchar,
  	"archive_url" varchar,
  	"source_type" "enum__companies_v_version_press_coverage_source_type" DEFAULT 'independent-editorial',
  	"geek_mentioned" boolean,
  	"featured" boolean,
  	"validation_note" varchar,
  	"thumbnail_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_companies_v_version_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"award_body" varchar,
  	"program_name" varchar,
  	"category" varchar,
  	"result" varchar,
  	"year" numeric,
  	"url" varchar,
  	"geek_credited" boolean,
  	"validation_note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_companies_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_companies_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "brands_press_coverage" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"publisher" varchar,
  	"publication_date" timestamp(3) with time zone,
  	"headline" varchar,
  	"url" varchar,
  	"archive_url" varchar,
  	"source_type" "enum_brands_press_coverage_source_type" DEFAULT 'independent-editorial',
  	"geek_mentioned" boolean,
  	"featured" boolean,
  	"validation_note" varchar,
  	"thumbnail_id" integer
  );
  
  CREATE TABLE "brands_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"award_body" varchar,
  	"program_name" varchar,
  	"category" varchar,
  	"result" varchar,
  	"year" numeric,
  	"url" varchar,
  	"geek_credited" boolean,
  	"validation_note" varchar
  );
  
  CREATE TABLE "brands_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "brands_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_brands_v_version_press_coverage" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"publisher" varchar,
  	"publication_date" timestamp(3) with time zone,
  	"headline" varchar,
  	"url" varchar,
  	"archive_url" varchar,
  	"source_type" "enum__brands_v_version_press_coverage_source_type" DEFAULT 'independent-editorial',
  	"geek_mentioned" boolean,
  	"featured" boolean,
  	"validation_note" varchar,
  	"thumbnail_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_brands_v_version_awards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"award_body" varchar,
  	"program_name" varchar,
  	"category" varchar,
  	"result" varchar,
  	"year" numeric,
  	"url" varchar,
  	"geek_credited" boolean,
  	"validation_note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_brands_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_brands_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "solutions_press_coverage" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"publisher" varchar,
  	"publication_date" timestamp(3) with time zone,
  	"headline" varchar,
  	"url" varchar,
  	"archive_url" varchar,
  	"source_type" "enum_solutions_press_coverage_source_type" DEFAULT 'independent-editorial',
  	"geek_mentioned" boolean,
  	"featured" boolean,
  	"validation_note" varchar,
  	"thumbnail_id" integer
  );
  
  CREATE TABLE "solutions_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "solutions_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_solutions_v_version_press_coverage" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"publisher" varchar,
  	"publication_date" timestamp(3) with time zone,
  	"headline" varchar,
  	"url" varchar,
  	"archive_url" varchar,
  	"source_type" "enum__solutions_v_version_press_coverage_source_type" DEFAULT 'independent-editorial',
  	"geek_mentioned" boolean,
  	"featured" boolean,
  	"validation_note" varchar,
  	"thumbnail_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_version_faqs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_solutions_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  ALTER TABLE "services" ADD COLUMN "search_strategy_primary_keyword" varchar;
  ALTER TABLE "services" ADD COLUMN "search_strategy_search_intent" "enum_services_search_strategy_intent";
  ALTER TABLE "services" ADD COLUMN "search_strategy_target_market" varchar;
  ALTER TABLE "services" ADD COLUMN "search_strategy_keyword_research_date" timestamp(3) with time zone;
  ALTER TABLE "services" ADD COLUMN "search_strategy_search_notes" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_search_strategy_primary_keyword" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_search_strategy_search_intent" "enum__services_v_version_search_strategy_intent";
  ALTER TABLE "_services_v" ADD COLUMN "version_search_strategy_target_market" varchar;
  ALTER TABLE "_services_v" ADD COLUMN "version_search_strategy_keyword_research_date" timestamp(3) with time zone;
  ALTER TABLE "_services_v" ADD COLUMN "version_search_strategy_search_notes" varchar;
  ALTER TABLE "projects" ADD COLUMN "search_strategy_primary_keyword" varchar;
  ALTER TABLE "projects" ADD COLUMN "search_strategy_search_intent" "enum_projects_search_strategy_intent";
  ALTER TABLE "projects" ADD COLUMN "search_strategy_target_market" varchar;
  ALTER TABLE "projects" ADD COLUMN "search_strategy_keyword_research_date" timestamp(3) with time zone;
  ALTER TABLE "projects" ADD COLUMN "search_strategy_search_notes" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_search_strategy_primary_keyword" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_search_strategy_search_intent" "enum__projects_v_version_search_strategy_intent";
  ALTER TABLE "_projects_v" ADD COLUMN "version_search_strategy_target_market" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_search_strategy_keyword_research_date" timestamp(3) with time zone;
  ALTER TABLE "_projects_v" ADD COLUMN "version_search_strategy_search_notes" varchar;
  ALTER TABLE "business_categories" ADD COLUMN "search_strategy_primary_keyword" varchar;
  ALTER TABLE "business_categories" ADD COLUMN "search_strategy_search_intent" "enum_business_categories_search_strategy_intent";
  ALTER TABLE "business_categories" ADD COLUMN "search_strategy_target_market" varchar;
  ALTER TABLE "business_categories" ADD COLUMN "search_strategy_keyword_research_date" timestamp(3) with time zone;
  ALTER TABLE "business_categories" ADD COLUMN "search_strategy_search_notes" varchar;
  ALTER TABLE "_business_categories_v" ADD COLUMN "version_search_strategy_primary_keyword" varchar;
  ALTER TABLE "_business_categories_v" ADD COLUMN "version_search_strategy_search_intent" "enum__business_categories_v_version_search_strategy_intent";
  ALTER TABLE "_business_categories_v" ADD COLUMN "version_search_strategy_target_market" varchar;
  ALTER TABLE "_business_categories_v" ADD COLUMN "version_search_strategy_keyword_research_date" timestamp(3) with time zone;
  ALTER TABLE "_business_categories_v" ADD COLUMN "version_search_strategy_search_notes" varchar;
  ALTER TABLE "companies" ADD COLUMN "search_strategy_primary_keyword" varchar;
  ALTER TABLE "companies" ADD COLUMN "search_strategy_search_intent" "enum_companies_search_strategy_intent";
  ALTER TABLE "companies" ADD COLUMN "search_strategy_target_market" varchar;
  ALTER TABLE "companies" ADD COLUMN "search_strategy_keyword_research_date" timestamp(3) with time zone;
  ALTER TABLE "companies" ADD COLUMN "search_strategy_search_notes" varchar;
  ALTER TABLE "_companies_v" ADD COLUMN "version_search_strategy_primary_keyword" varchar;
  ALTER TABLE "_companies_v" ADD COLUMN "version_search_strategy_search_intent" "enum__companies_v_version_search_strategy_intent";
  ALTER TABLE "_companies_v" ADD COLUMN "version_search_strategy_target_market" varchar;
  ALTER TABLE "_companies_v" ADD COLUMN "version_search_strategy_keyword_research_date" timestamp(3) with time zone;
  ALTER TABLE "_companies_v" ADD COLUMN "version_search_strategy_search_notes" varchar;
  ALTER TABLE "brands" ADD COLUMN "search_strategy_primary_keyword" varchar;
  ALTER TABLE "brands" ADD COLUMN "search_strategy_search_intent" "enum_brands_search_strategy_intent";
  ALTER TABLE "brands" ADD COLUMN "search_strategy_target_market" varchar;
  ALTER TABLE "brands" ADD COLUMN "search_strategy_keyword_research_date" timestamp(3) with time zone;
  ALTER TABLE "brands" ADD COLUMN "search_strategy_search_notes" varchar;
  ALTER TABLE "_brands_v" ADD COLUMN "version_search_strategy_primary_keyword" varchar;
  ALTER TABLE "_brands_v" ADD COLUMN "version_search_strategy_search_intent" "enum__brands_v_version_search_strategy_intent";
  ALTER TABLE "_brands_v" ADD COLUMN "version_search_strategy_target_market" varchar;
  ALTER TABLE "_brands_v" ADD COLUMN "version_search_strategy_keyword_research_date" timestamp(3) with time zone;
  ALTER TABLE "_brands_v" ADD COLUMN "version_search_strategy_search_notes" varchar;
  ALTER TABLE "solutions" ADD COLUMN "search_strategy_primary_keyword" varchar;
  ALTER TABLE "solutions" ADD COLUMN "search_strategy_search_intent" "enum_solutions_search_strategy_intent";
  ALTER TABLE "solutions" ADD COLUMN "search_strategy_target_market" varchar;
  ALTER TABLE "solutions" ADD COLUMN "search_strategy_keyword_research_date" timestamp(3) with time zone;
  ALTER TABLE "solutions" ADD COLUMN "search_strategy_search_notes" varchar;
  ALTER TABLE "_solutions_v" ADD COLUMN "version_search_strategy_primary_keyword" varchar;
  ALTER TABLE "_solutions_v" ADD COLUMN "version_search_strategy_search_intent" "enum__solutions_v_version_search_strategy_intent";
  ALTER TABLE "_solutions_v" ADD COLUMN "version_search_strategy_target_market" varchar;
  ALTER TABLE "_solutions_v" ADD COLUMN "version_search_strategy_keyword_research_date" timestamp(3) with time zone;
  ALTER TABLE "_solutions_v" ADD COLUMN "version_search_strategy_search_notes" varchar;
  ALTER TABLE "services_faqs" ADD CONSTRAINT "services_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_texts" ADD CONSTRAINT "services_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_version_faqs" ADD CONSTRAINT "_services_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_services_v_texts" ADD CONSTRAINT "_services_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_services_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_press_coverage" ADD CONSTRAINT "projects_press_coverage_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_press_coverage" ADD CONSTRAINT "projects_press_coverage_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_awards" ADD CONSTRAINT "projects_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_faqs" ADD CONSTRAINT "projects_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_texts" ADD CONSTRAINT "projects_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_press_coverage" ADD CONSTRAINT "_projects_v_version_press_coverage_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_version_press_coverage" ADD CONSTRAINT "_projects_v_version_press_coverage_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_awards" ADD CONSTRAINT "_projects_v_version_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_faqs" ADD CONSTRAINT "_projects_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_texts" ADD CONSTRAINT "_projects_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "business_categories_faqs" ADD CONSTRAINT "business_categories_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."business_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "business_categories_texts" ADD CONSTRAINT "business_categories_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."business_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_business_categories_v_version_faqs" ADD CONSTRAINT "_business_categories_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_business_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_business_categories_v_texts" ADD CONSTRAINT "_business_categories_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_business_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "companies_press_coverage" ADD CONSTRAINT "companies_press_coverage_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "companies_press_coverage" ADD CONSTRAINT "companies_press_coverage_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "companies_awards" ADD CONSTRAINT "companies_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "companies_faqs" ADD CONSTRAINT "companies_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "companies_texts" ADD CONSTRAINT "companies_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."companies"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_companies_v_version_press_coverage" ADD CONSTRAINT "_companies_v_version_press_coverage_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_companies_v_version_press_coverage" ADD CONSTRAINT "_companies_v_version_press_coverage_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_companies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_companies_v_version_awards" ADD CONSTRAINT "_companies_v_version_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_companies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_companies_v_version_faqs" ADD CONSTRAINT "_companies_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_companies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_companies_v_texts" ADD CONSTRAINT "_companies_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_companies_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_press_coverage" ADD CONSTRAINT "brands_press_coverage_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands_press_coverage" ADD CONSTRAINT "brands_press_coverage_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_awards" ADD CONSTRAINT "brands_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_faqs" ADD CONSTRAINT "brands_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "brands_texts" ADD CONSTRAINT "brands_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_brands_v_version_press_coverage" ADD CONSTRAINT "_brands_v_version_press_coverage_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_brands_v_version_press_coverage" ADD CONSTRAINT "_brands_v_version_press_coverage_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_brands_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_brands_v_version_awards" ADD CONSTRAINT "_brands_v_version_awards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_brands_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_brands_v_version_faqs" ADD CONSTRAINT "_brands_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_brands_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_brands_v_texts" ADD CONSTRAINT "_brands_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_brands_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_press_coverage" ADD CONSTRAINT "solutions_press_coverage_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "solutions_press_coverage" ADD CONSTRAINT "solutions_press_coverage_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_faqs" ADD CONSTRAINT "solutions_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "solutions_texts" ADD CONSTRAINT "solutions_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_version_press_coverage" ADD CONSTRAINT "_solutions_v_version_press_coverage_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_solutions_v_version_press_coverage" ADD CONSTRAINT "_solutions_v_version_press_coverage_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_version_faqs" ADD CONSTRAINT "_solutions_v_version_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_solutions_v_texts" ADD CONSTRAINT "_solutions_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_solutions_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "services_faqs_order_idx" ON "services_faqs" USING btree ("_order");
  CREATE INDEX "services_faqs_parent_id_idx" ON "services_faqs" USING btree ("_parent_id");
  CREATE INDEX "services_texts_order_parent" ON "services_texts" USING btree ("order","parent_id");
  CREATE INDEX "_services_v_version_faqs_order_idx" ON "_services_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_services_v_version_faqs_parent_id_idx" ON "_services_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_services_v_texts_order_parent" ON "_services_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "projects_press_coverage_order_idx" ON "projects_press_coverage" USING btree ("_order");
  CREATE INDEX "projects_press_coverage_parent_id_idx" ON "projects_press_coverage" USING btree ("_parent_id");
  CREATE INDEX "projects_press_coverage_thumbnail_idx" ON "projects_press_coverage" USING btree ("thumbnail_id");
  CREATE INDEX "projects_awards_order_idx" ON "projects_awards" USING btree ("_order");
  CREATE INDEX "projects_awards_parent_id_idx" ON "projects_awards" USING btree ("_parent_id");
  CREATE INDEX "projects_faqs_order_idx" ON "projects_faqs" USING btree ("_order");
  CREATE INDEX "projects_faqs_parent_id_idx" ON "projects_faqs" USING btree ("_parent_id");
  CREATE INDEX "projects_texts_order_parent" ON "projects_texts" USING btree ("order","parent_id");
  CREATE INDEX "_projects_v_version_press_coverage_order_idx" ON "_projects_v_version_press_coverage" USING btree ("_order");
  CREATE INDEX "_projects_v_version_press_coverage_parent_id_idx" ON "_projects_v_version_press_coverage" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_press_coverage_thumbnail_idx" ON "_projects_v_version_press_coverage" USING btree ("thumbnail_id");
  CREATE INDEX "_projects_v_version_awards_order_idx" ON "_projects_v_version_awards" USING btree ("_order");
  CREATE INDEX "_projects_v_version_awards_parent_id_idx" ON "_projects_v_version_awards" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_version_faqs_order_idx" ON "_projects_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_projects_v_version_faqs_parent_id_idx" ON "_projects_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_texts_order_parent" ON "_projects_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "business_categories_faqs_order_idx" ON "business_categories_faqs" USING btree ("_order");
  CREATE INDEX "business_categories_faqs_parent_id_idx" ON "business_categories_faqs" USING btree ("_parent_id");
  CREATE INDEX "business_categories_texts_order_parent" ON "business_categories_texts" USING btree ("order","parent_id");
  CREATE INDEX "_business_categories_v_version_faqs_order_idx" ON "_business_categories_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_business_categories_v_version_faqs_parent_id_idx" ON "_business_categories_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_business_categories_v_texts_order_parent" ON "_business_categories_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "companies_press_coverage_order_idx" ON "companies_press_coverage" USING btree ("_order");
  CREATE INDEX "companies_press_coverage_parent_id_idx" ON "companies_press_coverage" USING btree ("_parent_id");
  CREATE INDEX "companies_press_coverage_thumbnail_idx" ON "companies_press_coverage" USING btree ("thumbnail_id");
  CREATE INDEX "companies_awards_order_idx" ON "companies_awards" USING btree ("_order");
  CREATE INDEX "companies_awards_parent_id_idx" ON "companies_awards" USING btree ("_parent_id");
  CREATE INDEX "companies_faqs_order_idx" ON "companies_faqs" USING btree ("_order");
  CREATE INDEX "companies_faqs_parent_id_idx" ON "companies_faqs" USING btree ("_parent_id");
  CREATE INDEX "companies_texts_order_parent" ON "companies_texts" USING btree ("order","parent_id");
  CREATE INDEX "_companies_v_version_press_coverage_order_idx" ON "_companies_v_version_press_coverage" USING btree ("_order");
  CREATE INDEX "_companies_v_version_press_coverage_parent_id_idx" ON "_companies_v_version_press_coverage" USING btree ("_parent_id");
  CREATE INDEX "_companies_v_version_press_coverage_thumbnail_idx" ON "_companies_v_version_press_coverage" USING btree ("thumbnail_id");
  CREATE INDEX "_companies_v_version_awards_order_idx" ON "_companies_v_version_awards" USING btree ("_order");
  CREATE INDEX "_companies_v_version_awards_parent_id_idx" ON "_companies_v_version_awards" USING btree ("_parent_id");
  CREATE INDEX "_companies_v_version_faqs_order_idx" ON "_companies_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_companies_v_version_faqs_parent_id_idx" ON "_companies_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_companies_v_texts_order_parent" ON "_companies_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "brands_press_coverage_order_idx" ON "brands_press_coverage" USING btree ("_order");
  CREATE INDEX "brands_press_coverage_parent_id_idx" ON "brands_press_coverage" USING btree ("_parent_id");
  CREATE INDEX "brands_press_coverage_thumbnail_idx" ON "brands_press_coverage" USING btree ("thumbnail_id");
  CREATE INDEX "brands_awards_order_idx" ON "brands_awards" USING btree ("_order");
  CREATE INDEX "brands_awards_parent_id_idx" ON "brands_awards" USING btree ("_parent_id");
  CREATE INDEX "brands_faqs_order_idx" ON "brands_faqs" USING btree ("_order");
  CREATE INDEX "brands_faqs_parent_id_idx" ON "brands_faqs" USING btree ("_parent_id");
  CREATE INDEX "brands_texts_order_parent" ON "brands_texts" USING btree ("order","parent_id");
  CREATE INDEX "_brands_v_version_press_coverage_order_idx" ON "_brands_v_version_press_coverage" USING btree ("_order");
  CREATE INDEX "_brands_v_version_press_coverage_parent_id_idx" ON "_brands_v_version_press_coverage" USING btree ("_parent_id");
  CREATE INDEX "_brands_v_version_press_coverage_thumbnail_idx" ON "_brands_v_version_press_coverage" USING btree ("thumbnail_id");
  CREATE INDEX "_brands_v_version_awards_order_idx" ON "_brands_v_version_awards" USING btree ("_order");
  CREATE INDEX "_brands_v_version_awards_parent_id_idx" ON "_brands_v_version_awards" USING btree ("_parent_id");
  CREATE INDEX "_brands_v_version_faqs_order_idx" ON "_brands_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_brands_v_version_faqs_parent_id_idx" ON "_brands_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_brands_v_texts_order_parent" ON "_brands_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "solutions_press_coverage_order_idx" ON "solutions_press_coverage" USING btree ("_order");
  CREATE INDEX "solutions_press_coverage_parent_id_idx" ON "solutions_press_coverage" USING btree ("_parent_id");
  CREATE INDEX "solutions_press_coverage_thumbnail_idx" ON "solutions_press_coverage" USING btree ("thumbnail_id");
  CREATE INDEX "solutions_faqs_order_idx" ON "solutions_faqs" USING btree ("_order");
  CREATE INDEX "solutions_faqs_parent_id_idx" ON "solutions_faqs" USING btree ("_parent_id");
  CREATE INDEX "solutions_texts_order_parent" ON "solutions_texts" USING btree ("order","parent_id");
  CREATE INDEX "_solutions_v_version_press_coverage_order_idx" ON "_solutions_v_version_press_coverage" USING btree ("_order");
  CREATE INDEX "_solutions_v_version_press_coverage_parent_id_idx" ON "_solutions_v_version_press_coverage" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_version_press_coverage_thumbnail_idx" ON "_solutions_v_version_press_coverage" USING btree ("thumbnail_id");
  CREATE INDEX "_solutions_v_version_faqs_order_idx" ON "_solutions_v_version_faqs" USING btree ("_order");
  CREATE INDEX "_solutions_v_version_faqs_parent_id_idx" ON "_solutions_v_version_faqs" USING btree ("_parent_id");
  CREATE INDEX "_solutions_v_texts_order_parent" ON "_solutions_v_texts" USING btree ("order","parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "services_faqs" CASCADE;
  DROP TABLE "services_texts" CASCADE;
  DROP TABLE "_services_v_version_faqs" CASCADE;
  DROP TABLE "_services_v_texts" CASCADE;
  DROP TABLE "projects_press_coverage" CASCADE;
  DROP TABLE "projects_awards" CASCADE;
  DROP TABLE "projects_faqs" CASCADE;
  DROP TABLE "projects_texts" CASCADE;
  DROP TABLE "_projects_v_version_press_coverage" CASCADE;
  DROP TABLE "_projects_v_version_awards" CASCADE;
  DROP TABLE "_projects_v_version_faqs" CASCADE;
  DROP TABLE "_projects_v_texts" CASCADE;
  DROP TABLE "business_categories_faqs" CASCADE;
  DROP TABLE "business_categories_texts" CASCADE;
  DROP TABLE "_business_categories_v_version_faqs" CASCADE;
  DROP TABLE "_business_categories_v_texts" CASCADE;
  DROP TABLE "companies_press_coverage" CASCADE;
  DROP TABLE "companies_awards" CASCADE;
  DROP TABLE "companies_faqs" CASCADE;
  DROP TABLE "companies_texts" CASCADE;
  DROP TABLE "_companies_v_version_press_coverage" CASCADE;
  DROP TABLE "_companies_v_version_awards" CASCADE;
  DROP TABLE "_companies_v_version_faqs" CASCADE;
  DROP TABLE "_companies_v_texts" CASCADE;
  DROP TABLE "brands_press_coverage" CASCADE;
  DROP TABLE "brands_awards" CASCADE;
  DROP TABLE "brands_faqs" CASCADE;
  DROP TABLE "brands_texts" CASCADE;
  DROP TABLE "_brands_v_version_press_coverage" CASCADE;
  DROP TABLE "_brands_v_version_awards" CASCADE;
  DROP TABLE "_brands_v_version_faqs" CASCADE;
  DROP TABLE "_brands_v_texts" CASCADE;
  DROP TABLE "solutions_press_coverage" CASCADE;
  DROP TABLE "solutions_faqs" CASCADE;
  DROP TABLE "solutions_texts" CASCADE;
  DROP TABLE "_solutions_v_version_press_coverage" CASCADE;
  DROP TABLE "_solutions_v_version_faqs" CASCADE;
  DROP TABLE "_solutions_v_texts" CASCADE;
  ALTER TABLE "services" DROP COLUMN "search_strategy_primary_keyword";
  ALTER TABLE "services" DROP COLUMN "search_strategy_search_intent";
  ALTER TABLE "services" DROP COLUMN "search_strategy_target_market";
  ALTER TABLE "services" DROP COLUMN "search_strategy_keyword_research_date";
  ALTER TABLE "services" DROP COLUMN "search_strategy_search_notes";
  ALTER TABLE "_services_v" DROP COLUMN "version_search_strategy_primary_keyword";
  ALTER TABLE "_services_v" DROP COLUMN "version_search_strategy_search_intent";
  ALTER TABLE "_services_v" DROP COLUMN "version_search_strategy_target_market";
  ALTER TABLE "_services_v" DROP COLUMN "version_search_strategy_keyword_research_date";
  ALTER TABLE "_services_v" DROP COLUMN "version_search_strategy_search_notes";
  ALTER TABLE "projects" DROP COLUMN "search_strategy_primary_keyword";
  ALTER TABLE "projects" DROP COLUMN "search_strategy_search_intent";
  ALTER TABLE "projects" DROP COLUMN "search_strategy_target_market";
  ALTER TABLE "projects" DROP COLUMN "search_strategy_keyword_research_date";
  ALTER TABLE "projects" DROP COLUMN "search_strategy_search_notes";
  ALTER TABLE "_projects_v" DROP COLUMN "version_search_strategy_primary_keyword";
  ALTER TABLE "_projects_v" DROP COLUMN "version_search_strategy_search_intent";
  ALTER TABLE "_projects_v" DROP COLUMN "version_search_strategy_target_market";
  ALTER TABLE "_projects_v" DROP COLUMN "version_search_strategy_keyword_research_date";
  ALTER TABLE "_projects_v" DROP COLUMN "version_search_strategy_search_notes";
  ALTER TABLE "business_categories" DROP COLUMN "search_strategy_primary_keyword";
  ALTER TABLE "business_categories" DROP COLUMN "search_strategy_search_intent";
  ALTER TABLE "business_categories" DROP COLUMN "search_strategy_target_market";
  ALTER TABLE "business_categories" DROP COLUMN "search_strategy_keyword_research_date";
  ALTER TABLE "business_categories" DROP COLUMN "search_strategy_search_notes";
  ALTER TABLE "_business_categories_v" DROP COLUMN "version_search_strategy_primary_keyword";
  ALTER TABLE "_business_categories_v" DROP COLUMN "version_search_strategy_search_intent";
  ALTER TABLE "_business_categories_v" DROP COLUMN "version_search_strategy_target_market";
  ALTER TABLE "_business_categories_v" DROP COLUMN "version_search_strategy_keyword_research_date";
  ALTER TABLE "_business_categories_v" DROP COLUMN "version_search_strategy_search_notes";
  ALTER TABLE "companies" DROP COLUMN "search_strategy_primary_keyword";
  ALTER TABLE "companies" DROP COLUMN "search_strategy_search_intent";
  ALTER TABLE "companies" DROP COLUMN "search_strategy_target_market";
  ALTER TABLE "companies" DROP COLUMN "search_strategy_keyword_research_date";
  ALTER TABLE "companies" DROP COLUMN "search_strategy_search_notes";
  ALTER TABLE "_companies_v" DROP COLUMN "version_search_strategy_primary_keyword";
  ALTER TABLE "_companies_v" DROP COLUMN "version_search_strategy_search_intent";
  ALTER TABLE "_companies_v" DROP COLUMN "version_search_strategy_target_market";
  ALTER TABLE "_companies_v" DROP COLUMN "version_search_strategy_keyword_research_date";
  ALTER TABLE "_companies_v" DROP COLUMN "version_search_strategy_search_notes";
  ALTER TABLE "brands" DROP COLUMN "search_strategy_primary_keyword";
  ALTER TABLE "brands" DROP COLUMN "search_strategy_search_intent";
  ALTER TABLE "brands" DROP COLUMN "search_strategy_target_market";
  ALTER TABLE "brands" DROP COLUMN "search_strategy_keyword_research_date";
  ALTER TABLE "brands" DROP COLUMN "search_strategy_search_notes";
  ALTER TABLE "_brands_v" DROP COLUMN "version_search_strategy_primary_keyword";
  ALTER TABLE "_brands_v" DROP COLUMN "version_search_strategy_search_intent";
  ALTER TABLE "_brands_v" DROP COLUMN "version_search_strategy_target_market";
  ALTER TABLE "_brands_v" DROP COLUMN "version_search_strategy_keyword_research_date";
  ALTER TABLE "_brands_v" DROP COLUMN "version_search_strategy_search_notes";
  ALTER TABLE "solutions" DROP COLUMN "search_strategy_primary_keyword";
  ALTER TABLE "solutions" DROP COLUMN "search_strategy_search_intent";
  ALTER TABLE "solutions" DROP COLUMN "search_strategy_target_market";
  ALTER TABLE "solutions" DROP COLUMN "search_strategy_keyword_research_date";
  ALTER TABLE "solutions" DROP COLUMN "search_strategy_search_notes";
  ALTER TABLE "_solutions_v" DROP COLUMN "version_search_strategy_primary_keyword";
  ALTER TABLE "_solutions_v" DROP COLUMN "version_search_strategy_search_intent";
  ALTER TABLE "_solutions_v" DROP COLUMN "version_search_strategy_target_market";
  ALTER TABLE "_solutions_v" DROP COLUMN "version_search_strategy_keyword_research_date";
  ALTER TABLE "_solutions_v" DROP COLUMN "version_search_strategy_search_notes";
  DROP TYPE "public"."enum_services_search_strategy_intent";
  DROP TYPE "public"."enum__services_v_version_search_strategy_intent";
  DROP TYPE "public"."enum_projects_press_coverage_source_type";
  DROP TYPE "public"."enum_projects_search_strategy_intent";
  DROP TYPE "public"."enum__projects_v_version_press_coverage_source_type";
  DROP TYPE "public"."enum__projects_v_version_search_strategy_intent";
  DROP TYPE "public"."enum_business_categories_search_strategy_intent";
  DROP TYPE "public"."enum__business_categories_v_version_search_strategy_intent";
  DROP TYPE "public"."enum_companies_press_coverage_source_type";
  DROP TYPE "public"."enum_companies_search_strategy_intent";
  DROP TYPE "public"."enum__companies_v_version_press_coverage_source_type";
  DROP TYPE "public"."enum__companies_v_version_search_strategy_intent";
  DROP TYPE "public"."enum_brands_press_coverage_source_type";
  DROP TYPE "public"."enum_brands_search_strategy_intent";
  DROP TYPE "public"."enum__brands_v_version_press_coverage_source_type";
  DROP TYPE "public"."enum__brands_v_version_search_strategy_intent";
  DROP TYPE "public"."enum_solutions_press_coverage_source_type";
  DROP TYPE "public"."enum_solutions_search_strategy_intent";
  DROP TYPE "public"."enum__solutions_v_version_press_coverage_source_type";
  DROP TYPE "public"."enum__solutions_v_version_search_strategy_intent";`)
}
