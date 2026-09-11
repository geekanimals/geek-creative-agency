"use client";

/**
 * HIGH ULTRA LOUNGE — bespoke case-study renderer.
 *
 * A distinct "campaign skin" (deep atmospheric charcoal + High's original red)
 * for one project only. It is dispatched from the shared /work/[slug] route, is
 * driven by the shared projects.ts metadata (routing, SEO, related/next) and
 * reuses the global Nav/footer + <Media> + <RelatedAndNext>. It is NOT a second
 * case-study framework: every other project still renders via <CaseStudy>.
 *
 * Copy + asset selection are locked to the approved source (Website Copy V1 +
 * Proof Map). Claim guardrails honoured: 421 ft only (never 444); annual scope
 * = "planned", never "executed"; sell-out attributed to the archive record;
 * mixology credited to High's bar team; no reach/click/follower metrics.
 */

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import Media from "../ui/Media";
import { CaseStudy as CaseStudyType } from "@/lib/work/types";
import RelatedAndNext from "./RelatedAndNext";

const B = "/assets/work/high-ultra-lounge";
const RED = "#E11D28";
const CREAM = "#ECE7DD";
const MUTED = "rgba(236,231,221,0.60)";
const HAIR = "rgba(236,231,221,0.14)";

/* curated PUBLISH assets (code → file), from the approved manifest */
const IMG = {
  // launch
  L02: `${B}/launch/launch-teaser-like-us-2013.jpg`,
  L03: `${B}/launch/launch-reveal-green.png`,
  L04: `${B}/launch/launch-reveal-magenta.png`,
  L05: `${B}/launch/launch-reveal-red.png`,
  // pink
  P01: `${B}/events/pink-2014-rachel-zoe.png`,
  P02: `${B}/events/pink-2015-social-montage.jpg`,
  P03: `${B}/events/pink-2015-marilyn-monroe.jpg`,
  P04: `${B}/events/pink-2015-night-is-yours.jpg`,
  // full moon
  F01: `${B}/events/full-moon-original-poster.png`,
  F02: `${B}/events/full-moon-later-edition.jpg`,
  F03: `${B}/events/full-moon-return.jpg`,
  // high on power
  H05: `${B}/high-on-power/high-on-power-10-leaders-10-cocktails.jpg`,
  H02: `${B}/high-on-power/high-on-power-menu-page-1.jpg`,
  H03: `${B}/high-on-power/high-on-power-menu-page-2.jpg`,
  H04: `${B}/high-on-power/high-on-power-menu-page-3.jpg`,
  H06: `${B}/high-on-power/high-on-power-menu-centre-fold.jpg`,
  H07: `${B}/high-on-power/high-on-power-highly-politically-incorrect-standee.jpg`,
  // food / daytime
  D01: `${B}/food-daytime/japanese-food-festival-emailer-1.jpg`,
  D02: `${B}/food-daytime/japanese-food-festival-emailer-2.jpg`,
  D03: `${B}/food-daytime/sunday-brunch-identity.png`,
  D04: `${B}/food-daytime/sunday-brunch-bring-it-on-421-feet.jpg`,
  D05: `${B}/food-daytime/31-reasons-office-lunch-15.png`,
  D06: `${B}/food-daytime/31-reasons-office-lunch-19.png`,
  D07: `${B}/food-daytime/31-reasons-office-lunch-31.png`,
  // venue / on-ground
  V01: `${B}/venue-on-ground/high-view-rooftop-venue-night.jpg`,
  V02: `${B}/events/new-york-nights-event-creative.jpg`,
  V03: `${B}/venue-on-ground/new-york-nights-on-ground-lantern-moment.jpg`,
  V04: `${B}/venue-on-ground/new-york-nights-photo-01.jpg`,
};

