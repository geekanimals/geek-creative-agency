# GEEK CREATIVE AGENCY — INDEPENDENT CODEX AUDIT

You are an independent senior software architect, security reviewer, Next.js/Payload engineer and production-readiness auditor.

Another coding agent built this repository. Do not trust prior reports. Independently inspect the repository, reproduce important behaviour, identify production risks, and prove or disprove the architecture.

## CRITICAL RULE — READ-ONLY AUDIT FIRST
Do not modify source code, commit, deploy, refactor, auto-fix vulnerabilities, or rewrite architecture. Return a report only.

## Expected repository state
- branch/source: cms-reconcile
- frozen architecture commit: 8a55024
- checkpoint before portfolio graph: cms-complete-phase-10

Verify actual state with git status, branch, log and tags. If dirty, identify changes and do not discard them.

## Expected stack
Verify actual versions from package.json/lockfile:
- Next.js 15.4.x
- React 19
- Payload 3.88.x
- PostgreSQL/Supabase
- Vercel
- Vercel Blob
- Node 22
- App Router

## Target architecture
Public discovery:
Industry → Company → Brand → Service → Solution / Geek IP → Project / Case Study

Underlying CMS must remain multi-relational, not rigid.

A Project should support:
- Business Category / Industry
- Company
- Brand
- multiple Services
- zero or more Solutions
- Project Kind
- Render Mode

Existing Projects must still work without the new relationships.

Expected routes:
- /industries/[slug]
- /companies/[slug]
- /brands/[slug]
- /services/[slug]
- /solutions/[slug]
- /work/[slug]

Gold-standard structural proofs:
1. FMCG → PepsiCo → Lay's → Influencer Marketing → Influencer Relationship Management → Friends of Lay's
2. FMCG → PepsiCo → Lay's → Influencer Marketing → Heartwork
No duplicate Project records.

## Audit method
For every major claim:
1. inspect implementation
2. reproduce where feasible
3. identify edge cases
4. classify: proven / plausible / untested / incorrect

Do not mark PASS merely because code looks reasonable.

## 1 — Baseline reproducibility
Run where safe:
- npm ci
- npx tsc --noEmit
- npm run generate:types
- npm run build

After potentially mutating commands run git status --short.
If generate:types changes tracked files, report drift and do not commit.

## 2 — Architecture map
Independently map collections, globals, routes, CMS query layer, static fallbacks, cache tags, preview, media, forms/API.

## 3 — Payload config
Audit registration, DB adapter/pooling, Blob, Sharp, secrets, generated types, admin, access control, migrations and schema-push rules. Look for unsafe defaults and environment mismatches.

## 4 — Production schema push
Verify NODE_ENV=production with PAYLOAD_DB_PUSH=true cannot enable destructive schema push. Do not perform destructive DB actions.

## 5 — Migration chain
Inspect all migrations for order, registration, FKs, indexes, enums, versions, rels, destructive UPs and DOWN safety. Pay special attention to Portfolio Graph and Services drafts transition, NOT NULL changes, _status and existing relationships.
Determine whether a truly empty Postgres DB can reach current schema using committed migrations only. Use only a disposable DB if executing; never staging.

## 6 — Schema vs generated types
Compare Payload schemas to payload-types.ts. Audit BusinessCategory, Company, Brand, Service, Solution and Project. Search for any, as any, unknown as, @ts-ignore, @ts-expect-error, eslint-disable and classify.

## 7 — Project relationship graph
Verify businessCategories hasMany, company single optional, brand single optional, services preserved, solutions hasMany optional, projectKind separate from renderMode, legacy businessCategory retained.

## 8 — Brand→Company consistency
Audit/test:
A. Brand Lay's + empty Company => derive PepsiCo
B. Lay's + PepsiCo => valid
C. Lay's + unrelated Company => reject
D. Company only => valid
E. Brand changed after Project already has old derived Company => no stale mismatch
Case E is high priority.

## 9 — Project Kind
Verify campaign / ongoing-program / platform / activation and default. Ensure projectKind does not change renderMode semantics.

## 10 — Legacy Project compatibility
Verify High Ultra, Coolest Job, static Projects, standard, flexible and flagship renderers still work without new relations.

## 11 — Flagship safety
Trace render dispatch and prove generic breadcrumb/discovery/hub UI is not injected into flagship art direction.

