# Production Redirect Map — geekcreativeagency.com launch

The old `geekcreativeagency.com` was a **single-page** site (anchor-based nav) plus
a few standalone `.html` legal/careers pages. Its `sitemap.xml` was **compromised
spam** (200+ obfuscated URLs such as `/tqorgt`, `/20tqormswihfat428scb`, all dated
2021-01-07) and the footer carried injected piracy-streaming links. We preserve the
SEO equity of the **legitimate** URLs only; the spam is dropped, not migrated.

Redirects are implemented in `next.config.mjs → redirects()` and apply once the
domain points at the new Vercel deployment. `permanent: true` emits **HTTP 308**
(permanent; search engines treat it like a 301).

## Legitimate legacy URLs → new URLs

| Old URL | New URL | Status | Reason |
| --- | --- | --- | --- |
| `/` | `/` | 200 | Home (no redirect) |
| `/career.html` | `/contact` | 308 | Careers is now the "Work at Geek" door in the Four Doors on `/contact` |
| `/careers.html` | `/contact` | 308 | Defensive alias for the same |
| `/privacy-policy.html` | `/privacy` | 308 | Legal — privacy policy |
| `/terms-and-conditions.html` | `/terms` | 308 | Legal — terms |
| `/refund-policy.html` | `/terms` | 308 | No standalone refund policy on the new site; nearest legal doc |

### Old homepage sections (anchors — no distinct URL, resolve to `/`)
`WHO WE ARE` (`#not_just_brawn`), `WHAT WE DO` (`#what_we_do`), `WHAT WE'VE DONE`
(`#look_again`), `AWARDS` (`#awards`), `FIND US` (`#g_spot`) were fragments on the
homepage. They resolve to `/` and need no redirect. Their content now lives at
`/about`, `/what-we-do`, `/work` respectively (reachable from the new nav).

### External/unrelated (leave alone)
- `https://www.sustainify.in` — separate legitimate Geek service; **do not** touch.
- HRMS login, social profiles — external; unchanged.

## URLs that must NOT be redirected (return 404/410)
- Every spam sitemap URL (`/tqorgt`, `/40tqorab-14ut09045`, … ~210 total). These
  fall through to a normal **404** on the new site — intentional, so the injected
  spam index is de-indexed rather than mass-redirected to `/`.
- The injected piracy-streaming outbound links (animesuge.io, bflix.to, movies7.to,
  fbox.to, myflixer.ru, flixtor.one, flixhq.net, swatchseries.ru, soap2day.video,
  watchmovieshd.ru, watchserieshd.ru) are **not present** in the new codebase.

## Operator follow-up (post-cutover, Search Console)
- Do **not** add catch-all redirects for the spam URLs. Let them 404; optionally
  return 410 (Gone) via a small handler if Search Console shows they linger.
- Use Search Console "Removals" only through legitimate procedures for known spam
  URLs; submit the new `/sitemap.xml`.
