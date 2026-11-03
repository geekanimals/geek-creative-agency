import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_page_build_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"href" varchar,
  	"title" varchar,
  	"line" varchar,
  	"blurb" varchar
  );
  
  CREATE TABLE "home_page_create_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "home_page_proof_cases_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "home_page_proof_cases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"brand" varchar,
  	"image_id" integer,
  	"href" varchar
  );
  
  CREATE TABLE "home_page_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "home_page_built_by_geek_stories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"href" varchar,
  	"title" varchar,
  	"kicker" varchar
  );
  
  CREATE TABLE "home_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer
  );
  
  CREATE TABLE "_home_page_v_version_build_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"href" varchar,
  	"title" varchar,
  	"line" varchar,
  	"blurb" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_create_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_proof_cases_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" numeric,
  	"suffix" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_proof_cases" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand" varchar,
  	"image_id" integer,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_process_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_built_by_geek_stories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"href" varchar,
  	"title" varchar,
  	"kicker" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"projects_id" integer
  );
  
  ALTER TABLE "home_page_build_cards" ADD CONSTRAINT "home_page_build_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_build_cards" ADD CONSTRAINT "home_page_build_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_create_cards" ADD CONSTRAINT "home_page_create_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_create_cards" ADD CONSTRAINT "home_page_create_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_proof_cases_stats" ADD CONSTRAINT "home_page_proof_cases_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_proof_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_proof_cases" ADD CONSTRAINT "home_page_proof_cases_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_proof_cases" ADD CONSTRAINT "home_page_proof_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_process_steps" ADD CONSTRAINT "home_page_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_built_by_geek_stories" ADD CONSTRAINT "home_page_built_by_geek_stories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_built_by_geek_stories" ADD CONSTRAINT "home_page_built_by_geek_stories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_build_cards" ADD CONSTRAINT "_home_page_v_version_build_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_build_cards" ADD CONSTRAINT "_home_page_v_version_build_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_create_cards" ADD CONSTRAINT "_home_page_v_version_create_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_create_cards" ADD CONSTRAINT "_home_page_v_version_create_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_proof_cases_stats" ADD CONSTRAINT "_home_page_v_version_proof_cases_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_version_proof_cases"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_proof_cases" ADD CONSTRAINT "_home_page_v_version_proof_cases_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_proof_cases" ADD CONSTRAINT "_home_page_v_version_proof_cases_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_process_steps" ADD CONSTRAINT "_home_page_v_version_process_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_built_by_geek_stories" ADD CONSTRAINT "_home_page_v_version_built_by_geek_stories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_built_by_geek_stories" ADD CONSTRAINT "_home_page_v_version_built_by_geek_stories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_rels" ADD CONSTRAINT "_home_page_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_rels" ADD CONSTRAINT "_home_page_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "home_page_build_cards_order_idx" ON "home_page_build_cards" USING btree ("_order");
  CREATE INDEX "home_page_build_cards_parent_id_idx" ON "home_page_build_cards" USING btree ("_parent_id");
  CREATE INDEX "home_page_build_cards_image_idx" ON "home_page_build_cards" USING btree ("image_id");
  CREATE INDEX "home_page_create_cards_order_idx" ON "home_page_create_cards" USING btree ("_order");
  CREATE INDEX "home_page_create_cards_parent_id_idx" ON "home_page_create_cards" USING btree ("_parent_id");
  CREATE INDEX "home_page_create_cards_image_idx" ON "home_page_create_cards" USING btree ("image_id");
  CREATE INDEX "home_page_proof_cases_stats_order_idx" ON "home_page_proof_cases_stats" USING btree ("_order");
  CREATE INDEX "home_page_proof_cases_stats_parent_id_idx" ON "home_page_proof_cases_stats" USING btree ("_parent_id");
  CREATE INDEX "home_page_proof_cases_order_idx" ON "home_page_proof_cases" USING btree ("_order");
  CREATE INDEX "home_page_proof_cases_parent_id_idx" ON "home_page_proof_cases" USING btree ("_parent_id");
  CREATE INDEX "home_page_proof_cases_image_idx" ON "home_page_proof_cases" USING btree ("image_id");
  CREATE INDEX "home_page_process_steps_order_idx" ON "home_page_process_steps" USING btree ("_order");
  CREATE INDEX "home_page_process_steps_parent_id_idx" ON "home_page_process_steps" USING btree ("_parent_id");
  CREATE INDEX "home_page_built_by_geek_stories_order_idx" ON "home_page_built_by_geek_stories" USING btree ("_order");
  CREATE INDEX "home_page_built_by_geek_stories_parent_id_idx" ON "home_page_built_by_geek_stories" USING btree ("_parent_id");
  CREATE INDEX "home_page_built_by_geek_stories_image_idx" ON "home_page_built_by_geek_stories" USING btree ("image_id");
  CREATE INDEX "home_page_rels_order_idx" ON "home_page_rels" USING btree ("order");
  CREATE INDEX "home_page_rels_parent_idx" ON "home_page_rels" USING btree ("parent_id");
  CREATE INDEX "home_page_rels_path_idx" ON "home_page_rels" USING btree ("path");
  CREATE INDEX "home_page_rels_projects_id_idx" ON "home_page_rels" USING btree ("projects_id");
  CREATE INDEX "_home_page_v_version_build_cards_order_idx" ON "_home_page_v_version_build_cards" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_build_cards_parent_id_idx" ON "_home_page_v_version_build_cards" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_build_cards_image_idx" ON "_home_page_v_version_build_cards" USING btree ("image_id");
  CREATE INDEX "_home_page_v_version_create_cards_order_idx" ON "_home_page_v_version_create_cards" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_create_cards_parent_id_idx" ON "_home_page_v_version_create_cards" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_create_cards_image_idx" ON "_home_page_v_version_create_cards" USING btree ("image_id");
  CREATE INDEX "_home_page_v_version_proof_cases_stats_order_idx" ON "_home_page_v_version_proof_cases_stats" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_proof_cases_stats_parent_id_idx" ON "_home_page_v_version_proof_cases_stats" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_proof_cases_order_idx" ON "_home_page_v_version_proof_cases" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_proof_cases_parent_id_idx" ON "_home_page_v_version_proof_cases" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_proof_cases_image_idx" ON "_home_page_v_version_proof_cases" USING btree ("image_id");
  CREATE INDEX "_home_page_v_version_process_steps_order_idx" ON "_home_page_v_version_process_steps" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_process_steps_parent_id_idx" ON "_home_page_v_version_process_steps" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_built_by_geek_stories_order_idx" ON "_home_page_v_version_built_by_geek_stories" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_built_by_geek_stories_parent_id_idx" ON "_home_page_v_version_built_by_geek_stories" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_built_by_geek_stories_image_idx" ON "_home_page_v_version_built_by_geek_stories" USING btree ("image_id");
  CREATE INDEX "_home_page_v_rels_order_idx" ON "_home_page_v_rels" USING btree ("order");
  CREATE INDEX "_home_page_v_rels_parent_idx" ON "_home_page_v_rels" USING btree ("parent_id");
  CREATE INDEX "_home_page_v_rels_path_idx" ON "_home_page_v_rels" USING btree ("path");
  CREATE INDEX "_home_page_v_rels_projects_id_idx" ON "_home_page_v_rels" USING btree ("projects_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_page_build_cards" CASCADE;
  DROP TABLE "home_page_create_cards" CASCADE;
  DROP TABLE "home_page_proof_cases_stats" CASCADE;
  DROP TABLE "home_page_proof_cases" CASCADE;
  DROP TABLE "home_page_process_steps" CASCADE;
  DROP TABLE "home_page_built_by_geek_stories" CASCADE;
  DROP TABLE "home_page_rels" CASCADE;
  DROP TABLE "_home_page_v_version_build_cards" CASCADE;
  DROP TABLE "_home_page_v_version_create_cards" CASCADE;
  DROP TABLE "_home_page_v_version_proof_cases_stats" CASCADE;
  DROP TABLE "_home_page_v_version_proof_cases" CASCADE;
  DROP TABLE "_home_page_v_version_process_steps" CASCADE;
  DROP TABLE "_home_page_v_version_built_by_geek_stories" CASCADE;
  DROP TABLE "_home_page_v_rels" CASCADE;`)
}
