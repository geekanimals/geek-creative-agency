# Claude-assisted case studies (Option 4)

Claude writes the case study in a chat; this folder's script saves it to the
CMS as a **draft**. A person always previews and publishes. No paid AI API is
used: the writing happens inside the existing Claude subscription.

## The process

1. **Share the material with Claude in chat**: brief, client report, figures,
   press links, award details, photos. Say which brand and company it is for.
2. **Claude writes** `content/claude-case-studies/<slug>.json` in the format of
   `template.json`, following the rules below. If anything is unclear (a figure
   without a source, a brand missing in the CMS), Claude asks instead of guessing.
3. **Check it** (nothing is saved):
   `npm run case-study:draft -- content/claude-case-studies/<slug>.json`
4. **Save it as a draft**:
   `npm run case-study:draft -- content/claude-case-studies/<slug>.json --write`
   To redo a draft that already exists, add `--update`. The live version of a
   published case study does not change until someone clicks Publish.
5. **Review in `/admin` → Projects**: open the draft, click **Preview**, check
   it on desktop and mobile, add the hero image and gallery photos, then click
   **Publish**.

The JSON files in `content/claude-case-studies/` are not committed to Git
because they can hold unpublished client figures.

## Rules Claude follows (Gold Standard)

Full contract: `scripts/case-study-agent/GOLD_STANDARD_CASE_STUDY_AGENT_MEMORY.md`.

- **Only facts from the material.** Every figure goes in `metrics` with a
  `source` that points to an entry in `sources`. No source, no figure. The
  script refuses a metric without one.
- **Keep the scope honest.** Figures from Geek's own tracking are labelled as
  Geek's subset (use `note`), never as the whole campaign's result.
- **No invented strategy.** Do not turn an execution detail into a "strategic
  insight", imply cause from correlation, or add dates, partners or
  attribution the material does not state.
- **Quotes and awards only when supplied.** Name exactly who an award credited;
  tick `geekCredited` only when Geek is named.
- **Taxonomy must already exist.** Company, brand, services, industries and
  solutions are CMS slugs. A Solution (for example IRM) is used only when the
  material says so, never because a service is present. If something is missing,
  create it in `/admin` first; the script never creates or guesses records.
- **Brand belongs to its company** (Lay's → PepsiCo). The CMS rejects a mismatch.
- **SEO:** meta title up to 60 characters, meta description up to 160, written
  for people. FAQs answer real questions in one or two sentences.
- **Draft only.** Flagship (bespoke) case studies are never touched, and the
  script has no publish option.

## Images

Images are added in `/admin` during review (hero, gallery). The script does
not upload files, so a case study prepared on one computer still shows the
right images on the live site. An image already in `public/assets/...` can be
set with `heroLegacySrc`.
