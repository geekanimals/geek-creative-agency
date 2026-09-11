# Phase 12 — Content Entry Workflow

How real Geek case studies and content get into the **production** CMS. Do not
begin until the Phase 11 hard gates pass (fresh prod migrations + Blob upload).

## Where content is entered — decision

**Recommended: enter real content directly in the production CMS via a protected
admin session, before domain cutover.**

- The production Vercel deployment exists (Production target) but the Geek domain
  is **not** pointed at it yet, and Vercel Deployment Protection / staging
  `noindex` keeps it non-public. Editors sign in to `/admin` on the production
  deployment URL and enter content against the **production DB + production Blob**.
- This avoids the rejected alternatives: entering everything twice; cloning the
  dirty staging DB (dev history, fixtures, test accounts); or building a bespoke
  content-sync platform. Media lands in the production Blob once, with correct IDs.

Rejected: raw full-DB clone from staging (carries fixtures + test users + push
history). Not used.

## Per-project checklist (Projects collection)

For each case study, in `/admin → Projects → Create`:

1. **Title** · 2. **Slug** (auto from title; keep stable after publish) · 3. **Client** · 4. **Year** · 5. **Short summary** · 6. **Card summary**
7. **Service/category** (Taxonomy tab: businessCategory, services, campaignTypes) — reuse existing taxonomy; don't invent slugs
8. **Hero** — upload to Blob (`heroMedia`) **or** legacy `/public/assets` path (`heroLegacySrc`)
9. **Story** — challenge / insight / idea / outcome / quote fields
10. **Metrics** — value/label(/prefix/suffix) rows
11. **Media** — section blocks (flexible mode) or renderer-specific
12. **SEO** — metaTitle/metaDescription/ogImage (all optional; sensible defaults derive)
13. **Renderer** — `standard` (shared template), `flexible` (CMS section blocks), or `flagship` (bespoke, requires an allowlisted `flagshipRendererKey`)
14. **Save Draft** → 15. **Preview** (admin Preview button) → 16. **Approval** → 17. **Publish**

Insights follow the same Draft → Preview → Publish loop (title/slug/excerpt/publishDate/hero/body(Lexical)/category/SEO).

## Rules
- Publish only after approval; drafts never appear publicly or in the sitemap.
- Do not seed sample/demo content into production (fixture scripts are guarded).
- Enter each media asset once, in the production Blob, via the admin uploader.
