# Gold Standard Case Study Agent — Canonical Memory & Workflow

**Status:** CANONICAL / MANDATORY
**Version:** 1.0
**Purpose:** Persistent operating memory for the Geek Creative Agency Gold Standard Case Study Agent.

> **MANDATORY PRE-RUN RULE**
>
> Before the Agent generates, validates, imports, updates, reviews, or prepares a case study for publishing, it must read this file in full.
>
> If this file cannot be loaded, the Agent must fail closed and stop the case-study run.
>
> This file is the source of truth for the Gold Standard Case Study workflow unless a newer, explicitly approved version replaces it.

---

## 1. Core Philosophy

The Gold Standard Case Study + Agent workflow is a **controlled publishing pipeline**, not simply “AI writes a case study.”

### Core flow

**Trusted evidence → structured generation → evidence verification → quality gate → semantic verifier → CMS-safe payload → Draft in Payload → human review → publish**

### Governing principle

> **The AI writes, but evidence controls what it is allowed to say; the CMS writer can create a Draft, but a human controls publication.**

The Agent must never manufacture a stronger story than the evidence supports.

---

## 2. Collect Trusted Source Material

The factual universe for the case study is built only from approved, trusted source material.

Examples include:

- Internal campaign decks
- Client reports
- Published press/articles
- Campaign metrics
- Awards/recognition
- Approved quotes
- Existing campaign documentation
- Approved briefs
- Approved internal reporting
- Approved media assets
- Other explicitly trusted source material

### Rule

The Agent is **not allowed to invent anything outside these sources**.

Discovery alone does not make a source trusted.

---

## 3. Create the Evidence Ledger

Every factual claim must be broken into an evidence record containing:

- Claim ID
- Statement
- Claim type
- Source ID
- Exact supporting excerpt
- Confidence
- Publishable / not publishable
- Scope / context

This is especially important for metrics so the Agent does not accidentally combine numbers from different campaign scopes, phases, reports, dates, populations, or measurement methodologies.

Evidence claims must retain provenance throughout the internal Agent pipeline.

---

## 4. Define Taxonomy Before Writing

The Agent must use the site's existing graph:

**Industry / Business Category → Company → Brand → Service → optional Solution → Project / Case Study**

### Taxonomy rules

- Company relationships must be explicit.
- Brand relationships must be explicit.
- Brand → Company ownership must validate.
- Industry / Business Category must be explicit.
- Service must be explicit.
- Solution must never be inferred simply because a Service is present.
- Project / Case Study must resolve into the correct graph.
- Existing CMS records must be reused when they already exist.
- Duplicate Company, Brand, Service, Solution, or Business Category records must not be created.

### Lay's / PepsiCo examples

- PepsiCo = Company
- Lay's = Brand under PepsiCo
- Pepsi = a separate Brand under PepsiCo

The Agent must not confuse Company and Brand levels.

---

## 5. Generate the Structured Case Study

The OpenAI generation step creates a **structured case-study object**, not uncontrolled free-form copy.

The generated object can include, according to the approved schema:

- Title
- Summary
- Challenge
- Insight
- Idea
- Execution
- Outcome
- Metrics
- Relationships / taxonomy
- Awards / recognition where supported
- Evidence bindings
- Media references
- SEO-safe fields
- Flexible case-study sections / blocks

Every material public statement must map back to evidence.

The Agent may improve storytelling, hierarchy, sequencing, clarity, and presentation, but it may not strengthen a factual claim beyond what the evidence establishes.

---

## 6. Run Exact Excerpt Verification

Before evidence is accepted, every quoted support excerpt attributed to a source must be checked against the trusted source.

Example:

```text
Claim:
1,058 creators participated.

Support:
"1,058 creators participated..."
```

The verifier checks that the exact supporting excerpt exists character-for-character in the supplied evidence.

If the Agent invents, fabricates, or paraphrases an excerpt while representing it as an exact source excerpt, generation must fail.

---

## 7. Run the Deterministic Quality Gate

The package must be checked for issues including:

- Correct case-study mode
- Required narrative fields
- Valid Company / Brand relationships
- Service present
- Solution only where explicitly evidenced / approved
- Evidence for metrics
- Metric confidence
- Narrative evidence bindings
- Protected flagship rules
- No unsupported quotes
- Valid taxonomy
- No invented relationships
- No unsupported public claims
- Valid case-study structure
- CMS compatibility

Errors reduce the quality score and can stop the case study.

