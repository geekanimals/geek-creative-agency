# Production Runbook — Geek Creative Agency CMS

Operational reference for the production deployment. **No secrets live in this
file** — only variable names, scopes, and procedures.

Status: infrastructure hardened (Phase 11). **The Geek domain is NOT cut over
yet** — that is Phase 13. Real content entry is Phase 12.

---

## 1. Architecture

| Layer | Technology |
|---|---|
| App | Next.js 15.4.11 (App Router) + React 19.2.0 |
| CMS | Payload 3.88.0 (`/admin`, `/api`) |
| DB | Supabase Postgres (separate **staging** and **production** projects) |
| Media | Vercel Blob (separate staging and production stores) |
| Host | Vercel (Preview = staging; Production = launch) |
| Node | 22.x (CLI/migrations); build runs on Vercel |

**Frontend DB-resilience is per-surface (not blanket):**
- **CMS-first legacy surfaces** — Homepage, About, What We Do, Creators, Contact,
  Navigation/Footer/Site Settings, `/work` + project detail, `/insights` +
  articles — each has a typed **static fallback** and renders even when the
  CMS/DB is down (proven by the whole-site dead-DB test).
- **Portfolio hubs** (`/industries`, `/companies`, `/brands`, `/services`,
  `/solutions`) are **CMS-native**: they have no static registry. They are ISR
  (revalidate 3600) + on-demand revalidated, so already-generated hub pages
  serve from cache during a DB outage; an uncached hub during an outage returns
  5xx (retryable) — deliberately NOT a false 404. `/admin` and `/api` always
  require the database.

Do not add static fallbacks to the portfolio hubs to make a blanket claim true —
the accurate statement above is the intended design.

### Database connection modes (proven in Phase 3.5)
- **Serverless runtime (Vercel):** Supabase **Transaction Pooler `:6543`** — node-postgres uses unnamed prepared statements, pooler-compatible. Keep `PGPOOL_MAX` small (1–3).
- **Migrations / local:** Supabase **Session Pooler `:5432`**.
- **`push` is disabled in production by construction** (`payload.config.ts`: `NODE_ENV!=="production" && PAYLOAD_DB_PUSH==="true"`), plus a boot-time guard throws if the dangerous combo is ever set. Schema changes go through committed migrations only.

---

## 2. Environments

| | Staging | Production |
|---|---|---|
| Vercel target | Preview | Production |
| Supabase project | staging DB | **separate** production DB |
| Blob store | staging store | **separate** production store |
| Indexing | `noindex,nofollow` + robots `Disallow: /` (auto for `*.vercel.app`) | indexable (real domain) |
| Secrets | staging set | independent production set (never reuse staging) |

Staging vs production is detected at runtime via `IS_STAGING` (host ends in `vercel.app`) — see `lib/site.ts`. Robots/SEO flip automatically once `NEXT_PUBLIC_SITE_URL` is the real domain.

---

## 3. Fresh production database initialization

Run **once**, against the production DB via the **session pooler `:5432`**, with production env loaded (never commit it):

```bash
export PATH="$HOME/.nvm/versions/node/v22.23.2/bin:$PATH"   # Node 22
set -a; . ./.env.production.local; set +a                    # DATABASE_URL = prod :5432
npm run payload:migrate:status   # expect: all migrations "pending"
npm run payload:migrate          # applies the full committed chain
npm run payload:migrate:status   # expect: all migrations "ran"
```

Do **not** run `PAYLOAD_DB_PUSH=true` against production. Do **not** clone the staging DB (it contains dev history + fixtures + test accounts).

Then create the first Owner via the admin bootstrap (see §6) and enter content (Phase 12).

---

## 4. Rollback model

Four independent rollback axes — pick the one matching the failure:

### Code rollback
- Vercel: promote the previous good deployment (Vercel dashboard → Deployments → ⋯ → *Promote to Production*), or `vercel rollback`.
- Git: the tag **`cms-complete-phase-10`** marks the fully-built CMS; branch work continues from there.