## 12 — Services dual role — HIGH PRIORITY
Services now act as Project taxonomy/filter plus editorial SEO page. Prove:
- old slugs preserved
- Project relationships preserved
- /work?service=... still works
- draft/editorial state does not break taxonomy
- public Project relationships resolve
- thin Service page gating is deterministic
Critical: taxonomy may remain usable while editorial Service page 404s until authored.

## 13 — Service draft transition
Audit _status, versions, backfill/migration/seed assumptions and fresh-Production behaviour.

## 14 — Industry hub
Audit published lookup, draft exclusion, legacy category fallback, new relationship query, dedupe, derived companies/brands/services/solutions/projects, empty state, metadata, canonical and sitemap.

## 15 — Company hub
Verify direct Company Projects + Projects attached to Brands belonging to Company; dedupe; unpublished behaviour; portfolioGroup grouping; Company-only Projects.

## 16 — Brand hub
Verify Company, portfolioGroup, Industry, Services, Solutions, Programs, Campaigns, Activations, and projectKind=platform classification.

## 17 — Service hub
Audit editorial content gate, derived entities, result sizes, relationship depth, and whether card queries avoid loading full Project bodies.

## 18 — Solution hub
Prove Solution includes only explicitly related implementations. IRM should surface Friends of Lay's. Heartwork must not appear merely because it shares Influencer Marketing.

## 19 — Duplication
Audit duplicate Projects caused by Company+Brand aggregation, legacy+new Industry, multiple Services, multiple Solutions. Evaluate stable ID vs slug dedupe.

## 20 — N+1/query efficiency
Document actual DB/query behaviour per hub. Verify or disprove "one Projects query per hub plus one Brands query for Company." Assess hidden Payload population queries.

## 21 — Build-time DB pressure — HIGH PRIORITY
Investigate generateStaticParams, generateMetadata, page fetches, layout, sitemap, parallel prerender, Payload init and globals.
Answer:
1. likely concurrent DB connections during next build
2. whether connections are reused
3. Supabase build-limit risk
4. impact at 10/20/50 hub entities
5. whether "fresh prod DB has ample headroom" is valid

## 22 — Serverless runtime pool
Verify Production expects :6543 Transaction Pooler, PGPOOL_MAX, timeouts, prepared statements, cleanup/retry, and no migration/session URL used at runtime.

## 23 — Build-time DB failure
Determine behaviour if DB unavailable during build for params, sitemap, hubs and existing pages. Does build silently omit routes or sitemap entries? Can dynamicParams recover? Classify fail-open behaviour.

## 24 — Cache architecture
Map tags/revalidation for Projects, Insights, Globals, Home, Industries, Companies, Brands, Services, Solutions. Check stale refs, collisions, draft leakage, preview/published cache confusion, cached failures.

## 25 — Cross-entity revalidation — HIGH PRIORITY
When a Project moves Lay's→Doritos, Influencer Marketing→Branding or FMCG→another Industry, determine old/new hub stale window. Classify acceptable / undesirable / launch risk. Do not demand fan-out unless evidence warrants it.

## 26 — Slug changes
Audit old/new path invalidation for Industry, Company, Brand, Service, Solution and Project. Confirm ID relationships survive slug change.

## 27 — Draft security — CRITICAL
For every draft-enabled entity verify anonymous users cannot retrieve drafts via REST, public Local API usage, query params, populated relationships, hub aggregation, sitemap, static params, metadata or filters.
A published Project must not leak unpublished Brand/Company/Solution or unpublished Service editorial fields.

## 28 — Preview security
Audit /api/preview: secret compare, same-site path validation, external redirect rejection, malformed/encoded/protocol-relative URLs and draft-mode cookies. Assess https://evil.com, //evil.com, /%2F%2Fevil.com, javascript:, \evil.com. Never expose the secret.

## 29 — RBAC
Audit server-side access for Users, Media, Projects, Insights, Industries, Companies, Brands, Services, Solutions, Globals. Verify Owner/Admin/Editor/Viewer/Anonymous roles.

## 30 — Owner bootstrap
Audit first Owner, zero-owner recovery, last Owner delete/demote protection and concurrency/races.

## 31 — Media/Blob
Inspect upload/delete, Media deletion, derivatives, remote patterns, resolveMedia, legacy vs CMS assets. Production Blob interactive QA remains manual.

## 32 — Media security
Assess SVG, arbitrary MIME, executable formats, filename sanitation, file size limits, Sharp exhaustion and editor trust.