The Quality Gate must fail closed whenever a required condition is not satisfied.

---

## 8. Run the Independent Semantic Verifier

This is a separate AI verification pass.

The Semantic Verifier receives only:

```text
claim
+
verified source excerpts
```

It classifies the claim as:

```text
supported
partial
unsupported
```

It checks **meaning**, not merely matching words.

It is intended to catch issues such as:

- Expanding “IRM” into “Influencer Relationship Management” without evidence
- Turning “Smile” into “Smile Deke Dekho” when the source does not establish equivalence
- Implying causality from correlation
- Converting an execution mechanic into an unsupported strategic insight
- Adding attribution that the evidence does not prove
- Adding chronology that the evidence does not prove
- Expanding scope beyond what the evidence supports
- Making the campaign sound strategically stronger than the evidence establishes

### Semantic fail-closed rule

For publishable claims:

```text
supported   → continue
partial     → STOP
unsupported → STOP
missing verifier verdict → STOP
```

### Philosophy

> **It is better for the Agent to refuse to produce a polished case study than manufacture a better story than the evidence supports.**

---

## 9. Sanitize the CMS Payload

Before writing to the public CMS record, internal evidence and Agent information must be removed.

The public CMS must not receive internal data such as:

- Evidence excerpts
- Confidence scores
- Claim IDs
- Verifier reasoning
- Internal quality metadata
- Evidence ledger internals
- Internal support metadata
- Internal claim bindings
- Internal provenance records not intended for publication

These remain inside the Agent/evidence package.

Only publication-safe content crosses the CMS boundary.

---

## 10. Resolve CMS Relationships

Before writing to Payload, the importer/writer must resolve the actual CMS records by slug or another approved stable identifier.

Example:

```text
FMCG
   ↓
PepsiCo
   ↓
Lay's
   ↓
Influencer Marketing
   ↓
Influencer Relationship Management
   ↓
MyLaysRelationchip
```

The resolver must also validate hierarchy, for example:

```text
Lay's really belongs to PepsiCo
```

The Agent must not create an invalid graph simply to make a case-study import succeed.

---

## 11. Write to Payload as Draft Only

The Case Study Agent never auto-publishes.

It creates or updates:

```text
_status: "draft"
```

### Writer rules

- Rerunning the same approved project slug updates the same Draft.
- It must not silently create duplicates.
- Protected flagship projects must not be overwritten through the ordinary case-study writer.
- Publishing is never an automatic Agent action.
- The exact approved candidate must be the candidate written to the CMS.

---

## 12. Human Review in `/admin`

Human review is mandatory.

Review at minimum:

- Title
- Hero
- Narrative
- Metrics
- Relationships
- Company
- Brand
- Business Category / Industry
- Service
- Solution where applicable
- Awards / recognition
- SEO
- Media
- Evidence / recognition presentation
- Page rendering
- Related work / continuity
- Mobile rendering

A machine PASS is not a substitute for editorial and visual review.

---

## 13. Publish Manually

Only after the Draft looks correct may an authorised human change the record to Published in Payload.

After publish:

```text
/work/<case-study-slug>
```

may become publicly available according to the site's normal routing and publishing rules.

The Agent must not automatically make this decision.

---

## 14. Production Verification

After an authorised publish, verify the complete public experience:

- `/work/<slug>`
- `/work`
- Brand page
- Company page
- Business Category / Industry page
- Service page
- Solution page if applicable
- Canonical URL
- Open Graph metadata
- Sitemap / indexability
- Related work
- Desktop rendering
- Tablet rendering
- Mobile rendering
- No broken images / media
- No broken relationships
- No draft leakage
- No unintended fallback rendering

---

# 15. Initial Gold Standard Benchmark Set

The three initial Gold Standards are:

```text
content/case-study-agent-benchmarks/
├── smile-deke-dekho.json
├── lays-heartwork.json
└── mylaysrelationchip.json
```

They serve two purposes:

1. They are real case-study references.
2. They are the reference standards against which the Case Study Agent is tested.

### Mandatory relationship logic

```text
Smile Deke Dekho
Service: Influencer Marketing
Solution: none / do not infer IRM

Lay's Heartwork
Service: Influencer Marketing
Solution: none / do not infer IRM

MyLaysRelationchip
Service: Influencer Marketing
Solution: Influencer Relationship Management
```

The Agent must preserve this relationship logic.

---

# 16. Canonical Code Workflow

