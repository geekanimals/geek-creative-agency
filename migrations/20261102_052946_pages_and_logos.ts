import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_build_my_brand_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__build_my_brand_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_careers_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__careers_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_partners_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__partners_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "home_page_logo_wall_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer
  );
  
  CREATE TABLE "_home_page_v_version_logo_wall_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"logo_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "build_my_brand_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"intro" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_noindex" boolean,
  	"_status" "enum_build_my_brand_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_build_my_brand_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_title" varchar,
  	"version_intro" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_noindex" boolean,
  	"version__status" "enum__build_my_brand_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "careers_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"intro" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_noindex" boolean,
  	"_status" "enum_careers_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_careers_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_title" varchar,
  	"version_intro" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_noindex" boolean,
  	"version__status" "enum__careers_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "partners_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"intro" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_noindex" boolean,
  	"_status" "enum_partners_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "_partners_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_title" varchar,
  	"version_intro" varchar,
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_noindex" boolean,
  	"version__status" "enum__partners_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "projects" ADD COLUMN "brand_logo_id" integer;
  ALTER TABLE "_projects_v" ADD COLUMN "version_brand_logo_id" integer;
  ALTER TABLE "home_page_logo_wall_logos" ADD CONSTRAINT "home_page_logo_wall_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_logo_wall_logos" ADD CONSTRAINT "home_page_logo_wall_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_logo_wall_logos" ADD CONSTRAINT "_home_page_v_version_logo_wall_logos_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_logo_wall_logos" ADD CONSTRAINT "_home_page_v_version_logo_wall_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "build_my_brand_page" ADD CONSTRAINT "build_my_brand_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_build_my_brand_page_v" ADD CONSTRAINT "_build_my_brand_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "careers_page" ADD CONSTRAINT "careers_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_careers_page_v" ADD CONSTRAINT "_careers_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partners_page" ADD CONSTRAINT "partners_page_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_partners_page_v" ADD CONSTRAINT "_partners_page_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_page_logo_wall_logos_order_idx" ON "home_page_logo_wall_logos" USING btree ("_order");
  CREATE INDEX "home_page_logo_wall_logos_parent_id_idx" ON "home_page_logo_wall_logos" USING btree ("_parent_id");
  CREATE INDEX "home_page_logo_wall_logos_logo_idx" ON "home_page_logo_wall_logos" USING btree ("logo_id");
  CREATE INDEX "_home_page_v_version_logo_wall_logos_order_idx" ON "_home_page_v_version_logo_wall_logos" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_logo_wall_logos_parent_id_idx" ON "_home_page_v_version_logo_wall_logos" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_logo_wall_logos_logo_idx" ON "_home_page_v_version_logo_wall_logos" USING btree ("logo_id");
  CREATE INDEX "build_my_brand_page_seo_seo_og_image_idx" ON "build_my_brand_page" USING btree ("seo_og_image_id");
  CREATE INDEX "build_my_brand_page__status_idx" ON "build_my_brand_page" USING btree ("_status");
  CREATE INDEX "_build_my_brand_page_v_version_seo_version_seo_og_image_idx" ON "_build_my_brand_page_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_build_my_brand_page_v_version_version__status_idx" ON "_build_my_brand_page_v" USING btree ("version__status");
  CREATE INDEX "_build_my_brand_page_v_created_at_idx" ON "_build_my_brand_page_v" USING btree ("created_at");
  CREATE INDEX "_build_my_brand_page_v_updated_at_idx" ON "_build_my_brand_page_v" USING btree ("updated_at");
  CREATE INDEX "_build_my_brand_page_v_latest_idx" ON "_build_my_brand_page_v" USING btree ("latest");
  CREATE INDEX "careers_page_seo_seo_og_image_idx" ON "careers_page" USING btree ("seo_og_image_id");
  CREATE INDEX "careers_page__status_idx" ON "careers_page" USING btree ("_status");
  CREATE INDEX "_careers_page_v_version_seo_version_seo_og_image_idx" ON "_careers_page_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_careers_page_v_version_version__status_idx" ON "_careers_page_v" USING btree ("version__status");
  CREATE INDEX "_careers_page_v_created_at_idx" ON "_careers_page_v" USING btree ("created_at");
  CREATE INDEX "_careers_page_v_updated_at_idx" ON "_careers_page_v" USING btree ("updated_at");
  CREATE INDEX "_careers_page_v_latest_idx" ON "_careers_page_v" USING btree ("latest");
  CREATE INDEX "partners_page_seo_seo_og_image_idx" ON "partners_page" USING btree ("seo_og_image_id");
  CREATE INDEX "partners_page__status_idx" ON "partners_page" USING btree ("_status");
  CREATE INDEX "_partners_page_v_version_seo_version_seo_og_image_idx" ON "_partners_page_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_partners_page_v_version_version__status_idx" ON "_partners_page_v" USING btree ("version__status");
  CREATE INDEX "_partners_page_v_created_at_idx" ON "_partners_page_v" USING btree ("created_at");
  CREATE INDEX "_partners_page_v_updated_at_idx" ON "_partners_page_v" USING btree ("updated_at");
  CREATE INDEX "_partners_page_v_latest_idx" ON "_partners_page_v" USING btree ("latest");
  ALTER TABLE "projects" ADD CONSTRAINT "projects_brand_logo_id_media_id_fk" FOREIGN KEY ("brand_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_brand_logo_id_media_id_fk" FOREIGN KEY ("version_brand_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_brand_logo_idx" ON "projects" USING btree ("brand_logo_id");
  CREATE INDEX "_projects_v_version_version_brand_logo_idx" ON "_projects_v" USING btree ("version_brand_logo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page_logo_wall_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_version_logo_wall_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "build_my_brand_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_build_my_brand_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "careers_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_careers_page_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "partners_page" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_partners_page_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "home_page_logo_wall_logos" CASCADE;
  DROP TABLE "_home_page_v_version_logo_wall_logos" CASCADE;
  DROP TABLE "build_my_brand_page" CASCADE;
  DROP TABLE "_build_my_brand_page_v" CASCADE;
  DROP TABLE "careers_page" CASCADE;
  DROP TABLE "_careers_page_v" CASCADE;
  DROP TABLE "partners_page" CASCADE;
  DROP TABLE "_partners_page_v" CASCADE;
  ALTER TABLE "projects" DROP CONSTRAINT "projects_brand_logo_id_media_id_fk";
  
  ALTER TABLE "_projects_v" DROP CONSTRAINT "_projects_v_version_brand_logo_id_media_id_fk";
  
  DROP INDEX "projects_brand_logo_idx";
  DROP INDEX "_projects_v_version_version_brand_logo_idx";
  ALTER TABLE "projects" DROP COLUMN "brand_logo_id";
  ALTER TABLE "_projects_v" DROP COLUMN "version_brand_logo_id";
  DROP TYPE "public"."enum_build_my_brand_page_status";
  DROP TYPE "public"."enum__build_my_brand_page_v_version_status";
  DROP TYPE "public"."enum_careers_page_status";
  DROP TYPE "public"."enum__careers_page_v_version_status";
  DROP TYPE "public"."enum_partners_page_status";
  DROP TYPE "public"."enum__partners_page_v_version_status";`)
}
