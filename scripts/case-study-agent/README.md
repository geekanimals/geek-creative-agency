# Geek Creative Agency - Gold Standard Case Study Agent

## Status

Engineering implementation is complete and is awaiting controlled real-world validation on a genuinely new campaign.

Existing historical case studies such as Lay's Heartwork, Miller Lite / The Coolest Job, and High Ultra Lounge must NOT be treated as proof that the current Agent generated them.

They are references, benchmarks, or pre-existing website work.

The Agent has not automatically published any case study to production.

---

## Purpose

The Case Study Agent converts approved raw campaign material into an evidence-grounded, strategically structured, publication-ready case study candidate.

It is not a fixed-template copywriter.

Its job is to:

1. discover source material safely;
2. identify trusted sources;
3. extract claims, metrics, dates, media and provenance;
4. verify evidence;
5. reconcile conflicting figures and scopes;
6. understand portfolio relationships;
7. design the best narrative architecture for the campaign;
8. compile a flexible case study;
9. run factual, semantic and quality checks;
10. benchmark the candidate;
11. create a deterministic human-review package;
12. write only an explicitly approved staging CMS draft;
13. read the CMS draft back and verify it;
14. expose the exact CMS draft through an authorised preview;
15. leave publishing as a separate human decision.

---

## Canonical Pipeline

Campaign material

-> Safe local discovery

-> Human source review

-> Trusted source manifest

-> Approved source intake

-> Evidence extractor

-> Claim verifier

-> Evidence reconciler

-> Reconciliation auditor

-> Trusted evidence

-> Trusted portfolio context

-> Trusted media context

-> Story architect

-> Flexible designer

-> Deterministic compiler

-> Flexible quality gate

-> Semantic critic

-> Flexible benchmark

-> Gold Standard candidate

-> Deterministic review package + SHA-256 fingerprint

-> HUMAN APPROVAL

-> Safe CMS payload preparation

-> Staging-only draft writer

-> CMS read-back verification

-> Exact-draft preview

-> HUMAN VISUAL APPROVAL

-> Publishing remains separate and manual

---

## Core Design Principle

The framework controls reasoning, safety and evidence quality.

It does NOT force every case study into the same chapter structure.

The Architect and Designer may choose different chapter counts, hierarchy, metric presentation, media treatment and narrative flow depending on the campaign evidence.

The Agent must not invent unsupported campaign facts simply to complete a preferred story structure.

---

## Main Engineering Components

### Discovery

- sourceDiscovery.ts
- discoveryReview.ts
- sourceManifest.ts
- sourceIntake.ts

Discovery is local and read-only.

Symlinks are not followed.

Discovery itself does not automatically make a source trusted.

A human-approved source manifest is required before source material enters the trusted evidence pipeline.

### Evidence

- extractionSchema.ts
- extractor.ts
- verifier.ts
- verificationGate.ts
- reconciliationSchema.ts
- reconciler.ts
- reconciliationAuditorSchema.ts
- reconciliationAuditor.ts
- evidencePipeline.ts

Evidence claims retain provenance.

Conflicts must be reconciled rather than silently merged.

A reconciliation result that is unsafe for publication blocks the downstream CMS path.

### Portfolio Context

- portfolioContext.ts
- mediaContext.ts

Portfolio relationships are validated before reaching the Architect.

The Architect receives a read-only projection of approved relationships.

The Agent must not invent:

- Company relationships
- Brand relationships
- Industry/category relationships
- Service relationships
- Solution/IP relationships

Solution/IP may only be used when explicitly supplied through trusted portfolio context.

### Story Architecture

- architectureSchema.ts
- architect.ts

The Architect determines the strategic structure of the story from trusted evidence and trusted portfolio context.

It is not forced into Challenge -> Insight -> Idea -> Execution -> Outcome.

### Design

- designSchema.ts
- designer.ts

The Designer converts the approved architecture into a flexible presentation plan.

It may determine hierarchy, metric emphasis, section treatment, media use and CTA treatment while staying inside evidence and media constraints.

