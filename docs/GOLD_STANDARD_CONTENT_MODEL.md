# Geek Gold Standard — Content Model (Phase 11.26)

How the completed **Geek Gold Standard** case-study format maps onto the existing
CMS. This phase added **editorial fields only** — no new collections, no change to
the portfolio graph (Industry · Company · Brand · Service · Solution · Project),
render modes, flagship dispatch, or public-routability rules.

Two principles:

1. **Only publication-safe outputs live in Payload.** The private research
   operating system (claim ledger, source provenance, confidence scoring, raw
   commercial files, agent logs) stays **outside** the publishing CMS.
2. **Everything is machine-writable.** Field names are stable and writable through
   the Payload Local/REST API, so the future Case Study Agent can populate a
   Draft deterministically. Nothing requires a browser-only workflow.

---

## Field map — where each Gold Standard component lives

Legend: **Public** = rendered / exposed on published docs · **Internal** = staff-only
(never rendered publicly; stripped from the anonymous REST/GraphQL API).

| Gold Standard component | Collection(s) | Field | Vis. | Rendering |
| --- | --- | --- | --- | --- |
| Campaign snapshot (client, brand, industry, service, solution, kind, period) | Project | `client`, `company`, `brand`, `businessCategories`, `services`, `solutions`, `projectKind`, `year` | Public | Case-study header + relationship links |
| Narrative | Project | `headline`, `challenge`, `insight`, `idea`, `execution`, `outcome`, `quote`, or flexible `sections` | Public | Standard/flexible renderers |
| Verified metrics | Project | `metrics[]` (`value`,`label`,`prefix`,`suffix`,`note`) | Public | "The Impact" band. Verified figures only |
| Press & independent coverage | Project, Company, Brand, Solution | `pressCoverage[]` | Public | Evidence & Recognition → Press / Official groups |
| Official & partner sources | (same array) | `pressCoverage[].sourceType` = `official-brand`/`partner-ngo`/`campaign-archive` | Public | Rendered in a separate "Official & Partner Sources" group |
| Awards & recognition | Project, Company, Brand | `awards[]` | Public | Evidence & Recognition → Awards |
| Reader FAQ / AEO | all six | `faqs[]` (`question`,`answer`) | Public | Accessible `<details>` FAQ section |
| Public SEO metadata | Project + all hubs | `seo` group (`metaTitle`,`metaDescription`,`ogImage`,`noindex`) | Public | `generateMetadata` (title/description/canonical/OG/noindex) |
| Internal search strategy | all six | `searchStrategy` group | **Internal** | Never rendered; stripped from public API |
| Internal linking | Project | relationships (`company`/`brand`/`businessCategories`/`services`/`solutions`) | Public | Derived hub links (routable entities only) |
| Imagery | all | Media uploads (`heroMedia`, `pressCoverage[].thumbnail`, …) + legacy `/public/assets` paths | Public | Existing media pipeline |
| Card data | Project | `cardSummary`, `heroMedia`/`heroLegacySrc`, `featured`, `order` | Public | `/work` grid |
| Related work | Project | derived from shared relationships | Public | "More Like This" / discovery |

### `pressCoverage[]` fields
`publisher` (req) · `headline` (req) · `url` (req, http(s)-validated) · `archiveUrl`
· `publicationDate` · `sourceType` (`independent-editorial`/`official-brand`/`partner-ngo`/`campaign-archive`/`trade-publication`/`other`) ·
`geekMentioned` · `featured` · `validationNote` · `thumbnail` (Media only).

**Honesty rules (enforced in the renderer):** a "Geek featured" marker appears
**only** when `geekMentioned` is true; independent media and official/partner
sources render in **separate groups** so brand/official coverage is never presented
as independent editorial.

**Outbound-link policy:** Evidence citations are ordinary editorial references —
they open in a new tab with **`rel="noopener"`** and are **crawlable**. We do NOT
blanket-add `nofollow`/`noreferrer`: these are genuine citations (not paid
placements) and belong in the normal web citation graph. A genuinely paid /
sponsored / affiliate link would instead carry `rel="sponsored"` and/or
`rel="nofollow"` — none exist in this editorial section today. Anchor text is never
manipulated for PageRank; no reciprocal-link schemes.

### `awards[]` fields
`awardBody` (req) · `programName` · `category` · `result` · `year` · `url` ·
`creditedOrganizations[]` · `geekCredited` · `validationNote`.

**Attribution:** when `geekCredited` is false the card shows the credited
organisations (e.g. the client / partner agencies) rather than implying Geek was
credited.

### `searchStrategy` group (INTERNAL)
`primaryKeyword` · `secondaryKeywords[]` · `searchIntent` (`informational`/`commercial`/`branded`/`transactional`/`mixed`) ·
`targetMarket` · `keywordResearchDate` · `relatedQuestions[]` · `preferredInternalAnchors[]` · `searchNotes`.

- Field-level read access = authenticated staff only (`fieldIsAnyStaff`), so it is
  **stripped from anonymous REST/GraphQL responses** even on published docs.
- **Never** output as a `<meta name="keywords">` tag — these are editorial
  intelligence, not markup. `preferredInternalAnchors` are hints only; they are
  never auto-injected as exact-match anchor text.