### Database rollback
- **Prefer restore from backup** (§5) over reversing migrations. Down-migrations exist but dropping tables destroys content.
- For a bad content edit (not schema): use Payload **version history** on the affected document/global (drafts are enabled everywhere) — restore a prior version in `/admin`.

### Content rollback
- Payload draft/version history per Project, Insight, and page Global. Publish a previous version; no deploy needed.

### Domain rollback
- Point DNS / the Vercel domain back to the previous host (see the DNS plan in the launch checklist). DNS changes are **not** made until Phase 13.

---

## 5. Backups & restore

**Managed (Supabase):** confirm the production project's plan tier and enable the strongest available: daily automated backups and PITR (Point-In-Time Recovery) if the plan includes it. Record the actual retention window here once known: `__TBD by plan__`.

**Manual dump** (from a machine with `pg_dump`, using the session pooler; keep the URL out of shell history — read it from the env, don't paste it):

```bash
set -a; . ./.env.production.local; set +a
pg_dump "$DATABASE_URL" -Fc -f "geek-prod-$(date +%Y%m%d).dump"
pg_restore --list "geek-prod-$(date +%Y%m%d).dump" | head   # inspect
# Restore drill (throwaway DB only):
# pg_restore --clean --if-exists -d "$THROWAWAY_URL" geek-prod-YYYYMMDD.dump
```

A periodic **restore drill** into a throwaway DB is strongly recommended before launch.

**Media / Blob recovery caveat:** the DB and Blob are separate stores. Restoring the DB does **not** restore a Blob object that was deleted — the Media record would point at a missing URL (`resolveMedia()` yields a broken image; the page still renders). Vercel Blob has no built-in per-object version history. Treat Blob deletions as effectively permanent: delete a Media record only when you intend the file gone, and keep source assets outside Blob.

---

## 6. Owner / RBAC

Roles (`access/roles.ts`): `owner` > `admin` > `editor` > `viewer`.
- **Anonymous:** published content only; `/api/users`, versions, drafts → 403.
- **Viewer:** read-only in admin. **Editor:** create/edit/publish content. **Admin:** + user management. **Owner:** full; the first-owner bootstrap is hardened (see `collections/Users.ts`) so the last Owner cannot be demoted/deleted.

Production must have a real Owner and only intended Admin/Editor accounts — **do not carry staging test accounts** (e.g. the staging `viewer` test user) into production. Owner creation requires a human-chosen password (never scripted/printed).

---

## 7. Forms / lead delivery

`/api/lead` is provider-agnostic (`app/(frontend)/api/lead/route.ts`), checked in order: Resend (`RESEND_API_KEY` + `LEAD_TO_EMAIL`) → Formspree → webhook → Slack → dev-log. Honeypot + in-memory rate limit (6/min/IP) + server-side validation. For production set Resend (verify the sending domain + a valid `LEAD_FROM_EMAIL`) and confirm `LEAD_TO_EMAIL` is the Geek inbox.

---

## 8. Security posture
- Headers (site-wide, `next.config.mjs`): `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN` (keeps the admin live-preview iframe working), `Permissions-Policy: camera=(), microphone=(), geolocation=()`. HSTS is applied automatically by Vercel on the custom domain. No CSP (intentional — a correct admin+Blob+analytics CSP is fragile).
- `robots.txt`: staging blocks all; production allows `/` but disallows `/admin`, `/api/`, `/thank-you`.
- Dependency posture: see the Phase 11 report's dependency section (no anonymously-exploitable production-critical vuln; `next` image-DoS patch tracked as a pre-launch item).

## 9. Pre-flight
Before any production build/deploy, with production env loaded:
```bash
npm run prod:preflight   # read-only; validates env/pool/push/secrets/URL/migrations. Never prints secret values.
```