### Compiler

- compiler.ts

The compiler deterministically combines architecture, design, evidence and trusted context into a flexible case study candidate.

### Quality and Semantic Review

- flexibleQualityGate.ts
- semanticCriticSchema.ts
- semanticCritic.ts
- reconciliationAuditor.ts

The Agent rechecks factual integrity before CMS mutation.

Stale PASS metadata is not trusted at the write boundary.

### Benchmark

- flexibleBenchmark.ts

The machine benchmark evaluates ten objective dimensions.

The benchmark is an engineering quality signal.

It does not replace human editorial review.

### Review Package

- flexibleReviewPackage.ts

A deterministic review package contains:

- candidate;
- benchmark result;
- format version;
- SHA-256 candidate fingerprint.

The SHA-256 value is an integrity fingerprint.

It is NOT a cryptographic signature or identity/authentication mechanism.

The approved hash ensures the CMS writer receives the exact reviewed candidate rather than a regenerated candidate.

### CMS Boundary

- flexibleCmsPayload.ts

The CMS payload boundary strips internal evidence and Agent metadata that must never reach the public CMS document.

Evidence provenance, support metadata, confidence fields and internal claim bindings remain outside the publication payload.

### Draft Writer

- flexibleWriter.ts

The writer is deliberately restricted.

Required authorisation:

- humanApproved = true
- allowCmsDraftWrite = true
- target = staging

Environment protections include:

- PAYLOAD_DB_PUSH=true is refused;
- DATABASE_URL is required;
- CASE_STUDY_AGENT_STAGING_DB_MARKER is required;
- the marker must be a specific non-generic identity;
- the marker must match database hostname or username identity;
- password, database path and query parameters cannot satisfy the staging marker;
- VERCEL_ENV=production is refused.

The writer only creates or updates:

_status = "draft"

There is no Agent publish mode.

Protected flagship projects cannot be overwritten through the flexible writer.

### CMS Read-Back Verification

- flexibleCmsVerification.ts

After a staging mutation, the Agent reads the stored Payload document back.

It verifies Agent-owned fields against the approved draft.

It requires:

- _status = draft
- renderMode = flexible
- expected relationships
- expected section content
- expected publication-safe fields

Payload-generated nested IDs are ignored where appropriate.

If read-back verification fails, the writer reports failure.

It does not automatically delete or roll back the draft.

### Preview Boundary

Relevant integration files:

- app/(frontend)/api/preview/route.ts
- app/(frontend)/work/[slug]/page.tsx
- lib/cms/projects.ts

The preview route validates PREVIEW_SECRET before enabling Next.js draft mode.

When draft preview is enabled, the project page requests:

requireCmsDraft: true

This prevents an unavailable or missing CMS draft from silently falling back to an old static case study.

An authorised preview must therefore show the actual CMS draft or fail closed.

Normal public traffic retains the existing published/static behaviour.

---

## Operator CLI

Primary CLI:

scripts/case-study-agent/flexibleCli.ts

### Generate Review Package

Example:

npx tsx scripts/case-study-agent/flexibleCli.ts generate request.json --out review-package.json

Generate mode:

- runs the Agent;
- does not initialise Payload;
- does not write to the CMS;
- does not publish;
- creates the reviewable candidate package.

Review packages may contain campaign/source-derived information.

Do not commit sensitive review packages to Git.

Prefer storing them outside the repository or in an explicitly ignored local review directory.

### Write Approved Candidate To Staging

Example:

npx tsx scripts/case-study-agent/flexibleCli.ts write review-package.json --write-draft --human-approved --approved-hash <sha256>

Write mode requires all three controls:

- --write-draft
- --human-approved
- --approved-hash <exact lowercase candidate SHA-256>

The candidate is not regenerated in write mode.

The reviewed package is validated and the exact approved hash must match.

Payload is initialised only after operator, package and staging-environment preflight checks succeed.

There is intentionally no publish CLI command.

