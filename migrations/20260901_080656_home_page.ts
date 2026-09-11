import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "home_page_geek_way_principles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_heading_block" varchar,
  	"hero_heading_highlight" varchar,
  	"hero_subline" varchar,
  	"hero_cta_primary_label" varchar,
  	"hero_cta_primary_href" varchar,
  	"hero_cta_secondary_label" varchar,
  	"hero_cta_secondary_href" varchar,
  	"logo_wall_heading" varchar,
  	"logo_wall_heading_highlight" varchar,
  	"build_title" varchar,
  	"build_sub" varchar,
  	"build_trailing" varchar,
  	"create_title" varchar,
  	"create_sub" varchar,
  	"influence_eyebrow" varchar,
  	"influence_heading" varchar,
  	"influence_sub" varchar,
  	"influence_list" varchar,
  	"influence_link_label" varchar,
  	"influence_link_href" varchar,
  	"proof_eyebrow" varchar,
  	"proof_sub" varchar,
  	"process_heading" varchar,
  	"process_heading_highlight" varchar,
  	"process_trailing" varchar,
  	"built_by_geek_eyebrow" varchar,
  	"built_by_geek_heading_block" varchar,
  	"built_by_geek_heading_cyan" varchar,
  	"built_by_geek_closing" varchar,
  	"built_by_geek_closing_highlight" varchar,
  	"geek_way_title" varchar,
  	"geek_way_finale_block" varchar,
  	"geek_way_finale_highlight" varchar,
  	"geek_way_finale_sub" varchar,
  	"work_title" varchar,
  	"work_sub" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_noindex" boolean,
  	"_status" "enum_home_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_home_page_v_version_geek_way_principles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_heading_block" varchar,
  	"version_hero_heading_highlight" varchar,
  	"version_hero_subline" varchar,
  	"version_hero_cta_primary_label" varchar,
  	"version_hero_cta_primary_href" varchar,
  	"version_hero_cta_secondary_label" varchar,
  	"version_hero_cta_secondary_href" varchar,
  	"version_logo_wall_heading" varchar,
  	"version_logo_wall_heading_highlight" varchar,
  	"version_build_title" varchar,
  	"version_build_sub" varchar,
  	"version_build_trailing" varchar,
  	"version_create_title" varchar,
  	"version_create_sub" varchar,
  	"version_influence_eyebrow" varchar,
  	"version_influence_heading" varchar,
  	"version_influence_sub" varchar,
  	"version_influence_list" varchar,
  	"version_influence_link_label" varchar,
  	"version_influence_link_href" varchar,
  	"version_proof_eyebrow" varchar,
  	"version_proof_sub" varchar,
  	"version_process_heading" varchar,
  	"version_process_heading_highlight" varchar,
  	"version_process_trailing" varchar,
  	"version_built_by_geek_eyebrow" varchar,
  	"version_built_by_geek_heading_block" varchar,
  	"version_built_by_geek_heading_cyan" varchar,
  	"version_built_by_geek_closing" varchar,
  	"version_built_by_geek_closing_highlight" varchar,
  	"version_geek_way_title" varchar,
  	"version_geek_way_finale_block" varchar,
  	"version_geek_way_finale_highlight" varchar,
  	"version_geek_way_finale_sub" varchar,
  	"version_work_title" varchar,
  	"version_work_sub" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_noindex" boolean,
  	"version__status" "enum__home_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "home_page_geek_way_principles" ADD CONSTRAINT "home_page_geek_way_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_geek_way_principles" ADD CONSTRAINT "_home_page_v_version_geek_way_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_page_geek_way_principles_order_idx" ON "home_page_geek_way_principles" USING btree ("_order");
  CREATE INDEX "home_page_geek_way_principles_parent_id_idx" ON "home_page_geek_way_principles" USING btree ("_parent_id");
  CREATE INDEX "home_page_seo_seo_og_image_idx" ON "home_page" USING btree ("seo_og_image_id");
  CREATE INDEX "home_page__status_idx" ON "home_page" USING btree ("_status");
  CREATE INDEX "_home_page_v_version_geek_way_principles_order_idx" ON "_home_page_v_version_geek_way_principles" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_geek_way_principles_parent_id_idx" ON "_home_page_v_version_geek_way_principles" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_seo_version_seo_og_image_idx" ON "_home_page_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_home_page_v_version_version__status_idx" ON "_home_page_v" USING btree ("version__status");
  CREATE INDEX "_home_page_v_created_at_idx" ON "_home_page_v" USING btree ("created_at");
  CREATE INDEX "_home_page_v_updated_at_idx" ON "_home_page_v" USING btree ("updated_at");
  CREATE INDEX "_home_page_v_latest_idx" ON "_home_page_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_page_geek_way_principles" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "_home_page_v_version_geek_way_principles" CASCADE;
  DROP TABLE "_home_page_v" CASCADE;
  DROP TYPE "public"."enum_home_page_status";
  DROP TYPE "public"."enum__home_page_v_version_status";`)
}
