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

import { motion, useReducedMotion } from "framer-motion";
import Media from "@/components/ui/Media";
import RelatedAndNext from "@/components/work/case-study/RelatedAndNext";

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
function Reveal({ children, className, delay = 0, style }) {
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

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } };
const rise = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
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
}) {
  return (
    <div className={`hul-art ${className}`} style={{ aspectRatio: ratio, backgroundColor: mat }}>
      <Media
        src={src}
        label={alt}
        contain
        priority={priority}
        index={index}
        showSlotLabel={false}
      />
    </div>
  );
}

/* Full-bleed photograph — cover crop is acceptable for real venue/event shots. */
function Photo({ src, alt, className = "", priority = false, index = 0 }) {
  return (
    <div className={`hul-photo ${className}`}>
      <Media src={src} label={alt} priority={priority} index={index} showSlotLabel={false} />
    </div>
  );
}

function Kicker({ children }) {
  return (
    <p className="hul-kicker" style={{ color: RED }}>
      {children}
    </p>
  );
}

/* consistent section wrapper */
function Section({ children, className = "", edge = true }) {
  return (
    <section className={`hul-section ${className}`}>
      <div className={edge ? "hul-section__inner" : undefined}>{children}</div>
    </section>
  );
}

/* ── the properties in High's calendar (real campaign art) ─────────────── */
const PROPERTIES = [
  {
    name: "Pink In The City",
    line: "For the women who owned the night.",
    img: IMG.P04,
    alt: "Pink In The City ‘The Night Is Yours’ ladies-night event creative",
    ratio: "3/4",
  },
  {
    name: "Full Moon Party",
    line: "A night worth bringing back.",
    img: IMG.F01,
    alt: "High Full Moon Party original event poster",
    ratio: "1/1",
  },
  {
    name: "High On Power",
    line: "Politics with a pour of humour.",
    img: IMG.H05,
    alt: "High On Power — ten world leaders as ten cocktails, table-top artwork",
    ratio: "3/4",
  },
  {
    name: "Sunday Brunch",
    line: "Sundays that started before sunset.",
    img: IMG.D04,
    alt: "High Sunday Brunch ‘Binge it on’ 421 feet creative",
    ratio: "1/1",
  },
  {
    name: "Japanese Food Festival",
    line: "When food became the occasion.",
    img: IMG.D01,
    alt: "High Japanese Food Festival emailer creative",
    ratio: "3/4",
  },
  {
    name: "New York Nights",
    line: "Friday, in another city.",
    img: IMG.V02,
    alt: "High New York Nights event creative",
    ratio: "1/1",
  },
  {
    name: "31 Reasons To Skip Office Lunch",
    line: "The workday ending at lunch.",
    img: IMG.D06,
    alt: "31 Reasons To Skip Office Lunch numbered creative #19",
    ratio: "1/1",
  },
];

const MENU_NAMES = [
  "POTUS Passion",
  "From Russia With Love",
  "The Drinktator",
  "The Barlusconi",
  "The Muffler",
  "Monica Blewinsky",
  "The Sourkozy",
];

const CHAIN = [
  "Concept",
  "Name",
  "Identity",
  "Social",
  "WhatsApp",
  "LCD",
  "Print",
  "Standee",
  "Backdrop",
  "Ticket",
  "Media",
  "Outreach",
  "Venue",
  "Event",
  "Coverage",
  "Next night",
];