## 33 — Static fallback
Audit Home, About, What We Do, Creators, Contact, Work, Projects and Insights. Check whether catches are so broad that programming/data bugs are hidden as fallback content.

## 34 — New hub outage behaviour
If a published uncached hub gets transient DB failure and returns 404, assess SEO/availability impact vs 500/retry/stale cache. Recommend clearly.

## 35 — SEO
Audit metadata hierarchy, canonical, noindex, title/description fallback, OG, robots, sitemap, slug encoding, duplicate canonical and draft exclusion.

## 36 — Service SEO gating
Prove thin Service pages are excluded from direct render and sitemap while taxonomy use remains valid.

## 37 — Thin Industry/Company/Brand pages
Determine whether nearly empty entities can be published and flag SEO-quality risk if needed.

## 38 — Sitemap
Verify correct inclusion/dedupe for CMS/static Projects, Industries, Companies, Brands, Services, Solutions, Insights and core pages; inspect lastModified and fixture leakage.

## 39 — Robots/indexing
Verify Preview noindex/nofollow, Production indexability only when configured, /admin and /api handling, Vercel hosts and canonical origin.

## 40 — Structured data
Audit Organization/Article/Breadcrumb/Project schemas. No fabricated claims. Ensure discovery trail does not conflict with JSON-LD semantics.

## 41 — Internal linking
Audit ProjectDiscovery and hub links for drafts, thin Services returning 404, unpublished entities, duplicates and accessibility. Published Projects should not visibly link to 404 hubs.

## 42 — Project discovery trail
When multiple Industries/Services/Solutions exist, determine how one linear trail is selected and whether ordering could mislead.

## 43 — Many-to-many semantics
Ensure linear UI does not imply the data graph has only one true path.

## 44 — Industry consistency
Assess possible mismatch between Company, Brand and Project Industries and whether flexibility is intentional or validation is missing.

## 45 — Company aggregation edge cases
Ensure Brand-linked Projects aggregate even if Company is null/stale and assess hook protections.

## 46 — Static Project→hub relationships
Determine whether static-only Projects appear in new hubs; document transitional behaviour and Phase 12 impact.

## 47 — Work index regression
Audit /work and /work?service=... for static∪CMS merge, dedupe, published-only, ordering, unknown filters and draft-enabled Services.

## 48 — Insights regression
Verify index/article/fallback/drafts/sitemap/JSON-LD remain isolated.

## 49 — Homepage regression
Verify Homepage remains intentionally structured, WorkWall stays static-curated, and no accidental Projects/Insights dependency was added.

## 50 — Contact/lead API
Audit /api/lead validation, honeypot, rate limit, IP derivation, JSON limits, spam, provider fallback, secrets/logging, email injection and reply-to validation.

## 51 — Security headers
Verify nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy and impact on Payload Admin/live preview. CSP is not mandatory if unsafe to add.

## 52 — Dependency security
Run npm audit and npm audit --omit=dev if supported. Do not force-fix. Report package, severity, runtime/dev reachability, remediation and launch impact. Pay attention to Next.js.

## 53 — Next.js patch
Determine current Next version and nearest safe compatible patch if registry/web data is available. Do not upgrade.

## 54 — Error handling
Audit unknown routes, DB timeout, malformed content, provider/media failures and production stack/secret exposure.

## 55 — Secret leakage
Search repo and Git history for DATABASE_URL, PAYLOAD_SECRET, PREVIEW_SECRET, BLOB_READ_WRITE_TOKEN, RESEND_API_KEY, Supabase credentials, JWTs, Vercel tokens. Never print values; report type/location/remediation only.

## 56 — Fixture leakage
Search for fixture/demo/sample/test/staging plus cms-standard-demo, cms-flexible-demo, cms-draft-demo, fixture-friends-of-lays, fixture-heartwork, unpublished-preview-test. Audit production guards, sitemap, static registries, hubs and build params.

## 57 — Production preflight
Audit prod:preflight. Test with incomplete/local env where safe. Verify it fails safely, prints no secrets, modifies nothing, checks runtime port, fixture flags, site URL, secrets, form provider and migration readiness.

## 58 — Backup/restore runbook
Assess docs for code rollback, DB backup/restore, Blob recovery limitations and domain rollback. Separate documentation from tested restore.

## 59 — Accessibility
Reasonably audit Hub UI/discovery/breadcrumbs: headings, keyboard/focus, landmarks, links and obvious contrast issues.

