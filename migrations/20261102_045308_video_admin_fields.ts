import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_blocks_video_block_video_source" AS ENUM('none', 'upload', 'youtube');
  CREATE TYPE "public"."enum_projects_hero_video_media_source" AS ENUM('none', 'upload', 'youtube');
  CREATE TYPE "public"."enum__projects_v_blocks_video_block_video_source" AS ENUM('none', 'upload', 'youtube');
  CREATE TYPE "public"."enum__projects_v_version_hero_video_media_source" AS ENUM('none', 'upload', 'youtube');
  CREATE TYPE "public"."enum_home_page_videos_hero_source" AS ENUM('none', 'upload', 'youtube');
  CREATE TYPE "public"."enum_home_page_videos_build_source" AS ENUM('none', 'upload', 'youtube');
  CREATE TYPE "public"."enum_home_page_videos_built_by_geek_source" AS ENUM('none', 'upload', 'youtube');
  CREATE TYPE "public"."enum__home_page_v_version_videos_hero_source" AS ENUM('none', 'upload', 'youtube');
  CREATE TYPE "public"."enum__home_page_v_version_videos_build_source" AS ENUM('none', 'upload', 'youtube');
  CREATE TYPE "public"."enum__home_page_v_version_videos_built_by_geek_source" AS ENUM('none', 'upload', 'youtube');
  CREATE TYPE "public"."enum_work_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__work_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_door_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__door_pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "projects_blocks_video_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"video_source" "enum_projects_blocks_video_block_video_source" DEFAULT 'none',
  	"video_file_id" integer,
  	"video_mobile_file_id" integer,
  	"video_youtube_url" varchar,
  	"video_poster_id" integer,
  	"caption" varchar,
  	"credit" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_projects_v_blocks_video_block" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"video_source" "enum__projects_v_blocks_video_block_video_source" DEFAULT 'none',
  	"video_file_id" integer,
  	"video_mobile_file_id" integer,
  	"video_youtube_url" varchar,
  	"video_poster_id" integer,
  	"caption" varchar,
  	"credit" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "work_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"lede" varchar,
  	"explore_title" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_noindex" boolean,
  	"_status" "enum_work_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_work_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_title" varchar,
  	"version_lede" varchar,
  	"version_explore_title" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_noindex" boolean,
  	"version__status" "enum__work_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "door_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client_title" varchar,
  	"client_intro" varchar,
  	"client_seo_meta_title" varchar,
  	"client_seo_meta_description" varchar,
  	"client_seo_og_image_id" integer,
  	"client_seo_noindex" boolean,
  	"career_title" varchar,
  	"career_intro" varchar,
  	"career_seo_meta_title" varchar,
  	"career_seo_meta_description" varchar,
  	"career_seo_og_image_id" integer,
  	"career_seo_noindex" boolean,
  	"vendor_title" varchar,
  	"vendor_intro" varchar,
  	"vendor_seo_meta_title" varchar,
  	"vendor_seo_meta_description" varchar,
  	"vendor_seo_og_image_id" integer,
  	"vendor_seo_noindex" boolean,
  	"_status" "enum_door_pages_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_door_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_client_title" varchar,
  	"version_client_intro" varchar,
  	"version_client_seo_meta_title" varchar,
  	"version_client_seo_meta_description" varchar,
  	"version_client_seo_og_image_id" integer,
  	"version_client_seo_noindex" boolean,
  	"version_career_title" varchar,
  	"version_career_intro" varchar,
  	"version_career_seo_meta_title" varchar,
  	"version_career_seo_meta_description" varchar,
  	"version_career_seo_og_image_id" integer,
  	"version_career_seo_noindex" boolean,
  	"version_vendor_title" varchar,
  	"version_vendor_intro" varchar,
  	"version_vendor_seo_meta_title" varchar,
  	"version_vendor_seo_meta_description" varchar,
  	"version_vendor_seo_og_image_id" integer,
  	"version_vendor_seo_noindex" boolean,
  	"version__status" "enum__door_pages_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "projects" ADD COLUMN "hero_video_media_source" "enum_projects_hero_video_media_source" DEFAULT 'none';
  ALTER TABLE "projects" ADD COLUMN "hero_video_media_file_id" integer;
  ALTER TABLE "projects" ADD COLUMN "hero_video_media_mobile_file_id" integer;
  ALTER TABLE "projects" ADD COLUMN "hero_video_media_youtube_url" varchar;
  ALTER TABLE "projects" ADD COLUMN "hero_video_media_poster_id" integer;
  ALTER TABLE "_projects_v" ADD COLUMN "version_hero_video_media_source" "enum__projects_v_version_hero_video_media_source" DEFAULT 'none';
  ALTER TABLE "_projects_v" ADD COLUMN "version_hero_video_media_file_id" integer;
  ALTER TABLE "_projects_v" ADD COLUMN "version_hero_video_media_mobile_file_id" integer;
  ALTER TABLE "_projects_v" ADD COLUMN "version_hero_video_media_youtube_url" varchar;
  ALTER TABLE "_projects_v" ADD COLUMN "version_hero_video_media_poster_id" integer;
  ALTER TABLE "site_settings" ADD COLUMN "floating_contact_whatsapp_number" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "floating_contact_whatsapp_message" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "floating_contact_instagram_url" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "floating_contact_hide_buttons" boolean DEFAULT false;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_floating_contact_whatsapp_number" varchar;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_floating_contact_whatsapp_message" varchar;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_floating_contact_instagram_url" varchar;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_floating_contact_hide_buttons" boolean DEFAULT false;
  ALTER TABLE "home_page" ADD COLUMN "videos_hero_source" "enum_home_page_videos_hero_source" DEFAULT 'none';
  ALTER TABLE "home_page" ADD COLUMN "videos_hero_file_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "videos_hero_mobile_file_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "videos_hero_youtube_url" varchar;
  ALTER TABLE "home_page" ADD COLUMN "videos_hero_poster_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "videos_build_source" "enum_home_page_videos_build_source" DEFAULT 'none';
  ALTER TABLE "home_page" ADD COLUMN "videos_build_file_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "videos_build_mobile_file_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "videos_build_youtube_url" varchar;
  ALTER TABLE "home_page" ADD COLUMN "videos_build_poster_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "videos_built_by_geek_source" "enum_home_page_videos_built_by_geek_source" DEFAULT 'none';
  ALTER TABLE "home_page" ADD COLUMN "videos_built_by_geek_file_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "videos_built_by_geek_mobile_file_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "videos_built_by_geek_youtube_url" varchar;
  ALTER TABLE "home_page" ADD COLUMN "videos_built_by_geek_poster_id" integer;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_videos_hero_source" "enum__home_page_v_version_videos_hero_source" DEFAULT 'none';
  ALTER TABLE "_home_page_v" ADD COLUMN "version_videos_hero_file_id" integer;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_videos_hero_mobile_file_id" integer;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_videos_hero_youtube_url" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_videos_hero_poster_id" integer;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_videos_build_source" "enum__home_page_v_version_videos_build_source" DEFAULT 'none';
  ALTER TABLE "_home_page_v" ADD COLUMN "version_videos_build_file_id" integer;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_videos_build_mobile_file_id" integer;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_videos_build_youtube_url" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_videos_build_poster_id" integer;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_videos_built_by_geek_source" "enum__home_page_v_version_videos_built_by_geek_source" DEFAULT 'none';
  ALTER TABLE "_home_page_v" ADD COLUMN "version_videos_built_by_geek_file_id" integer;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_videos_built_by_geek_mobile_file_id" integer;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_videos_built_by_geek_youtube_url" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_videos_built_by_geek_poster_id" integer;
  ALTER TABLE "projects_blocks_video_block" ADD CONSTRAINT "projects_blocks_video_block_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_video_block" ADD CONSTRAINT "projects_blocks_video_block_video_mobile_file_id_media_id_fk" FOREIGN KEY ("video_mobile_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_video_block" ADD CONSTRAINT "projects_blocks_video_block_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_blocks_video_block" ADD CONSTRAINT "projects_blocks_video_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_video_block" ADD CONSTRAINT "_projects_v_blocks_video_block_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_video_block" ADD CONSTRAINT "_projects_v_blocks_video_block_video_mobile_file_id_media_id_fk" FOREIGN KEY ("video_mobile_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_video_block" ADD CONSTRAINT "_projects_v_blocks_video_block_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_blocks_video_block" ADD CONSTRAINT "_projects_v_blocks_video_block_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "work_page" ADD CONSTRAINT "work_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_work_page_v" ADD CONSTRAINT "_work_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "door_pages" ADD CONSTRAINT "door_pages_client_seo_og_image_id_media_id_fk" FOREIGN KEY ("client_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "door_pages" ADD CONSTRAINT "door_pages_career_seo_og_image_id_media_id_fk" FOREIGN KEY ("career_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "door_pages" ADD CONSTRAINT "door_pages_vendor_seo_og_image_id_media_id_fk" FOREIGN KEY ("vendor_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_door_pages_v" ADD CONSTRAINT "_door_pages_v_version_client_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_client_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_door_pages_v" ADD CONSTRAINT "_door_pages_v_version_career_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_career_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_door_pages_v" ADD CONSTRAINT "_door_pages_v_version_vendor_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_vendor_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_blocks_video_block_order_idx" ON "projects_blocks_video_block" USING btree ("_order");
  CREATE INDEX "projects_blocks_video_block_parent_id_idx" ON "projects_blocks_video_block" USING btree ("_parent_id");
  CREATE INDEX "projects_blocks_video_block_path_idx" ON "projects_blocks_video_block" USING btree ("_path");
  CREATE INDEX "projects_blocks_video_block_video_video_file_idx" ON "projects_blocks_video_block" USING btree ("video_file_id");
  CREATE INDEX "projects_blocks_video_block_video_video_mobile_file_idx" ON "projects_blocks_video_block" USING btree ("video_mobile_file_id");
  CREATE INDEX "projects_blocks_video_block_video_video_poster_idx" ON "projects_blocks_video_block" USING btree ("video_poster_id");
  CREATE INDEX "_projects_v_blocks_video_block_order_idx" ON "_projects_v_blocks_video_block" USING btree ("_order");
  CREATE INDEX "_projects_v_blocks_video_block_parent_id_idx" ON "_projects_v_blocks_video_block" USING btree ("_parent_id");
  CREATE INDEX "_projects_v_blocks_video_block_path_idx" ON "_projects_v_blocks_video_block" USING btree ("_path");
  CREATE INDEX "_projects_v_blocks_video_block_video_video_file_idx" ON "_projects_v_blocks_video_block" USING btree ("video_file_id");
  CREATE INDEX "_projects_v_blocks_video_block_video_video_mobile_file_idx" ON "_projects_v_blocks_video_block" USING btree ("video_mobile_file_id");
  CREATE INDEX "_projects_v_blocks_video_block_video_video_poster_idx" ON "_projects_v_blocks_video_block" USING btree ("video_poster_id");
  CREATE INDEX "work_page_seo_seo_og_image_idx" ON "work_page" USING btree ("seo_og_image_id");
  CREATE INDEX "work_page__status_idx" ON "work_page" USING btree ("_status");
  CREATE INDEX "_work_page_v_version_seo_version_seo_og_image_idx" ON "_work_page_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_work_page_v_version_version__status_idx" ON "_work_page_v" USING btree ("version__status");
  CREATE INDEX "_work_page_v_created_at_idx" ON "_work_page_v" USING btree ("created_at");
  CREATE INDEX "_work_page_v_updated_at_idx" ON "_work_page_v" USING btree ("updated_at");
  CREATE INDEX "_work_page_v_latest_idx" ON "_work_page_v" USING btree ("latest");
  CREATE INDEX "door_pages_client_seo_client_seo_og_image_idx" ON "door_pages" USING btree ("client_seo_og_image_id");
  CREATE INDEX "door_pages_career_seo_career_seo_og_image_idx" ON "door_pages" USING btree ("career_seo_og_image_id");
  CREATE INDEX "door_pages_vendor_seo_vendor_seo_og_image_idx" ON "door_pages" USING btree ("vendor_seo_og_image_id");
  CREATE INDEX "door_pages__status_idx" ON "door_pages" USING btree ("_status");
  CREATE INDEX "_door_pages_v_version_client_seo_version_client_seo_og_i_idx" ON "_door_pages_v" USING btree ("version_client_seo_og_image_id");
  CREATE INDEX "_door_pages_v_version_career_seo_version_career_seo_og_i_idx" ON "_door_pages_v" USING btree ("version_career_seo_og_image_id");
  CREATE INDEX "_door_pages_v_version_vendor_seo_version_vendor_seo_og_i_idx" ON "_door_pages_v" USING btree ("version_vendor_seo_og_image_id");
  CREATE INDEX "_door_pages_v_version_version__status_idx" ON "_door_pages_v" USING btree ("version__status");
  CREATE INDEX "_door_pages_v_created_at_idx" ON "_door_pages_v" USING btree ("created_at");
  CREATE INDEX "_door_pages_v_updated_at_idx" ON "_door_pages_v" USING btree ("updated_at");
  CREATE INDEX "_door_pages_v_latest_idx" ON "_door_pages_v" USING btree ("latest");
  ALTER TABLE "projects" ADD CONSTRAINT "projects_hero_video_media_file_id_media_id_fk" FOREIGN KEY ("hero_video_media_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_hero_video_media_mobile_file_id_media_id_fk" FOREIGN KEY ("hero_video_media_mobile_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_hero_video_media_poster_id_media_id_fk" FOREIGN KEY ("hero_video_media_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_hero_video_media_file_id_media_id_fk" FOREIGN KEY ("version_hero_video_media_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_hero_video_media_mobile_file_id_media_id_fk" FOREIGN KEY ("version_hero_video_media_mobile_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_hero_video_media_poster_id_media_id_fk" FOREIGN KEY ("version_hero_video_media_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_videos_hero_file_id_media_id_fk" FOREIGN KEY ("videos_hero_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_videos_hero_mobile_file_id_media_id_fk" FOREIGN KEY ("videos_hero_mobile_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_videos_hero_poster_id_media_id_fk" FOREIGN KEY ("videos_hero_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_videos_build_file_id_media_id_fk" FOREIGN KEY ("videos_build_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_videos_build_mobile_file_id_media_id_fk" FOREIGN KEY ("videos_build_mobile_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_videos_build_poster_id_media_id_fk" FOREIGN KEY ("videos_build_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_videos_built_by_geek_file_id_media_id_fk" FOREIGN KEY ("videos_built_by_geek_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_videos_built_by_geek_mobile_file_id_media_id_fk" FOREIGN KEY ("videos_built_by_geek_mobile_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_videos_built_by_geek_poster_id_media_id_fk" FOREIGN KEY ("videos_built_by_geek_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_videos_hero_file_id_media_id_fk" FOREIGN KEY ("version_videos_hero_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_videos_hero_mobile_file_id_media_id_fk" FOREIGN KEY ("version_videos_hero_mobile_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_videos_hero_poster_id_media_id_fk" FOREIGN KEY ("version_videos_hero_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_videos_build_file_id_media_id_fk" FOREIGN KEY ("version_videos_build_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_videos_build_mobile_file_id_media_id_fk" FOREIGN KEY ("version_videos_build_mobile_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_videos_build_poster_id_media_id_fk" FOREIGN KEY ("version_videos_build_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_videos_built_by_geek_file_id_media_id_fk" FOREIGN KEY ("version_videos_built_by_geek_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_videos_built_by_geek_mobile_file_id_media_id_fk" FOREIGN KEY ("version_videos_built_by_geek_mobile_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_videos_built_by_geek_poster_id_media_id_fk" FOREIGN KEY ("version_videos_built_by_geek_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_hero_video_media_hero_video_media_file_idx" ON "projects" USING btree ("hero_video_media_file_id");
  CREATE INDEX "projects_hero_video_media_hero_video_media_mobile_file_idx" ON "projects" USING btree ("hero_video_media_mobile_file_id");
  CREATE INDEX "projects_hero_video_media_hero_video_media_poster_idx" ON "projects" USING btree ("hero_video_media_poster_id");
  CREATE INDEX "_projects_v_version_hero_video_media_version_hero_video__idx" ON "_projects_v" USING btree ("version_hero_video_media_file_id");
  CREATE INDEX "_projects_v_version_hero_video_media_version_hero_vide_1_idx" ON "_projects_v" USING btree ("version_hero_video_media_mobile_file_id");
  CREATE INDEX "_projects_v_version_hero_video_media_version_hero_vide_2_idx" ON "_projects_v" USING btree ("version_hero_video_media_poster_id");
  CREATE INDEX "home_page_videos_hero_videos_hero_file_idx" ON "home_page" USING btree ("videos_hero_file_id");
  CREATE INDEX "home_page_videos_hero_videos_hero_mobile_file_idx" ON "home_page" USING btree ("videos_hero_mobile_file_id");
  CREATE INDEX "home_page_videos_hero_videos_hero_poster_idx" ON "home_page" USING btree ("videos_hero_poster_id");
  CREATE INDEX "home_page_videos_build_videos_build_file_idx" ON "home_page" USING btree ("videos_build_file_id");
  CREATE INDEX "home_page_videos_build_videos_build_mobile_file_idx" ON "home_page" USING btree ("videos_build_mobile_file_id");
  CREATE INDEX "home_page_videos_build_videos_build_poster_idx" ON "home_page" USING btree ("videos_build_poster_id");
  CREATE INDEX "home_page_videos_built_by_geek_videos_built_by_geek_file_idx" ON "home_page" USING btree ("videos_built_by_geek_file_id");
  CREATE INDEX "home_page_videos_built_by_geek_videos_built_by_geek_mobi_idx" ON "home_page" USING btree ("videos_built_by_geek_mobile_file_id");
  CREATE INDEX "home_page_videos_built_by_geek_videos_built_by_geek_post_idx" ON "home_page" USING btree ("videos_built_by_geek_poster_id");
  CREATE INDEX "_home_page_v_version_videos_hero_version_videos_hero_fil_idx" ON "_home_page_v" USING btree ("version_videos_hero_file_id");
  CREATE INDEX "_home_page_v_version_videos_hero_version_videos_hero_mob_idx" ON "_home_page_v" USING btree ("version_videos_hero_mobile_file_id");
  CREATE INDEX "_home_page_v_version_videos_hero_version_videos_hero_pos_idx" ON "_home_page_v" USING btree ("version_videos_hero_poster_id");
  CREATE INDEX "_home_page_v_version_videos_build_version_videos_build_f_idx" ON "_home_page_v" USING btree ("version_videos_build_file_id");
  CREATE INDEX "_home_page_v_version_videos_build_version_videos_build_m_idx" ON "_home_page_v" USING btree ("version_videos_build_mobile_file_id");
  CREATE INDEX "_home_page_v_version_videos_build_version_videos_build_p_idx" ON "_home_page_v" USING btree ("version_videos_build_poster_id");
  CREATE INDEX "_home_page_v_version_videos_built_by_geek_version_videos_idx" ON "_home_page_v" USING btree ("version_videos_built_by_geek_file_id");
  CREATE INDEX "_home_page_v_version_videos_built_by_geek_version_vide_1_idx" ON "_home_page_v" USING btree ("version_videos_built_by_geek_mobile_file_id");
  CREATE INDEX "_home_page_v_version_videos_built_by_geek_version_vide_2_idx" ON "_home_page_v" USING btree ("version_videos_built_by_geek_poster_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "projects_blocks_video_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_blocks_video_block" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "work_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_work_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "door_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_door_pages_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "projects_blocks_video_block" CASCADE;
  DROP TABLE "_projects_v_blocks_video_block" CASCADE;
  DROP TABLE "work_page" CASCADE;
  DROP TABLE "_work_page_v" CASCADE;
  DROP TABLE "door_pages" CASCADE;
  DROP TABLE "_door_pages_v" CASCADE;
  ALTER TABLE "projects" DROP CONSTRAINT "projects_hero_video_media_file_id_media_id_fk";
  
  ALTER TABLE "projects" DROP CONSTRAINT "projects_hero_video_media_mobile_file_id_media_id_fk";
  
  ALTER TABLE "projects" DROP CONSTRAINT "projects_hero_video_media_poster_id_media_id_fk";
  
  ALTER TABLE "_projects_v" DROP CONSTRAINT "_projects_v_version_hero_video_media_file_id_media_id_fk";
  
  ALTER TABLE "_projects_v" DROP CONSTRAINT "_projects_v_version_hero_video_media_mobile_file_id_media_id_fk";
  
  ALTER TABLE "_projects_v" DROP CONSTRAINT "_projects_v_version_hero_video_media_poster_id_media_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_videos_hero_file_id_media_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_videos_hero_mobile_file_id_media_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_videos_hero_poster_id_media_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_videos_build_file_id_media_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_videos_build_mobile_file_id_media_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_videos_build_poster_id_media_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_videos_built_by_geek_file_id_media_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_videos_built_by_geek_mobile_file_id_media_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_videos_built_by_geek_poster_id_media_id_fk";
  
  ALTER TABLE "_home_page_v" DROP CONSTRAINT "_home_page_v_version_videos_hero_file_id_media_id_fk";
  
  ALTER TABLE "_home_page_v" DROP CONSTRAINT "_home_page_v_version_videos_hero_mobile_file_id_media_id_fk";
  
  ALTER TABLE "_home_page_v" DROP CONSTRAINT "_home_page_v_version_videos_hero_poster_id_media_id_fk";
  
  ALTER TABLE "_home_page_v" DROP CONSTRAINT "_home_page_v_version_videos_build_file_id_media_id_fk";
  
  ALTER TABLE "_home_page_v" DROP CONSTRAINT "_home_page_v_version_videos_build_mobile_file_id_media_id_fk";
  
  ALTER TABLE "_home_page_v" DROP CONSTRAINT "_home_page_v_version_videos_build_poster_id_media_id_fk";
  
  ALTER TABLE "_home_page_v" DROP CONSTRAINT "_home_page_v_version_videos_built_by_geek_file_id_media_id_fk";
  
  ALTER TABLE "_home_page_v" DROP CONSTRAINT "_home_page_v_version_videos_built_by_geek_mobile_file_id_media_id_fk";
  
  ALTER TABLE "_home_page_v" DROP CONSTRAINT "_home_page_v_version_videos_built_by_geek_poster_id_media_id_fk";
  
  DROP INDEX "projects_hero_video_media_hero_video_media_file_idx";
  DROP INDEX "projects_hero_video_media_hero_video_media_mobile_file_idx";
  DROP INDEX "projects_hero_video_media_hero_video_media_poster_idx";
  DROP INDEX "_projects_v_version_hero_video_media_version_hero_video__idx";
  DROP INDEX "_projects_v_version_hero_video_media_version_hero_vide_1_idx";
  DROP INDEX "_projects_v_version_hero_video_media_version_hero_vide_2_idx";
  DROP INDEX "home_page_videos_hero_videos_hero_file_idx";
  DROP INDEX "home_page_videos_hero_videos_hero_mobile_file_idx";
  DROP INDEX "home_page_videos_hero_videos_hero_poster_idx";
  DROP INDEX "home_page_videos_build_videos_build_file_idx";
  DROP INDEX "home_page_videos_build_videos_build_mobile_file_idx";
  DROP INDEX "home_page_videos_build_videos_build_poster_idx";
  DROP INDEX "home_page_videos_built_by_geek_videos_built_by_geek_file_idx";
  DROP INDEX "home_page_videos_built_by_geek_videos_built_by_geek_mobi_idx";
  DROP INDEX "home_page_videos_built_by_geek_videos_built_by_geek_post_idx";
  DROP INDEX "_home_page_v_version_videos_hero_version_videos_hero_fil_idx";
  DROP INDEX "_home_page_v_version_videos_hero_version_videos_hero_mob_idx";
  DROP INDEX "_home_page_v_version_videos_hero_version_videos_hero_pos_idx";
  DROP INDEX "_home_page_v_version_videos_build_version_videos_build_f_idx";
  DROP INDEX "_home_page_v_version_videos_build_version_videos_build_m_idx";
  DROP INDEX "_home_page_v_version_videos_build_version_videos_build_p_idx";
  DROP INDEX "_home_page_v_version_videos_built_by_geek_version_videos_idx";
  DROP INDEX "_home_page_v_version_videos_built_by_geek_version_vide_1_idx";
  DROP INDEX "_home_page_v_version_videos_built_by_geek_version_vide_2_idx";
  ALTER TABLE "projects" DROP COLUMN "hero_video_media_source";
  ALTER TABLE "projects" DROP COLUMN "hero_video_media_file_id";
  ALTER TABLE "projects" DROP COLUMN "hero_video_media_mobile_file_id";
  ALTER TABLE "projects" DROP COLUMN "hero_video_media_youtube_url";
  ALTER TABLE "projects" DROP COLUMN "hero_video_media_poster_id";
  ALTER TABLE "_projects_v" DROP COLUMN "version_hero_video_media_source";
  ALTER TABLE "_projects_v" DROP COLUMN "version_hero_video_media_file_id";
  ALTER TABLE "_projects_v" DROP COLUMN "version_hero_video_media_mobile_file_id";
  ALTER TABLE "_projects_v" DROP COLUMN "version_hero_video_media_youtube_url";
  ALTER TABLE "_projects_v" DROP COLUMN "version_hero_video_media_poster_id";
  ALTER TABLE "home_page" DROP COLUMN "videos_hero_source";
  ALTER TABLE "home_page" DROP COLUMN "videos_hero_file_id";
  ALTER TABLE "home_page" DROP COLUMN "videos_hero_mobile_file_id";
  ALTER TABLE "home_page" DROP COLUMN "videos_hero_youtube_url";
  ALTER TABLE "home_page" DROP COLUMN "videos_hero_poster_id";
  ALTER TABLE "home_page" DROP COLUMN "videos_build_source";
  ALTER TABLE "home_page" DROP COLUMN "videos_build_file_id";
  ALTER TABLE "home_page" DROP COLUMN "videos_build_mobile_file_id";
  ALTER TABLE "home_page" DROP COLUMN "videos_build_youtube_url";
  ALTER TABLE "home_page" DROP COLUMN "videos_build_poster_id";
  ALTER TABLE "home_page" DROP COLUMN "videos_built_by_geek_source";
  ALTER TABLE "home_page" DROP COLUMN "videos_built_by_geek_file_id";
  ALTER TABLE "home_page" DROP COLUMN "videos_built_by_geek_mobile_file_id";
  ALTER TABLE "home_page" DROP COLUMN "videos_built_by_geek_youtube_url";
  ALTER TABLE "home_page" DROP COLUMN "videos_built_by_geek_poster_id";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_videos_hero_source";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_videos_hero_file_id";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_videos_hero_mobile_file_id";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_videos_hero_youtube_url";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_videos_hero_poster_id";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_videos_build_source";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_videos_build_file_id";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_videos_build_mobile_file_id";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_videos_build_youtube_url";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_videos_build_poster_id";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_videos_built_by_geek_source";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_videos_built_by_geek_file_id";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_videos_built_by_geek_mobile_file_id";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_videos_built_by_geek_youtube_url";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_videos_built_by_geek_poster_id";
  ALTER TABLE "site_settings" DROP COLUMN "floating_contact_whatsapp_number";
  ALTER TABLE "site_settings" DROP COLUMN "floating_contact_whatsapp_message";
  ALTER TABLE "site_settings" DROP COLUMN "floating_contact_instagram_url";
  ALTER TABLE "site_settings" DROP COLUMN "floating_contact_hide_buttons";
  ALTER TABLE "_site_settings_v" DROP COLUMN "version_floating_contact_whatsapp_number";
  ALTER TABLE "_site_settings_v" DROP COLUMN "version_floating_contact_whatsapp_message";
  ALTER TABLE "_site_settings_v" DROP COLUMN "version_floating_contact_instagram_url";
  ALTER TABLE "_site_settings_v" DROP COLUMN "version_floating_contact_hide_buttons";
  DROP TYPE "public"."enum_projects_blocks_video_block_video_source";
  DROP TYPE "public"."enum_projects_hero_video_media_source";
  DROP TYPE "public"."enum__projects_v_blocks_video_block_video_source";
  DROP TYPE "public"."enum__projects_v_version_hero_video_media_source";
  DROP TYPE "public"."enum_home_page_videos_hero_source";
  DROP TYPE "public"."enum_home_page_videos_build_source";
  DROP TYPE "public"."enum_home_page_videos_built_by_geek_source";
  DROP TYPE "public"."enum__home_page_v_version_videos_hero_source";
  DROP TYPE "public"."enum__home_page_v_version_videos_build_source";
  DROP TYPE "public"."enum__home_page_v_version_videos_built_by_geek_source";
  DROP TYPE "public"."enum_work_page_status";
  DROP TYPE "public"."enum__work_page_v_version_status";
  DROP TYPE "public"."enum_door_pages_status";
  DROP TYPE "public"."enum__door_pages_v_version_status";`)
}
