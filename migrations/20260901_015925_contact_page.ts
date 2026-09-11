import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_contact_page_doors_items_key" AS ENUM('client', 'creator', 'career', 'vendor');
  CREATE TYPE "public"."enum_contact_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__contact_page_v_version_doors_items_key" AS ENUM('client', 'creator', 'career', 'vendor');
  CREATE TYPE "public"."enum__contact_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "contact_page_doors_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"key" "enum_contact_page_doors_items_key",
  	"title" varchar,
  	"sub" varchar
  );
  
  CREATE TABLE "contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_heading_block" varchar,
  	"hero_heading_highlight" varchar,
  	"hero_form_eyebrow" varchar,
  	"doors_eyebrow" varchar,
  	"doors_heading" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_noindex" boolean,
  	"_status" "enum_contact_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_contact_page_v_version_doors_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" "enum__contact_page_v_version_doors_items_key",
  	"title" varchar,
  	"sub" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_contact_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_heading_block" varchar,
  	"version_hero_heading_highlight" varchar,
  	"version_hero_form_eyebrow" varchar,
  	"version_doors_eyebrow" varchar,
  	"version_doors_heading" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_noindex" boolean,
  	"version__status" "enum__contact_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "contact_page_doors_items" ADD CONSTRAINT "contact_page_doors_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_page" ADD CONSTRAINT "contact_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_contact_page_v_version_doors_items" ADD CONSTRAINT "_contact_page_v_version_doors_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_page_v" ADD CONSTRAINT "_contact_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "contact_page_doors_items_order_idx" ON "contact_page_doors_items" USING btree ("_order");
  CREATE INDEX "contact_page_doors_items_parent_id_idx" ON "contact_page_doors_items" USING btree ("_parent_id");
  CREATE INDEX "contact_page_seo_seo_og_image_idx" ON "contact_page" USING btree ("seo_og_image_id");
  CREATE INDEX "contact_page__status_idx" ON "contact_page" USING btree ("_status");
  CREATE INDEX "_contact_page_v_version_doors_items_order_idx" ON "_contact_page_v_version_doors_items" USING btree ("_order");
  CREATE INDEX "_contact_page_v_version_doors_items_parent_id_idx" ON "_contact_page_v_version_doors_items" USING btree ("_parent_id");
  CREATE INDEX "_contact_page_v_version_seo_version_seo_og_image_idx" ON "_contact_page_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_contact_page_v_version_version__status_idx" ON "_contact_page_v" USING btree ("version__status");
  CREATE INDEX "_contact_page_v_created_at_idx" ON "_contact_page_v" USING btree ("created_at");
  CREATE INDEX "_contact_page_v_updated_at_idx" ON "_contact_page_v" USING btree ("updated_at");
  CREATE INDEX "_contact_page_v_latest_idx" ON "_contact_page_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "contact_page_doors_items" CASCADE;
  DROP TABLE "contact_page" CASCADE;
  DROP TABLE "_contact_page_v_version_doors_items" CASCADE;
  DROP TABLE "_contact_page_v" CASCADE;
  DROP TYPE "public"."enum_contact_page_doors_items_key";
  DROP TYPE "public"."enum_contact_page_status";
  DROP TYPE "public"."enum__contact_page_v_version_doors_items_key";
  DROP TYPE "public"."enum__contact_page_v_version_status";`)
}
