/**
 * Transaction-pooler (Supabase :6543) compatibility test for Payload +
 * drizzle-orm + node-postgres. Run with DATABASE_URL pointed at :6543:
 *   export PATH=.../v22/bin:$PATH; set -a; . ./.env.local; set +a
 *   export DATABASE_URL="${DATABASE_URL/:5432/:6543}" PGPOOL_MAX=3
 *   npx tsx scripts/txn-pooler-test.ts
 * Exercises boot, reads, create/update/publish/draft/delete, media read, and a
 * concurrency burst — surfacing prepared-statement / EMAXCONN / txn errors.
 */
import { getPayload } from "payload";
import config from "../payload.config";

const SLUG = "txn-pooler-test";

async function main() {
  const host = (process.env.DATABASE_URL || "").replace(/\/\/[^@]*@/, "//***@");
  console.log(`  DB: ${host}`);
  console.log(`  PGPOOL_MAX=${process.env.PGPOOL_MAX}`);
  const payload = await getPayload({ config });
  const log = (m: string) => console.log(`  ✓ ${m}`);

  // clean any leftover disposable
  const prior = await payload.find({ collection: "projects", where: { slug: { equals: SLUG } }, limit: 1, draft: true, pagination: false });
  if (prior.docs[0]) await payload.delete({ collection: "projects", id: prior.docs[0].id });

  const list = await payload.find({ collection: "projects", where: { _status: { equals: "published" } }, limit: 50, pagination: false });
  log(`read: ${list.totalDocs} published projects`);
  const hi = await payload.find({ collection: "projects", where: { slug: { equals: "high-ultra-lounge" } }, depth: 1, limit: 1, pagination: false });
  log(`read one w/ depth: "${hi.docs[0]?.title}"`);
  const media = await payload.count({ collection: "media" });
  log(`media count: ${media.totalDocs}`);

  const created = await payload.create({ collection: "projects", data: { title: "TXN Pooler Test", slug: SLUG, renderMode: "standard", _status: "draft" } as never });
  log(`create disposable (draft) id=${created.id}`);
  await payload.update({ collection: "projects", id: created.id, data: { shortSummary: "updated", _status: "published" } as never });
  log("update + publish");
  await payload.update({ collection: "projects", id: created.id, data: { shortSummary: "draft edit" } as never, draft: true });
  log("draft save (new version)");
  await payload.delete({ collection: "projects", id: created.id });
  log("delete disposable");

  const t = Date.now();
  const N = 40;
  const results = await Promise.allSettled(
    Array.from({ length: N }, () => payload.find({ collection: "projects", where: { _status: { equals: "published" } }, depth: 1, limit: 5, pagination: false })),
  );
  const ok = results.filter((r) => r.status === "fulfilled").length;
  const fail = results.filter((r) => r.status === "rejected") as PromiseRejectedResult[];
  log(`concurrency ${N}x depth-1 reads: ok=${ok} fail=${fail.length} in ${Date.now() - t}ms`);
  fail.slice(0, 4).forEach((f) => console.log(`   ✗ ${String(f.reason?.message).slice(0, 160)}`));

  console.log(fail.length ? "\nRESULT: FAIL" : "\nRESULT: PASS");
  process.exit(fail.length ? 1 : 0);
}
main().catch((e) => { console.error("FATAL:", e?.message || e); process.exit(1); });
