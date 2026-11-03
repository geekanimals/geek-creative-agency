import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "contact_page_offices_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"city" varchar,
  	"address" varchar,
  	"map_query" varchar
  );
  
  CREATE TABLE "_contact_page_v_version_offices_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"city" varchar,
  	"address" varchar,
  	"map_query" varchar,
  	"_uuid" varchar
  );
  
  ALTER TABLE "contact_page" ADD COLUMN "offices_eyebrow" varchar;
  ALTER TABLE "contact_page" ADD COLUMN "offices_heading" varchar;
  ALTER TABLE "_contact_page_v" ADD COLUMN "version_offices_eyebrow" varchar;
  ALTER TABLE "_contact_page_v" ADD COLUMN "version_offices_heading" varchar;
  ALTER TABLE "contact_page_offices_items" ADD CONSTRAINT "contact_page_offices_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_contact_page_v_version_offices_items" ADD CONSTRAINT "_contact_page_v_version_offices_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_contact_page_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "contact_page_offices_items_order_idx" ON "contact_page_offices_items" USING btree ("_order");
  CREATE INDEX "contact_page_offices_items_parent_id_idx" ON "contact_page_offices_items" USING btree ("_parent_id");
  CREATE INDEX "_contact_page_v_version_offices_items_order_idx" ON "_contact_page_v_version_offices_items" USING btree ("_order");
  CREATE INDEX "_contact_page_v_version_offices_items_parent_id_idx" ON "_contact_page_v_version_offices_items" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "contact_page_offices_items" CASCADE;
  DROP TABLE "_contact_page_v_version_offices_items" CASCADE;
  ALTER TABLE "contact_page" DROP COLUMN "offices_eyebrow";
  ALTER TABLE "contact_page" DROP COLUMN "offices_heading";
  ALTER TABLE "_contact_page_v" DROP COLUMN "version_offices_eyebrow";
  ALTER TABLE "_contact_page_v" DROP COLUMN "version_offices_heading";`)
}
