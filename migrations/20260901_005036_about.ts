import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_about_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__about_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "about_hero_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "about_evolution_eras" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "about_geek_way_principles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "about" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_heading_line1" varchar,
  	"hero_heading_line2" varchar,
  	"hero_lead" varchar,
  	"evolution_eyebrow" varchar,
  	"evolution_heading_main" varchar,
  	"evolution_heading_muted" varchar,
  	"win_eyebrow" varchar,
  	"win_heading_line1" varchar,
  	"win_heading_line2" varchar,
  	"win_highlight" varchar,
  	"win_subcopy" varchar,
  	"geek_way_heading" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_noindex" boolean,
  	"_status" "enum_about_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_about_v_version_hero_paragraphs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_v_version_evolution_eras" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_v_version_geek_way_principles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_about_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_heading_line1" varchar,
  	"version_hero_heading_line2" varchar,
  	"version_hero_lead" varchar,
  	"version_evolution_eyebrow" varchar,
  	"version_evolution_heading_main" varchar,
  	"version_evolution_heading_muted" varchar,
  	"version_win_eyebrow" varchar,
  	"version_win_heading_line1" varchar,
  	"version_win_heading_line2" varchar,
  	"version_win_highlight" varchar,
  	"version_win_subcopy" varchar,
  	"version_geek_way_heading" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_noindex" boolean,
  	"version__status" "enum__about_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "about_hero_paragraphs" ADD CONSTRAINT "about_hero_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_evolution_eras" ADD CONSTRAINT "about_evolution_eras_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_geek_way_principles" ADD CONSTRAINT "about_geek_way_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about" ADD CONSTRAINT "about_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_about_v_version_hero_paragraphs" ADD CONSTRAINT "_about_v_version_hero_paragraphs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_v_version_evolution_eras" ADD CONSTRAINT "_about_v_version_evolution_eras_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_v_version_geek_way_principles" ADD CONSTRAINT "_about_v_version_geek_way_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_about_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_about_v" ADD CONSTRAINT "_about_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "about_hero_paragraphs_order_idx" ON "about_hero_paragraphs" USING btree ("_order");
  CREATE INDEX "about_hero_paragraphs_parent_id_idx" ON "about_hero_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "about_evolution_eras_order_idx" ON "about_evolution_eras" USING btree ("_order");
  CREATE INDEX "about_evolution_eras_parent_id_idx" ON "about_evolution_eras" USING btree ("_parent_id");
  CREATE INDEX "about_geek_way_principles_order_idx" ON "about_geek_way_principles" USING btree ("_order");
  CREATE INDEX "about_geek_way_principles_parent_id_idx" ON "about_geek_way_principles" USING btree ("_parent_id");
  CREATE INDEX "about_seo_seo_og_image_idx" ON "about" USING btree ("seo_og_image_id");
  CREATE INDEX "about__status_idx" ON "about" USING btree ("_status");
  CREATE INDEX "_about_v_version_hero_paragraphs_order_idx" ON "_about_v_version_hero_paragraphs" USING btree ("_order");
  CREATE INDEX "_about_v_version_hero_paragraphs_parent_id_idx" ON "_about_v_version_hero_paragraphs" USING btree ("_parent_id");
  CREATE INDEX "_about_v_version_evolution_eras_order_idx" ON "_about_v_version_evolution_eras" USING btree ("_order");
  CREATE INDEX "_about_v_version_evolution_eras_parent_id_idx" ON "_about_v_version_evolution_eras" USING btree ("_parent_id");
  CREATE INDEX "_about_v_version_geek_way_principles_order_idx" ON "_about_v_version_geek_way_principles" USING btree ("_order");
  CREATE INDEX "_about_v_version_geek_way_principles_parent_id_idx" ON "_about_v_version_geek_way_principles" USING btree ("_parent_id");
  CREATE INDEX "_about_v_version_seo_version_seo_og_image_idx" ON "_about_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_about_v_version_version__status_idx" ON "_about_v" USING btree ("version__status");
  CREATE INDEX "_about_v_created_at_idx" ON "_about_v" USING btree ("created_at");
  CREATE INDEX "_about_v_updated_at_idx" ON "_about_v" USING btree ("updated_at");
  CREATE INDEX "_about_v_latest_idx" ON "_about_v" USING btree ("latest");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "about_hero_paragraphs" CASCADE;
  DROP TABLE "about_evolution_eras" CASCADE;
  DROP TABLE "about_geek_way_principles" CASCADE;
  DROP TABLE "about" CASCADE;
  DROP TABLE "_about_v_version_hero_paragraphs" CASCADE;
  DROP TABLE "_about_v_version_evolution_eras" CASCADE;
  DROP TABLE "_about_v_version_geek_way_principles" CASCADE;
  DROP TABLE "_about_v" CASCADE;
  DROP TYPE "public"."enum_about_status";
  DROP TYPE "public"."enum__about_v_version_status";`)
}
