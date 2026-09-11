# Launch Rollback & Cutover Runbook — geekcreativeagency.com

Companion to `PRODUCTION_RUNBOOK.md`, `PRODUCTION_REDIRECT_MAP.md`, `MIGRATIONS.md`,
`ENVIRONMENT.md`. Covers the **operator** cutover sequence and how to roll back.
Never print secrets. Never enable `PAYLOAD_DB_PUSH` in Production.

Canonical host: **`https://geekcreativeagency.com`** (apex). `www` → apex (301/308).
Launch artifact: the current audited HEAD (Phase 11.28), Node **22.x**, Next 16.3.4,
React 19.2.8, Payload 3.88.0.

---

## A. Pre-cutover operator sequence (do in order, verify each)

1. **Node runtime** — repo pins `engines.node=22.x` + `.nvmrc`/`.node-version=22`.
   In the Vercel project settings set **Node.js Version = 22.x** as well (belt &
   suspenders; the dashboard default was 24.x).
2. **Fresh Production Supabase** — new project, dedicated to Production. Record:
   - session/direct connection (`:5432`) — for migrations
   - transaction pooler (`:6543`) — for runtime
   Do **not** reuse the push-managed staging DB or any disposable test DB.
3. **Run migrations** (session `:5432`, `PAYLOAD_DB_PUSH` unset):
   ```bash
   export PATH="$HOME/.nvm/versions/node/v22.23.2/bin:$PATH"
   export DATABASE_URL="<prod session :5432>"; export PAYLOAD_SECRET="<prod secret>"
   npm run payload:migrate:status   # 12 pending
   npm run payload:migrate          # applies 1→12
   npm run payload:migrate:status   # 12 ran, chronological, no "dev"
   ```
4. **Vercel Production env** (Production scope only; do not copy Preview secrets):
   `DATABASE_URI`/`DATABASE_URL`=`<prod :6543>`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SITE_URL=https://geekcreativeagency.com`,
   `PREVIEW_SECRET`, `PGPOOL_MAX=3`, `BLOB_READ_WRITE_TOKEN` (prod Blob),
   `RESEND_API_KEY`, `LEAD_TO_EMAIL`. Leave `PAYLOAD_DB_PUSH` unset.
5. **Production Owner** — create the first Owner via Local API/one-off script
   (avoid public first-user creation): `payload.create({collection:"users", data:{email, password, name, role:"owner"}})`.
6. **Blob smoke** — in Admin → Media: upload an image, confirm public URL + render,
   delete, confirm SVG rejected. Static `/public/assets/**` untouched.
7. **Deploy to Production target WITHOUT domain** — `vercel deploy --prod` (or promote
   the verified build). Get the `*.vercel.app` production URL.
8. **QA on the production URL** (before DNS): `/`, `/about`, `/what-we-do`, `/creators`,
   `/contact`, `/work`, `/insights`, `/admin/login`, `/robots.txt`, `/sitemap.xml`,
   `/work/high-ultra-lounge`, `/work/the-coolest-job`, any CMS project. Admin login +
   one create/edit/save. Lead form (safe internal submission → real email delivered).
   Confirm `NEXT_PUBLIC_SITE_URL` set → no admin CSRF (cookie writes succeed).

## B. Cutover
9. In Vercel → Domains, add `geekcreativeagency.com` (+ `www`). Apply the **exact**
   DNS records Vercel returns (A/ALIAS for apex, CNAME for www) at the DNS provider.
   Do not guess values. Set `www` to redirect to the apex.
10. Wait for Vercel domain verification + SSL issuance. Then verify:
    `https://geekcreativeagency.com` serves the new site, valid SSL, `www`→apex 301.

## C. Post-cutover smoke (on the real domain)
`/`, `/about`, `/what-we-do`, `/work`, `/insights`, `/contact`, `/admin/login`,
`/robots.txt`, `/sitemap.xml`; title/meta/canonical/favicon, nav, images, lead form,
SSL, **no spam links**, not noindex, no Vercel-auth wall, no DB 500, no console errors.
Legacy redirects: `/career.html`→`/contact`, `/privacy-policy.html`→`/privacy`,
`/terms-and-conditions.html`→`/terms`, `/refund-policy.html`→`/terms` (all 308).
Spam URLs (e.g. `/tqorgt`) → 404.

## D. Old site decommission
- Ensure the old compromised host no longer answers for the canonical domain (DNS now
  points at Vercel). Keep a backup only if required.
- Rotate/revoke old hosting credentials (compromise suspected — piracy-spam injection).
- Do **not** delete unrelated Geek services (e.g. `sustainify.in`). Document what was retired.

## E. Search Console (cleanup, not a blocker)
Submit `/sitemap.xml`; request indexing for key pages; let spam URLs 404/410 (do not
mass-redirect them to `/`); use Removals only via legitimate procedures.

---

## ROLLBACK

### 1. Revert the Vercel deployment
Vercel → Deployments → pick the last-good deployment → **Promote to Production**
(instant alias swap). Or `vercel rollback <deployment-url>`. Keep the previous
production deployment id noted before cutover as the rollback candidate.

### 2. Revert DNS (only if absolutely required)
Restore the previous DNS values recorded before cutover (record apex A/ALIAS + `www`
CNAME + TTL of the OLD host BEFORE changing them). Note: reverting to the old host
re-exposes the spam — prefer a Vercel deployment rollback over a DNS revert.

### 3. Restore the database
Supabase → Database → Backups → restore the latest good point-in-time backup (verify
PITR/backup is enabled on the Production project before launch). Because migrations are
additive and Production data starts minimal, a full restore is rarely needed; prefer it
only for data loss/corruption.

### 4. Diagnose lead/email failure
- `/api/lead` returning 503 in Production = no provider configured → set `RESEND_API_KEY`
  + `LEAD_TO_EMAIL` (Production never silently succeeds without a provider — by design).
- 502 = provider call failed → check Resend key/domain verification.
- Check Vercel function logs (PII-safe: they log form kind + delivered flag only).

## Pre-cutover checklist to record (fill before DNS switch)
- [ ] Previous DNS values (apex + www + TTL): ______
- [ ] Last-good Vercel production deployment id (rollback candidate): ______
- [ ] Supabase Production backup/PITR enabled + verified: ______
- [ ] Redirect map committed (`docs/PRODUCTION_REDIRECT_MAP.md`): ✅