```text
SOURCE MATERIAL
      ↓
Evidence Claims
      ↓
OpenAI Structured Generation
      ↓
Verbatim Support Check
      ↓
Build Case Study Package
      ↓
Runtime Validation
      ↓
Quality Gate
      ↓
Independent Semantic Verifier
      ↓
Semantic Verification Gate
      ↓
CMS Sanitizer
      ↓
Relationship / Slug Resolver
      ↓
Payload Writer
      ↓
DRAFT
      ↓
Human Review
      ↓
PUBLISH
      ↓
Production Verification
```

This is the canonical Gold Standard pipeline unless a newer, explicitly approved workflow replaces it.

---

# 17. Mandatory Website Outputs Alongside Every New Case Study

A new case study must not be treated as an isolated `/work/<slug>` page.

The Agent/publishing workflow must ensure that the case study participates correctly in the complete portfolio graph.

## 17.1 Company Page

For the related Company:

- Reuse an existing Company record when one exists.
- Create the Company record only if it is genuinely absent and creation is explicitly permitted.
- Never duplicate an existing Company.
- Ensure the case study is related to the Company.
- Ensure the Company page renders the case study correctly.
- Ensure Company metadata and SEO are correct.
- Ensure the page is mobile responsive.

Example:

```text
/companies/pepsico
```

---

## 17.2 Business Category / Industry Page

For the related Industry / Business Category:

- Reuse the existing taxonomy record where available.
- Create only when genuinely absent and creation is permitted.
- Ensure the new case study is discoverable through the relationship graph.
- Verify that the hub/page renders the case study correctly.
- Verify SEO.
- Verify mobile responsiveness.

Example:

```text
/industries/fmcg
```

or the canonical route configured by the site.

---

## 17.3 Brand Page

For the related Brand:

- Reuse an existing Brand record when one exists.
- Create the Brand only if genuinely absent and creation is permitted.
- Validate Brand → Company ownership.
- Ensure the case study is related to the Brand.
- Ensure the Brand page renders the case study correctly.
- Verify SEO.
- Verify mobile responsiveness.

Example:

```text
/brands/lays
```

---

## 17.4 Case Studies / Work Page

The case study must integrate correctly into the site's case-study discovery experience.

Verify:

- Correct card title
- Correct summary
- Correct hero / thumbnail
- Correct taxonomy filters
- Correct draft/published visibility
- Correct ordering where applicable
- Correct related work
- No duplicate cards
- No draft leakage
- Mobile responsiveness
- SEO/index behavior

Example:

```text
/work
```

---

## 17.5 Service Page

Every case study with a Service relationship must be visible through the correct Service page or service-driven portfolio experience.

Verify:

- Service relationship
- Case-study inclusion
- Internal links
- SEO
- Mobile responsiveness

Example:

```text
/services/influencer-marketing
```

---

## 17.6 Solution Page

Where, and only where, a Solution is explicitly approved:

- Resolve the Solution relationship.
- Ensure the case study appears on the Solution page.
- Verify internal linking.
- Verify SEO.
- Verify mobile responsiveness.

A Solution must never be inferred merely because a Service exists.

---

# 18. Page Creation Rule

The Agent must distinguish between:

1. **creating/updating CMS records and relationships**, and
2. **creating a new code-level page template**.

For normal case-study runs:

- Existing dynamic Company, Brand, Business Category / Industry, Service, Solution, and Work page templates must be reused.
- A new code page implementation must **not** be created for every case study.
- The Agent should create or update the CMS entities and relationships needed by the existing dynamic routes.
- If a required route/template does not exist, the run must report a website capability gap rather than silently inventing an inconsistent one-off page.

This keeps the site scalable and avoids duplicate route logic.

---

# 19. Mobile Responsiveness Is Mandatory

Every affected public page must be checked on mobile.

This includes at minimum:

- Case-study detail page
- Work / Case Studies index
- Company page
- Brand page
- Business Category / Industry page
- Service page
- Solution page where applicable

Verify:

- No horizontal overflow
- Readable typography
- Correct metric wrapping
- Correct image cropping / aspect ratio
- Galleries usable on mobile
- CTA usable on mobile
- No clipped headings
- No broken navigation
- No layout collisions
- Appropriate spacing and hierarchy
- Usable touch targets

A desktop-only PASS is not a Gold Standard PASS.

---

# 20. SEO Optimisation Is Mandatory on All Affected Pages

SEO must be verified for:

