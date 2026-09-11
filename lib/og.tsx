import { ImageResponse } from "next/og";

/** Shared 1200×630 OpenGraph template — Geek cyan / charcoal / white. */
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const CYAN = "#32C1DF";
const INK = "#0C0D0C";

export function renderOG({
  title,
  eyebrow,
  tag,
  dark = true,
}: {
  title: string;
  eyebrow?: string;
  tag?: string;
  dark?: boolean;
}) {
  const bg = dark ? INK : "#FFFFFF";
  const fg = dark ? "#FFFFFF" : INK;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: bg,
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* radial cyan glow */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -160,
            width: 620,
            height: 620,
            borderRadius: 620,
            background: "radial-gradient(closest-side, rgba(50,193,223,0.55), rgba(50,193,223,0))",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 46, fontWeight: 800, color: CYAN, letterSpacing: -2 }}>geek</div>
          {tag && (
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: 4, color: dark ? "rgba(255,255,255,0.55)" : "#5A5F5C", textTransform: "uppercase" }}>{tag}</div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {eyebrow && (
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 3, color: CYAN, textTransform: "uppercase", marginBottom: 18 }}>{eyebrow}</div>
          )}
          <div style={{ fontSize: title.length > 40 ? 76 : 96, fontWeight: 800, color: fg, lineHeight: 1.02, letterSpacing: -2, textTransform: "uppercase" }}>
            {title}
          </div>
        </div>

        <div style={{ fontSize: 24, color: dark ? "rgba(255,255,255,0.6)" : "#5A5F5C", fontWeight: 600 }}>
          We build brands. Then we make them matter.
        </div>
      </div>
    ),
    { ...ogSize }
  );
}
