import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_careers_page_openings_job_type" AS ENUM('full-time', 'internship', 'part-time', 'contract');
  CREATE TYPE "public"."enum__careers_page_v_version_openings_job_type" AS ENUM('full-time', 'internship', 'part-time', 'contract');
  ALTER TYPE "public"."enum_site_settings_social_links_platform" ADD VALUE 'slideshare';
  ALTER TYPE "public"."enum__site_settings_v_version_social_links_platform" ADD VALUE 'slideshare';
  CREATE TABLE "careers_page_openings" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"job_type" "enum_careers_page_openings_job_type" DEFAULT 'full-time',
  	"team" varchar,
  	"location" varchar,
  	"experience" varchar,
  	"summary" varchar,
  	"responsibilities" varchar,
  	"requirements" varchar,
  	"open" boolean DEFAULT true
  );
  
  CREATE TABLE "_careers_page_v_version_openings" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"job_type" "enum__careers_page_v_version_openings_job_type" DEFAULT 'full-time',
  	"team" varchar,
  	"location" varchar,
  	"experience" varchar,
  	"summary" varchar,
  	"responsibilities" varchar,
  	"requirements" varchar,
  	"open" boolean DEFAULT true,
  	"_uuid" varchar
  );
  
  ALTER TABLE "careers_page" ADD COLUMN "internship_show" boolean DEFAULT true;
  ALTER TABLE "careers_page" ADD COLUMN "internship_heading" varchar;
  ALTER TABLE "careers_page" ADD COLUMN "internship_body" varchar;
  ALTER TABLE "_careers_page_v" ADD COLUMN "version_internship_show" boolean DEFAULT true;
  ALTER TABLE "_careers_page_v" ADD COLUMN "version_internship_heading" varchar;
  ALTER TABLE "_careers_page_v" ADD COLUMN "version_internship_body" varchar;
  ALTER TABLE "careers_page_openings" ADD CONSTRAINT "careers_page_openings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."careers_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_careers_page_v_version_openings" ADD CONSTRAINT "_careers_page_v_version_openings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_careers_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "careers_page_openings_order_idx" ON "careers_page_openings" USING btree ("_order");
  CREATE INDEX "careers_page_openings_parent_id_idx" ON "careers_page_openings" USING btree ("_parent_id");
  CREATE INDEX "_careers_page_v_version_openings_order_idx" ON "_careers_page_v_version_openings" USING btree ("_order");
  CREATE INDEX "_careers_page_v_version_openings_parent_id_idx" ON "_careers_page_v_version_openings" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "careers_page_openings" CASCADE;
  DROP TABLE "_careers_page_v_version_openings" CASCADE;
  ALTER TABLE "site_settings_social_links" ALTER COLUMN "platform" SET DATA TYPE text;
  DROP TYPE "public"."enum_site_settings_social_links_platform";
  CREATE TYPE "public"."enum_site_settings_social_links_platform" AS ENUM('instagram', 'linkedin', 'youtube', 'x', 'facebook');
  ALTER TABLE "site_settings_social_links" ALTER COLUMN "platform" SET DATA TYPE "public"."enum_site_settings_social_links_platform" USING "platform"::"public"."enum_site_settings_social_links_platform";
  ALTER TABLE "_site_settings_v_version_social_links" ALTER COLUMN "platform" SET DATA TYPE text;
  DROP TYPE "public"."enum__site_settings_v_version_social_links_platform";
  CREATE TYPE "public"."enum__site_settings_v_version_social_links_platform" AS ENUM('instagram', 'linkedin', 'youtube', 'x', 'facebook');
  ALTER TABLE "_site_settings_v_version_social_links" ALTER COLUMN "platform" SET DATA TYPE "public"."enum__site_settings_v_version_social_links_platform" USING "platform"::"public"."enum__site_settings_v_version_social_links_platform";
  ALTER TABLE "careers_page" DROP COLUMN "internship_show";
  ALTER TABLE "careers_page" DROP COLUMN "internship_heading";
  ALTER TABLE "careers_page" DROP COLUMN "internship_body";
  ALTER TABLE "_careers_page_v" DROP COLUMN "version_internship_show";
  ALTER TABLE "_careers_page_v" DROP COLUMN "version_internship_heading";
  ALTER TABLE "_careers_page_v" DROP COLUMN "version_internship_body";
  DROP TYPE "public"."enum_careers_page_openings_job_type";
  DROP TYPE "public"."enum__careers_page_v_version_openings_job_type";`)
}
