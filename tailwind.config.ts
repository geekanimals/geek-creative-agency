import type { Config } from "tailwindcss";

/**
 * GEEK design tokens.
 * Cyan is sampled as a placeholder — replace `geek.cyan` with the exact hex
 * from the supplied logo. Everything else keys off these values.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        geek: {
          cyan: "#32C1DF", // sampled from Geek logo
          "cyan-bright": "#63D0EA",
          deep: "#137C93", // deeper cyan for type on light backgrounds
          navy: "#08252E",
        },
        paper: "#F5F6F4",
        mist: "#ECEEEB",
        ink: "#0C0D0C",
        graphite: "#5A5F5C",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        brush: ["var(--font-brush)", "cursive"],
      },
      letterSpacing: {
        tightest: "-0.055em",
      },
      maxWidth: {
        edge: "1600px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 38s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
