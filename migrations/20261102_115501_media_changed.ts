import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_home_page_media_changed_eras_video_source" AS ENUM('none', 'upload', 'youtube');
  CREATE TYPE "public"."enum__home_page_v_version_media_changed_eras_video_source" AS ENUM('none', 'upload', 'youtube');
  CREATE TABLE "home_page_media_changed_eras" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"pre" varchar,
  	"post" varchar,
  	"image_id" integer,
  	"href" varchar,
  	"video_source" "enum_home_page_media_changed_eras_video_source" DEFAULT 'none',
  	"video_file_id" integer,
  	"video_mobile_file_id" integer,
  	"video_youtube_url" varchar,
  	"video_poster_id" integer,
  	"label" varchar,
  	"animated" boolean
  );
  
  CREATE TABLE "_home_page_v_version_media_changed_eras" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"pre" varchar,
  	"post" varchar,
  	"image_id" integer,
  	"href" varchar,
  	"video_source" "enum__home_page_v_version_media_changed_eras_video_source" DEFAULT 'none',
  	"video_file_id" integer,
  	"video_mobile_file_id" integer,
  	"video_youtube_url" varchar,
  	"video_poster_id" integer,
  	"label" varchar,
  	"animated" boolean,
  	"_uuid" varchar
  );
  
  ALTER TABLE "home_page" ADD COLUMN "media_changed_finale_kicker" varchar;
  ALTER TABLE "home_page" ADD COLUMN "media_changed_finale_word" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_media_changed_finale_kicker" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_media_changed_finale_word" varchar;
  ALTER TABLE "home_page_media_changed_eras" ADD CONSTRAINT "home_page_media_changed_eras_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_media_changed_eras" ADD CONSTRAINT "home_page_media_changed_eras_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_media_changed_eras" ADD CONSTRAINT "home_page_media_changed_eras_video_mobile_file_id_media_id_fk" FOREIGN KEY ("video_mobile_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_media_changed_eras" ADD CONSTRAINT "home_page_media_changed_eras_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_media_changed_eras" ADD CONSTRAINT "home_page_media_changed_eras_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_media_changed_eras" ADD CONSTRAINT "_home_page_v_version_media_changed_eras_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_media_changed_eras" ADD CONSTRAINT "_home_page_v_version_media_changed_eras_video_file_id_media_id_fk" FOREIGN KEY ("video_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_media_changed_eras" ADD CONSTRAINT "_home_page_v_version_media_changed_eras_video_mobile_file_id_media_id_fk" FOREIGN KEY ("video_mobile_file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_media_changed_eras" ADD CONSTRAINT "_home_page_v_version_media_changed_eras_video_poster_id_media_id_fk" FOREIGN KEY ("video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_media_changed_eras" ADD CONSTRAINT "_home_page_v_version_media_changed_eras_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_page_media_changed_eras_order_idx" ON "home_page_media_changed_eras" USING btree ("_order");
  CREATE INDEX "home_page_media_changed_eras_parent_id_idx" ON "home_page_media_changed_eras" USING btree ("_parent_id");
  CREATE INDEX "home_page_media_changed_eras_image_idx" ON "home_page_media_changed_eras" USING btree ("image_id");
  CREATE INDEX "home_page_media_changed_eras_video_video_file_idx" ON "home_page_media_changed_eras" USING btree ("video_file_id");
  CREATE INDEX "home_page_media_changed_eras_video_video_mobile_file_idx" ON "home_page_media_changed_eras" USING btree ("video_mobile_file_id");
  CREATE INDEX "home_page_media_changed_eras_video_video_poster_idx" ON "home_page_media_changed_eras" USING btree ("video_poster_id");
  CREATE INDEX "_home_page_v_version_media_changed_eras_order_idx" ON "_home_page_v_version_media_changed_eras" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_media_changed_eras_parent_id_idx" ON "_home_page_v_version_media_changed_eras" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_media_changed_eras_image_idx" ON "_home_page_v_version_media_changed_eras" USING btree ("image_id");
  CREATE INDEX "_home_page_v_version_media_changed_eras_video_video_file_idx" ON "_home_page_v_version_media_changed_eras" USING btree ("video_file_id");
  CREATE INDEX "_home_page_v_version_media_changed_eras_video_video_mobi_idx" ON "_home_page_v_version_media_changed_eras" USING btree ("video_mobile_file_id");
  CREATE INDEX "_home_page_v_version_media_changed_eras_video_video_post_idx" ON "_home_page_v_version_media_changed_eras" USING btree ("video_poster_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_page_media_changed_eras" CASCADE;
  DROP TABLE "_home_page_v_version_media_changed_eras" CASCADE;
  ALTER TABLE "home_page" DROP COLUMN "media_changed_finale_kicker";
  ALTER TABLE "home_page" DROP COLUMN "media_changed_finale_word";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_media_changed_finale_kicker";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_media_changed_finale_word";
  DROP TYPE "public"."enum_home_page_media_changed_eras_video_source";
  DROP TYPE "public"."enum__home_page_v_version_media_changed_eras_video_source";`)
}
