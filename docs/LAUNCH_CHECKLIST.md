# Phase 13 — Domain Launch Checklist (skeleton)

Do **not** execute any of this until Phase 12 content is entered and approved.
This is the cutover plan, not an instruction to launch now.

## Pre-cutover gates
- [ ] Phase 11 hard gates all green (see the Phase 11 report), including a
      **completed fresh-production migration run** and a **real Blob upload QA**.
- [ ] Phase 12 real content entered + approved in the production CMS; **zero**
      demo/sample/test records in the production DB.
- [ ] Production env set (own `PAYLOAD_SECRET`, `PREVIEW_SECRET`, DB `:6543`,
      prod Blob token, `NEXT_PUBLIC_SITE_URL` = real domain, `PGPOOL_MAX=3`,
      Resend). `PAYLOAD_DB_PUSH` and `ALLOW_STAGING_FIXTURES` **absent**.
- [ ] `npm run prod:preflight` → PASS against production env.
- [ ] `npm run build` clean; latest commit deployed to Vercel **Production target**.
- [ ] Backup taken + a restore drill done (see runbook §5).
- [ ] Real Owner exists; staging test accounts absent.

## Cutover (DNS)
- [ ] Confirm intended domain (apex + `www` behaviour + redirect preference) — recorded in the Phase 11 domain audit.
- [ ] Add the domain to the Vercel project; set the apex/`www` records per Vercel's instructions (A/ALIAS for apex, CNAME for `www`).
- [ ] Verify SSL issued.
- [ ] Because `NEXT_PUBLIC_SITE_URL` becomes the real (non-`vercel.app`) domain, `IS_STAGING` flips false automatically → robots become indexable, canonicals + sitemap use the real origin. Verify.

## Post-cutover verification
- [ ] `/` and all routes 200 on the real domain; canonicals show the real origin (no `vercel.app`).
- [ ] `robots.txt` allows `/`, disallows `/admin` + `/api/`; `/sitemap.xml` lists real published Projects + Insights (no drafts).
- [ ] OG/Twitter tags resolve; social preview correct.
- [ ] Submit one internal test lead → received; then confirm real delivery path.
- [ ] Admin login works on the real domain; live preview iframe renders.
- [ ] Lighthouse spot-check on home / work / a case study.
- [ ] Submit the sitemap to Search Console; monitor logs + Vercel analytics.

## Rollback triggers
- Broken render / DB outage not masked by fallback → promote previous Vercel deployment.
- Bad content → Payload version restore.
- DNS/SSL problem → revert DNS to prior host.
