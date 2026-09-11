# Migrations

Schema is owned by committed migrations in `migrations/` (registered in
`migrations/index.ts`). Production **never** uses schema push.

## Ordered chain (fresh production DB applies these in order)

1. `20260831_173459` — Users / Media
2. `20260831_190209_projects_services` — Projects + Services
3. `20260901_000410_globals` — Navigation / Footer / Site Settings
4. `20260901_005036_about` — About page Global
5. `20260901_010706_what_we_do` — What We Do Global
6. `20260901_012655_creators_page` — Creators page Global
7. `20260901_015925_contact_page` — Contact page Global
8. `20260901_062621_insights` — Insights collection
9. `20260901_080656_home_page` — Home page Global
10. `20260901_100158_portfolio_graph` — Business Categories / Companies / Brands / Solutions + Project relationships & Service editorial (Phase 11.25)
11. `20260901_120000_service_publish_backfill` — publish pre-existing Service taxonomy rows (data migration)
12. `20260901_221942_gold_standard_fields` — Gold Standard editorial fields: press / awards / FAQ / internal search strategy (Phase 11.26, additive)

(12 files = 12 index entries.)

## Fresh production initialization

With **production** env loaded and `DATABASE_URL` on the **session pooler `:5432`**:

```bash
export PATH="$HOME/.nvm/versions/node/v22.23.2/bin:$PATH"
set -a; . ./.env.production.local; set +a
npm run payload:migrate:status   # all "pending"
npm run payload:migrate          # applies chain 1→9
npm run payload:migrate:status   # all "ran"
```

Expected: every migration runs, no push, no destructive prompt, no drift.

## Creating a new migration (future changes)

```bash
set -a; . ./.env; . ./.env.local; set +a          # staging/dev, :5432
npm run payload:migrate:create <name>              # generates file + registers in index.ts
```
Review the generated SQL (UP = additive expected; DOWN drops — destructive).
Commit the migration. Never hand-edit applied migrations.

## Notes
- Dev/staging DBs are push-synced (`PAYLOAD_DB_PUSH=true`), so **do not** run
  `payload:migrate` against them (it would prompt over push-synced state). The
  committed chain is for **fresh** databases (production, CI).
- Node 22 is required for the Payload CLI (Node 24 breaks it).