---

## Human Approval Gates

Human review is intentionally part of the system.

### Gate 1 - Source Trust

A human reviews discovered materials and decides which sources may enter the trusted source manifest.

### Gate 2 - Candidate Approval

A human reviews the generated case study candidate and benchmark package.

The approved candidate SHA-256 is then supplied to the staging write command.

### Gate 3 - Visual Preview Approval

After CMS read-back verification, a human must inspect the rendered staging/draft preview.

This confirms visual hierarchy, media treatment, responsiveness, copy and overall storytelling quality.

### Gate 4 - Publishing

Publishing is outside the Agent's automatic workflow.

A production publish decision must remain explicit and human-controlled.

---

## Safety Boundaries

The flexible Agent does not:

- automatically publish;
- automatically write to production;
- automatically delete CMS records;
- automatically roll back failed draft writes;
- follow discovery symlinks;
- make discovered material trusted without review;
- invent portfolio relationships;
- invent Solution/IP attribution;
- silently ignore evidence conflicts;
- use a static fallback to impersonate an authorised CMS draft preview.

---

## Current Limitations

### Real-world validation is still pending

The engineering system has passed its automated regression suite, but it has not yet completed its first controlled end-to-end run on a genuinely new campaign chosen by the project owners.

That validation should happen only after the project owners agree on the campaign and source material.

### Existing historical case studies

Existing historical case studies were not necessarily generated by this Agent.

They may be used as:

- design references;
- quality references;
- factual benchmark material;
- regression protection.

They must not be represented as evidence that the current Agent generated them.

### Source discovery

Discovery can identify supported local campaign assets and documents, but document discovery is not equivalent to full semantic extraction for every file format.

Unsupported or partially supported source formats may require approved preprocessing or a future ingestion adapter.

### External systems

Google Drive, URLs, email and other remote systems are not automatically trusted or discovered by the local discovery component.

They require an explicit approved ingestion mechanism.

### Benchmark

A perfect machine benchmark score does not replace human editorial judgement.

### Database identity

The staging database marker is an operational safety control, not a cryptographic database attestation.

Before the first real staging write, the operator should independently confirm that DATABASE_URL points to the approved staging database.

---

## Testing

Full Agent regression inventory:

33 test files

Final engineering regression:

1000 counted assertions passed

0 Agent test failures


Before final handover or release, run the complete regression suite again so the final exact assertion count is recorded after all engineering changes.

TypeScript verification:

npx tsc --noEmit

Agent/K6 whitespace verification:

git diff --check -- scripts/case-study-agent ':(literal)app/(frontend)/work/[slug]/page.tsx' lib/cms/projects.ts

---

## Production Safety Rule

Never run a production CMS write, production deployment or publish action merely because the Agent generated a passing candidate.

The required sequence is:

verified candidate

-> human approval

-> staging draft

-> read-back verification

-> authorised preview

-> human visual approval

-> separate production decision

---

## First Real-World Validation

When the project owners select a genuinely new campaign:

1. collect source material;
2. run safe discovery;
3. manually review discovered sources;
4. build the trusted source manifest;
5. run Agent generation;
6. inspect evidence reconciliation;
7. inspect portfolio and media context;
8. inspect the architecture and final candidate;
9. review benchmark results;
10. record the candidate SHA-256;
11. independently verify staging database identity;
12. write the exact approved candidate to staging draft;
13. confirm CMS read-back verification;
14. open the authorised exact-draft preview;
15. perform human visual review;
16. record issues and improve the Agent if required;
17. do not publish until the project owners explicitly approve publishing.

---

## Engineering Readiness Definition

The Agent can be called ENGINEERING READY when:

- full regression suite is green;
- TypeScript is clean;
- safety audit is green;
- Git change audit is complete;
- operator documentation is complete.

ENGINEERING READY does not mean production-proven.

The next status after a successful new-campaign staging validation should be:

REAL-WORLD VALIDATED

Production publishing remains a separate explicit decision.
