import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_influence_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__influence_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "influence_page_tiers_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "influence_page_models_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"tag" varchar,
  	"body" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "influence_page_steps_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "influence_page_platform_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "influence_page_hampers_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"tag" varchar,
  	"body" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "influence_page_stories_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"tag" varchar,
  	"body" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "influence_page_clients_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "influence_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar,
  	"hero_heading" varchar,
  	"hero_highlight" varchar,
  	"hero_intro" varchar,
  	"hero_primary_label" varchar,
  	"hero_primary_href" varchar,
  	"hero_brand_login_label" varchar,
  	"hero_brand_login_href" varchar,
  	"tiers_heading" varchar,
  	"models_eyebrow" varchar,
  	"models_heading" varchar,
  	"steps_eyebrow" varchar,
  	"steps_heading" varchar,
  	"steps_closing" varchar,
  	"platform_eyebrow" varchar,
  	"platform_heading" varchar,
  	"platform_body" varchar,
  	"platform_button_label" varchar,
  	"platform_button_href" varchar,
  	"platform_creator_label" varchar,
  	"platform_creator_href" varchar,
  	"hampers_eyebrow" varchar,
  	"hampers_heading" varchar,
  	"hampers_intro" varchar,
  	"stories_eyebrow" varchar,
  	"stories_heading" varchar,
  	"clients_heading" varchar,
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
  	"_status" "enum_influence_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_influence_page_v_version_tiers_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_influence_page_v_version_models_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"tag" varchar,
  	"body" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_influence_page_v_version_steps_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_influence_page_v_version_platform_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_influence_page_v_version_hampers_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"tag" varchar,
  	"body" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_influence_page_v_version_stories_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"tag" varchar,
  	"body" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_influence_page_v_version_clients_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_influence_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_eyebrow" varchar,
  	"version_hero_heading" varchar,
  	"version_hero_highlight" varchar,
  	"version_hero_intro" varchar,
  	"version_hero_primary_label" varchar,
  	"version_hero_primary_href" varchar,
  	"version_hero_brand_login_label" varchar,
  	"version_hero_brand_login_href" varchar,
  	"version_tiers_heading" varchar,
  	"version_models_eyebrow" varchar,
  	"version_models_heading" varchar,
  	"version_steps_eyebrow" varchar,
  	"version_steps_heading" varchar,
  	"version_steps_closing" varchar,
  	"version_platform_eyebrow" varchar,
  	"version_platform_heading" varchar,
  	"version_platform_body" varchar,
  	"version_platform_button_label" varchar,
  	"version_platform_button_href" varchar,
  	"version_platform_creator_label" varchar,
  	"version_platform_creator_href" varchar,
  	"version_hampers_eyebrow" varchar,
  	"version_hampers_heading" varchar,
  	"version_hampers_intro" varchar,
  	"version_stories_eyebrow" varchar,
  	"version_stories_heading" varchar,
  	"version_clients_heading" varchar,
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
  	"version__status" "enum__influence_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "home_page" ADD COLUMN "influence_button_label" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_influence_button_label" varchar;
  ALTER TABLE "influence_page_tiers_items" ADD CONSTRAINT "influence_page_tiers_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."influence_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "influence_page_models_items" ADD CONSTRAINT "influence_page_models_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."influence_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "influence_page_steps_items" ADD CONSTRAINT "influence_page_steps_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."influence_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "influence_page_platform_features" ADD CONSTRAINT "influence_page_platform_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."influence_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "influence_page_hampers_items" ADD CONSTRAINT "influence_page_hampers_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."influence_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "influence_page_stories_items" ADD CONSTRAINT "influence_page_stories_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."influence_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "influence_page_clients_items" ADD CONSTRAINT "influence_page_clients_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."influence_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "influence_page" ADD CONSTRAINT "influence_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_influence_page_v_version_tiers_items" ADD CONSTRAINT "_influence_page_v_version_tiers_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_influence_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_influence_page_v_version_models_items" ADD CONSTRAINT "_influence_page_v_version_models_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_influence_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_influence_page_v_version_steps_items" ADD CONSTRAINT "_influence_page_v_version_steps_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_influence_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_influence_page_v_version_platform_features" ADD CONSTRAINT "_influence_page_v_version_platform_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_influence_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_influence_page_v_version_hampers_items" ADD CONSTRAINT "_influence_page_v_version_hampers_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_influence_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_influence_page_v_version_stories_items" ADD CONSTRAINT "_influence_page_v_version_stories_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_influence_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_influence_page_v_version_clients_items" ADD CONSTRAINT "_influence_page_v_version_clients_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_influence_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_influence_page_v" ADD CONSTRAINT "_influence_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "influence_page_tiers_items_order_idx" ON "influence_page_tiers_items" USING btree ("_order");
  CREATE INDEX "influence_page_tiers_items_parent_id_idx" ON "influence_page_tiers_items" USING btree ("_parent_id");
  CREATE INDEX "influence_page_models_items_order_idx" ON "influence_page_models_items" USING btree ("_order");
  CREATE INDEX "influence_page_models_items_parent_id_idx" ON "influence_page_models_items" USING btree ("_parent_id");
  CREATE INDEX "influence_page_steps_items_order_idx" ON "influence_page_steps_items" USING btree ("_order");
  CREATE INDEX "influence_page_steps_items_parent_id_idx" ON "influence_page_steps_items" USING btree ("_parent_id");
  CREATE INDEX "influence_page_platform_features_order_idx" ON "influence_page_platform_features" USING btree ("_order");
  CREATE INDEX "influence_page_platform_features_parent_id_idx" ON "influence_page_platform_features" USING btree ("_parent_id");
  CREATE INDEX "influence_page_hampers_items_order_idx" ON "influence_page_hampers_items" USING btree ("_order");
  CREATE INDEX "influence_page_hampers_items_parent_id_idx" ON "influence_page_hampers_items" USING btree ("_parent_id");
  CREATE INDEX "influence_page_stories_items_order_idx" ON "influence_page_stories_items" USING btree ("_order");
  CREATE INDEX "influence_page_stories_items_parent_id_idx" ON "influence_page_stories_items" USING btree ("_parent_id");
  CREATE INDEX "influence_page_clients_items_order_idx" ON "influence_page_clients_items" USING btree ("_order");
  CREATE INDEX "influence_page_clients_items_parent_id_idx" ON "influence_page_clients_items" USING btree ("_parent_id");
  CREATE INDEX "influence_page_seo_seo_og_image_idx" ON "influence_page" USING btree ("seo_og_image_id");
  CREATE INDEX "influence_page__status_idx" ON "influence_page" USING btree ("_status");
  CREATE INDEX "_influence_page_v_version_tiers_items_order_idx" ON "_influence_page_v_version_tiers_items" USING btree ("_order");
  CREATE INDEX "_influence_page_v_version_tiers_items_parent_id_idx" ON "_influence_page_v_version_tiers_items" USING btree ("_parent_id");
  CREATE INDEX "_influence_page_v_version_models_items_order_idx" ON "_influence_page_v_version_models_items" USING btree ("_order");
  CREATE INDEX "_influence_page_v_version_models_items_parent_id_idx" ON "_influence_page_v_version_models_items" USING btree ("_parent_id");
  CREATE INDEX "_influence_page_v_version_steps_items_order_idx" ON "_influence_page_v_version_steps_items" USING btree ("_order");
  CREATE INDEX "_influence_page_v_version_steps_items_parent_id_idx" ON "_influence_page_v_version_steps_items" USING btree ("_parent_id");
  CREATE INDEX "_influence_page_v_version_platform_features_order_idx" ON "_influence_page_v_version_platform_features" USING btree ("_order");
  CREATE INDEX "_influence_page_v_version_platform_features_parent_id_idx" ON "_influence_page_v_version_platform_features" USING btree ("_parent_id");
  CREATE INDEX "_influence_page_v_version_hampers_items_order_idx" ON "_influence_page_v_version_hampers_items" USING btree ("_order");
  CREATE INDEX "_influence_page_v_version_hampers_items_parent_id_idx" ON "_influence_page_v_version_hampers_items" USING btree ("_parent_id");
  CREATE INDEX "_influence_page_v_version_stories_items_order_idx" ON "_influence_page_v_version_stories_items" USING btree ("_order");
  CREATE INDEX "_influence_page_v_version_stories_items_parent_id_idx" ON "_influence_page_v_version_stories_items" USING btree ("_parent_id");
  CREATE INDEX "_influence_page_v_version_clients_items_order_idx" ON "_influence_page_v_version_clients_items" USING btree ("_order");
  CREATE INDEX "_influence_page_v_version_clients_items_parent_id_idx" ON "_influence_page_v_version_clients_items" USING btree ("_parent_id");
  CREATE INDEX "_influence_page_v_version_seo_version_seo_og_image_idx" ON "_influence_page_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_influence_page_v_version_version__status_idx" ON "_influence_page_v" USING btree ("version__status");
  CREATE INDEX "_influence_page_v_created_at_idx" ON "_influence_page_v" USING btree ("created_at");
  CREATE INDEX "_influence_page_v_updated_at_idx" ON "_influence_page_v" USING btree ("updated_at");
  CREATE INDEX "_influence_page_v_latest_idx" ON "_influence_page_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "influence_page_tiers_items" CASCADE;
  DROP TABLE "influence_page_models_items" CASCADE;
  DROP TABLE "influence_page_steps_items" CASCADE;
  DROP TABLE "influence_page_platform_features" CASCADE;
  DROP TABLE "influence_page_hampers_items" CASCADE;
  DROP TABLE "influence_page_stories_items" CASCADE;
  DROP TABLE "influence_page_clients_items" CASCADE;
  DROP TABLE "influence_page" CASCADE;
  DROP TABLE "_influence_page_v_version_tiers_items" CASCADE;
  DROP TABLE "_influence_page_v_version_models_items" CASCADE;
  DROP TABLE "_influence_page_v_version_steps_items" CASCADE;
  DROP TABLE "_influence_page_v_version_platform_features" CASCADE;
  DROP TABLE "_influence_page_v_version_hampers_items" CASCADE;
  DROP TABLE "_influence_page_v_version_stories_items" CASCADE;
  DROP TABLE "_influence_page_v_version_clients_items" CASCADE;
  DROP TABLE "_influence_page_v" CASCADE;
  ALTER TABLE "home_page" DROP COLUMN "influence_button_label";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_influence_button_label";
  DROP TYPE "public"."enum_influence_page_status";
  DROP TYPE "public"."enum__influence_page_v_version_status";`)
}
