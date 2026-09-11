# Geek Creative Agency — Homepage

Premium, visual-first homepage for Geek. Next.js (App Router) · React · Tailwind · Framer Motion.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Design tokens
All colours/fonts live in `tailwind.config.ts` and `app/globals.css`.
- `geek.cyan` = **`#32C1DF`** — sampled directly from `Geek_logo_Animated.psd`.
  Supporting: `cyan-bright #63D0EA`, `deep #137C93` (type on light), `navy #08252E`.
- Fonts: Space Grotesk (display), Inter (UI), Caveat (brush accent) via `next/font`.

## Logo
The real Geek wordmark is extracted from the PSD into transparent PNGs in `/public`:
`geek-logo-cyan.png` (light bg), `geek-logo-navy.png` (cyan footer),
`geek-logo-white.png` (dark bg), `geek-logo-ink.png`. Rendered via
`components/ui/GeekLogo.tsx` with a `variant` prop. Favicon: `app/icon.png`
(the logo "g" on navy). To refresh from a new PSD, re-run the extraction and
overwrite these files.

## Swapping in real assets
Every visual is a `<Media>` slot (`components/ui/Media.tsx`): pass `src` to show
the real file, or leave it unset and the slot renders a labelled placeholder
showing the exact required path (`need`). Never fabricate a campaign visual.

1. Full required-file list: **`public/assets/ASSET-CHECKLIST.md`** (grouped by
   section, ✅ delivered / ⬜ required).
2. Drop the file at its `need` path, then set the matching `src` field in
   `lib/data/*.ts` (e.g. `src: "/assets/work/doritos/hero.jpg"`). It renders
   immediately.
3. **Showreel**: add `public/assets/work/showreel.mp4` (20–25s, muted) and
   uncomment the `<video>` block in `components/Hero.tsx` (poster collage is the
   fallback until then).
4. **Client logos**: drop monochrome SVGs at `/assets/clients/<slug>.svg` and set
   `logo` in `lib/data/clients.ts`.
5. **Logo**: real Geek wordmark already wired (`components/ui/GeekLogo.tsx`).

## Forms — live handler
Four modal forms (Client / Creator / Career / Vendor) in `components/forms/`
POST to the **live** route `app/api/lead/route.ts`. It's provider-agnostic —
set ONE env var in `.env.local` and leads start delivering (no code change):

- `RESEND_API_KEY` + `LEAD_TO_EMAIL` → email (recommended)
- `FORMSPREE_ENDPOINT` → Formspree
- `LEAD_WEBHOOK_URL` → any webhook (Zapier / CRM)
- `LEAD_SLACK_WEBHOOK` → Slack

See `.env.example`. With nothing set, submissions succeed in the UI and are
logged server-side (dev). Built in: honeypot spam trap (`company_website`),
per-IP rate limit, email validation, and reply-to set to the lead's email.

## Layout system
The homepage uses a compact **editorial band** system (`components/ui/Band.tsx`):
each section is a narrow left **label rail** + a wide content row, separated by
thin rules — dense and horizontal, not full-screen panels. Horizontal galleries
(media strip, Create, The Work, Process rail) scroll sideways; the page scrolls
vertically through the bands. Swap `Placeholder` for real media via the `image`
prop; use `bare` when a tile carries its own caption overlay.

## Section order (homepage)
Hero → The Media Changed → Client Logo Wall → BUILD → CREATE → INFLUENCE →
PROOF → Big Idea to Last Mile → Built by Geek → The Geek Way → The Work →
Four Doors → End.

> Only the homepage is built. No additional pages until approved.
