import { Fragment } from "react";

/**
 * Render text with "\n" line breaks, colouring `highlight` cyan wherever it
 * appears. Several words/phrases can be highlighted by separating them with
 * commas, e.g. "We, you". Art direction (the cyan colour, the display type)
 * stays in React; only the copy comes from the CMS.
 * Props: text (string), highlight? (string).
 */
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function HighlightedLines({ text, highlight }) {
  const terms = (highlight || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  const re = terms.length ? new RegExp(`(${terms.map(escapeRe).join("|")})`) : null;

  return (
    <>
      <style href="hlines" precedence="default">
        {styles}
      </style>
      {text.split("\n").map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {re
            ? line.split(re).map((part, j) =>
                terms.includes(part) ? (
                  <span key={j} className="hlines__highlight">
                    {part}
                  </span>
                ) : (
                  <Fragment key={j}>{part}</Fragment>
                ),
              )
            : line}
        </Fragment>
      ))}
    </>
  );
}

const styles = `
.hlines__highlight {
  color: #32c1df;
}
`;
