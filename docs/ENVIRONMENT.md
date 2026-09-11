# Environment Matrix

Variable **names and scopes only** — no values. Derived from an audit of every
`process.env.*` reference in the code.

| Variable | Local | Preview (staging) | Production | Secret? | Purpose |
|---|:--:|:--:|:--:|:--:|---|
| `DATABASE_URL` | ✓ (`:5432`) | ✓ (`:6543` runtime) | ✓ (`:6543` runtime) | **yes** | Postgres connection string. Runtime = transaction pooler `:6543`; migrations = session pooler `:5432`. |
| `PAYLOAD_SECRET` | ✓ | ✓ | ✓ (**unique**) | **yes** | Payload auth/session signing. Never reuse across envs. |
| `BLOB_READ_WRITE_TOKEN` | ✓ | ✓ (staging store) | ✓ (**prod store**) | **yes** | Vercel Blob RW token. Separate store per env. |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | `https://…vercel.app` | `https://<geek domain>` | no | Canonical origin; drives absolute URLs, sitemap, robots, `IS_STAGING`. |
| `PREVIEW_SECRET` | ✓ | ✓ | ✓ (**unique**) | **yes** | Guards `/api/preview` draft mode. Never reuse across envs. |
| `PGPOOL_MAX` | (default 6) | `3` | `3` | no | node-postgres pool size per instance (small for serverless). |
| `PG_IDLE_TIMEOUT` | optional | optional | optional | no | Pool idle timeout ms (default 10000). |
| `PG_CONNECT_TIMEOUT` | optional | optional | optional | no | Pool connect timeout ms (default 10000). |
| `PAYLOAD_DB_PUSH` | `true` only when syncing schema locally | **absent** | **absent (forbidden)** | no | Opt-in dev schema push. Boot guard throws if `true` in production. |
| `NODE_ENV` | dev | production (Vercel) | production | no | Set by tooling; gates `push`. |
| `RESEND_API_KEY` | optional | optional | ✓ (for live leads) | **yes** | Resend email delivery for `/api/lead`. |
| `LEAD_TO_EMAIL` | optional | optional | ✓ | no* | Lead recipient (Geek inbox). *Not a secret but keep out of public code. |
| `LEAD_FROM_EMAIL` | optional | optional | ✓ | no | Verified sender address. |
| `FORMSPREE_ENDPOINT` / `LEAD_WEBHOOK_URL` / `LEAD_SLACK_WEBHOOK` | optional | optional | optional | mixed | Alternative lead providers (fallback chain). |
| `NEXT_PUBLIC_GA_ID` | optional | optional | optional | no | Google Analytics id (public). |
| `ALLOW_STAGING_FIXTURES` | only to run fixtures | only to run fixtures | **absent (forbidden)** | no | Override gate for staging seed scripts. Never set in production. |

**Connection-pool sizing (`PGPOOL_MAX`)**
- `PGPOOL_MAX` bounds the node-postgres pool **per process/worker** — it is NOT a
  global cap across `next build`'s parallel static-generation workers, so peak
  connections ≈ (workers) × PGPOOL_MAX. On the Supabase **session pooler**
  (`:5432`, 15-client cap) a build with a moderate pool can exhaust it.
- **Build:** use `PGPOOL_MAX=1` (each worker holds ≤1 connection; a fresh prod DB
  has no competing traffic so a one-time build stays well under the cap). Hub
  `generateStaticParams` fail open (`[]`) on any DB hiccup, so the build never
  crashes on transient pressure; `dynamicParams=true` still serves pages on
  demand.
- **Preview/Production runtime:** `PGPOOL_MAX=3` on the **transaction pooler**
  (`:6543`), which multiplexes across Vercel's ephemeral instances. Request-level
  `cache()` in the hub getters collapses the generateMetadata + page reads into
  one logical query per hub render.
- If the platform cannot separate build vs runtime env, `PGPOOL_MAX=1` is a safe
  single value (the transaction pooler handles cross-instance concurrency).
- Measured locally against the shared staging DB (competing traffic); a
  dedicated production DB will see lower contention.

**Rules**
- Production secrets are **independent** of staging (own `PAYLOAD_SECRET`, `PREVIEW_SECRET`, DB, Blob token).
- Local secret files (`.env`, `.env.local`, `.env.production.local`, `.env.vercel-preview`) and `.vercel/` are git-ignored (`!.env.example` is the only tracked env file, placeholders only).
- Never print values; use `npm run prod:preflight` to check presence/shape.
