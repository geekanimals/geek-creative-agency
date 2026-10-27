#!/usr/bin/env bash
# QA for the Claude-assisted case-study writer.
# Runs safety checks (nothing saved) and, with --write, saves ONE test draft
# "qa-test-case-study" (never published). Delete that draft in /admin afterwards.
#   bash scripts/claude-case-study/qa.sh            # checks only
#   bash scripts/claude-case-study/qa.sh --write    # checks + test draft save/update
set -u
cd "$(dirname "$0")/../.."
Q=content/claude-case-studies/qa
mkdir -p "$Q"
RUN="npx tsx scripts/claude-case-study/write-draft.ts"
pass=0; fail=0

cat > "$Q/base.json" <<'JSON'
{
  "slug": "qa-test-case-study",
  "title": "QA TEST - delete me",
  "client": "Lay's",
  "year": 2026,
  "location": "India",
  "shortSummary": "Test draft created by the QA script. Not a real case study.",
  "cardSummary": "QA test draft.",
  "projectKind": "campaign",
  "taxonomy": {
    "company": "pepsico",
    "brand": "lays",
    "services": ["influencer-marketing"],
    "industries": ["fmcg-foods"],
    "campaignTypes": ["influencer-campaign"]
  },
  "story": {
    "headline": "QA test headline",
    "challenge": { "question": "Does the writer work?", "copy": "Checking every safety rule." },
    "insight": "Test insight.",
    "idea": { "statement": "Test idea.", "copy": "Test idea copy." },
    "execution": "Test execution.",
    "outcome": "Test outcome."
  },
  "metrics": [ { "value": "123", "label": "test figure", "note": "QA only", "source": "src-1" } ],
  "sources": [ { "id": "src-1", "title": "QA source" } ],
  "seo": { "metaTitle": "QA test | Geek", "metaDescription": "QA test draft." },
  "faqs": [ { "question": "Is this real?", "answer": "No, it is a QA test." } ]
}
JSON

variant() { # name, node expression that edits d
  node -e "const fs=require('fs');const d=JSON.parse(fs.readFileSync('$Q/base.json'));$2;fs.writeFileSync('$Q/$1.json',JSON.stringify(d,null,2))"
}
variant no-source      "delete d.metrics[0].source"
variant wrong-company  "d.taxonomy.company='titan-company'"
variant missing-brand  "d.taxonomy.brand='no-such-brand'"
variant bad-slug       "d.slug='QA Test!'"
variant bad-type       "d.taxonomy.campaignTypes=['not-a-type']"
variant typo-field     "d.metric=d.metrics"
variant flagship       "d.slug='high-ultra-lounge'"
variant flexible       "d.slug='lays-heartwork'"
variant existing       "d.slug='tanishq'"

expect() { # label, want(ok|fail), file, extra args
  local label="$1" want="$2" file="$3"; shift 3
  out=$($RUN "$file" "$@" 2>&1); code=$?
  got=$([ $code -eq 0 ] && echo ok || echo fail)
  if [ "$got" = "$want" ]; then pass=$((pass+1)); echo "PASS  $label"; else fail=$((fail+1)); echo "FAIL  $label (expected $want, got $got)"; fi
  echo "$out" | grep -E "✖|✓|^  -|^  !" | sed 's/^/        /' | head -6
}

echo "== Safety checks (nothing is saved) =="
expect "valid case study passes the check"            ok   "$Q/base.json"
expect "figure without a source is refused"           fail "$Q/no-source.json"
expect "brand under the wrong company is refused"     fail "$Q/wrong-company.json"
expect "brand missing from the CMS is refused"        fail "$Q/missing-brand.json"
expect "invalid slug is refused"                      fail "$Q/bad-slug.json"
expect "invalid campaign type is refused"             fail "$Q/bad-type.json"
expect "misspelt field name is refused"               fail "$Q/typo-field.json"
expect "flagship project is never touched"            fail "$Q/flagship.json" --write --update
expect "flexible-layout project is not overwritten"   fail "$Q/flexible.json" --write --update
expect "existing project needs --update"              fail "$Q/existing.json" --write

if [ "${1:-}" = "--write" ]; then
  echo "== Save test (creates draft qa-test-case-study) =="
  expect "test draft is saved"                        ok   "$Q/base.json" --write
  expect "saving again without --update is refused"   fail "$Q/base.json" --write
  expect "--update replaces the draft"                ok   "$Q/base.json" --write --update
fi

echo "== Result: $pass passed, $fail failed =="
[ $fail -eq 0 ]