/* ── page ──────────────────────────────────────────────────────────────── */
export default function HighUltraLounge({ project, pool }) {
  const reduce = useReducedMotion();
  return (
    <article style={{ backgroundColor: "#0B0B0E", color: CREAM }} className="hul">
      <style href="hul" precedence="default">
        {styles}
      </style>
      {/* grain / atmosphere layer for the whole skin */}
      <div className="hul__skin">
        {/* ========== 01 · HERO ========== */}
        <header className="hul-hero">
          {/* atmospheric rooftop establishing image (LCP) */}
          <div className="hul-fill">
            <Media
              src={IMG.V01}
              label="High Ultra Lounge rooftop at night, above Bengaluru"
              priority
              index={3}
              showSlotLabel={false}
            />
          </div>
          <div
            className="hul-fill"
            style={{
              background:
                "linear-gradient(180deg, rgba(11,11,14,0.72) 0%, rgba(11,11,14,0.55) 42%, rgba(11,11,14,0.92) 100%)",
            }}
          />
          <div className="hul-container hul-hero__inner">
            <div className="hul-hero__grid">
              <div>
                <motion.p
                  initial={reduce ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="hul-kicker"
                  style={{ color: CREAM }}
                >
                  High Ultra Lounge · Bengaluru ·{" "}
                  <span style={{ color: RED }}>Hospitality / F&B</span>
                </motion.p>
                <motion.h1
                  initial={reduce ? false : { opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="hul-display hul-caps"
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
                  className="hul-hero__lede"
                  style={{ color: MUTED }}
                >
                  From pre-launch curiosity to recurring nightlife properties, daytime occasions,
                  food and cocktail experiences, digital, print and on-ground execution — Geek
                  worked inside High’s rhythm for over two years.
                </motion.p>
              </div>

              {/* asymmetric archive cluster */}
              <motion.div
                variants={stagger}
                initial={reduce ? undefined : "hidden"}
                animate={reduce ? undefined : "show"}
                className="hul-hero__cluster"
                aria-hidden
              >
                <motion.div variants={rise} className="hul-hero__card--a">
                  <Art src={IMG.P04} alt="" ratio="3/4" index={0} />
                </motion.div>
                <motion.div variants={rise} className="hul-hero__card--b">
                  <Art src={IMG.H05} alt="" ratio="4/3" index={1} />
                </motion.div>
              </motion.div>
            </div>

            {/* property ticker */}
            <div className="hul-hero__ticker" style={{ borderColor: HAIR, color: MUTED }}>
              {[
                "Pink In The City",
                "Full Moon",
                "High On Power",
                "Sunday Brunch",
                "Japanese Food Festival",
                "New York Nights",
                "31 Reasons",
              ].map((n) => (
                <span key={n} className="hul-hero__tick">
                  {n}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* ========== 02 · CURIOSITY ========== */}
        <Section className="hul-section--pad">
          <Reveal>
            <Kicker>The Launch · Chapter 01</Kicker>
            <h2
              className="hul-display hul-caps hul-curiosity__title"
              style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)" }}
            >
              Before people went High,
              <br />
              we got them <span style={{ color: RED }}>curious.</span>
            </h2>
          </Reveal>

          <div className="hul-curiosity__grid">
            <Reveal className="hul-curiosity__copy">
              <p style={{ color: MUTED }}>
                High Ultra Lounge was preparing to open on the rooftop of Bengaluru’s World Trade
                Center. The obvious launch route was easy to imagine: beautiful venue photography,
                cocktails, food, people partying, and a logo everywhere.
              </p>
              <p style={{ color: CREAM }}>We chose curiosity instead.</p>
              <p style={{ color: MUTED }}>
                We deliberately held the brand reveal back and started with a much simpler question
                — while the coloured “–” dash from the High logo quietly became the building block
                of every teaser. Mystery on the surface; brand memory underneath.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <Art
                src={IMG.L02}
                alt="High ‘Like Us’ pre-launch teaser emailer asking what gets you High"
                ratio="16/9"
                index={2}
              />
            </Reveal>
          </div>

          {/* WHAT GETS YOU HIGH — the big moment */}
          <Reveal className="hul-teaser">
            <p className="hul-teaser__kicker" style={{ color: MUTED }}>
              The teaser asked
            </p>
            <p
              className="hul-display hul-caps hul-teaser__line"
              style={{ fontSize: "clamp(2.4rem, 9vw, 8rem)", color: CREAM }}
            >
              What gets you <span style={{ color: RED }}>High?</span>
            </p>
            <div className="hul-teaser__notes" style={{ color: MUTED }}>
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
            className="hul-curiosity__reveal"
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
          <Reveal className="hul-curiosity__outro">
            <p className="hul-curiosity__outro-text" style={{ color: MUTED }}>
              So even before the logo appeared, the audience was already learning a piece of High.
              Then the campaign moved from teaser into the full brand reveal — food, drinks,
              ambience and identity.
            </p>
          </Reveal>
        </Section>

        {/* ========== 03 · THE DOORS OPENED (full-bleed venue) ========== */}
        <section className="hul-doors">
          <Photo
            src={IMG.V01}
            alt="High Ultra Lounge rooftop venue at night"
            className="hul-doors__photo"
            index={4}
          />
          <div
            className="hul-fill"
            style={{
              background:
                "linear-gradient(180deg, rgba(11,11,14,0.55) 0%, rgba(11,11,14,0.2) 50%, rgba(11,11,14,0.85) 100%)",
            }}
          />
          <div className="hul-doors__overlay">
            <div className="hul-container">
              <Reveal>
                <p className="hul-doors__kicker" style={{ color: RED }}>
                  Then the doors opened
                </p>
                <h2
                  className="hul-display hul-caps hul-doors__title"
                  style={{ fontSize: "clamp(2rem, 6vw, 5rem)" }}
                >
                  421 feet above Bengaluru,
                  <br />
                  High became real.
                </h2>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ========== SETTING · contextual facts ========== */}
        <Section className="hul-section--setting">
          <Reveal>
            <div className="hul-facts" style={{ borderColor: HAIR }}>
              {[
                { k: "Opened", v: "2014" },
                { k: "Location", v: "WTC · Bengaluru" },
                { k: "Footprint", v: "10,000 sq ft" },
                { k: "Height", v: "421 ft" },
              ].map((f) => (
                <div key={f.k}>
                  <p
                    className="hul-display"
                    style={{
                      fontSize: "clamp(1.5rem,3.4vw,2.6rem)",
                      color: CREAM,
                    }}
                  >
                    {f.v}
                  </p>
                  <p className="hul-facts__key" style={{ color: MUTED }}>
                    {f.k}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal className="hul-setting__outro">
            <p
              className="hul-display hul-caps hul-setting__statement"
              style={{ fontSize: "clamp(1.5rem,4vw,3rem)" }}
            >
              A spectacular venue could create a first visit. The harder job was creating reasons to
              <span style={{ color: RED }}> keep coming back.</span>
            </p>
          </Reveal>
        </Section>

        {/* ========== 04 · THE RELATIONSHIP / PIVOT ========== */}
        <Section className="hul-section--rule hul-section--pad">
          <Reveal>
            <Kicker>The Relationship · Chapter 02</Kicker>
            <h2
              className="hul-display hul-caps hul-relationship__title"
              style={{ fontSize: "clamp(2rem, 5.5vw, 4.6rem)" }}
            >
              The launch wasn’t the end of the brief.
              <br />
              <span style={{ color: RED }}>It was the beginning of the relationship.</span>
            </h2>
          </Reveal>
          <div className="hul-relationship__grid">
            <Reveal className="hul-relationship__copy" style={{ color: MUTED }}>
              <p>
                A hospitality brand isn’t built on opening night. It is built on the reasons people
                have to come back.
              </p>
              <p>
                A Wednesday that feels different from a Friday. A brunch worth giving up Sunday
                afternoon for. A cocktail menu people talk about. A property people recognise before
                they read the details.
              </p>
              <p style={{ color: CREAM }}>
                Geek’s role expanded from launch communication into ongoing brand-building — online
                and offline creative, event properties, social and digital, print, venue collateral,
                food and beverage communication, event coverage and on-ground execution.
              </p>
            </Reveal>
            {/* annual scope — phrased as PLANNED */}
            <Reveal delay={0.1}>
              <div className="hul-scope" style={{ borderColor: HAIR, backgroundColor: "#101015" }}>
                <p className="hul-scope__intro" style={{ color: MUTED }}>
                  The 2015–16 annual scope was structured around
                </p>
                <p
                  className="hul-display hul-scope__count"
                  style={{ fontSize: "clamp(3rem,9vw,6rem)", color: RED }}
                >
                  18
                </p>
                <p className="hul-scope__unit" style={{ color: CREAM }}>
                  planned campaigns
                </p>
                <div className="hul-scope__split">
                  {[
                    { n: "9", l: "Events" },
                    { n: "6", l: "Sub-category" },
                    { n: "3", l: "Weekly" },
                  ].map((x) => (
                    <div key={x.l} className="hul-scope__cell" style={{ borderColor: HAIR }}>
                      <p className="hul-display" style={{ fontSize: "1.9rem", color: CREAM }}>
                        {x.n}
                      </p>
                      <p className="hul-scope__cell-label" style={{ color: MUTED }}>
                        {x.l}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="hul-scope__note" style={{ color: MUTED }}>
                  A contracted annual plan — not a tally of finished work. It shows the operating
                  rhythm of the relationship, campaign after campaign.
                </p>
              </div>
            </Reveal>
          </div>
        </Section>

        {/* ========== 05 · THE CALENDAR (property rail) ========== */}
        <Section className="hul-section--rule hul-section--pad">
          <Reveal>
            <Kicker>The Calendar · Chapter 03</Kicker>
            <h2
              className="hul-display hul-caps hul-calendar__title"
              style={{ fontSize: "clamp(2.2rem, 6vw, 5rem)" }}
            >
              We built a calendar.
              <br />
              <span style={{ color: RED }}>Not a campaign.</span>
            </h2>
            <p className="hul-calendar__lede" style={{ color: MUTED }}>
              High didn’t need one repeated message. It needed different reasons to matter at
              different moments — different audiences, different dayparts, different formats. One
              brand.
            </p>
          </Reveal>

          <div className="hul-rail hul-no-scrollbar" style={{ scrollSnapType: "x mandatory" }}>
            {PROPERTIES.map((p, i) => (
              <Reveal key={p.name} delay={(i % 3) * 0.05} className="hul-rail__item">
                <div className="hul-rail__card" style={{ scrollSnapAlign: "start" }}>
                  <Art src={p.img} alt={p.alt} ratio={p.ratio} index={i} />
                  <p
                    className="hul-display hul-caps hul-rail__name"
                    style={{ fontSize: "1.4rem", color: CREAM }}
                  >
                    {p.name}
                  </p>
                  <p className="hul-rail__line" style={{ color: MUTED }}>
                    {p.line}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="hul-rail__hint" style={{ color: MUTED }}>
            Scroll / swipe the calendar →
          </p>
        </Section>

        {/* ========== 06 · PINK IN THE CITY ========== */}
        <Section className="hul-section--rule hul-section--pad">
          <div className="hul-pink__grid">
            <Reveal>
              <Art
                src={IMG.P04}
                alt="Pink In The City ‘The Night Is Yours’ event-detail creative"
                ratio="3/4"
                index={0}
              />
            </Reveal>
            <div>
              <Reveal>
                <Kicker>Recurring Property · Pink In The City</Kicker>
                <h2 className="hul-display hul-caps" style={{ fontSize: "clamp(1.9rem,5vw,4rem)" }}>
                  One night for the ladies.
                  <br />
                  <span style={{ color: RED }}>Four editions</span> of a recognisable property.
                </h2>
                <p className="hul-pink__copy" style={{ color: MUTED }}>
                  Ladies’ nights were hardly new. The opportunity was to make High’s version feel
                  like High. Pink In The City gave the night its own mnemonic, visual world and
                  voice — then carried that identity through social, event communication, WhatsApp,
                  LCD and print. The archive documents four editions across 2014 and 2015. The
                  property returned; the creative evolved; the name stayed recognisable.
                </p>
              </Reveal>
              <motion.div
                variants={stagger}
                initial={reduce ? undefined : "hidden"}
                whileInView={reduce ? undefined : "show"}
                viewport={{ once: true, margin: "-60px" }}
                className="hul-pink__strip"
              >
                {[
                  { s: IMG.P01, a: "Pink In The City 2014 quote creative" },
                  { s: IMG.P03, a: "Pink In The City 2015 quote creative" },
                  {
                    s: IMG.P02,
                    a: "Pink In The City 2015 social-creative montage",
                  },
                ].map((m, i) => (
                  <motion.div key={m.s} variants={rise}>
                    <Art src={m.s} alt={m.a} ratio="1/1" index={i} />
                  </motion.div>
                ))}
              </motion.div>
              <Reveal className="hul-pink__coda">
                <p className="hul-pink__coda-text" style={{ color: CREAM }}>
                  That is when an event begins to behave like an{" "}
                  <span style={{ color: RED }}>asset.</span>
                </p>
              </Reveal>
            </div>
          </div>
        </Section>

        {/* ========== 07 · FULL MOON (low-res → small archival tiles) ========== */}
        <Section className="hul-section--rule hul-section--pad">
          <Reveal className="hul-center">
            <Kicker>Recurring Property · Full Moon Party</Kicker>
            <h2
              className="hul-display hul-caps hul-moon__title"
              style={{ fontSize: "clamp(2rem,5.5vw,4.5rem)" }}
            >
              Some ideas are too good
              <br />
              <span style={{ color: RED }}>for one night.</span>
            </h2>
          </Reveal>
          {/* deliberately small archival tiles — source is low resolution */}
          <div className="hul-moon__tiles">
            {[
              {
                s: IMG.F01,
                a: "High Full Moon Party — original event poster",
                t: "The original",
              },
              {
                s: IMG.F02,
                a: "High Full Moon Party — ‘Taking it a little higher’ later edition",
                t: "It came back",
              },
              {
                s: IMG.F03,
                a: "‘Return of the Full Moon Party’ event creative",
                t: "And came back again",
              },
            ].map((m, i) => (
              <Reveal key={m.s} delay={i * 0.08}>
                <div className="hul-moon__tile">
                  <Art src={m.s} alt={m.a} ratio="1/1" index={i} mat="#141319" />
                  <p className="hul-moon__caption" style={{ color: MUTED }}>
                    {m.t}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="hul-moon__outro">
            <p className="hul-display hul-caps" style={{ fontSize: "clamp(1.4rem,4vw,2.6rem)" }}>
              Return of the <span style={{ color: RED }}>Full Moon Party.</span>
            </p>
            <p className="hul-moon__copy" style={{ color: MUTED }}>
              For Full Moon, Geek’s role extended beyond the event identity and communication into
              the experience at the party itself. An idea became a recognisable reason to return.
            </p>
          </Reveal>
        </Section>

        {/* ========== 08 · HIGH ON POWER (showstopper) ========== */}
        <section className="hul-band" style={{ borderColor: HAIR, backgroundColor: "#08080B" }}>
          <Section className="hul-section--peak">
            <Reveal className="hul-center">
              <Kicker>The Creative Peak · High On Power</Kicker>
              <h2 className="hul-display hul-caps" style={{ fontSize: "clamp(2.4rem,8vw,6.5rem)" }}>
                Politics.
                <br />
                Cocktails.
                <br />
                Comedy.
              </h2>
              <p
                className="hul-display hul-caps hul-power__tagline"
                style={{ fontSize: "clamp(1.2rem,3.2vw,2.2rem)", color: RED }}
              >
                What could possibly go wrong?
              </p>
            </Reveal>

            <Reveal className="hul-power__intro" style={{ color: MUTED }}>
              <p>
                High On Power began with a simple creative provocation: what if some of the world’s
                most recognisable political personalities could be translated into drinks?
              </p>
            </Reveal>

            <Reveal className="hul-power__trio">
              {["Ten world leaders", "Ten personas", "Ten cocktails"].map((t) => (
                <span
                  key={t}
                  className="hul-display hul-caps"
                  style={{ fontSize: "clamp(1.1rem,3vw,2rem)", color: CREAM }}
                >
                  {t}
                </span>
              ))}
            </Reveal>

            {/* full-width centrepiece */}
            <Reveal className="hul-power__centrepiece">
              <Art
                src={IMG.H05}
                alt="High On Power — ten world leaders translated into ten cocktails, table-top menu artwork"
                ratio="16/10"
                mat="#0d0d11"
                index={0}
              />
            </Reveal>

            <Reveal className="hul-power__story" style={{ color: MUTED }}>
              <p>
                It got its own identity, visual system, menu, digital participation and physical
                communication — and its own live entertainment layer. The festival paired with{" "}
                <span style={{ color: CREAM }}>Highly Politically Incorrect</span>, a ticketed
                stand-up show featuring Sundeep Rao and Sorabh Pant.
              </p>
              <p className="hul-power__note" style={{ color: MUTED }}>
                The archived case-study record notes the show as a complete sell-out.
              </p>
            </Reveal>

            <Reveal className="hul-power__standee">
              <Art
                src={IMG.H07}
                alt="Highly Politically Incorrect stand-up show standee for the High On Power festival"
                ratio="1/2"
                mat="#0d0d11"
                index={1}
              />
            </Reveal>
          </Section>
        </section>

        {/* ========== 09/10 · THE MENU WAS MEDIA TOO ========== */}
        <section className="hul-band" style={{ borderColor: HAIR, backgroundColor: "#08080B" }}>
          <Section className="hul-section--pad">
            <Reveal>
              <Kicker>The Menu · Chapter 05</Kicker>
              <h2 className="hul-display hul-caps" style={{ fontSize: "clamp(2.4rem,8vw,7rem)" }}>
                The menu
                <br />
                <span style={{ color: RED }}>was media too.</span>
              </h2>
            </Reveal>

            {/* tactile menu spreads */}
            <Reveal className="hul-menu__spread">
              <Art
                src={IMG.H06}
                alt="High On Power concept menu — centre-fold spread"
                ratio="16/11"
                mat="#0d0d11"
                index={0}
              />
            </Reveal>
            <div className="hul-menu__pages">
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
            <Reveal className="hul-menu__names">
              {MENU_NAMES.map((n) => (
                <span key={n} className="hul-menu__name" style={{ color: MUTED }}>
                  {n}
                </span>
              ))}
            </Reveal>

            <Reveal className="hul-menu__coda">
              <p className="hul-display hul-caps" style={{ fontSize: "clamp(1.4rem,4vw,2.6rem)" }}>
                An idea doesn’t have to live in an ad.
              </p>
              <p className="hul-menu__coda-copy" style={{ color: MUTED }}>
                It can live in a drink, a menu, a ticket, a table, a conversation — anything the
                customer touches can carry the idea. The mixology belonged to High’s bar team; our
                job was to make the creative idea travel through the experience around it.
              </p>
            </Reveal>
          </Section>
        </section>

        {/* ========== 11 · DAYLIGHT / FOOD ========== */}
        <Section className="hul-section--rule hul-section--pad">
          <Reveal>
            <Kicker>Daytime & Food · Chapter 06</Kicker>
            <h2
              className="hul-display hul-caps hul-day__title"
              style={{ fontSize: "clamp(2rem,5.5vw,4.5rem)" }}
            >
              Daylight had a <span style={{ color: RED }}>calendar too.</span>
            </h2>
            <p className="hul-day__lede" style={{ color: MUTED }}>
              High was not only a Friday-night brand. The same creative thinking built reasons to
              visit across different dayparts and dining occasions.
            </p>
          </Reveal>

          {/* Sunday brunch */}
          <div className="hul-day__brunch">
            <Reveal>
              <Art src={IMG.D03} alt="High Sunday Brunch identity" ratio="1/1" index={0} />
            </Reveal>
            <Reveal delay={0.08}>
              <Art
                src={IMG.D04}
                alt="High Sunday Brunch ‘Binge it on — exotic buffet & drinks at 421 feet High’ creative"
                ratio="1/1"
                index={1}
              />
            </Reveal>
          </div>

          {/* 31 reasons — numbered system */}
          <Reveal className="hul-day__reasons-head">
            <p className="hul-day__label" style={{ color: RED }}>
              31 Reasons To Skip Office Lunch
            </p>
            <p className="hul-day__reasons-copy" style={{ color: MUTED }}>
              One proposition, dozens of potential reasons — a numbered system built to keep
              producing fresh communication.
            </p>
          </Reveal>
          <div className="hul-day__reasons">
            {[
              {
                s: IMG.D05,
                a: "31 Reasons #15 — ‘Lose that tie! Grab a quick lunch.’",
              },
              {
                s: IMG.D06,
                a: "31 Reasons #19 — ‘Better pictures for Instagram? Grab a quick lunch.’",
              },
              {
                s: IMG.D07,
                a: "31 Reasons #31 — ‘Slow internet killing your time? Grab a quick lunch.’",
              },
            ].map((m, i) => (
              <Reveal key={m.s} delay={i * 0.06}>
                <Art src={m.s} alt={m.a} ratio="1/1" index={i} />
              </Reveal>
            ))}
          </div>

          {/* japanese food festival */}
          <div className="hul-day__festival">
            <Reveal>
              <p className="hul-day__label" style={{ color: RED }}>
                Japanese Food Festival
              </p>
              <p
                className="hul-display hul-caps hul-day__festival-title"
                style={{ fontSize: "clamp(1.6rem,4.5vw,3.2rem)" }}
              >
                When food itself became <span style={{ color: RED }}>the occasion.</span>
              </p>
              <p className="hul-day__festival-copy" style={{ color: MUTED }}>
                Food was not filler between nightlife posts. When High wanted food to become the
                event, the calendar shifted again — into properties like its Japanese Food Festival.
                Food was content.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="hul-day__festival-art">
              <Art
                src={IMG.D01}
                alt="High Japanese Food Festival emailer — one"
                ratio="3/5"
                index={0}
              />
              <Art
                src={IMG.D02}
                alt="High Japanese Food Festival emailer — two"
                ratio="3/5"
                index={1}
              />
            </Reveal>
          </div>
        </Section>

        {/* ========== 12 · THE IDEA LEFT THE SCREEN (New York Nights) ========== */}
        <Section className="hul-section--rule hul-section--pad">
          <Reveal>
            <Kicker>On-Ground · Chapter 07</Kicker>
            <h2
              className="hul-display hul-caps hul-ground__title"
              style={{ fontSize: "clamp(2rem,5.5vw,4.5rem)" }}
            >
              The idea <span style={{ color: RED }}>left the screen.</span>
            </h2>
            <p className="hul-ground__lede" style={{ color: MUTED }}>
              A strong hospitality campaign has a moment where the artwork stops being the
              experience. New York Nights gives us that proof in one sequence: the property
              creative, then the actual rooftop, then real guests inside the experience.
            </p>
          </Reveal>
          <Reveal className="hul-ground__pair">
            <Art src={IMG.V02} alt="High New York Nights event creative" ratio="1/1" index={0} />
            <Photo
              src={IMG.V04}
              alt="High New York Nights — guests inside the branded rooftop experience"
              className="hul-ground__photo hul-ground__photo--square"
              index={1}
            />
          </Reveal>
          <Reveal className="hul-ground__wide">
            <Photo
              src={IMG.V03}
              alt="High New York Nights — the lantern moment on the rooftop with guests participating"
              className="hul-ground__photo hul-ground__photo--wide"
              index={2}
            />
          </Reveal>
          <Reveal className="hul-ground__coda">
            <p className="hul-ground__coda-text" style={{ color: MUTED }}>
              That is the difference between making communication for an event and helping make the
              event happen.
            </p>
          </Reveal>
        </Section>

        {/* ========== 13 · IDEA TO LAST MILE (chain) ========== */}
        <Section className="hul-section--rule hul-section--pad">
          <Reveal>
            <Kicker>How it worked · Chapter 08</Kicker>
            <h2
              className="hul-display hul-caps hul-chain__title"
              style={{ fontSize: "clamp(2rem,5.5vw,4.5rem)" }}
            >
              From the idea
              <br />
              <span style={{ color: RED }}>to the last drink served.</span>
            </h2>
            <p className="hul-chain__lede" style={{ color: MUTED }}>
              Not a sequence of disconnected deliverables. A chain — where an idea moves from
              concept all the way to the next night.
            </p>
          </Reveal>
          <motion.ul
            variants={stagger}
            initial={reduce ? undefined : "hidden"}
            whileInView={reduce ? undefined : "show"}
            viewport={{ once: true, margin: "-60px" }}
            className="hul-chain"
          >
            {CHAIN.map((step, i) => (
              <motion.li key={step} variants={rise} className="hul-chain__step">
                <span
                  className="hul-display hul-caps"
                  style={{
                    fontSize: "clamp(1.05rem,2.4vw,1.8rem)",
                    color: i === CHAIN.length - 1 ? RED : CREAM,
                  }}
                >
                  {step}
                </span>
                {i < CHAIN.length - 1 && (
                  <span aria-hidden style={{ color: RED }}>
                    →
                  </span>
                )}
              </motion.li>
            ))}
          </motion.ul>
          <Reveal className="hul-chain__coda">
            <p
              className="hul-display hul-caps hul-chain__coda-text"
              style={{ fontSize: "clamp(1.5rem,4vw,3rem)" }}
            >
              High didn’t need an agency for one big night. It needed ideas for the
              <span style={{ color: RED }}> nights after it.</span>
            </p>
          </Reveal>
        </Section>

        {/* ========== 14 · ALWAYS ON — archive wall ========== */}
        <Section className="hul-section--rule hul-section--pad">
          <Reveal>
            <Kicker>Always On · March 2016 and beyond</Kicker>
            <h2 className="hul-display hul-caps" style={{ fontSize: "clamp(2.2rem,6vw,5rem)" }}>
              421 feet high. <span style={{ color: RED }}>Always on.</span>
            </h2>
            <p className="hul-archive__lede" style={{ color: MUTED }}>
              Years of different reasons to experience the same brand. Let the archive take over.
            </p>
          </Reveal>
          <div className="hul-archive">
            {[
              {
                s: IMG.L05,
                a: "High brand-reveal mood visual — red",
                r: "1/1",
              },
              { s: IMG.P04, a: "Pink In The City event creative", r: "3/4" },
              {
                s: IMG.V03,
                a: "New York Nights lantern moment on the rooftop",
                r: "16/10",
              },
              {
                s: IMG.H05,
                a: "High On Power — ten leaders, ten cocktails",
                r: "4/3",
              },
              { s: IMG.D04, a: "Sunday Brunch 421-feet creative", r: "1/1" },
              {
                s: IMG.F03,
                a: "Return of the Full Moon Party creative",
                r: "1/1",
              },
              {
                s: IMG.D06,
                a: "31 Reasons To Skip Office Lunch creative",
                r: "1/1",
              },
              { s: IMG.H06, a: "High On Power menu centre fold", r: "3/2" },
              { s: IMG.V01, a: "High rooftop venue at night", r: "3/2" },
              { s: IMG.D01, a: "Japanese Food Festival emailer", r: "3/5" },
              { s: IMG.P02, a: "Pink In The City social montage", r: "4/3" },
              {
                s: IMG.L03,
                a: "High brand-reveal mood visual — green",
                r: "1/1",
              },
            ].map((m, i) => (
              <div key={m.s + i} className="hul-archive__item">
                <Art src={m.s} alt={m.a} ratio={m.r} index={i} />
              </div>
            ))}
          </div>
        </Section>

        {/* ========== 15 · CLOSING ========== */}
        <section className="hul-band" style={{ borderColor: HAIR, backgroundColor: "#08080B" }}>
          <Section className="hul-section--closing">
            <Reveal>
              <p
                className="hul-display hul-caps"
                style={{ fontSize: "clamp(2rem,6vw,4.5rem)", color: MUTED }}
              >
                A launch creates attention.
              </p>
              <p
                className="hul-display hul-caps hul-closing__line"
                style={{ fontSize: "clamp(2.4rem,8vw,6.5rem)" }}
              >
                A calendar <span style={{ color: RED }}>builds a brand.</span>
              </p>
            </Reveal>
            <Reveal className="hul-closing__sign">
              <p
                className="hul-display hul-caps hul-closing__signoff"
                style={{ fontSize: "clamp(1.6rem,4.5vw,3.4rem)" }}
              >
                We didn’t just launch High.
                <br />
                We built its calendar.
              </p>
              <p className="hul-closing__dates" style={{ color: MUTED }}>
                High Ultra Lounge · 2014 → Mar 2016+
              </p>
            </Reveal>

            {/* footer data */}
            <Reveal className="hul-credits">
              {[
                { k: "Client", v: "High Ultra Lounge" },
                { k: "Location", v: "Bengaluru, India" },
                { k: "Category", v: "Hospitality / F&B" },
                { k: "Engagement", v: "Long-term brand partnership" },
              ].map((f) => (
                <div key={f.k}>
                  <p className="hul-credits__key" style={{ color: MUTED }}>
                    {f.k}
                  </p>
                  <p className="hul-credits__value" style={{ color: CREAM }}>
                    {f.v}
                  </p>
                </div>
              ))}
              <div className="hul-credits__services">
                <p className="hul-credits__key" style={{ color: MUTED }}>
                  Services
                </p>
                <p className="hul-credits__services-text" style={{ color: CREAM }}>
                  Strategy · Creative · Branding · Social &amp; Digital · Event Property Development
                  · Experiential · Print · Content · Food &amp; Beverage Communication · PR /
                  Outreach · On-ground Activation
                </p>
              </div>
            </Reveal>

            <Reveal className="hul-closing__tag">
              <p className="hul-display hul-caps" style={{ fontSize: "clamp(1.4rem,4vw,2.6rem)" }}>
                We build brands. <span style={{ color: RED }}>Then we make them matter.</span>
              </p>
            </Reveal>
          </Section>
        </section>
      </div>

      {/* shared related / next module (light chrome — belongs to the Geek site) */}
      <RelatedAndNext project={project} pool={pool} />
    </article>
  );
}

const styles = `
/* ---------- skin + shared building blocks ---------- */
.hul {
  overflow: hidden;
}

.hul__skin {
  position: relative;
}

.hul-fill {
  position: absolute;
  inset: 0px;
}

.hul-caps {
  text-transform: uppercase;
}

.hul-center {
  text-align: center;
}

.hul-art {
  position: relative;
  overflow: hidden;
  border-radius: 0.375rem;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.hul-photo {
  position: relative;
  overflow: hidden;
}

.hul-kicker {
  margin-bottom: 1.5rem;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
}

/* Section wrapper: padding sits on the section, the inner column is capped at 1400px
   (same as the original layout, so the text column is a full 1400px on wide screens). */
.hul-section {
  padding-inline: 32px;
}

.hul-section__inner {
  max-width: 1400px;
  margin-inline: auto;
}

.hul-section--rule {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.hul-section--pad {
  padding-block: 6rem;
}

.hul-section--setting {
  padding-block: 4rem;
}

.hul-section--peak {
  padding-block: 6rem;
}

.hul-section--closing {
  padding-block: 7rem;
  text-align: center;
}

.hul-band {
  border-top: 1px solid;
}

/* shared body-copy rhythm (15px / 14px, leading-relaxed) */
.hul-curiosity__copy,
.hul-curiosity__outro-text,
.hul-relationship__copy,
.hul-calendar__lede,
.hul-pink__copy,
.hul-power__intro,
.hul-power__story,
.hul-day__lede,
.hul-ground__lede,
.hul-chain__lede,
.hul-archive__lede {
  font-size: 15px;
  line-height: 1.625;
}

.hul-moon__copy,
.hul-menu__coda-copy,
.hul-day__reasons-copy,
.hul-day__festival-copy,
.hul-ground__coda-text {
  font-size: 14px;
  line-height: 1.625;
}

.hul-curiosity__copy > :not([hidden]) ~ :not([hidden]),
.hul-relationship__copy > :not([hidden]) ~ :not([hidden]),
.hul-power__intro > :not([hidden]) ~ :not([hidden]) {
  margin-top: 1.25rem;
  margin-bottom: 0;
}

/* ---------- 01 · hero ---------- */
.hul-hero {
  position: relative;
  min-height: 92vh;
  width: 100%;
  overflow: hidden;
}

.hul-hero__inner {
  position: relative;
  display: flex;
  min-height: 92vh;
  flex-direction: column;
  justify-content: flex-end;
  padding-top: 7rem;
  padding-bottom: 3.5rem;
}

.hul-hero__grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  align-items: end;
  gap: 2.5rem;
}

.hul-hero__lede {
  margin-top: 1.75rem;
  max-width: 54ch;
  font-size: 1rem;
  line-height: 1.625;
}

.hul-hero__cluster {
  display: none;
  gap: 1rem;
}

.hul-hero__card--a {
  transform: translate(1rem, 0);
}

.hul-hero__card--b {
  transform: translate(-1.5rem, -0.75rem);
}

.hul-hero__ticker {
  margin-top: 3rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 1.25rem;
  row-gap: 0.5rem;
  border-top: 1px solid;
  padding-top: 1.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.hul-hero__tick {
  white-space: nowrap;
}

/* ---------- 02 · curiosity ---------- */
.hul-curiosity__title {
  max-width: 18ch;
}

.hul-curiosity__grid {
  margin-top: 3.5rem;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 3rem;
}

.hul-curiosity__copy {
  max-width: 46ch;
}

.hul-teaser {
  margin-top: 5rem;
  text-align: center;
}

.hul-teaser__kicker {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}

.hul-teaser__line {
  margin-top: 1rem;
}

.hul-teaser__notes {
  margin-inline: auto;
  margin-top: 2rem;
  display: flex;
  max-width: 28rem;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.hul-curiosity__reveal {
  margin-top: 4rem;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.25rem;
}

.hul-curiosity__outro {
  margin-top: 2.5rem;
}

.hul-curiosity__outro-text {
  margin-inline: auto;
  max-width: 40ch;
  text-align: center;
}

/* ---------- 03 · doors opened ---------- */
.hul-doors {
  position: relative;
}

.hul-doors__photo {
  height: 70vh;
  min-height: 420px;
  width: 100%;
}

.hul-doors__overlay {
  position: absolute;
  inset: 0px;
  display: flex;
  align-items: center;
}

.hul-doors__kicker {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
}

.hul-doors__title {
  margin-top: 1rem;
  max-width: 16ch;
}

/* ---------- setting · facts ---------- */
.hul-facts {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  row-gap: 2rem;
  border-top: 1px solid;
  border-bottom: 1px solid;
  padding-block: 2.5rem;
}

.hul-facts__key {
  margin-top: 0.25rem;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.hul-setting__outro {
  margin-top: 3rem;
}

.hul-setting__statement {
  margin-inline: auto;
  max-width: 30ch;
  text-align: center;
}

/* ---------- 04 · relationship ---------- */
.hul-relationship__title {
  max-width: 22ch;
}

.hul-relationship__grid {
  margin-top: 3rem;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 3rem;
}

.hul-relationship__copy {
  max-width: 48ch;
}

.hul-scope {
  border: 1px solid;
  border-radius: 0.5rem;
  padding: 1.75rem;
}

.hul-scope__intro {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.hul-scope__count {
  margin-top: 0.75rem;
}

.hul-scope__unit {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.hul-scope__split {
  margin-top: 1.75rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  text-align: center;
}

.hul-scope__cell {
  border: 1px solid;
  border-radius: 0.375rem;
  padding-block: 1rem;
}

.hul-scope__cell-label {
  margin-top: 0.25rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.hul-scope__note {
  margin-top: 1.5rem;
  font-size: 0.7rem;
  line-height: 1.625;
}

/* ---------- 05 · calendar rail ---------- */
.hul-calendar__title {
  max-width: 16ch;
}

.hul-calendar__lede {
  margin-top: 1.5rem;
  max-width: 52ch;
}

.hul-rail {
  margin-top: 3.5rem;
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  padding-bottom: 1.5rem;
}

.hul-rail__item {
  flex-shrink: 0;
}

.hul-rail__card {
  width: 78vw;
  flex-shrink: 0;
}

.hul-rail__name {
  margin-top: 1rem;
}

.hul-rail__line {
  margin-top: 0.25rem;
  font-size: 13px;
}

.hul-rail__hint {
  margin-top: 0.5rem;
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

/* ---------- 06 · pink in the city ---------- */
.hul-pink__grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 3rem;
}

.hul-pink__copy {
  margin-top: 1.5rem;
  max-width: 46ch;
}

.hul-pink__strip {
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}

.hul-pink__coda {
  margin-top: 1.5rem;
}

.hul-pink__coda-text {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

/* ---------- 07 · full moon ---------- */
.hul-moon__title {
  margin-inline: auto;
  max-width: 16ch;
}

.hul-moon__tiles {
  margin-inline: auto;
  margin-top: 3.5rem;
  display: grid;
  max-width: 48rem;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.5rem;
}

.hul-moon__tile {
  margin-inline: auto;
  max-width: 240px;
}

.hul-moon__caption {
  margin-top: 0.75rem;
  text-align: center;
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.hul-moon__outro {
  margin-top: 3rem;
  text-align: center;
}

.hul-moon__copy {
  margin-inline: auto;
  margin-top: 1rem;
  max-width: 42ch;
}

/* ---------- 08 · high on power ---------- */
/* original leading-[0.95] on the title is overridden by .hul-display (cascade rule) — not ported */
.hul-power__tagline {
  margin-top: 2rem;
}

.hul-power__intro {
  margin-inline: auto;
  margin-top: 4rem;
  max-width: 52ch;
  text-align: center;
}

.hul-power__trio {
  margin-top: 2.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  column-gap: 2rem;
  row-gap: 0.75rem;
  text-align: center;
}

.hul-power__centrepiece {
  margin-top: 3.5rem;
}

.hul-power__story {
  margin-inline: auto;
  margin-top: 3.5rem;
  max-width: 52ch;
  text-align: center;
}

.hul-power__note {
  margin-top: 1rem;
  font-size: 13px;
}

.hul-power__standee {
  margin-inline: auto;
  margin-top: 3rem;
  max-width: 24rem;
}

/* ---------- 09/10 · menu ---------- */
.hul-menu__spread {
  margin-top: 3.5rem;
}

.hul-menu__pages {
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.5rem;
}

.hul-menu__names {
  margin-top: 3rem;
  display: flex;
  flex-wrap: wrap;
  column-gap: 1.5rem;
  row-gap: 0.5rem;
}

.hul-menu__name {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hul-menu__coda {
  margin-inline: auto;
  margin-top: 4rem;
  max-width: 40ch;
  text-align: center;
}

/* original leading-[1.05] on the coda title is overridden by .hul-display (cascade rule) — not ported */
.hul-menu__coda-copy {
  margin-top: 1.25rem;
}

/* ---------- 11 · daylight / food ---------- */
.hul-day__title {
  max-width: 16ch;
}

.hul-day__lede {
  margin-top: 1.5rem;
  max-width: 50ch;
}

.hul-day__brunch {
  margin-top: 3.5rem;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.5rem;
}

.hul-day__reasons-head {
  margin-top: 5rem;
}

.hul-day__label {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.hul-day__reasons-copy {
  margin-top: 0.75rem;
  max-width: 46ch;
}

.hul-day__reasons {
  margin-top: 1.5rem;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.5rem;
}

.hul-day__festival {
  margin-top: 5rem;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 2.5rem;
}

.hul-day__festival-title {
  margin-top: 1rem;
}

.hul-day__festival-copy {
  margin-top: 1.25rem;
  max-width: 42ch;
}

.hul-day__festival-art {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

/* ---------- 12 · on-ground ---------- */
.hul-ground__title {
  max-width: 18ch;
}

.hul-ground__lede {
  margin-top: 1.5rem;
  max-width: 48ch;
}

.hul-ground__pair {
  margin-top: 3rem;
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1.5rem;
}

.hul-ground__photo {
  width: 100%;
  border-radius: 0.375rem;
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
}

.hul-ground__photo--square {
  aspect-ratio: 1 / 1;
}

.hul-ground__photo--wide {
  aspect-ratio: 16/9;
}

.hul-ground__wide {
  margin-top: 1.5rem;
}

.hul-ground__coda {
  margin-top: 2rem;
}

.hul-ground__coda-text {
  max-width: 44ch;
}

/* ---------- 13 · chain ---------- */
.hul-chain__title {
  max-width: 18ch;
}

.hul-chain__lede {
  margin-top: 1.5rem;
  max-width: 46ch;
}

.hul-chain {
  margin-top: 3rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  column-gap: 0.75rem;
  row-gap: 1rem;
}

.hul-chain__step {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.hul-chain__coda {
  margin-top: 3.5rem;
}

.hul-chain__coda-text {
  max-width: 20ch;
}

/* ---------- 14 · archive wall ---------- */
.hul-archive__lede {
  margin-top: 1.5rem;
  max-width: 46ch;
}

.hul-archive {
  margin-top: 3.5rem;
  column-fill: balance;
  gap: 1rem;
}

.hul-archive__item {
  margin-bottom: 1rem;
  break-inside: avoid;
}

/* ---------- 15 · closing ---------- */
.hul-closing__line {
  margin-top: 0.75rem;
}

.hul-closing__sign {
  margin-top: 4rem;
}

.hul-closing__signoff {
  margin-inline: auto;
  max-width: 20ch;
}

.hul-closing__dates {
  margin-top: 1.5rem;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

.hul-credits {
  margin-inline: auto;
  margin-top: 5rem;
  display: grid;
  max-width: 56rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 2rem;
  row-gap: 2rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 3rem;
  text-align: left;
}

.hul-credits__key {
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.hul-credits__value {
  margin-top: 0.5rem;
  font-size: 14px;
}

.hul-credits__services {
  grid-column: span 2 / span 2;
}

.hul-credits__services-text {
  margin-top: 0.5rem;
  font-size: 13px;
  line-height: 1.625;
}

.hul-closing__tag {
  margin-top: 5rem;
}

/* ---------- breakpoints ---------- */
/* ---- type/layout helpers (local copy). Placed after the base rules and before the
   breakpoints, matching the original cascade: helpers beat plain utilities, responsive
   variants beat helpers. ---- */
.hul-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}

@media (max-width: 639px) {
  .hul-container {
    padding-inline: 20px;
  }
}

.hul-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.045em;
  line-height: 0.92;
  text-wrap: balance;
}

.hul-no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.hul-no-scrollbar::-webkit-scrollbar {
  display: none;
}

@media (min-width: 640px) {
  .hul-section--pad {
    padding-block: 8rem;
  }

  .hul-section--setting {
    padding-block: 5rem;
  }

  .hul-section--peak {
    padding-block: 9rem;
  }

  .hul-section--closing {
    padding-block: 10rem;
  }

  .hul-hero__inner {
    padding-bottom: 5rem;
  }

  .hul-hero__lede {
    font-size: 1.125rem;
    line-height: 1.75rem;
  }

  .hul-curiosity__reveal,
  .hul-moon__tiles,
  .hul-menu__pages,
  .hul-day__reasons {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .hul-facts {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .hul-scope {
    padding: 2.25rem;
  }

  .hul-rail__card {
    width: 380px;
  }

  .hul-day__brunch,
  .hul-ground__pair {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hul-archive {
    columns: 2;
  }

  .hul-credits {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .hul-credits__services {
    grid-column: span 4 / span 4;
  }
}

@media (min-width: 1024px) {
  .hul-hero__grid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 360px);
  }

  .hul-hero__cluster {
    display: grid;
  }

  .hul-curiosity__grid {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr);
    align-items: center;
  }

  .hul-relationship__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .hul-pink__grid {
    grid-template-columns: minmax(0, 420px) minmax(0, 1fr);
    align-items: center;
  }

  .hul-day__brunch,
  .hul-day__festival {
    align-items: center;
  }

  .hul-day__festival {
    grid-template-columns: minmax(0, 1fr) minmax(0, 360px);
  }

  .hul-archive {
    columns: 3;
  }
}

@media (max-width: 639px) {
  .hul-section {
    padding-inline: 20px;
  }
}
`;
