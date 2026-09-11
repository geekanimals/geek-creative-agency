/* eslint-disable @next/next/no-img-element */
/**
 * GEEK logo — extracted from the supplied Geek_logo_Animated.psd.
 * Transparent PNGs live in /public, one per context colour:
 *   cyan  → light backgrounds (brand default)
 *   navy  → on the cyan footer
 *   white → on dark sections
 *   ink   → near-black contexts
 * Intrinsic ratio 668×190. Sized by height via the `className` (set an h-*).
 */
type Variant = "cyan" | "white" | "navy" | "ink";

const SRC: Record<Variant, string> = {
  cyan: "/geek-logo-cyan.png",
  white: "/geek-logo-white.png",
  navy: "/geek-logo-navy.png",
  ink: "/geek-logo-ink.png",
};

export default function GeekLogo({
  className = "h-7",
  variant = "cyan",
}: {
  className?: string;
  variant?: Variant;
}) {
  return (
    <img
      src={SRC[variant]}
      alt="Geek"
      width={668}
      height={190}
      className={`w-auto select-none ${className}`}
      draggable={false}
    />
  );
}
