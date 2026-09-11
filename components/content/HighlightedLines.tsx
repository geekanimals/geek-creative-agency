import { Fragment } from "react";

/**
 * Render text with "\n" line breaks, colouring `highlight` cyan wherever it
 * appears in a line. Art direction (the cyan colour, the display type) stays in
 * React; only the copy comes from the CMS. Shared verbatim by the What We Do and
 * Creators pages (previously duplicated as a local `Lines` helper in each).
 */
export function HighlightedLines({ text, highlight }: { text: string; highlight?: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {highlight && line.includes(highlight) ? (
            <>
              {line.split(highlight)[0]}
              <span className="text-geek-cyan">{highlight}</span>
              {line.split(highlight).slice(1).join(highlight)}
            </>
          ) : (
            line
          )}
        </Fragment>
      ))}
    </>
  );
}
