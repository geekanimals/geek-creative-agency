import Link from "next/link";

/** Small breadcrumb for the Work browse pages: Work / Brand / Lay's. */
export default function WorkCrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="wcrumbs">
      <style href="wcrumbs" precedence="default">
        {styles}
      </style>
      <ol className="wcrumbs__list">
        {items.map((it, i) => {
          const last = i === items.length - 1;
          return (
            <li key={it.path} className="wcrumbs__item">
              {last ? (
                <span aria-current="page" className="wcrumbs__current">
                  {it.name}
                </span>
              ) : (
                <Link href={it.path} className="wcrumbs__link">
                  {it.name}
                </Link>
              )}
              {!last && (
                <span className="wcrumbs__sep" aria-hidden>
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

const styles = `
.wcrumbs__list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.14em;
}

.wcrumbs__item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.wcrumbs__link {
  color: #5a5f5c;
  transition-property: color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

.wcrumbs__link:hover {
  color: #32c1df;
}

.wcrumbs__current {
  color: #137c93;
}

.wcrumbs__sep {
  color: #c5c9c4;
}
`;
