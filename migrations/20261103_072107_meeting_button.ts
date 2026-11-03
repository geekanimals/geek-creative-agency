import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ADD COLUMN "floating_contact_meeting_url" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "floating_contact_meeting_label" varchar;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_floating_contact_meeting_url" varchar;
  ALTER TABLE "_site_settings_v" ADD COLUMN "version_floating_contact_meeting_label" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN "floating_contact_meeting_url";
  ALTER TABLE "site_settings" DROP COLUMN "floating_contact_meeting_label";
  ALTER TABLE "_site_settings_v" DROP COLUMN "version_floating_contact_meeting_url";
  ALTER TABLE "_site_settings_v" DROP COLUMN "version_floating_contact_meeting_label";`)
}
