import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_business_category" AS ENUM('fmcg', 'food-beverage', 'hospitality', 'it-technology', 'retail', 'fashion', 'beauty-personal-care', 'automobile', 'education', 'real-estate', 'financial-services', 'aviation', 'd2c', 'lifestyle', 'healthcare', 'sustainability', 'social-impact', 'b2b');
  CREATE TYPE "public"."enum_projects_campaign_types" AS ENUM('brand-launch', 'product-launch', 'store-venue-launch', 'integrated-campaign', 'mass-creator-campaign', 'influencer-campaign', 'celebrity-campaign', 'micro-influencer-campaign', 'barter-campaign', 'ugc-campaign', 'social-campaign', 'digital-campaign', 'interactive-experience', 'event-activation', 'cause-campaign', 'employer-branding', 'content-campaign', 'community-campaign', 'referral-campaign', 'recruitment-campaign', 'long-term-partnership', 'brand-building');
  CREATE TYPE "public"."enum_projects_blocks_split_content_media_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_projects_render_mode" AS ENUM('standard', 'flexible', 'flagship');
  CREATE TYPE "public"."enum_projects_flagship_renderer_key" AS ENUM('high-ultra-lounge', 'the-coolest-job');
  CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_business_category" AS ENUM('fmcg', 'food-beverage', 'hospitality', 'it-technology', 'retail', 'fashion', 'beauty-personal-care', 'automobile', 'education', 'real-estate', 'financial-services', 'aviation', 'd2c', 'lifestyle', 'healthcare', 'sustainability', 'social-impact', 'b2b');
  CREATE TYPE "public"."enum__projects_v_version_campaign_types" AS ENUM('brand-launch', 'product-launch', 'store-venue-launch', 'integrated-campaign', 'mass-creator-campaign', 'influencer-campaign', 'celebrity-campaign', 'micro-influencer-campaign', 'barter-campaign', 'ugc-campaign', 'social-campaign', 'digital-campaign', 'interactive-experience', 'event-activation', 'cause-campaign', 'employer-branding', 'content-campaign', 'community-campaign', 'referral-campaign', 'recruitment-campaign', 'long-term-partnership', 'brand-building');
  CREATE TYPE "public"."enum__projects_v_blocks_split_content_media_side" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__projects_v_version_render_mode" AS ENUM('standard', 'flexible', 'flagship');
  CREATE TYPE "public"."enum__projects_v_version_flagship_renderer_key" AS ENUM('high-ultra-lounge', 'the-coolest-job');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "projects_business_category" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_projects_business_category",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "projects_campaign_types" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_projects_campaign_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "projects_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"prefix" varchar,
  	"suffix" varchar,
  	"note" varchar
  );
  
  CREATE TABLE "projects_blocks_section_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"legacy_src" varchar,
  	"alt" varchar,
  	"caption" varchar,
  	"credit" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_full_bleed_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"legacy_src" varchar,
  	"alt" varchar,
  	"caption" varchar,
  	"credit" varchar,
  	"overlay_heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_split_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_side" "enum_projects_blocks_split_content_media_side" DEFAULT 'left',
  	"content" jsonb,
  	"media_id" integer,
  	"legacy_src" varchar,
  	"alt" varchar,
  	"caption" varchar,
  	"credit" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_media_gallery_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"legacy_src" varchar,
  	"alt" varchar,
  	"caption" varchar,
  	"credit" varchar
  );
  
  CREATE TABLE "projects_blocks_media_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_metrics_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"prefix" varchar,
  	"suffix" varchar,
  	"note" varchar
  );
  
  CREATE TABLE "projects_blocks_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"attribution" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"button_label" varchar,
  	"button_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"client" varchar,
  	"year" numeric,
  	"location" varchar,
  	"short_summary" varchar,
  	"card_summary" varchar,
  	"render_mode" "enum_projects_render_mode" DEFAULT 'standard',
  	"flagship_renderer_key" "enum_projects_flagship_renderer_key",
  	"hero_media_id" integer,
  	"hero_legacy_src" varchar,
  	"hero_video" varchar,
  	"featured" boolean,
  	"order" numeric DEFAULT 100,
  	"headline" varchar,
  	"challenge_question" varchar,
  	"challenge_copy" varchar,
  	"insight" varchar,
  	"idea_statement" varchar,
  	"idea_copy" varchar,
  	"execution" varchar,
  	"outcome" varchar,
  	"quote_text" varchar,
  	"quote_attribution" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_noindex" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "_projects_v_version_business_category" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__projects_v_version_business_category",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_campaign_types" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__projects_v_version_campaign_types",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_projects_v_version_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"prefix" varchar,
  	"suffix" varchar,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_section_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"body" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"content" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_media_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"legacy_src" varchar,
  	"alt" varchar,
  	"caption" varchar,
  	"credit" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_full_bleed_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"legacy_src" varchar,
  	"alt" varchar,
  	"caption" varchar,
  	"credit" varchar,
  	"overlay_heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_split_content" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_side" "enum__projects_v_blocks_split_content_media_side" DEFAULT 'left',
  	"content" jsonb,
  	"media_id" integer,
  	"legacy_src" varchar,
  	"alt" varchar,
  	"caption" varchar,
  	"credit" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_media_gallery_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"media_id" integer,
  	"legacy_src" varchar,
  	"alt" varchar,
  	"caption" varchar,
  	"credit" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_media_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_metrics_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"prefix" varchar,
  	"suffix" varchar,
  	"note" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_quote" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"attribution" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"body" varchar,
  	"button_label" varchar,
  	"button_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_client" varchar,
  	"version_year" numeric,
  	"version_location" varchar,
  	"version_short_summary" varchar,
  	"version_card_summary" varchar,
  	"version_render_mode" "enum__projects_v_version_render_mode" DEFAULT 'standard',
  	"version_flagship_renderer_key" "enum__projects_v_version_flagship_renderer_key",
  	"version_hero_media_id" integer,
  	"version_hero_legacy_src" varchar,
  	"version_hero_video" varchar,
  	"version_featured" boolean,
  	"version_order" numeric DEFAULT 100,
  	"version_headline" varchar,
  	"version_challenge_question" varchar,
  	"version_challenge_copy" varchar,
  	"version_insight" varchar,
  	"version_idea_statement" varchar,
  	"version_idea_copy" varchar,
  	"version_execution" varchar,
  	"version_outcome" varchar,
  	"version_quote_text" varchar,
  	"version_quote_attribution" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_noindex" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "services_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "projects_business_category" ADD CONSTRAINT "projects_business_category_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_campaign_types" ADD CONSTRAINT "projects_campaign_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_metrics" ADD CONSTRAINT "projects_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_section_intro" ADD CONSTRAINT "projects_blocks_section_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_rich_text" ADD CONSTRAINT "projects_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_media_block" ADD CONSTRAINT "projects_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_media_block" ADD CONSTRAINT "projects_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_full_bleed_media" ADD CONSTRAINT "projects_blocks_full_bleed_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_full_bleed_media" ADD CONSTRAINT "projects_blocks_full_bleed_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_split_content" ADD CONSTRAINT "projects_blocks_split_content_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_split_content" ADD CONSTRAINT "projects_blocks_split_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_media_gallery_items" ADD CONSTRAINT "projects_blocks_media_gallery_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_media_gallery_items" ADD CONSTRAINT "projects_blocks_media_gallery_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_media_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_media_gallery" ADD CONSTRAINT "projects_blocks_media_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_metrics_items" ADD CONSTRAINT "projects_blocks_metrics_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects_blocks_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_metrics" ADD CONSTRAINT "projects_blocks_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_quote" ADD CONSTRAINT "projects_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_blocks_cta" ADD CONSTRAINT "projects_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_business_category" ADD CONSTRAINT "_projects_v_version_business_category_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_campaign_types" ADD CONSTRAINT "_projects_v_version_campaign_types_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_version_metrics" ADD CONSTRAINT "_projects_v_version_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_section_intro" ADD CONSTRAINT "_projects_v_blocks_section_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_rich_text" ADD CONSTRAINT "_projects_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_media_block" ADD CONSTRAINT "_projects_v_blocks_media_block_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_media_block" ADD CONSTRAINT "_projects_v_blocks_media_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_full_bleed_media" ADD CONSTRAINT "_projects_v_blocks_full_bleed_media_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_full_bleed_media" ADD CONSTRAINT "_projects_v_blocks_full_bleed_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_split_content" ADD CONSTRAINT "_projects_v_blocks_split_content_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_split_content" ADD CONSTRAINT "_projects_v_blocks_split_content_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_media_gallery_items" ADD CONSTRAINT "_projects_v_blocks_media_gallery_items_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_media_gallery_items" ADD CONSTRAINT "_projects_v_blocks_media_gallery_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_blocks_media_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_media_gallery" ADD CONSTRAINT "_projects_v_blocks_media_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_metrics_items" ADD CONSTRAINT "_projects_v_blocks_metrics_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v_blocks_metrics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_metrics" ADD CONSTRAINT "_projects_v_blocks_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_quote" ADD CONSTRAINT "_projects_v_blocks_quote_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_cta" ADD CONSTRAINT "_projects_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "services_slug_idx" ON "services" USING btree ("slug");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE INDEX "projects_business_category_order_idx" ON "projects_business_category" USING btree ("order");
  CREATE INDEX "projects_business_category_parent_idx" ON "projects_business_category" USING btree ("parent_id");
  CREATE INDEX "projects_campaign_types_order_idx" ON "projects_campaign_types" USING btree ("order");
  CREATE INDEX "projects_campaign_types_parent_idx" ON "projects_campaign_types" USING btree ("parent_id");
  CREATE INDEX "projects_metrics_order_idx" ON "projects_metrics" USING btree ("_order");
  CREATE INDEX "projects_metrics_parent_id_idx" ON "projects_metrics" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_section_intro_order_idx" ON "projects_blocks_section_intro" USING btree ("_order");
  CREATE INDEX "projects_blocks_section_intro_parent_id_idx" ON "projects_blocks_section_intro" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_section_intro_path_idx" ON "projects_blocks_section_intro" USING btree ("_path");
  CREATE INDEX "projects_blocks_rich_text_order_idx" ON "projects_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "projects_blocks_rich_text_parent_id_idx" ON "projects_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_rich_text_path_idx" ON "projects_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "projects_blocks_media_block_order_idx" ON "projects_blocks_media_block" USING btree ("_order");
  CREATE INDEX "projects_blocks_media_block_parent_id_idx" ON "projects_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_media_block_path_idx" ON "projects_blocks_media_block" USING btree ("_path");
  CREATE INDEX "projects_blocks_media_block_media_idx" ON "projects_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "projects_blocks_full_bleed_media_order_idx" ON "projects_blocks_full_bleed_media" USING btree ("_order");
  CREATE INDEX "projects_blocks_full_bleed_media_parent_id_idx" ON "projects_blocks_full_bleed_media" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_full_bleed_media_path_idx" ON "projects_blocks_full_bleed_media" USING btree ("_path");
  CREATE INDEX "projects_blocks_full_bleed_media_media_idx" ON "projects_blocks_full_bleed_media" USING btree ("media_id");
  CREATE INDEX "projects_blocks_split_content_order_idx" ON "projects_blocks_split_content" USING btree ("_order");
  CREATE INDEX "projects_blocks_split_content_parent_id_idx" ON "projects_blocks_split_content" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_split_content_path_idx" ON "projects_blocks_split_content" USING btree ("_path");
  CREATE INDEX "projects_blocks_split_content_media_idx" ON "projects_blocks_split_content" USING btree ("media_id");
  CREATE INDEX "projects_blocks_media_gallery_items_order_idx" ON "projects_blocks_media_gallery_items" USING btree ("_order");
  CREATE INDEX "projects_blocks_media_gallery_items_parent_id_idx" ON "projects_blocks_media_gallery_items" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_media_gallery_items_media_idx" ON "projects_blocks_media_gallery_items" USING btree ("media_id");
  CREATE INDEX "projects_blocks_media_gallery_order_idx" ON "projects_blocks_media_gallery" USING btree ("_order");
  CREATE INDEX "projects_blocks_media_gallery_parent_id_idx" ON "projects_blocks_media_gallery" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_media_gallery_path_idx" ON "projects_blocks_media_gallery" USING btree ("_path");
  CREATE INDEX "projects_blocks_metrics_items_order_idx" ON "projects_blocks_metrics_items" USING btree ("_order");
  CREATE INDEX "projects_blocks_metrics_items_parent_id_idx" ON "projects_blocks_metrics_items" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_metrics_order_idx" ON "projects_blocks_metrics" USING btree ("_order");
  CREATE INDEX "projects_blocks_metrics_parent_id_idx" ON "projects_blocks_metrics" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_metrics_path_idx" ON "projects_blocks_metrics" USING btree ("_path");
  CREATE INDEX "projects_blocks_quote_order_idx" ON "projects_blocks_quote" USING btree ("_order");
  CREATE INDEX "projects_blocks_quote_parent_id_idx" ON "projects_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_quote_path_idx" ON "projects_blocks_quote" USING btree ("_path");
  CREATE INDEX "projects_blocks_cta_order_idx" ON "projects_blocks_cta" USING btree ("_order");
  CREATE INDEX "projects_blocks_cta_parent_id_idx" ON "projects_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_cta_path_idx" ON "projects_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "projects_slug_idx" ON "projects" USING btree ("slug");
  CREATE INDEX "projects_hero_media_idx" ON "projects" USING btree ("hero_media_id");
  CREATE INDEX "projects_seo_seo_og_image_idx" ON "projects" USING btree ("seo_og_image_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_services_id_idx" ON "projects_rels" USING btree ("services_id");
  CREATE INDEX "_projects_v_version_business_category_order_idx" ON "_projects_v_version_business_category" USING btree ("order");
  CREATE INDEX "_projects_v_version_business_category_parent_idx" ON "_projects_v_version_business_category" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_campaign_types_order_idx" ON "_projects_v_version_campaign_types" USING btree ("order");
  CREATE INDEX "_projects_v_version_campaign_types_parent_idx" ON "_projects_v_version_campaign_types" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_metrics_order_idx" ON "_projects_v_version_metrics" USING btree ("_order");
  CREATE INDEX "_projects_v_version_metrics_parent_id_idx" ON "_projects_v_version_metrics" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_section_intro_order_idx" ON "_projects_v_blocks_section_intro" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_section_intro_parent_id_idx" ON "_projects_v_blocks_section_intro" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_section_intro_path_idx" ON "_projects_v_blocks_section_intro" USING btree ("_path");
  CREATE INDEX "_projects_v_blocks_rich_text_order_idx" ON "_projects_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_rich_text_parent_id_idx" ON "_projects_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_rich_text_path_idx" ON "_projects_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_projects_v_blocks_media_block_order_idx" ON "_projects_v_blocks_media_block" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_media_block_parent_id_idx" ON "_projects_v_blocks_media_block" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_media_block_path_idx" ON "_projects_v_blocks_media_block" USING btree ("_path");
  CREATE INDEX "_projects_v_blocks_media_block_media_idx" ON "_projects_v_blocks_media_block" USING btree ("media_id");
  CREATE INDEX "_projects_v_blocks_full_bleed_media_order_idx" ON "_projects_v_blocks_full_bleed_media" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_full_bleed_media_parent_id_idx" ON "_projects_v_blocks_full_bleed_media" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_full_bleed_media_path_idx" ON "_projects_v_blocks_full_bleed_media" USING btree ("_path");
  CREATE INDEX "_projects_v_blocks_full_bleed_media_media_idx" ON "_projects_v_blocks_full_bleed_media" USING btree ("media_id");
  CREATE INDEX "_projects_v_blocks_split_content_order_idx" ON "_projects_v_blocks_split_content" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_split_content_parent_id_idx" ON "_projects_v_blocks_split_content" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_split_content_path_idx" ON "_projects_v_blocks_split_content" USING btree ("_path");
  CREATE INDEX "_projects_v_blocks_split_content_media_idx" ON "_projects_v_blocks_split_content" USING btree ("media_id");
  CREATE INDEX "_projects_v_blocks_media_gallery_items_order_idx" ON "_projects_v_blocks_media_gallery_items" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_media_gallery_items_parent_id_idx" ON "_projects_v_blocks_media_gallery_items" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_media_gallery_items_media_idx" ON "_projects_v_blocks_media_gallery_items" USING btree ("media_id");
  CREATE INDEX "_projects_v_blocks_media_gallery_order_idx" ON "_projects_v_blocks_media_gallery" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_media_gallery_parent_id_idx" ON "_projects_v_blocks_media_gallery" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_media_gallery_path_idx" ON "_projects_v_blocks_media_gallery" USING btree ("_path");
  CREATE INDEX "_projects_v_blocks_metrics_items_order_idx" ON "_projects_v_blocks_metrics_items" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_metrics_items_parent_id_idx" ON "_projects_v_blocks_metrics_items" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_metrics_order_idx" ON "_projects_v_blocks_metrics" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_metrics_parent_id_idx" ON "_projects_v_blocks_metrics" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_metrics_path_idx" ON "_projects_v_blocks_metrics" USING btree ("_path");
  CREATE INDEX "_projects_v_blocks_quote_order_idx" ON "_projects_v_blocks_quote" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_quote_parent_id_idx" ON "_projects_v_blocks_quote" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_quote_path_idx" ON "_projects_v_blocks_quote" USING btree ("_path");
  CREATE INDEX "_projects_v_blocks_cta_order_idx" ON "_projects_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_cta_parent_id_idx" ON "_projects_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_cta_path_idx" ON "_projects_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_slug_idx" ON "_projects_v" USING btree ("version_slug");
  CREATE INDEX "_projects_v_version_version_hero_media_idx" ON "_projects_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_projects_v_version_seo_version_seo_og_image_idx" ON "_projects_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_rels_order_idx" ON "_projects_v_rels" USING btree ("order");
  CREATE INDEX "_projects_v_rels_parent_idx" ON "_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projects_v_rels_path_idx" ON "_projects_v_rels" USING btree ("path");
  CREATE INDEX "_projects_v_rels_services_id_idx" ON "_projects_v_rels" USING btree ("services_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_business_category" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_campaign_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_metrics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_section_intro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_media_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_full_bleed_media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_split_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_media_gallery_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_media_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_metrics_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_metrics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_quote" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_business_category" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_campaign_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_version_metrics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_section_intro" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_rich_text" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_media_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_full_bleed_media" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_split_content" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_media_gallery_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_media_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_metrics_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_metrics" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_quote" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_cta" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "services" CASCADE;
  DROP TABLE "projects_business_category" CASCADE;
  DROP TABLE "projects_campaign_types" CASCADE;
  DROP TABLE "projects_metrics" CASCADE;
  DROP TABLE "projects_blocks_section_intro" CASCADE;
  DROP TABLE "projects_blocks_rich_text" CASCADE;
  DROP TABLE "projects_blocks_media_block" CASCADE;
  DROP TABLE "projects_blocks_full_bleed_media" CASCADE;
  DROP TABLE "projects_blocks_split_content" CASCADE;
  DROP TABLE "projects_blocks_media_gallery_items" CASCADE;
  DROP TABLE "projects_blocks_media_gallery" CASCADE;
  DROP TABLE "projects_blocks_metrics_items" CASCADE;
  DROP TABLE "projects_blocks_metrics" CASCADE;
  DROP TABLE "projects_blocks_quote" CASCADE;
  DROP TABLE "projects_blocks_cta" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "_projects_v_version_business_category" CASCADE;
  DROP TABLE "_projects_v_version_campaign_types" CASCADE;
  DROP TABLE "_projects_v_version_metrics" CASCADE;
  DROP TABLE "_projects_v_blocks_section_intro" CASCADE;
  DROP TABLE "_projects_v_blocks_rich_text" CASCADE;
  DROP TABLE "_projects_v_blocks_media_block" CASCADE;
  DROP TABLE "_projects_v_blocks_full_bleed_media" CASCADE;
  DROP TABLE "_projects_v_blocks_split_content" CASCADE;
  DROP TABLE "_projects_v_blocks_media_gallery_items" CASCADE;
  DROP TABLE "_projects_v_blocks_media_gallery" CASCADE;
  DROP TABLE "_projects_v_blocks_metrics_items" CASCADE;
  DROP TABLE "_projects_v_blocks_metrics" CASCADE;
  DROP TABLE "_projects_v_blocks_quote" CASCADE;
  DROP TABLE "_projects_v_blocks_cta" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_rels" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_services_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";
  
  DROP INDEX "payload_locked_documents_rels_services_id_idx";
  DROP INDEX "payload_locked_documents_rels_projects_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "services_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  DROP TYPE "public"."enum_projects_business_category";
  DROP TYPE "public"."enum_projects_campaign_types";
  DROP TYPE "public"."enum_projects_blocks_split_content_media_side";
  DROP TYPE "public"."enum_projects_render_mode";
  DROP TYPE "public"."enum_projects_flagship_renderer_key";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_business_category";
  DROP TYPE "public"."enum__projects_v_version_campaign_types";
  DROP TYPE "public"."enum__projects_v_blocks_split_content_media_side";
  DROP TYPE "public"."enum__projects_v_version_render_mode";
  DROP TYPE "public"."enum__projects_v_version_flagship_renderer_key";
  DROP TYPE "public"."enum__projects_v_version_status";`)
}
