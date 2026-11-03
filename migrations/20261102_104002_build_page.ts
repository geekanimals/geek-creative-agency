import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_build_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__build_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "build_page_phases_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "build_page_steps_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"link_label" varchar,
  	"link_href" varchar
  );
  
  CREATE TABLE "build_page_capabilities_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "build_page_portfolio_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar
  );
  
  CREATE TABLE "build_page_proof_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "build_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_highlight" varchar,
  	"hero_intro" varchar,
  	"phases_eyebrow" varchar,
  	"phases_heading" varchar,
  	"steps_eyebrow" varchar,
  	"steps_heading" varchar,
  	"steps_closing" varchar,
  	"capabilities_heading" varchar,
  	"showcase_eyebrow" varchar,
  	"showcase_heading" varchar,
  	"portfolio_heading" varchar,
  	"portfolio_note" varchar,
  	"proof_eyebrow" varchar,
  	"proof_heading" varchar,
  	"cta_heading" varchar,
  	"cta_highlight" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"cta_secondary_label" varchar,
  	"cta_secondary_href" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_noindex" boolean,
  	"_status" "enum_build_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "build_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer
  );
  
  CREATE TABLE "_build_page_v_version_phases_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_build_page_v_version_steps_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"link_label" varchar,
  	"link_href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_build_page_v_version_capabilities_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_build_page_v_version_portfolio_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_build_page_v_version_proof_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_build_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar,
  	"version_hero_heading" varchar,
  	"version_hero_highlight" varchar,
  	"version_hero_intro" varchar,
  	"version_phases_eyebrow" varchar,
  	"version_phases_heading" varchar,
  	"version_steps_eyebrow" varchar,
  	"version_steps_heading" varchar,
  	"version_steps_closing" varchar,
  	"version_capabilities_heading" varchar,
  	"version_showcase_eyebrow" varchar,
  	"version_showcase_heading" varchar,
  	"version_portfolio_heading" varchar,
  	"version_portfolio_note" varchar,
  	"version_proof_eyebrow" varchar,
  	"version_proof_heading" varchar,
  	"version_cta_heading" varchar,
  	"version_cta_highlight" varchar,
  	"version_cta_label" varchar,
  	"version_cta_href" varchar,
  	"version_cta_secondary_label" varchar,
  	"version_cta_secondary_href" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_noindex" boolean,
  	"version__status" "enum__build_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_build_page_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer
  );
  
  ALTER TABLE "home_page" ADD COLUMN "build_button_label" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_build_button_label" varchar;
  ALTER TABLE "build_page_phases_items" ADD CONSTRAINT "build_page_phases_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."build_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "build_page_steps_items" ADD CONSTRAINT "build_page_steps_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."build_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "build_page_capabilities_items" ADD CONSTRAINT "build_page_capabilities_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."build_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "build_page_portfolio_items" ADD CONSTRAINT "build_page_portfolio_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."build_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "build_page_proof_items" ADD CONSTRAINT "build_page_proof_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."build_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "build_page" ADD CONSTRAINT "build_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "build_page_rels" ADD CONSTRAINT "build_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."build_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "build_page_rels" ADD CONSTRAINT "build_page_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_build_page_v_version_phases_items" ADD CONSTRAINT "_build_page_v_version_phases_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_build_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_build_page_v_version_steps_items" ADD CONSTRAINT "_build_page_v_version_steps_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_build_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_build_page_v_version_capabilities_items" ADD CONSTRAINT "_build_page_v_version_capabilities_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_build_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_build_page_v_version_portfolio_items" ADD CONSTRAINT "_build_page_v_version_portfolio_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_build_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_build_page_v_version_proof_items" ADD CONSTRAINT "_build_page_v_version_proof_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_build_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_build_page_v" ADD CONSTRAINT "_build_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_build_page_v_rels" ADD CONSTRAINT "_build_page_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_build_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_build_page_v_rels" ADD CONSTRAINT "_build_page_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "build_page_phases_items_order_idx" ON "build_page_phases_items" USING btree ("_order");
  CREATE INDEX "build_page_phases_items_parent_id_idx" ON "build_page_phases_items" USING btree ("_parent_id");
  CREATE INDEX "build_page_steps_items_order_idx" ON "build_page_steps_items" USING btree ("_order");
  CREATE INDEX "build_page_steps_items_parent_id_idx" ON "build_page_steps_items" USING btree ("_parent_id");
  CREATE INDEX "build_page_capabilities_items_order_idx" ON "build_page_capabilities_items" USING btree ("_order");
  CREATE INDEX "build_page_capabilities_items_parent_id_idx" ON "build_page_capabilities_items" USING btree ("_parent_id");
  CREATE INDEX "build_page_portfolio_items_order_idx" ON "build_page_portfolio_items" USING btree ("_order");
  CREATE INDEX "build_page_portfolio_items_parent_id_idx" ON "build_page_portfolio_items" USING btree ("_parent_id");
  CREATE INDEX "build_page_proof_items_order_idx" ON "build_page_proof_items" USING btree ("_order");
  CREATE INDEX "build_page_proof_items_parent_id_idx" ON "build_page_proof_items" USING btree ("_parent_id");
  CREATE INDEX "build_page_seo_seo_og_image_idx" ON "build_page" USING btree ("seo_og_image_id");
  CREATE INDEX "build_page__status_idx" ON "build_page" USING btree ("_status");
  CREATE INDEX "build_page_rels_order_idx" ON "build_page_rels" USING btree ("order");
  CREATE INDEX "build_page_rels_parent_idx" ON "build_page_rels" USING btree ("parent_id");
  CREATE INDEX "build_page_rels_path_idx" ON "build_page_rels" USING btree ("path");
  CREATE INDEX "build_page_rels_projects_id_idx" ON "build_page_rels" USING btree ("projects_id");
  CREATE INDEX "_build_page_v_version_phases_items_order_idx" ON "_build_page_v_version_phases_items" USING btree ("_order");
  CREATE INDEX "_build_page_v_version_phases_items_parent_id_idx" ON "_build_page_v_version_phases_items" USING btree ("_parent_id");
  CREATE INDEX "_build_page_v_version_steps_items_order_idx" ON "_build_page_v_version_steps_items" USING btree ("_order");
  CREATE INDEX "_build_page_v_version_steps_items_parent_id_idx" ON "_build_page_v_version_steps_items" USING btree ("_parent_id");
  CREATE INDEX "_build_page_v_version_capabilities_items_order_idx" ON "_build_page_v_version_capabilities_items" USING btree ("_order");
  CREATE INDEX "_build_page_v_version_capabilities_items_parent_id_idx" ON "_build_page_v_version_capabilities_items" USING btree ("_parent_id");
  CREATE INDEX "_build_page_v_version_portfolio_items_order_idx" ON "_build_page_v_version_portfolio_items" USING btree ("_order");
  CREATE INDEX "_build_page_v_version_portfolio_items_parent_id_idx" ON "_build_page_v_version_portfolio_items" USING btree ("_parent_id");
  CREATE INDEX "_build_page_v_version_proof_items_order_idx" ON "_build_page_v_version_proof_items" USING btree ("_order");
  CREATE INDEX "_build_page_v_version_proof_items_parent_id_idx" ON "_build_page_v_version_proof_items" USING btree ("_parent_id");
  CREATE INDEX "_build_page_v_version_seo_version_seo_og_image_idx" ON "_build_page_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_build_page_v_version_version__status_idx" ON "_build_page_v" USING btree ("version__status");
  CREATE INDEX "_build_page_v_created_at_idx" ON "_build_page_v" USING btree ("created_at");
  CREATE INDEX "_build_page_v_updated_at_idx" ON "_build_page_v" USING btree ("updated_at");
  CREATE INDEX "_build_page_v_latest_idx" ON "_build_page_v" USING btree ("latest");
  CREATE INDEX "_build_page_v_rels_order_idx" ON "_build_page_v_rels" USING btree ("order");
  CREATE INDEX "_build_page_v_rels_parent_idx" ON "_build_page_v_rels" USING btree ("parent_id");
  CREATE INDEX "_build_page_v_rels_path_idx" ON "_build_page_v_rels" USING btree ("path");
  CREATE INDEX "_build_page_v_rels_projects_id_idx" ON "_build_page_v_rels" USING btree ("projects_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "build_page_phases_items" CASCADE;
  DROP TABLE "build_page_steps_items" CASCADE;
  DROP TABLE "build_page_capabilities_items" CASCADE;
  DROP TABLE "build_page_portfolio_items" CASCADE;
  DROP TABLE "build_page_proof_items" CASCADE;
  DROP TABLE "build_page" CASCADE;
  DROP TABLE "build_page_rels" CASCADE;
  DROP TABLE "_build_page_v_version_phases_items" CASCADE;
  DROP TABLE "_build_page_v_version_steps_items" CASCADE;
  DROP TABLE "_build_page_v_version_capabilities_items" CASCADE;
  DROP TABLE "_build_page_v_version_portfolio_items" CASCADE;
  DROP TABLE "_build_page_v_version_proof_items" CASCADE;
  DROP TABLE "_build_page_v" CASCADE;
  DROP TABLE "_build_page_v_rels" CASCADE;
  ALTER TABLE "home_page" DROP COLUMN "build_button_label";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_build_button_label";
  DROP TYPE "public"."enum_build_page_status";
  DROP TYPE "public"."enum__build_page_v_version_status";`)
}
