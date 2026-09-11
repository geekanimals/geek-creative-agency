import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_insights_category" AS ENUM('geek-decoded', 'creator-economy', 'brand-building', 'social-culture', 'whats-next', 'case-study-learnings');
  CREATE TYPE "public"."enum_insights_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__insights_v_version_category" AS ENUM('geek-decoded', 'creator-economy', 'brand-building', 'social-culture', 'whats-next', 'case-study-learnings');
  CREATE TYPE "public"."enum__insights_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "insights" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"publish_date" timestamp(3) with time zone,
  	"hero_media_id" integer,
  	"hero_legacy_src" varchar,
  	"body" jsonb,
  	"category" "enum_insights_category",
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"seo_og_image_id" integer,
  	"seo_noindex" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_insights_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_insights_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_publish_date" timestamp(3) with time zone,
  	"version_hero_media_id" integer,
  	"version_hero_legacy_src" varchar,
  	"version_body" jsonb,
  	"version_category" "enum__insights_v_version_category",
  	"version_seo_meta_title" varchar,
  	"version_seo_meta_description" varchar,
  	"version_seo_og_image_id" integer,
  	"version_seo_noindex" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__insights_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "insights_id" integer;
  ALTER TABLE "insights" ADD CONSTRAINT "insights_hero_media_id_media_id_fk" FOREIGN KEY ("hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "insights" ADD CONSTRAINT "insights_seo_og_image_id_media_id_fk" FOREIGN KEY ("seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_parent_id_insights_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."insights"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_version_hero_media_id_media_id_fk" FOREIGN KEY ("version_hero_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_insights_v" ADD CONSTRAINT "_insights_v_version_seo_og_image_id_media_id_fk" FOREIGN KEY ("version_seo_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE UNIQUE INDEX "insights_slug_idx" ON "insights" USING btree ("slug");
  CREATE INDEX "insights_hero_media_idx" ON "insights" USING btree ("hero_media_id");
  CREATE INDEX "insights_seo_seo_og_image_idx" ON "insights" USING btree ("seo_og_image_id");
  CREATE INDEX "insights_updated_at_idx" ON "insights" USING btree ("updated_at");
  CREATE INDEX "insights_created_at_idx" ON "insights" USING btree ("created_at");
  CREATE INDEX "insights__status_idx" ON "insights" USING btree ("_status");
  CREATE INDEX "_insights_v_parent_idx" ON "_insights_v" USING btree ("parent_id");
  CREATE INDEX "_insights_v_version_version_slug_idx" ON "_insights_v" USING btree ("version_slug");
  CREATE INDEX "_insights_v_version_version_hero_media_idx" ON "_insights_v" USING btree ("version_hero_media_id");
  CREATE INDEX "_insights_v_version_seo_version_seo_og_image_idx" ON "_insights_v" USING btree ("version_seo_og_image_id");
  CREATE INDEX "_insights_v_version_version_updated_at_idx" ON "_insights_v" USING btree ("version_updated_at");
  CREATE INDEX "_insights_v_version_version_created_at_idx" ON "_insights_v" USING btree ("version_created_at");
  CREATE INDEX "_insights_v_version_version__status_idx" ON "_insights_v" USING btree ("version__status");
  CREATE INDEX "_insights_v_created_at_idx" ON "_insights_v" USING btree ("created_at");
  CREATE INDEX "_insights_v_updated_at_idx" ON "_insights_v" USING btree ("updated_at");
  CREATE INDEX "_insights_v_latest_idx" ON "_insights_v" USING btree ("latest");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_insights_fk" FOREIGN KEY ("insights_id") REFERENCES "public"."insights"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_insights_id_idx" ON "payload_locked_documents_rels" USING btree ("insights_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "insights" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_insights_v" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "insights" CASCADE;
  DROP TABLE "_insights_v" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_insights_fk";
  
  DROP INDEX "payload_locked_documents_rels_insights_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "insights_id";
  DROP TYPE "public"."enum_insights_category";
  DROP TYPE "public"."enum_insights_status";
  DROP TYPE "public"."enum__insights_v_version_category";
  DROP TYPE "public"."enum__insights_v_version_status";`)
}
