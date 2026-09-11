import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_social_links_platform" AS ENUM('instagram', 'linkedin', 'youtube', 'x', 'facebook');
  CREATE TYPE "public"."enum__site_settings_v_version_social_links_platform" AS ENUM('instagram', 'linkedin', 'youtube', 'x', 'facebook');
  CREATE TABLE "navigation_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"open_in_new_tab" boolean DEFAULT false
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_navigation_v_version_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"open_in_new_tab" boolean DEFAULT false,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_navigation_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_cta_label" varchar,
  	"version_cta_href" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"cta_heading_prefix" varchar,
  	"cta_heading_highlight" varchar,
  	"cta_heading_suffix" varchar,
  	"cta_button_label" varchar,
  	"cta_button_href" varchar,
  	"tagline" varchar,
  	"copyright_text" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_footer_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_cta_heading_prefix" varchar,
  	"version_cta_heading_highlight" varchar,
  	"version_cta_heading_suffix" varchar,
  	"version_cta_button_label" varchar,
  	"version_cta_button_href" varchar,
  	"version_tagline" varchar,
  	"version_copyright_text" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_social_links_platform" NOT NULL,
  	"label" varchar,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"short" varchar,
  	"description" varchar,
  	"seo_default_title" varchar,
  	"seo_title_template" varchar,
  	"seo_default_description" varchar,
  	"seo_default_og_image_id" integer,
  	"seo_org_name" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_site_settings_v_version_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"platform" "enum__site_settings_v_version_social_links_platform" NOT NULL,
  	"label" varchar,
  	"url" varchar NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_settings_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_name" varchar,
  	"version_short" varchar,
  	"version_description" varchar,
  	"version_seo_default_title" varchar,
  	"version_seo_title_template" varchar,
  	"version_seo_default_description" varchar,
  	"version_seo_default_og_image_id" integer,
  	"version_seo_org_name" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "navigation_items" ADD CONSTRAINT "navigation_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_navigation_v_version_items" ADD CONSTRAINT "_navigation_v_version_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_navigation_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social_links" ADD CONSTRAINT "site_settings_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_seo_default_og_image_id_media_id_fk" FOREIGN KEY ("seo_default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_site_settings_v_version_social_links" ADD CONSTRAINT "_site_settings_v_version_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_settings_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_settings_v" ADD CONSTRAINT "_site_settings_v_version_seo_default_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "navigation_items_order_idx" ON "navigation_items" USING btree ("_order");
  CREATE INDEX "navigation_items_parent_id_idx" ON "navigation_items" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_version_items_order_idx" ON "_navigation_v_version_items" USING btree ("_order");
  CREATE INDEX "_navigation_v_version_items_parent_id_idx" ON "_navigation_v_version_items" USING btree ("_parent_id");
  CREATE INDEX "_navigation_v_created_at_idx" ON "_navigation_v" USING btree ("created_at");
  CREATE INDEX "_navigation_v_updated_at_idx" ON "_navigation_v" USING btree ("updated_at");
  CREATE INDEX "_footer_v_created_at_idx" ON "_footer_v" USING btree ("created_at");
  CREATE INDEX "_footer_v_updated_at_idx" ON "_footer_v" USING btree ("updated_at");
  CREATE INDEX "site_settings_social_links_order_idx" ON "site_settings_social_links" USING btree ("_order");
  CREATE INDEX "site_settings_social_links_parent_id_idx" ON "site_settings_social_links" USING btree ("_parent_id");
  CREATE INDEX "site_settings_seo_seo_default_og_image_idx" ON "site_settings" USING btree ("seo_default_og_image_id");
  CREATE INDEX "_site_settings_v_version_social_links_order_idx" ON "_site_settings_v_version_social_links" USING btree ("_order");
  CREATE INDEX "_site_settings_v_version_social_links_parent_id_idx" ON "_site_settings_v_version_social_links" USING btree ("_parent_id");
  CREATE INDEX "_site_settings_v_version_seo_version_seo_default_og_imag_idx" ON "_site_settings_v" USING btree ("version_seo_default_og_image_id");
  CREATE INDEX "_site_settings_v_created_at_idx" ON "_site_settings_v" USING btree ("created_at");
  CREATE INDEX "_site_settings_v_updated_at_idx" ON "_site_settings_v" USING btree ("updated_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "navigation_items" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "_navigation_v_version_items" CASCADE;
  DROP TABLE "_navigation_v" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TABLE "_footer_v" CASCADE;
  DROP TABLE "site_settings_social_links" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "_site_settings_v_version_social_links" CASCADE;
  DROP TABLE "_site_settings_v" CASCADE;
  DROP TYPE "public"."enum_site_settings_social_links_platform";
  DROP TYPE "public"."enum__site_settings_v_version_social_links_platform";`)
}
