/* eslint-disable @next/next/no-img-element */
/**
 * GEEK logo — extracted from the supplied Geek_logo_Animated.psd.
 * Transparent PNGs live in /public, one per context colour:
 *   cyan  → light backgrounds (brand default)
 *   navy  → on the cyan footer
 *   white → on dark sections
 *   ink   → near-black contexts
 * Intrinsic ratio 668×190. Sized by height: default 1.75rem (was `h-7`);
 * callers pass their own class via `className` and set its height with a
 * compound selector, e.g. `.glogo.nav__logo { height: 1.5rem; }`.
 * Props: className? (string), variant? ("cyan" | "white" | "navy" | "ink", default "cyan").
 */

const SRC = {
  cyan: "/geek-logo-cyan.png",
  white: "/geek-logo-white.png",
  navy: "/geek-logo-navy.png",
  ink: "/geek-logo-ink.png",
};

export default function GeekLogo({ className = "", variant = "cyan" }) {
  return (
    <>
      <style href="glogo" precedence="default">
        {styles}
      </style>
      <img
        src={SRC[variant]}
        alt="Geek"
        width={668}
        height={190}
        className={`glogo ${className}`}
        draggable={false}
      />
    </>
  );
}

const styles = `
.glogo {
  height: 1.75rem;
  width: auto;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}
`;