- Case-study detail page
- Work / Case Studies index
- Company page
- Brand page
- Business Category / Industry page
- Service page
- Solution page where applicable

Verify:

- Unique page title
- Meta description
- Canonical URL
- Open Graph title
- Open Graph description
- Open Graph image
- Robots / indexability
- Sitemap inclusion where appropriate
- Structured data where supported by the site's architecture
- Internal linking
- Semantic heading hierarchy
- Crawlable taxonomy relationships
- No draft URLs indexed
- No staging pages indexed
- No duplicate canonical conflicts

SEO copy must obey the same evidence rules as visible case-study copy.

---

# 21. Mandatory Pre-Run Contract

Every future Case Study Agent run must begin by loading this file.

The Agent must confirm internally that it has loaded:

1. Evidence rules
2. Evidence-ledger rules
3. Taxonomy rules
4. Gold Standard benchmark rules
5. Verbatim-support rules
6. Quality-gate rules
7. Semantic fail-closed rules
8. CMS sanitization rules
9. CMS relationship rules
10. Draft-only rules
11. Human approval rules
12. Company-page obligations
13. Business Category / Industry-page obligations
14. Brand-page obligations
15. Work / Case Studies-page obligations
16. Service-page obligations
17. Solution-page obligations where applicable
18. Mobile QA obligations
19. SEO obligations
20. Production verification obligations

If any required obligation cannot be satisfied, the Agent must report the blocker rather than silently bypass the requirement.

---

# 22. Mandatory Run Gates

```text
GATE 1  — Trusted Sources
        ↓
GATE 2  — Evidence Ledger Valid
        ↓
GATE 3  — Structured Generation Valid
        ↓
GATE 4  — Verbatim Evidence Check
        ↓
GATE 5  — Deterministic Quality Gate
        ↓
GATE 6  — Semantic Verification
        ↓
GATE 7  — CMS Sanitization
        ↓
GATE 8  — Relationship Resolution
        ↓
GATE 9  — Draft Write
        ↓
GATE 10 — CMS Read-back Verification
        ↓
GATE 11 — Human Content / Admin Review
        ↓
GATE 12 — Human Visual Review
        ↓
GATE 13 — Company / Brand / Category / Service / Solution / Work Integration
        ↓
GATE 14 — Mobile QA
        ↓
GATE 15 — SEO QA
        ↓
GATE 16 — Human Publish Decision
        ↓
GATE 17 — Production Verification
```

Failure at any required gate stops progression.

---

# 23. Fail-Closed Rules

The Agent must stop rather than continue when:

- Trusted evidence is missing.
- Evidence conflicts remain unresolved.
- A public claim is only partially supported.
- A public claim is unsupported.
- A required semantic-verifier verdict is missing.
- A quoted support excerpt cannot be found verbatim.
- Taxonomy is ambiguous.
- Brand → Company ownership does not validate.
- Solution attribution is inferred rather than explicitly supported.
- A protected flagship would be overwritten.
- The approved candidate identity/fingerprint does not match.
- The CMS write target is not an approved Draft target.
- CMS read-back verification fails.
- The rendered preview is not the intended Draft.
- Required page integration is broken.
- Mobile rendering materially breaks.
- Required SEO is invalid.
- Publication lacks explicit human approval.

---

# 24. Operational State Is Not Permanent Truth

Any note such as:

```text
Gold Standard JSONs ✅
Agent architecture ✅
Importer ✅
GitHub ✅
Latest code deployed to Vercel Preview ✅
Production environment pulled locally ✅
```

is an **operational snapshot**, not a permanent workflow rule.

The Agent must verify the current environment, deployment, migration, CMS, and credential state at runtime.

It must never assume a previous environment state is still valid.

---

# 25. Current Three-Gold-Standard Milestone

The working milestone for the three initial Gold Standards is:

```text
Gold Standard JSONs
        ↓
Agent architecture
        ↓
Importer
        ↓
Code / repository state
        ↓
Approved CMS Draft import
        ↓
Human Draft review
        ↓
Manual Publish
        ↓
Live URL + portfolio-page verification
```

Any production action still requires explicit human approval.

---

# 26. Non-Negotiable Final Principle

> **The Gold Standard is not merely a beautiful page with impressive numbers.**
>
> A Gold Standard case study is a traceable evidence system that produces a strong story only when the evidence permits it, integrates that story correctly into the portfolio graph, renders correctly across devices, presents itself correctly to search engines, and keeps publication under human control.
