import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_page_hero_video_source" AS ENUM('none', 'upload', 'youtube');
  CREATE TYPE "public"."enum_home_page_build_video_source" AS ENUM('none', 'upload', 'youtube');
  CREATE TYPE "public"."enum_home_page_built_by_geek_video_source" AS ENUM('none', 'upload', 'youtube');
  CREATE TYPE "public"."enum__home_page_v_version_hero_video_source" AS ENUM('none', 'upload', 'youtube');
  CREATE TYPE "public"."enum__home_page_v_version_build_video_source" AS ENUM('none', 'upload', 'youtube');
  CREATE TYPE "public"."enum__home_page_v_version_built_by_geek_video_source" AS ENUM('none', 'upload', 'youtube');
  ALTER TABLE "home_page" ADD COLUMN "hero_video_source" "enum_home_page_hero_video_source" DEFAULT 'none';
  ALTER TABLE "home_page" ADD COLUMN "hero_video_file_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "hero_video_mobile_file_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "hero_video_youtube_url" varchar;
  ALTER TABLE "home_page" ADD COLUMN "hero_video_poster_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "build_video_source" "enum_home_page_build_video_source" DEFAULT 'none';
  ALTER TABLE "home_page" ADD COLUMN "build_video_file_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "build_video_mobile_file_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "build_video_youtube_url" varchar;
  ALTER TABLE "home_page" ADD COLUMN "build_video_poster_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "built_by_geek_video_source" "enum_home_page_built_by_geek_video_source" DEFAULT 'none';
  ALTER TABLE "home_page" ADD COLUMN "built_by_geek_video_file_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "built_by_geek_video_mobile_file_id" integer;
  ALTER TABLE "home_page" ADD COLUMN "built_by_geek_video_youtube_url" varchar;
  ALTER TABLE "home_page" ADD COLUMN "built_by_geek_video_poster_id" integer;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_hero_video_source" "enum__home_page_v_version_hero_video_source" DEFAULT 'none';
  ALTER TABLE "_home_page_v" ADD COLUMN "version_hero_video_file_id" integer;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_hero_video_mobile_file_id" integer;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_hero_video_youtube_url" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_hero_video_poster_id" integer;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_build_video_source" "enum__home_page_v_version_build_video_source" DEFAULT 'none';
  ALTER TABLE "_home_page_v" ADD COLUMN "version_build_video_file_id" integer;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_build_video_mobile_file_id" integer;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_build_video_youtube_url" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_build_video_poster_id" integer;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_built_by_geek_video_source" "enum__home_page_v_version_built_by_geek_video_source" DEFAULT 'none';
  ALTER TABLE "_home_page_v" ADD COLUMN "version_built_by_geek_video_file_id" integer;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_built_by_geek_video_mobile_file_id" integer;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_built_by_geek_video_youtube_url" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_built_by_geek_video_poster_id" integer;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_video_file_id_media_id_fk" FOREIGN KEY ("hero_video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_video_mobile_file_id_media_id_fk" FOREIGN KEY ("hero_video_mobile_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_hero_video_poster_id_media_id_fk" FOREIGN KEY ("hero_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_build_video_file_id_media_id_fk" FOREIGN KEY ("build_video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_build_video_mobile_file_id_media_id_fk" FOREIGN KEY ("build_video_mobile_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_build_video_poster_id_media_id_fk" FOREIGN KEY ("build_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_built_by_geek_video_file_id_media_id_fk" FOREIGN KEY ("built_by_geek_video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_built_by_geek_video_mobile_file_id_media_id_fk" FOREIGN KEY ("built_by_geek_video_mobile_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_built_by_geek_video_poster_id_media_id_fk" FOREIGN KEY ("built_by_geek_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_hero_video_file_id_media_id_fk" FOREIGN KEY ("version_hero_video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_hero_video_mobile_file_id_media_id_fk" FOREIGN KEY ("version_hero_video_mobile_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_hero_video_poster_id_media_id_fk" FOREIGN KEY ("version_hero_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_build_video_file_id_media_id_fk" FOREIGN KEY ("version_build_video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_build_video_mobile_file_id_media_id_fk" FOREIGN KEY ("version_build_video_mobile_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_build_video_poster_id_media_id_fk" FOREIGN KEY ("version_build_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_built_by_geek_video_file_id_media_id_fk" FOREIGN KEY ("version_built_by_geek_video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_built_by_geek_video_mobile_file_id_media_id_fk" FOREIGN KEY ("version_built_by_geek_video_mobile_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_built_by_geek_video_poster_id_media_id_fk" FOREIGN KEY ("version_built_by_geek_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "home_page_hero_video_hero_video_file_idx" ON "home_page" USING btree ("hero_video_file_id");
  CREATE INDEX "home_page_hero_video_hero_video_mobile_file_idx" ON "home_page" USING btree ("hero_video_mobile_file_id");
  CREATE INDEX "home_page_hero_video_hero_video_poster_idx" ON "home_page" USING btree ("hero_video_poster_id");
  CREATE INDEX "home_page_build_video_build_video_file_idx" ON "home_page" USING btree ("build_video_file_id");
  CREATE INDEX "home_page_build_video_build_video_mobile_file_idx" ON "home_page" USING btree ("build_video_mobile_file_id");
  CREATE INDEX "home_page_build_video_build_video_poster_idx" ON "home_page" USING btree ("build_video_poster_id");
  CREATE INDEX "home_page_built_by_geek_video_built_by_geek_video_file_idx" ON "home_page" USING btree ("built_by_geek_video_file_id");
  CREATE INDEX "home_page_built_by_geek_video_built_by_geek_video_mobile_idx" ON "home_page" USING btree ("built_by_geek_video_mobile_file_id");
  CREATE INDEX "home_page_built_by_geek_video_built_by_geek_video_poster_idx" ON "home_page" USING btree ("built_by_geek_video_poster_id");
  CREATE INDEX "_home_page_v_version_hero_video_version_hero_video_file_idx" ON "_home_page_v" USING btree ("version_hero_video_file_id");
  CREATE INDEX "_home_page_v_version_hero_video_version_hero_video_mobil_idx" ON "_home_page_v" USING btree ("version_hero_video_mobile_file_id");
  CREATE INDEX "_home_page_v_version_hero_video_version_hero_video_poste_idx" ON "_home_page_v" USING btree ("version_hero_video_poster_id");
  CREATE INDEX "_home_page_v_version_build_video_version_build_video_fil_idx" ON "_home_page_v" USING btree ("version_build_video_file_id");
  CREATE INDEX "_home_page_v_version_build_video_version_build_video_mob_idx" ON "_home_page_v" USING btree ("version_build_video_mobile_file_id");
  CREATE INDEX "_home_page_v_version_build_video_version_build_video_pos_idx" ON "_home_page_v" USING btree ("version_build_video_poster_id");
  CREATE INDEX "_home_page_v_version_built_by_geek_video_version_built_b_idx" ON "_home_page_v" USING btree ("version_built_by_geek_video_file_id");
  CREATE INDEX "_home_page_v_version_built_by_geek_video_version_built_1_idx" ON "_home_page_v" USING btree ("version_built_by_geek_video_mobile_file_id");
  CREATE INDEX "_home_page_v_version_built_by_geek_video_version_built_2_idx" ON "_home_page_v" USING btree ("version_built_by_geek_video_poster_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "home_page" DROP CONSTRAINT "home_page_hero_video_file_id_media_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_hero_video_mobile_file_id_media_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_hero_video_poster_id_media_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_build_video_file_id_media_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_build_video_mobile_file_id_media_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_build_video_poster_id_media_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_built_by_geek_video_file_id_media_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_built_by_geek_video_mobile_file_id_media_id_fk";
  
  ALTER TABLE "home_page" DROP CONSTRAINT "home_page_built_by_geek_video_poster_id_media_id_fk";
  
  ALTER TABLE "_home_page_v" DROP CONSTRAINT "_home_page_v_version_hero_video_file_id_media_id_fk";
  
  ALTER TABLE "_home_page_v" DROP CONSTRAINT "_home_page_v_version_hero_video_mobile_file_id_media_id_fk";
  
  ALTER TABLE "_home_page_v" DROP CONSTRAINT "_home_page_v_version_hero_video_poster_id_media_id_fk";
  
  ALTER TABLE "_home_page_v" DROP CONSTRAINT "_home_page_v_version_build_video_file_id_media_id_fk";
  
  ALTER TABLE "_home_page_v" DROP CONSTRAINT "_home_page_v_version_build_video_mobile_file_id_media_id_fk";
  
  ALTER TABLE "_home_page_v" DROP CONSTRAINT "_home_page_v_version_build_video_poster_id_media_id_fk";
  
  ALTER TABLE "_home_page_v" DROP CONSTRAINT "_home_page_v_version_built_by_geek_video_file_id_media_id_fk";
  
  ALTER TABLE "_home_page_v" DROP CONSTRAINT "_home_page_v_version_built_by_geek_video_mobile_file_id_media_id_fk";
  
  ALTER TABLE "_home_page_v" DROP CONSTRAINT "_home_page_v_version_built_by_geek_video_poster_id_media_id_fk";
  
  DROP INDEX "home_page_hero_video_hero_video_file_idx";
  DROP INDEX "home_page_hero_video_hero_video_mobile_file_idx";
  DROP INDEX "home_page_hero_video_hero_video_poster_idx";
  DROP INDEX "home_page_build_video_build_video_file_idx";
  DROP INDEX "home_page_build_video_build_video_mobile_file_idx";
  DROP INDEX "home_page_build_video_build_video_poster_idx";
  DROP INDEX "home_page_built_by_geek_video_built_by_geek_video_file_idx";
  DROP INDEX "home_page_built_by_geek_video_built_by_geek_video_mobile_idx";
  DROP INDEX "home_page_built_by_geek_video_built_by_geek_video_poster_idx";
  DROP INDEX "_home_page_v_version_hero_video_version_hero_video_file_idx";
  DROP INDEX "_home_page_v_version_hero_video_version_hero_video_mobil_idx";
  DROP INDEX "_home_page_v_version_hero_video_version_hero_video_poste_idx";
  DROP INDEX "_home_page_v_version_build_video_version_build_video_fil_idx";
  DROP INDEX "_home_page_v_version_build_video_version_build_video_mob_idx";
  DROP INDEX "_home_page_v_version_build_video_version_build_video_pos_idx";
  DROP INDEX "_home_page_v_version_built_by_geek_video_version_built_b_idx";
  DROP INDEX "_home_page_v_version_built_by_geek_video_version_built_1_idx";
  DROP INDEX "_home_page_v_version_built_by_geek_video_version_built_2_idx";
  ALTER TABLE "home_page" DROP COLUMN "hero_video_source";
  ALTER TABLE "home_page" DROP COLUMN "hero_video_file_id";
  ALTER TABLE "home_page" DROP COLUMN "hero_video_mobile_file_id";
  ALTER TABLE "home_page" DROP COLUMN "hero_video_youtube_url";
  ALTER TABLE "home_page" DROP COLUMN "hero_video_poster_id";
  ALTER TABLE "home_page" DROP COLUMN "build_video_source";
  ALTER TABLE "home_page" DROP COLUMN "build_video_file_id";
  ALTER TABLE "home_page" DROP COLUMN "build_video_mobile_file_id";
  ALTER TABLE "home_page" DROP COLUMN "build_video_youtube_url";
  ALTER TABLE "home_page" DROP COLUMN "build_video_poster_id";
  ALTER TABLE "home_page" DROP COLUMN "built_by_geek_video_source";
  ALTER TABLE "home_page" DROP COLUMN "built_by_geek_video_file_id";
  ALTER TABLE "home_page" DROP COLUMN "built_by_geek_video_mobile_file_id";
  ALTER TABLE "home_page" DROP COLUMN "built_by_geek_video_youtube_url";
  ALTER TABLE "home_page" DROP COLUMN "built_by_geek_video_poster_id";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_hero_video_source";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_hero_video_file_id";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_hero_video_mobile_file_id";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_hero_video_youtube_url";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_hero_video_poster_id";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_build_video_source";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_build_video_file_id";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_build_video_mobile_file_id";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_build_video_youtube_url";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_build_video_poster_id";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_built_by_geek_video_source";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_built_by_geek_video_file_id";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_built_by_geek_video_mobile_file_id";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_built_by_geek_video_youtube_url";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_built_by_geek_video_poster_id";
  DROP TYPE "public"."enum_home_page_hero_video_source";
  DROP TYPE "public"."enum_home_page_build_video_source";
  DROP TYPE "public"."enum_home_page_built_by_geek_video_source";
  DROP TYPE "public"."enum__home_page_v_version_hero_video_source";
  DROP TYPE "public"."enum__home_page_v_version_build_video_source";
  DROP TYPE "public"."enum__home_page_v_version_built_by_geek_video_source";`)
}
