import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * COMMITTED data migration (not a fixture): publish pre-existing Service
 * taxonomy rows.
 *
 * When drafts were enabled on Services (portfolio_graph migration), the new
 * `_status` column defaulted every EXISTING taxonomy row to 'draft'. Draft rows
 * are invisible to anonymous Project→services relationship population, which
 * would silently break the /work Service filter and project service tags after
 * an in-place upgrade. Service taxonomy availability must NOT depend on a
 * staging fixture script.
 *
 * Policy (taxonomy availability ≠ SEO landing-page eligibility):
 *   - Services that existed BEFORE drafts → published here, so taxonomy keeps
 *     working. Their public /services/[slug] page stays gated separately by the
 *     editorial-content check in lib/cms/services.ts (a published-but-thin
 *     service still 404s until it has real content).
 *   - NEW services created after drafts follow normal editorial draft behaviour
 *     (this migration only touches rows that already existed as drafts at run
 *     time; on a fresh DB the services table is empty here → no-op).
 *
 * Re-saving through the Payload local API (rather than a raw UPDATE) also
 * materialises the published VERSION row, so relationship population is correct
 * in both public and draft-preview reads.
 */
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  const result = await db.execute(sql`SELECT id FROM services WHERE _status = 'draft' OR _status IS NULL`)
  const rows = ((result as unknown as { rows?: { id: number }[] }).rows) ?? []
  for (const row of rows) {
    await payload.update({
      collection: 'services',
      id: row.id,
      data: { _status: 'published' } as never,
      req,
      overrideAccess: true,
    })
  }
  payload.logger.info(`[migration] service_publish_backfill: published ${rows.length} pre-existing service taxonomy row(s).`)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Intentional no-op: reverting published→draft could hide legitimate taxonomy
  // and lose version state. Production rollback should restore from backup
  // (see docs/PRODUCTION_RUNBOOK.md §4/§5), not run this down migration.
}
