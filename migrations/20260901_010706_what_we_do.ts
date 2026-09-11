import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_what_we_do_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__what_we_do_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "what_we_do_capabilities_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "what_we_do_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"thought" varchar,
  	"thought_highlight" varchar,
  	"link_label" varchar,
  	"link_href" varchar
  );
  
  CREATE TABLE "what_we_do" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_block1" varchar,
  	"hero_block2" varchar,
  	"hero_highlight" varchar,
  	"hero_intro" varchar,
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_noindex" boolean,
  	"_status" "enum_what_we_do_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_what_we_do_v_version_capabilities_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_what_we_do_v_version_capabilities" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"thought" varchar,
  	"thought_highlight" varchar,
  	"link_label" varchar,
  	"link_href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_what_we_do_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_block1" varchar,
  	"version_hero_block2" varchar,
  	"version_hero_highlight" varchar,
  	"version_hero_intro" varchar,
  	"version_cta_label" varchar,
  	"version_cta_href" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_noindex" boolean,
  	"version__status" "enum__what_we_do_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "what_we_do_capabilities_items" ADD CONSTRAINT "what_we_do_capabilities_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."what_we_do_capabilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "what_we_do_capabilities" ADD CONSTRAINT "what_we_do_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."what_we_do"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "what_we_do" ADD CONSTRAINT "what_we_do_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_what_we_do_v_version_capabilities_items" ADD CONSTRAINT "_what_we_do_v_version_capabilities_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_what_we_do_v_version_capabilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_what_we_do_v_version_capabilities" ADD CONSTRAINT "_what_we_do_v_version_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_what_we_do_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_what_we_do_v" ADD CONSTRAINT "_what_we_do_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "what_we_do_capabilities_items_order_idx" ON "what_we_do_capabilities_items" USING btree ("_order");
  CREATE INDEX "what_we_do_capabilities_items_parent_id_idx" ON "what_we_do_capabilities_items" USING btree ("_parent_id");
  CREATE INDEX "what_we_do_capabilities_order_idx" ON "what_we_do_capabilities" USING btree ("_order");
  CREATE INDEX "what_we_do_capabilities_parent_id_idx" ON "what_we_do_capabilities" USING btree ("_parent_id");
  CREATE INDEX "what_we_do_seo_seo_og_image_idx" ON "what_we_do" USING btree ("seo_og_image_id");
  CREATE INDEX "what_we_do__status_idx" ON "what_we_do" USING btree ("_status");
  CREATE INDEX "_what_we_do_v_version_capabilities_items_order_idx" ON "_what_we_do_v_version_capabilities_items" USING btree ("_order");
  CREATE INDEX "_what_we_do_v_version_capabilities_items_parent_id_idx" ON "_what_we_do_v_version_capabilities_items" USING btree ("_parent_id");
  CREATE INDEX "_what_we_do_v_version_capabilities_order_idx" ON "_what_we_do_v_version_capabilities" USING btree ("_order");
  CREATE INDEX "_what_we_do_v_version_capabilities_parent_id_idx" ON "_what_we_do_v_version_capabilities" USING btree ("_parent_id");
  CREATE INDEX "_what_we_do_v_version_seo_version_seo_og_image_idx" ON "_what_we_do_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_what_we_do_v_version_version__status_idx" ON "_what_we_do_v" USING btree ("version__status");
  CREATE INDEX "_what_we_do_v_created_at_idx" ON "_what_we_do_v" USING btree ("created_at");
  CREATE INDEX "_what_we_do_v_updated_at_idx" ON "_what_we_do_v" USING btree ("updated_at");
  CREATE INDEX "_what_we_do_v_latest_idx" ON "_what_we_do_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "what_we_do_capabilities_items" CASCADE;
  DROP TABLE "what_we_do_capabilities" CASCADE;
  DROP TABLE "what_we_do" CASCADE;
  DROP TABLE "_what_we_do_v_version_capabilities_items" CASCADE;
  DROP TABLE "_what_we_do_v_version_capabilities" CASCADE;
  DROP TABLE "_what_we_do_v" CASCADE;
  DROP TYPE "public"."enum_what_we_do_status";
  DROP TYPE "public"."enum__what_we_do_v_version_status";`)
}