/* ── motion helpers (all reduced-motion safe) ──────────────────────────── */
function Reveal({ children, className, delay = 0, style }: { children: ReactNode; className?: string; delay?: number; style?: CSSProperties }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

/* Framed archival artwork — never cropped (object-contain on a mat). */
function Art({
  src,
  alt,
  ratio = "1/1",
  mat = "#141319",
  className = "",
  priority = false,
  index = 0,
}: {
  src: string;
  alt: string;
  ratio?: string;
  mat?: string;
  className?: string;
  priority?: boolean;
  index?: number;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-md ring-1 ring-white/10 ${className}`}
      style={{ aspectRatio: ratio, backgroundColor: mat }}
    >
      <Media src={src} label={alt} contain priority={priority} index={index} showSlotLabel={false} />
    </div>
  );
}

/* Full-bleed photograph — cover crop is acceptable for real venue/event shots. */
function Photo({ src, alt, className = "", priority = false, index = 0 }: { src: string; alt: string; className?: string; priority?: boolean; index?: number }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Media src={src} label={alt} priority={priority} index={index} showSlotLabel={false} />
    </div>
  );
}

function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="mb-6 text-[0.72rem] font-bold uppercase tracking-[0.28em]" style={{ color: RED }}>
      {children}
    </p>
  );
}

/* consistent section wrapper */
function Section({ children, className = "", edge = true }: { children: ReactNode; className?: string; edge?: boolean }) {
  return (
    <section className={`px-5 sm:px-8 ${className}`}>
      <div className={edge ? "mx-auto max-w-edge" : ""}>{children}</div>
    </section>
  );
}

/* ── the properties in High's calendar (real campaign art) ─────────────── */
const PROPERTIES: { name: string; line: string; img: string; alt: string; ratio: string }[] = [
  { name: "Pink In The City", line: "For the women who owned the night.", img: IMG.P04, alt: "Pink In The City ‘The Night Is Yours’ ladies-night event creative", ratio: "3/4" },
  { name: "Full Moon Party", line: "A night worth bringing back.", img: IMG.F01, alt: "High Full Moon Party original event poster", ratio: "1/1" },
  { name: "High On Power", line: "Politics with a pour of humour.", img: IMG.H05, alt: "High On Power — ten world leaders as ten cocktails, table-top artwork", ratio: "3/4" },
  { name: "Sunday Brunch", line: "Sundays that started before sunset.", img: IMG.D04, alt: "High Sunday Brunch ‘Binge it on’ 421 feet creative", ratio: "1/1" },
  { name: "Japanese Food Festival", line: "When food became the occasion.", img: IMG.D01, alt: "High Japanese Food Festival emailer creative", ratio: "3/4" },
  { name: "New York Nights", line: "Friday, in another city.", img: IMG.V02, alt: "High New York Nights event creative", ratio: "1/1" },
  { name: "31 Reasons To Skip Office Lunch", line: "The workday ending at lunch.", img: IMG.D06, alt: "31 Reasons To Skip Office Lunch numbered creative #19", ratio: "1/1" },
];

const MENU_NAMES = ["POTUS Passion", "From Russia With Love", "The Drinktator", "The Barlusconi", "The Muffler", "Monica Blewinsky", "The Sourkozy"];

const CHAIN = [
  "Concept", "Name", "Identity", "Social", "WhatsApp", "LCD", "Print", "Standee",
  "Backdrop", "Ticket", "Media", "Outreach", "Venue", "Event", "Coverage", "Next night",
];

/* ── page ──────────────────────────────────────────────────────────────── */
export default function HighUltraLounge({ project }: { project: CaseStudyType }) {
  const reduce = useReducedMotion();
  return (
    <article style={{ backgroundColor: "#0B0B0E", color: CREAM }} className="overflow-hidden">
      {/* grain / atmosphere layer for the whole skin */}
      <div className="relative">
        {/* ========== 01 · HERO ========== */}
        <header className="relative min-h-[92vh] w-full overflow-hidden">
          {/* atmospheric rooftop establishing image (LCP) */}
          <div className="absolute inset-0">
            <Media src={IMG.V01} label="High Ultra Lounge rooftop at night, above Bengaluru" priority index={3} showSlotLabel={false} />
          </div>
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(11,11,14,0.72) 0%, rgba(11,11,14,0.55) 42%, rgba(11,11,14,0.92) 100%)" }}
          />
          <div className="relative mx-auto flex min-h-[92vh] max-w-edge flex-col justify-end px-5 pb-14 pt-28 sm:px-8 sm:pb-20">
            <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)]">
              <div>
                <motion.p
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="mb-6 text-[0.72rem] font-bold uppercase tracking-[0.28em]"
                  style={{ color: CREAM }}
                >
                  High Ultra Lounge · Bengaluru · <span style={{ color: RED }}>Hospitality / F&B</span>
                </motion.p>
                <motion.h1
                  initial={reduce ? false : { opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="h-display uppercase"
                  style={{ fontSize: "clamp(2.5rem, 7vw, 6.5rem)" }}
                >
                  We didn’t just
                  <br />
                  launch High.
                  <br />
                  <span style={{ color: RED }}>We built its calendar.</span>
                </motion.h1>
                <motion.p
                  initial={reduce ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="mt-7 max-w-[54ch] text-base leading-relaxed sm:text-lg"
                  style={{ color: MUTED }}
                >
                  From pre-launch curiosity to recurring nightlife properties, daytime occasions, food and
                  cocktail experiences, digital, print and on-ground execution — Geek worked inside High’s
                  rhythm for over two years.
                </motion.p>
              </div>

              {/* asymmetric archive cluster */}
              <motion.div
                variants={stagger}
                initial={reduce ? undefined : "hidden"}
                animate={reduce ? undefined : "show"}
                className="hidden gap-4 lg:grid"
                aria-hidden
              >
                <motion.div variants={rise} className="translate-x-4">
                  <Art src={IMG.P04} alt="" ratio="3/4" index={0} />
                </motion.div>
                <motion.div variants={rise} className="-translate-x-6 -translate-y-3">
                  <Art src={IMG.H05} alt="" ratio="4/3" index={1} />
                </motion.div>
              </motion.div>
            </div>

            {/* property ticker */}
            <div className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-2 border-t pt-6 text-[0.7rem] font-semibold uppercase tracking-[0.2em]" style={{ borderColor: HAIR, color: MUTED }}>
              {["Pink In The City", "Full Moon", "High On Power", "Sunday Brunch", "Japanese Food Festival", "New York Nights", "31 Reasons"].map((n) => (
                <span key={n} className="whitespace-nowrap">{n}</span>
              ))}
            </div>
          </div>
        </header>

        {/* ========== 02 · CURIOSITY ========== */}
        <Section className="py-24 sm:py-32">
          <Reveal>
            <Kicker>The Launch · Chapter 01</Kicker>
            <h2 className="h-display max-w-[18ch] uppercase" style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)" }}>
              Before people went High,
              <br />
              we got them <span style={{ color: RED }}>curious.</span>
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center">
            <Reveal className="max-w-[46ch] space-y-5 text-[15px] leading-relaxed" >
              <p style={{ color: MUTED }}>
                High Ultra Lounge was preparing to open on the rooftop of Bengaluru’s World Trade Center. The
                obvious launch route was easy to imagine: beautiful venue photography, cocktails, food, people
                partying, and a logo everywhere.
              </p>
              <p style={{ color: CREAM }}>We chose curiosity instead.</p>
              <p style={{ color: MUTED }}>
                We deliberately held the brand reveal back and started with a much simpler question — while the
                coloured “–” dash from the High logo quietly became the building block of every teaser. Mystery
                on the surface; brand memory underneath.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <Art src={IMG.L02} alt="High ‘Like Us’ pre-launch teaser emailer asking what gets you High" ratio="16/9" index={2} />
            </Reveal>
          </div>

          {/* WHAT GETS YOU HIGH — the big moment */}
          <Reveal className="mt-20 text-center">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.3em]" style={{ color: MUTED }}>The teaser asked</p>
            <p className="h-display mt-4 uppercase" style={{ fontSize: "clamp(2.4rem, 9vw, 8rem)", color: CREAM }}>
              What gets you <span style={{ color: RED }}>High?</span>
            </p>
            <div className="mx-auto mt-8 flex max-w-md flex-col items-center gap-1 text-[0.7rem] font-semibold uppercase tracking-[0.24em]" style={{ color: MUTED }}>
              <span>No logo</span>
              <span>No venue reveal</span>
              <span style={{ color: CREAM }}>Curiosity first</span>
            </div>
          </Reveal>

          {/* three-part colour reveal */}
          <motion.div
            variants={stagger}
            initial={reduce ? undefined : "hidden"}
            whileInView={reduce ? undefined : "show"}
            viewport={{ once: true, margin: "-60px" }}
            className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3"
          >
            {[
              { s: IMG.L03, a: "High brand-reveal mood visual — green" },
              { s: IMG.L04, a: "High brand-reveal mood visual — magenta" },
              { s: IMG.L05, a: "High brand-reveal mood visual — red" },
            ].map((m, i) => (
              <motion.div key={m.s} variants={rise}>
                <Art src={m.s} alt={m.a} ratio="1/1" index={i} />
              </motion.div>
            ))}
          </motion.div>
          <Reveal className="mt-10">
            <p className="mx-auto max-w-[40ch] text-center text-[15px] leading-relaxed" style={{ color: MUTED }}>
              So even before the logo appeared, the audience was already learning a piece of High. Then the
              campaign moved from teaser into the full brand reveal — food, drinks, ambience and identity.
            </p>
          </Reveal>
        </Section>

        {/* ========== 03 · THE DOORS OPENED (full-bleed venue) ========== */}
        <section className="relative">
          <Photo src={IMG.V01} alt="High Ultra Lounge rooftop venue at night" className="h-[70vh] min-h-[420px] w-full" index={4} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(11,11,14,0.55) 0%, rgba(11,11,14,0.2) 50%, rgba(11,11,14,0.85) 100%)" }} />
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-edge px-5 sm:px-8">
              <Reveal>
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.28em]" style={{ color: RED }}>Then the doors opened</p>
                <h2 className="h-display mt-4 max-w-[16ch] uppercase" style={{ fontSize: "clamp(2rem, 6vw, 5rem)" }}>
                  421 feet above Bengaluru,
                  <br />
                  High became real.
                </h2>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ========== SETTING · contextual facts ========== */}
        <Section className="py-16 sm:py-20">
          <Reveal>
            <div className="grid grid-cols-2 gap-y-8 border-y py-10 sm:grid-cols-4" style={{ borderColor: HAIR }}>
              {[
                { k: "Opened", v: "2014" },
                { k: "Location", v: "WTC · Bengaluru" },
                { k: "Footprint", v: "10,000 sq ft" },
                { k: "Height", v: "421 ft" },
              ].map((f) => (
                <div key={f.k}>
                  <p className="h-display" style={{ fontSize: "clamp(1.5rem,3.4vw,2.6rem)", color: CREAM }}>{f.v}</p>
                  <p className="mt-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>{f.k}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className="mt-12">
            <p className="mx-auto max-w-[30ch] text-center h-display uppercase" style={{ fontSize: "clamp(1.5rem,4vw,3rem)" }}>
              A spectacular venue could create a first visit. The harder job was creating reasons to
              <span style={{ color: RED }}> keep coming back.</span>
            </p>
          </Reveal>
        </Section>

        {/* ========== 04 · THE RELATIONSHIP / PIVOT ========== */}
        <Section className="border-t border-white/10 py-24 sm:py-32">
          <Reveal>
            <Kicker>The Relationship · Chapter 02</Kicker>
            <h2 className="h-display max-w-[22ch] uppercase" style={{ fontSize: "clamp(2rem, 5.5vw, 4.6rem)" }}>
              The launch wasn’t the end of the brief.
              <br />
              <span style={{ color: RED }}>It was the beginning of the relationship.</span>
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
            <Reveal className="max-w-[48ch] space-y-5 text-[15px] leading-relaxed" style={{ color: MUTED }}>
              <p>A hospitality brand isn’t built on opening night. It is built on the reasons people have to come back.</p>
              <p>
                A Wednesday that feels different from a Friday. A brunch worth giving up Sunday afternoon for. A
                cocktail menu people talk about. A property people recognise before they read the details.
              </p>
              <p style={{ color: CREAM }}>
                Geek’s role expanded from launch communication into ongoing brand-building — online and offline
                creative, event properties, social and digital, print, venue collateral, food and beverage
                communication, event coverage and on-ground execution.
              </p>
            </Reveal>
            {/* annual scope — phrased as PLANNED */}
            <Reveal delay={0.1}>
              <div className="rounded-lg border p-7 sm:p-9" style={{ borderColor: HAIR, backgroundColor: "#101015" }}>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em]" style={{ color: MUTED }}>
                  The 2015–16 annual scope was structured around
                </p>
                <p className="h-display mt-3" style={{ fontSize: "clamp(3rem,9vw,6rem)", color: RED }}>18</p>
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.24em]" style={{ color: CREAM }}>planned campaigns</p>
                <div className="mt-7 grid grid-cols-3 gap-3 text-center">
                  {[
                    { n: "9", l: "Events" },
                    { n: "6", l: "Sub-category" },
                    { n: "3", l: "Weekly" },
                  ].map((x) => (
                    <div key={x.l} className="rounded-md border py-4" style={{ borderColor: HAIR }}>
                      <p className="h-display" style={{ fontSize: "1.9rem", color: CREAM }}>{x.n}</p>
                      <p className="mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.16em]" style={{ color: MUTED }}>{x.l}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-[0.7rem] leading-relaxed" style={{ color: MUTED }}>
                  A contracted annual plan — not a tally of finished work. It shows the operating rhythm of the
                  relationship, campaign after campaign.
                </p>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ========== 05 · THE CALENDAR (property rail) ========== */}
        <Section className="border-t border-white/10 py-24 sm:py-32">
          <Reveal>
            <Kicker>The Calendar · Chapter 03</Kicker>
            <h2 className="h-display max-w-[16ch] uppercase" style={{ fontSize: "clamp(2.2rem, 6vw, 5rem)" }}>
              We built a calendar.
              <br />
              <span style={{ color: RED }}>Not a campaign.</span>
            </h2>
            <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed" style={{ color: MUTED }}>
              High didn’t need one repeated message. It needed different reasons to matter at different moments —
              different audiences, different dayparts, different formats. One brand.
            </p>
          </Reveal>

          <div className="mt-14 flex gap-5 overflow-x-auto pb-6 no-scrollbar" style={{ scrollSnapType: "x mandatory" }}>
            {PROPERTIES.map((p, i) => (
              <Reveal key={p.name} delay={(i % 3) * 0.05} className="shrink-0" >
                <div className="w-[78vw] shrink-0 sm:w-[380px]" style={{ scrollSnapAlign: "start" }}>
                  <Art src={p.img} alt={p.alt} ratio={p.ratio} index={i} />
                  <p className="h-display mt-4 uppercase" style={{ fontSize: "1.4rem", color: CREAM }}>{p.name}</p>
                  <p className="mt-1 text-[13px]" style={{ color: MUTED }}>{p.line}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-2 text-[0.66rem] font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>Scroll / swipe the calendar →</p>
        </Section>

        {/* ========== 06 · PINK IN THE CITY ========== */}
        <Section className="border-t border-white/10 py-24 sm:py-32">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:items-center">
            <Reveal>
              <Art src={IMG.P04} alt="Pink In The City ‘The Night Is Yours’ event-detail creative" ratio="3/4" index={0} />
            </Reveal>
            <div>
              <Reveal>
                <Kicker>Recurring Property · Pink In The City</Kicker>
                <h2 className="h-display uppercase" style={{ fontSize: "clamp(1.9rem,5vw,4rem)" }}>
                  One night for the ladies.
                  <br />
                  <span style={{ color: RED }}>Four editions</span> of a recognisable property.
                </h2>
                <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed" style={{ color: MUTED }}>
                  Ladies’ nights were hardly new. The opportunity was to make High’s version feel like High. Pink
                  In The City gave the night its own mnemonic, visual world and voice — then carried that identity
                  through social, event communication, WhatsApp, LCD and print. The archive documents four
                  editions across 2014 and 2015. The property returned; the creative evolved; the name stayed
                  recognisable.
                </p>
              </Reveal>
              <motion.div
                variants={stagger}
                initial={reduce ? undefined : "hidden"}
                whileInView={reduce ? undefined : "show"}
                viewport={{ once: true, margin: "-60px" }}
                className="mt-8 grid grid-cols-3 gap-4"
              >
                {[
                  { s: IMG.P01, a: "Pink In The City 2014 quote creative" },
                  { s: IMG.P03, a: "Pink In The City 2015 quote creative" },
                  { s: IMG.P02, a: "Pink In The City 2015 social-creative montage" },
                ].map((m, i) => (
                  <motion.div key={m.s} variants={rise}>
                    <Art src={m.s} alt={m.a} ratio="1/1" index={i} />
                  </motion.div>
                ))}
              </motion.div>
              <Reveal className="mt-6">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.22em]" style={{ color: CREAM }}>
                  That is when an event begins to behave like an <span style={{ color: RED }}>asset.</span>
                </p>
              </Reveal>
            </div>
          </div>
        </Section>

        {/* ========== 07 · FULL MOON (low-res → small archival tiles) ========== */}
        <Section className="border-t border-white/10 py-24 sm:py-32">
          <Reveal className="text-center">
            <Kicker>Recurring Property · Full Moon Party</Kicker>
            <h2 className="h-display mx-auto max-w-[16ch] uppercase" style={{ fontSize: "clamp(2rem,5.5vw,4.5rem)" }}>
              Some ideas are too good
              <br />
              <span style={{ color: RED }}>for one night.</span>
            </h2>
          </Reveal>
          {/* deliberately small archival tiles — source is low resolution */}
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { s: IMG.F01, a: "High Full Moon Party — original event poster", t: "The original" },
              { s: IMG.F02, a: "High Full Moon Party — ‘Taking it a little higher’ later edition", t: "It came back" },
              { s: IMG.F03, a: "‘Return of the Full Moon Party’ event creative", t: "And came back again" },
            ].map((m, i) => (
              <Reveal key={m.s} delay={i * 0.08}>
                <div className="mx-auto max-w-[240px]">
                  <Art src={m.s} alt={m.a} ratio="1/1" index={i} mat="#141319" />
                  <p className="mt-3 text-center text-[0.66rem] font-semibold uppercase tracking-[0.18em]" style={{ color: MUTED }}>{m.t}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 text-center">
            <p className="h-display uppercase" style={{ fontSize: "clamp(1.4rem,4vw,2.6rem)" }}>
              Return of the <span style={{ color: RED }}>Full Moon Party.</span>
            </p>
            <p className="mx-auto mt-4 max-w-[42ch] text-[14px] leading-relaxed" style={{ color: MUTED }}>
              For Full Moon, Geek’s role extended beyond the event identity and communication into the experience
              at the party itself. An idea became a recognisable reason to return.
            </p>
          </Reveal>
        </Section>

        {/* ========== 08 · HIGH ON POWER (showstopper) ========== */}
        <section className="border-t" style={{ borderColor: HAIR, backgroundColor: "#08080B" }}>
          <Section className="py-24 sm:py-36">
            <Reveal className="text-center">
              <Kicker>The Creative Peak · High On Power</Kicker>
              <h2 className="h-display uppercase leading-[0.95]" style={{ fontSize: "clamp(2.4rem,8vw,6.5rem)" }}>
                Politics.
                <br />
                Cocktails.
                <br />
                Comedy.
              </h2>
              <p className="mt-8 h-display uppercase" style={{ fontSize: "clamp(1.2rem,3.2vw,2.2rem)", color: RED }}>
                What could possibly go wrong?
              </p>
            </Reveal>

            <Reveal className="mx-auto mt-16 max-w-[52ch] space-y-5 text-center text-[15px] leading-relaxed" style={{ color: MUTED }}>
              <p>
                High On Power began with a simple creative provocation: what if some of the world’s most
                recognisable political personalities could be translated into drinks?
              </p>
            </Reveal>

            <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center">
              {["Ten world leaders", "Ten personas", "Ten cocktails"].map((t) => (
                <span key={t} className="h-display uppercase" style={{ fontSize: "clamp(1.1rem,3vw,2rem)", color: CREAM }}>{t}</span>
              ))}
            </Reveal>

            {/* full-width centrepiece */}
            <Reveal className="mt-14">
              <Art src={IMG.H05} alt="High On Power — ten world leaders translated into ten cocktails, table-top menu artwork" ratio="16/10" mat="#0d0d11" index={0} />
            </Reveal>

            <Reveal className="mx-auto mt-14 max-w-[52ch] text-center text-[15px] leading-relaxed" style={{ color: MUTED }}>
              <p>
                It got its own identity, visual system, menu, digital participation and physical communication —
                and its own live entertainment layer. The festival paired with <span style={{ color: CREAM }}>Highly Politically Incorrect</span>, a
                ticketed stand-up show featuring Sundeep Rao and Sorabh Pant.
              </p>
              <p className="mt-4 text-[13px]" style={{ color: MUTED }}>
                The archived case-study record notes the show as a complete sell-out.
              </p>
            </Reveal>

            <Reveal className="mx-auto mt-12 max-w-sm">
              <Art src={IMG.H07} alt="Highly Politically Incorrect stand-up show standee for the High On Power festival" ratio="1/2" mat="#0d0d11" index={1} />
            </Reveal>
          </Section>
        </section>

        {/* ========== 09/10 · THE MENU WAS MEDIA TOO ========== */}
        <section className="border-t" style={{ borderColor: HAIR, backgroundColor: "#08080B" }}>
          <Section className="py-24 sm:py-32">
            <Reveal>
              <Kicker>The Menu · Chapter 05</Kicker>
              <h2 className="h-display uppercase" style={{ fontSize: "clamp(2.4rem,8vw,7rem)" }}>
                The menu
                <br />
                <span style={{ color: RED }}>was media too.</span>
              </h2>
            </Reveal>

            {/* tactile menu spreads */}
            <Reveal className="mt-14">
              <Art src={IMG.H06} alt="High On Power concept menu — centre-fold spread" ratio="16/11" mat="#0d0d11" index={0} />
            </Reveal>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {[
                { s: IMG.H02, a: "High On Power concept menu — page one" },
                { s: IMG.H03, a: "High On Power concept menu — page two" },
                { s: IMG.H04, a: "High On Power concept menu — page three" },
              ].map((m, i) => (
                <Reveal key={m.s} delay={i * 0.06}>
                  <Art src={m.s} alt={m.a} ratio="7/5" mat="#0d0d11" index={i} />
                </Reveal>
              ))}
            </div>

            {/* drink names */}
            <Reveal className="mt-12 flex flex-wrap gap-x-6 gap-y-2">
              {MENU_NAMES.map((n) => (
                <span key={n} className="text-[0.78rem] font-semibold uppercase tracking-[0.14em]" style={{ color: MUTED }}>{n}</span>
              ))}
            </Reveal>

            <Reveal className="mx-auto mt-16 max-w-[40ch] text-center">
              <p className="h-display uppercase leading-[1.05]" style={{ fontSize: "clamp(1.4rem,4vw,2.6rem)" }}>
                An idea doesn’t have to live in an ad.
              </p>
              <p className="mt-5 text-[14px] leading-relaxed" style={{ color: MUTED }}>
                It can live in a drink, a menu, a ticket, a table, a conversation — anything the customer touches
                can carry the idea. The mixology belonged to High’s bar team; our job was to make the creative
                idea travel through the experience around it.
              </p>
            </Reveal>
          </Section>
        </section>

        {/* ========== 11 · DAYLIGHT / FOOD ========== */}
        <Section className="border-t border-white/10 py-24 sm:py-32">
          <Reveal>
            <Kicker>Daytime & Food · Chapter 06</Kicker>
            <h2 className="h-display max-w-[16ch] uppercase" style={{ fontSize: "clamp(2rem,5.5vw,4.5rem)" }}>
              Daylight had a <span style={{ color: RED }}>calendar too.</span>
            </h2>
            <p className="mt-6 max-w-[50ch] text-[15px] leading-relaxed" style={{ color: MUTED }}>
              High was not only a Friday-night brand. The same creative thinking built reasons to visit across
              different dayparts and dining occasions.
            </p>
          </Reveal>

          {/* Sunday brunch */}
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:items-center">
            <Reveal><Art src={IMG.D03} alt="High Sunday Brunch identity" ratio="1/1" index={0} /></Reveal>
            <Reveal delay={0.08}><Art src={IMG.D04} alt="High Sunday Brunch ‘Binge it on — exotic buffet & drinks at 421 feet High’ creative" ratio="1/1" index={1} /></Reveal>
          </div>

          {/* 31 reasons — numbered system */}
          <Reveal className="mt-20">
            <p className="text-[0.72rem] font-bold uppercase tracking-[0.24em]" style={{ color: RED }}>31 Reasons To Skip Office Lunch</p>
            <p className="mt-3 max-w-[46ch] text-[14px] leading-relaxed" style={{ color: MUTED }}>
              One proposition, dozens of potential reasons — a numbered system built to keep producing fresh
              communication.
            </p>
          </Reveal>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { s: IMG.D05, a: "31 Reasons #15 — ‘Lose that tie! Grab a quick lunch.’" },
              { s: IMG.D06, a: "31 Reasons #19 — ‘Better pictures for Instagram? Grab a quick lunch.’" },
              { s: IMG.D07, a: "31 Reasons #31 — ‘Slow internet killing your time? Grab a quick lunch.’" },
            ].map((m, i) => (
              <Reveal key={m.s} delay={i * 0.06}><Art src={m.s} alt={m.a} ratio="1/1" index={i} /></Reveal>
            ))}
          </div>

          {/* japanese food festival */}
          <div className="mt-20 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,360px)] lg:items-center">
            <Reveal>
              <p className="text-[0.72rem] font-bold uppercase tracking-[0.24em]" style={{ color: RED }}>Japanese Food Festival</p>
              <p className="h-display mt-4 uppercase" style={{ fontSize: "clamp(1.6rem,4.5vw,3.2rem)" }}>
                When food itself became <span style={{ color: RED }}>the occasion.</span>
              </p>
              <p className="mt-5 max-w-[42ch] text-[14px] leading-relaxed" style={{ color: MUTED }}>
                Food was not filler between nightlife posts. When High wanted food to become the event, the
                calendar shifted again — into properties like its Japanese Food Festival. Food was content.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="grid grid-cols-2 gap-4">
              <Art src={IMG.D01} alt="High Japanese Food Festival emailer — one" ratio="3/5" index={0} />
              <Art src={IMG.D02} alt="High Japanese Food Festival emailer — two" ratio="3/5" index={1} />
            </Reveal>
          </div>
        </Section>

        {/* ========== 12 · THE IDEA LEFT THE SCREEN (New York Nights) ========== */}
        <Section className="border-t border-white/10 py-24 sm:py-32">
          <Reveal>
            <Kicker>On-Ground · Chapter 07</Kicker>
            <h2 className="h-display max-w-[18ch] uppercase" style={{ fontSize: "clamp(2rem,5.5vw,4.5rem)" }}>
              The idea <span style={{ color: RED }}>left the screen.</span>
            </h2>
            <p className="mt-6 max-w-[48ch] text-[15px] leading-relaxed" style={{ color: MUTED }}>
              A strong hospitality campaign has a moment where the artwork stops being the experience. New York
              Nights gives us that proof in one sequence: the property creative, then the actual rooftop, then
              real guests inside the experience.
            </p>
          </Reveal>
          <Reveal className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Art src={IMG.V02} alt="High New York Nights event creative" ratio="1/1" index={0} />
            <Photo src={IMG.V04} alt="High New York Nights — guests inside the branded rooftop experience" className="aspect-square w-full rounded-md ring-1 ring-white/10" index={1} />
          </Reveal>
          <Reveal className="mt-6">
            <Photo src={IMG.V03} alt="High New York Nights — the lantern moment on the rooftop with guests participating" className="aspect-[16/9] w-full rounded-md ring-1 ring-white/10" index={2} />
          </Reveal>
          <Reveal className="mt-8">
            <p className="max-w-[44ch] text-[14px] leading-relaxed" style={{ color: MUTED }}>
              That is the difference between making communication for an event and helping make the event happen.
            </p>
          </Reveal>
        </Section>

        {/* ========== 13 · IDEA TO LAST MILE (chain) ========== */}
        <Section className="border-t border-white/10 py-24 sm:py-32">
          <Reveal>
            <Kicker>How it worked · Chapter 08</Kicker>
            <h2 className="h-display max-w-[18ch] uppercase" style={{ fontSize: "clamp(2rem,5.5vw,4.5rem)" }}>
              From the idea
              <br />
              <span style={{ color: RED }}>to the last drink served.</span>
            </h2>
            <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed" style={{ color: MUTED }}>
              Not a sequence of disconnected deliverables. A chain — where an idea moves from concept all the way
              to the next night.
            </p>
          </Reveal>
          <motion.ul
            variants={stagger}
            initial={reduce ? undefined : "hidden"}
            whileInView={reduce ? undefined : "show"}
            viewport={{ once: true, margin: "-60px" }}
            className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-4"
          >
            {CHAIN.map((step, i) => (
              <motion.li key={step} variants={rise} className="flex items-center gap-3">
                <span className="h-display uppercase" style={{ fontSize: "clamp(1.05rem,2.4vw,1.8rem)", color: i === CHAIN.length - 1 ? RED : CREAM }}>{step}</span>
                {i < CHAIN.length - 1 && <span aria-hidden style={{ color: RED }}>→</span>}
              </motion.li>
            ))}
          </motion.ul>
          <Reveal className="mt-14">
            <p className="h-display max-w-[20ch] uppercase" style={{ fontSize: "clamp(1.5rem,4vw,3rem)" }}>
              High didn’t need an agency for one big night. It needed ideas for the
              <span style={{ color: RED }}> nights after it.</span>
            </p>
          </Reveal>
        </Section>

        {/* ========== 14 · ALWAYS ON — archive wall ========== */}
        <Section className="border-t border-white/10 py-24 sm:py-32">
          <Reveal>
            <Kicker>Always On · March 2016 and beyond</Kicker>
            <h2 className="h-display uppercase" style={{ fontSize: "clamp(2.2rem,6vw,5rem)" }}>
              421 feet high. <span style={{ color: RED }}>Always on.</span>
            </h2>
            <p className="mt-6 max-w-[46ch] text-[15px] leading-relaxed" style={{ color: MUTED }}>
              Years of different reasons to experience the same brand. Let the archive take over.
            </p>
          </Reveal>
          <div className="mt-14 [column-fill:_balance] gap-4 sm:columns-2 lg:columns-3">
            {[
              { s: IMG.L05, a: "High brand-reveal mood visual — red", r: "1/1" },
              { s: IMG.P04, a: "Pink In The City event creative", r: "3/4" },
              { s: IMG.V03, a: "New York Nights lantern moment on the rooftop", r: "16/10" },
              { s: IMG.H05, a: "High On Power — ten leaders, ten cocktails", r: "4/3" },
              { s: IMG.D04, a: "Sunday Brunch 421-feet creative", r: "1/1" },
              { s: IMG.F03, a: "Return of the Full Moon Party creative", r: "1/1" },
              { s: IMG.D06, a: "31 Reasons To Skip Office Lunch creative", r: "1/1" },
              { s: IMG.H06, a: "High On Power menu centre fold", r: "3/2" },
              { s: IMG.V01, a: "High rooftop venue at night", r: "3/2" },
              { s: IMG.D01, a: "Japanese Food Festival emailer", r: "3/5" },
              { s: IMG.P02, a: "Pink In The City social montage", r: "4/3" },
              { s: IMG.L03, a: "High brand-reveal mood visual — green", r: "1/1" },
            ].map((m, i) => (
              <div key={m.s + i} className="mb-4 break-inside-avoid">
                <Art src={m.s} alt={m.a} ratio={m.r} index={i} />
              </div>
            ))}
          </div>
        </Section>

        {/* ========== 15 · CLOSING ========== */}
        <section className="border-t" style={{ borderColor: HAIR, backgroundColor: "#08080B" }}>
          <Section className="py-28 sm:py-40 text-center">
            <Reveal>
              <p className="h-display uppercase" style={{ fontSize: "clamp(2rem,6vw,4.5rem)", color: MUTED }}>
                A launch creates attention.
              </p>
              <p className="h-display mt-3 uppercase" style={{ fontSize: "clamp(2.4rem,8vw,6.5rem)" }}>
                A calendar <span style={{ color: RED }}>builds a brand.</span>
              </p>
            </Reveal>
            <Reveal className="mt-16">
              <p className="h-display mx-auto max-w-[20ch] uppercase" style={{ fontSize: "clamp(1.6rem,4.5vw,3.4rem)" }}>
                We didn’t just launch High.
                <br />
                We built its calendar.
              </p>
              <p className="mt-6 text-[0.72rem] font-semibold uppercase tracking-[0.24em]" style={{ color: MUTED }}>
                High Ultra Lounge · 2014 → Mar 2016+
              </p>
            </Reveal>

            {/* footer data */}
            <Reveal className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-x-8 gap-y-8 border-t pt-12 text-left sm:grid-cols-4" >
              {[
                { k: "Client", v: "High Ultra Lounge" },
                { k: "Location", v: "Bengaluru, India" },
                { k: "Category", v: "Hospitality / F&B" },
                { k: "Engagement", v: "Long-term brand partnership" },
              ].map((f) => (
                <div key={f.k}>
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>{f.k}</p>
                  <p className="mt-2 text-[14px]" style={{ color: CREAM }}>{f.v}</p>
                </div>
              ))}
              <div className="col-span-2 sm:col-span-4">
                <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em]" style={{ color: MUTED }}>Services</p>
                <p className="mt-2 text-[13px] leading-relaxed" style={{ color: CREAM }}>
                  Strategy · Creative · Branding · Social &amp; Digital · Event Property Development · Experiential ·
                  Print · Content · Food &amp; Beverage Communication · PR / Outreach · On-ground Activation
                </p>
              </div>
            </Reveal>

            <Reveal className="mt-20">
              <p className="h-display uppercase" style={{ fontSize: "clamp(1.4rem,4vw,2.6rem)" }}>
                We build brands. <span style={{ color: RED }}>Then we make them matter.</span>
              </p>
            </Reveal>
          </Section>
        </section>
      </div>

      {/* shared related / next module (light chrome — belongs to the Geek site) */}
      <RelatedAndNext project={project} />
    </article>
  );
}