## 60 — Responsive
Inspect/test around 390px, 768px and desktop for overflow, chips, long names, cards, breadcrumbs and editorial text.

## 61 — Performance/scale
Assess at 10, 100 and 500 Projects. Identify scaling cliffs.

## 62 — Hub card data
Prove list queries do not fetch full story/flexible blocks/media galleries when only card data is needed.

## 63 — Project fetch depth
Audit relationship depth and unexpected payload expansion.

## 64 — Delete behaviour
Assess deleting referenced Company, Brand, Service, Solution and Industry: block/null/cascade/orphan behaviour.

## 65 — Unpublish behaviour
Assess unpublished PepsiCo with published Lay's/Projects, unpublished Service still referenced by Projects, and unpublished IRM with published Friends of Lay's. Check leaks and broken links.

## 66 — Editorial integrity
Assess guardrails for duplicate slugs, mismatched Brand/Company, empty Service page, thin hub publishing, invalid href and slug changes.

## 67 — SEO doorway risk
Confirm architecture does not automatically publish thin entity pages.

## 68 — Future agent readiness
Without building an agent, assess deterministic lookup via unique slugs/IDs and entity namespaces.

## 69 — Provenance
Confirm no unnecessary public provenance schema and assess external evidence-package approach.

## 70 — Manual production gates
Keep separate from code defects:
- Production Supabase
- fresh migration
- Production Blob
- real Blob upload QA
- Production Owner
- Resend live send
- Production env
- domain/DNS/SSL
- restore drill

## Severity
P0 = launch blocker
P1 = serious security/reliability/correctness issue before launch
P2 = meaningful improvement with mitigation
P3 = cleanup/polish
INFO = observation/tradeoff

Every finding requires evidence, realistic failure mode and impact.

# REQUIRED FINAL REPORT

## INDEPENDENT CODEX AUDIT — EXECUTIVE SUMMARY
Repository reproducible: PASS / FAIL
Architecture coherent: PASS / FAIL
Fresh migration confidence: HIGH / MEDIUM / LOW
Payload/RBAC: PASS / FAIL
Draft security: PASS / FAIL
Portfolio graph: PASS / FAIL
Services dual-role architecture: PASS / FAIL
Query efficiency: PASS / FAIL
Build/DB pressure: PASS / RISK / FAIL
Cache/revalidation: PASS / RISK / FAIL
Static fallback: PASS / FAIL
Hub outage behaviour: PASS / RISK / FAIL
SEO/indexing: PASS / FAIL
Security: PASS / RISK / FAIL
Performance: PASS / RISK / FAIL
Production readiness: READY / READY AFTER FIXES / NOT READY

## FINDINGS SUMMARY
| ID | Severity | Finding | Evidence | Impact | Recommended Fix |
|---|---|---|---|---|---|
Sort P0→P1→P2→P3.

For each finding provide evidence, reproduction where possible, impact and minimal recommended fix. Do not implement.

Also include:
- CLAIMS VERIFIED
- CLAIMS NOT PROVEN
- PORTFOLIO GRAPH AUDIT
- SERVICES DUAL-ROLE AUDIT
- COMPANY / BRAND GUARD AUDIT
- BUILD-TIME DB PRESSURE AUDIT
- CROSS-ENTITY REVALIDATION AUDIT
- HUB OUTAGE AUDIT
- MIGRATION AUDIT
- DRAFT / RBAC SECURITY AUDIT
- API SECURITY AUDIT
- CACHE MAP
- QUERY COUNT MAP
- SEO AUDIT
- PERFORMANCE / SCALE
- DEPENDENCY SECURITY
- FIXTURE / TEST DATA SAFETY
- MANUAL INFRASTRUCTURE GATES
- RECOMMENDED FIX ORDER
- FINAL VERDICT

Final verdict must explicitly answer:
1. Trust fresh Production DB?
2. Trust anonymous users not to see Draft/private CMS content?
3. Is Industry→Company→Brand→Service→Solution→Project correct?
4. Is Services taxonomy + SEO dual role safe?
5. Are High Ultra and Coolest Job protected?
6. Are new hubs performant enough?
7. Are cache/revalidation semantics acceptable?
8. Any P0/P1 issues before real production content?
9. Can CMS architecture remain frozen?
10. Safe to proceed to Gold Standard content entry after verified fixes/manual gates?

# STOP
Do not edit code.
Do not commit.
Do not deploy.
Return the report only.
