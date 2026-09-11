import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_creators_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__creators_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "creators_page_one_degree_opportunities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "creators_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_heading_block" varchar,
  	"hero_heading_highlight" varchar,
  	"hero_subline" varchar,
  	"hero_cta_label" varchar,
  	"hero_cta_href" varchar,
  	"one_degree_heading" varchar,
  	"one_degree_body" varchar,
  	"why_geek_eyebrow" varchar,
  	"why_geek_heading" varchar,
  	"why_geek_heading_highlight" varchar,
  	"join_eyebrow" varchar,
  	"join_heading" varchar,
  	"join_subcopy" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_noindex" boolean,
  	"_status" "enum_creators_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_creators_page_v_version_one_degree_opportunities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_creators_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_heading_block" varchar,
  	"version_hero_heading_highlight" varchar,
  	"version_hero_subline" varchar,
  	"version_hero_cta_label" varchar,
  	"version_hero_cta_href" varchar,
  	"version_one_degree_heading" varchar,
  	"version_one_degree_body" varchar,
  	"version_why_geek_eyebrow" varchar,
  	"version_why_geek_heading" varchar,
  	"version_why_geek_heading_highlight" varchar,
  	"version_join_eyebrow" varchar,
  	"version_join_heading" varchar,
  	"version_join_subcopy" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_noindex" boolean,
  	"version__status" "enum__creators_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "creators_page_one_degree_opportunities" ADD CONSTRAINT "creators_page_one_degree_opportunities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."creators_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "creators_page" ADD CONSTRAINT "creators_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_creators_page_v_version_one_degree_opportunities" ADD CONSTRAINT "_creators_page_v_version_one_degree_opportunities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_creators_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_creators_page_v" ADD CONSTRAINT "_creators_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "creators_page_one_degree_opportunities_order_idx" ON "creators_page_one_degree_opportunities" USING btree ("_order");
  CREATE INDEX "creators_page_one_degree_opportunities_parent_id_idx" ON "creators_page_one_degree_opportunities" USING btree ("_parent_id");
  CREATE INDEX "creators_page_seo_seo_og_image_idx" ON "creators_page" USING btree ("seo_og_image_id");
  CREATE INDEX "creators_page__status_idx" ON "creators_page" USING btree ("_status");
  CREATE INDEX "_creators_page_v_version_one_degree_opportunities_order_idx" ON "_creators_page_v_version_one_degree_opportunities" USING btree ("_order");
  CREATE INDEX "_creators_page_v_version_one_degree_opportunities_parent_id_idx" ON "_creators_page_v_version_one_degree_opportunities" USING btree ("_parent_id");
  CREATE INDEX "_creators_page_v_version_seo_version_seo_og_image_idx" ON "_creators_page_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_creators_page_v_version_version__status_idx" ON "_creators_page_v" USING btree ("version__status");
  CREATE INDEX "_creators_page_v_created_at_idx" ON "_creators_page_v" USING btree ("created_at");
  CREATE INDEX "_creators_page_v_updated_at_idx" ON "_creators_page_v" USING btree ("updated_at");
  CREATE INDEX "_creators_page_v_latest_idx" ON "_creators_page_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "creators_page_one_degree_opportunities" CASCADE;
  DROP TABLE "creators_page" CASCADE;
  DROP TABLE "_creators_page_v_version_one_degree_opportunities" CASCADE;
  DROP TABLE "_creators_page_v" CASCADE;
  DROP TYPE "public"."enum_creators_page_status";
  DROP TYPE "public"."enum__creators_page_v_version_status";`)
}