- Search Strategy content does **not** make a thin entity public-routable
  (routability is content-led — see `lib/cms/routable.ts`).

---

## Applicability (semantic, not symmetric)

| Field | Industry | Company | Brand | Service | Solution | Project |
| --- | :-: | :-: | :-: | :-: | :-: | :-: |
| `searchStrategy` (internal) | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| `faqs` | ✔ | ✔ | ✔ | ✔ | ✔ | ✔ |
| `pressCoverage` | — | ✔ | ✔ | — | ✔ | ✔ |
| `awards` | — | ✔ | ✔ | — | — | ✔ |

Rationale: Industries and Services have no campaign-specific press/awards of their
own; awards attach to campaigns/brands/companies, not to an abstract Solution or
Service. Fields were added where they are semantically useful, not for symmetry.

**Rendering scope this phase:** Evidence & Recognition + FAQ render on
**standard/flexible Project pages** only, and each renders nothing when empty.
Flagship Projects (High Ultra Lounge, The Coolest Job) are never injected with the
generic section — their bespoke renderers are untouched. Hub-level press/awards/FAQ
are schema-ready and can be surfaced in a later rendering pass.

---

## What stays OUTSIDE Payload

The future Case Study Agent maintains a deeper **internal evidence ledger** that is
**not** part of the publishing CMS:

- The claim ledger (`claim`, `value`, `source`, `sourceType`, `confidence`, `scope`,
  `classification` ∈ {FACT, SYNTHESIS, INFERENCE, MISSING, CONFLICT}, `conflict`,
  `privacy`).
- Gmail source messages and Google Drive source files; raw commercial files.
- Private creator details; source-confidence calculations.
- Unpublished research notes beyond the editorial `searchNotes` field.
- Agent execution logs.

Only **publication-safe outputs** are written into the fields above. Provenance is
kept out of the public Project schema (a separate evidence package / later
internal-only admin surface, if ever needed).

---

## Case Study Agent — expected machine-writable shape

The Agent ingests from Drive / Geek email / the existing site / public web / media
& award databases / brand & partner sources, and produces publication-safe output
that is written to a **Draft** (never auto-published):

```jsonc
// payload.create({ collection: "projects", data: { ... _status: "draft" } })
{
  "title": "…", "slug": "…", "client": "…", "renderMode": "standard",
  "projectKind": "campaign",
  "company": <id>, "brand": <id>,
  "businessCategories": [<id>], "services": [<id>], "solutions": [<id>],
  "headline": "…", "shortSummary": "…",
  "metrics": [{ "value": "27.5M+", "label": "…" }],
  "pressCoverage": [{ "publisher": "…", "headline": "…", "url": "https://…",
    "sourceType": "independent-editorial", "geekMentioned": true,
    "featured": true, "validationNote": "…" }],
  "awards": [{ "awardBody": "…", "programName": "…", "result": "Gold",
    "year": 2021, "creditedOrganizations": ["…"], "geekCredited": false }],
  "faqs": [{ "question": "…", "answer": "…" }],
  "searchStrategy": { "primaryKeyword": "…", "secondaryKeywords": ["…"],
    "searchIntent": "branded", "targetMarket": "India" },
  "seo": { "metaTitle": "…", "metaDescription": "…" },
  "_status": "draft"
}
```

Rules for the Agent: predictable field names (above); relationships by id;
arrays/relationships are writable through Local/REST API; **preserve Draft** — never
auto-publish; no hidden browser-only step is required to create a record.

---

## Asset model

- **No new Asset collection.** Continue using **Media**. Only assets with
  acceptable rights/editorial status are imported into Media; the CMS never
  hotlinks arbitrary external images. `pressCoverage[].thumbnail` is a Media
  relationship (not a free URL) for exactly this reason.
- The Agent maintains an **external Asset Manifest** (source URL, source, asset
  type, rights status, attribution, original, enhanced derivative, campaign, usage
  recommendation). Only approved assets cross into Media.

### Image/video enhancement principle (documentation only — not built here)
A future media-preparation step may resize, compress, crop, generate
thumbnails/poster frames, upscale, or normalise formats — but must **retain
originals** and must **not fabricate or materially alter historical campaign
evidence**. No enhancement tooling is built in Phase 11.26.

---

## Migration & environments

- Additive migration `20260901_221942_gold_standard_fields` (registered in
  `migrations/index.ts`): new array tables (`*_press_coverage`, `*_awards`,
  `*_faqs`, `*_texts`), new enums (`…_search_strategy_intent`, `…_source_type`),
  and `search_strategy_*` group columns + version mirrors. **No destructive
  operations.** Existing records, drafts, and static fallback are preserved.
- **Non-Production execution proof:** the full committed chain + this migration were
  applied to a disposable local Postgres, admin editors rendered, and public
  rendering + field-level access were verified end-to-end.
- The **Preview/Production content DB migration remains a manual infra gate** and
  must be applied (via `npm run payload:migrate`, never `PAYLOAD_DB_PUSH`) before
  real Gold Standard content entry. Production is untouched.
