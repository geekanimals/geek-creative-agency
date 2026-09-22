# GOLD STANDARD CASE STUDY AGENT — ENGINEERING HANDOFF

## Purpose

This file preserves engineering-session continuity for the permanent Gold Standard Case Study Agent.

It does NOT replace:

- CASE_STUDY_AGENT_PRE_RUN.md
- GOLD_STANDARD_CASE_STUDY_AGENT_MEMORY.md

Those files remain mandatory Agent runtime memory.

---

## Repository

C:\Users\HASWANTH KUMAR D\desktop\geek-creative-agency

## Branch

case-study-agent

## GitHub

Push is ON HOLD.

Authenticated GitHub account Haswanthkumar11 currently does not have permission to push to:

https://github.com/geekanimals/geek-creative-agency

Do not modify GitHub authentication, remotes, credentials, permissions, or push unless explicitly requested by Mayank.

## Known Local Commits

- e75cec8 Enforce Gold Standard Case Study Agent workflow
- 4546a98 Complete Gold Standard Case Study Agent engineering
- 58e372a origin/main — Initial project import

## Last Fully Verified Engineering State

- 35 / 35 test files passed
- 1045 assertions passed
- 0 failed
- TypeScript PASS
- Git diff check PASS
- Engineering gate PASS

This verification predates the next Agent changes. Re-run verification after modifying Agent code.

---

# Permanent Agent Rule

THE AGENT MUST DO THE CASE STUDY WORK ITSELF.

ChatGPT may:

- orchestrate the Agent
- supply raw trusted source material
- inspect outputs
- diagnose failures
- identify generic Agent weaknesses
- fix generic Agent weaknesses
- add generic regression tests
- rerun and verify the Agent

ChatGPT must NOT manually:

- write case studies
- choose winning metrics
- reconcile conflicting campaign evidence
- architect the story
- design the page
- decide SEO conclusions
- patch case-specific copy to pass a gate
- create campaign-specific Agent hacks

If a real campaign exposes a weakness:

diagnose generic weakness -> fix generically -> regression test -> verify -> rerun campaign

There is one permanent Gold Standard Case Study Agent.

Do not create alternate Agent versions.

---

# Current Case Study

Company: PepsiCo
Brand: Kurkure
Project: Kurkure x Masaba
Slug: kurkure-masaba
Industry: FMCG
Service: Influencer Marketing
Solutions: []

Request:

content/case-study-agent-input/kurkure-masaba.request.json

Review output:

content/case-study-agent-input/kurkure-masaba.request.review.json

mediaAssets is intentionally empty.

---

# Approved Source Set

Four sourceManifest entries are approved for extraction:

1. kurkure-masaba-geek-report-2020-11
   Drive ID: 15SpkqB8YwFK6p2G4fLcfXfZFJ41N6xig

2. kurkure-masaba-influencer-brief-2020-11
   Drive ID: 16sB1ClF3ehLxCm_O1KG1I6x5mnZlF-i7

3. kurkure-masaba-listening-2020-11
   Drive ID: 1zgjgO-mxW-hCx01c-EMY_EKWWlLumiZw

4. kurkure-masaba-geek-case-study-alternate
   Drive ID: 1ljNUpimHOjF5dKuvL2Tm-2pX6Tguns8z

Different first-party evidence contains figures including 525 vs 515 posts and broader listening-report scopes.

The Agent must reconcile and scope this evidence itself.

---

# Latest Input State

The request was cleaned so all four entries are:

approved-for-extraction

Counts:

approvedCount = 4
pendingCount = 0
rejectedCount = 0

mediaAssets = []

Result previously confirmed:

Kurkure input ready: 4 approved sources | mediaAssets: 0

---

# Latest Agent Run

Command:

npx tsx scripts/case-study-agent/flexibleCli.ts generate content/case-study-agent-input/kurkure-masaba.request.json --out content/case-study-agent-input/kurkure-masaba.request.review.json

Result:

Gold Standard Case Study Agent — Flexible
Mode: GENERATE / REVIEW ONLY

Running full Case Study Agent…

Flexible Case Study Agent failed:
Flexible SEO Quality Gate failed: SEO_FALSE_RESEARCH_SIGNAL

---

# CURRENT BLOCKER

SEO_FALSE_RESEARCH_SIGNAL

Do not manually rewrite Kurkure SEO.

Diagnosis must determine:

- where SEO_FALSE_RESEARCH_SIGNAL is implemented
- which generated field/text triggers it
- the exact triggering phrase
- whether the phrase actually makes an unsupported research/data/study claim
- whether the SEO-generation prompt encourages such wording
- whether the quality-gate detector is overbroad
- whether this exposes a generic Agent weakness

Then:

1. make the smallest GENERIC fix if needed
2. add/update GENERIC regression tests
3. run focused tests
4. run full verification
5. rerun the exact Kurkure request
6. inspect Agent-generated output

Do not touch CMS, Payload, production, deployment, publishing, or GitHub.

---

# NEXT ENGINEERING STEP

Locate every implementation, test, and reference associated with:

SEO_FALSE_RESEARCH_SIGNAL

Then inspect the detector and the generated SEO value that triggered it.

Work one controlled step at a time.
