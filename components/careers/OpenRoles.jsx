import ApplyButton from "@/components/careers/ApplyButton";

const TYPE_LABEL = {
  "full-time": "Full-time",
  internship: "Internship",
  "part-time": "Part-time",
  contract: "Contract",
};

/**
 * /careers — open roles (Admin → Careers Page → Open roles) and the
 * internships box. Each role expands for details; "Apply" fills the form.
 */
export default function OpenRoles({ openings = [], internship }) {
  return (
    <section id="open-roles" className="roles roles-container" aria-labelledby="roles-title">
      <style href="open-roles" precedence="default">
        {styles}
      </style>

      <div className="roles__head">
        <p className="roles__eyebrow">Open roles</p>
        <h2 id="roles-title" className="roles-display roles__title">
          Join the team.
        </h2>
        <p className="roles__count">
          {openings.length
            ? `${openings.length} open ${openings.length === 1 ? "role" : "roles"}`
            : "No open roles right now"}
        </p>
      </div>

      {openings.length > 0 ? (
        <ul className="roles__list">
          {openings.map((o, i) => (
            <li key={o.title + i} className="roles__item">
              <details className="roles__details">
                <summary className="roles__summary">
                  <span className="roles__main">
                    <span className="roles-display roles__name">{o.title}</span>
                    <span className="roles__meta">
                      <span className={`roles__tag ${o.type === "internship" ? "roles__tag--intern" : ""}`}>
                        {TYPE_LABEL[o.type] || "Full-time"}
                      </span>
                      {[o.team, o.location, o.experience].filter(Boolean).map((m) => (
                        <span key={m} className="roles__meta-item">
                          {m}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="roles__toggle" aria-hidden />
                </summary>
                <div className="roles__body">
                  {o.summary && <p className="roles__summary-text">{o.summary}</p>}
                  {(o.responsibilities.length > 0 || o.requirements.length > 0) && (
                    <div className="roles__cols">
                      {o.responsibilities.length > 0 && (
                        <div>
                          <h3 className="roles__sub">What you'll do</h3>
                          <ul className="roles__points">
                            {o.responsibilities.map((r) => (
                              <li key={r}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {o.requirements.length > 0 && (
                        <div>
                          <h3 className="roles__sub">What we're looking for</h3>
                          <ul className="roles__points">
                            {o.requirements.map((r) => (
                              <li key={r}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  <ApplyButton role={o.title} className="roles__apply">
                    Apply for this role <span aria-hidden>→</span>
                  </ApplyButton>
                </div>
              </details>
            </li>
          ))}
        </ul>
      ) : (
        <p className="roles__empty">
          We're not listing any roles at the moment, but we read every application. If you love building brands,
          send us your details and resume — we'll reach out when there's a fit.{" "}
          <ApplyButton role="" className="roles__inline-link">
            Apply anyway →
          </ApplyButton>
        </p>
      )}

      {internship?.show && (
        <div className="roles__intern">
          <div>
            <p className="roles__eyebrow">For students</p>
            <h3 className="roles-display roles__intern-title">{internship.heading}</h3>
            <p className="roles__intern-body">{internship.body}</p>
          </div>
          <ApplyButton role="Internship" className="roles__apply roles__apply--solid">
            Apply for an internship <span aria-hidden>→</span>
          </ApplyButton>
        </div>
      )}
    </section>
  );
}

const styles = `
.roles-container {
  width: 100%;
  max-width: 1400px;
  margin-inline: auto;
  padding-inline: 32px;
}
@media (max-width: 639px) {
  .roles-container { padding-inline: 20px; }
}
.roles-display {
  font-family: var(--font-display), system-ui, sans-serif;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
}
.roles {
  padding-block: 3.5rem;
  border-top: 1px solid #eceeeb;
}
.roles__eyebrow {
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #32c1df;
}
.roles__title {
  margin-top: 0.75rem;
  font-size: clamp(2rem, 5vw, 4rem);
  text-transform: uppercase;
  color: #0c0d0c;
}
.roles__count {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #5a5f5c;
}
.roles__list {
  list-style: none;
  margin: 2rem 0 0;
  padding: 0;
  border-top: 1px solid #eceeeb;
}
.roles__item { border-bottom: 1px solid #eceeeb; }
.roles__summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 1.25rem;
  cursor: pointer;
  list-style: none;
}
.roles__summary::-webkit-details-marker { display: none; }
.roles__summary:focus-visible { outline: 2px solid #32c1df; outline-offset: 4px; border-radius: 4px; }
.roles__main { display: flex; flex-direction: column; gap: 0.6rem; min-width: 0; }
.roles__name {
  font-size: clamp(1.25rem, 2.6vw, 1.9rem);
  text-transform: uppercase;
  color: #0c0d0c;
  overflow-wrap: anywhere;
}
.roles__summary:hover .roles__name { color: #137c93; }
.roles__meta { display: flex; flex-wrap: wrap; align-items: center; gap: 0.4rem 0.9rem; }
.roles__tag {
  display: inline-block;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  background: #0c0d0c;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.roles__tag--intern { background: #32c1df; color: #0c0d0c; }
.roles__meta-item { font-size: 0.875rem; color: #5a5f5c; }
.roles__toggle {
  position: relative;
  flex: none;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid #d9dcd8;
  border-radius: 9999px;
}
.roles__toggle::before,
.roles__toggle::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 12px;
  height: 2px;
  background: #0c0d0c;
  transform: translate(-50%, -50%);
  transition: transform 180ms ease;
}
.roles__toggle::after { transform: translate(-50%, -50%) rotate(90deg); }
.roles__details[open] .roles__toggle::after { transform: translate(-50%, -50%) rotate(0deg); }
.roles__body { padding-bottom: 1.75rem; }
.roles__summary-text {
  max-width: 70ch;
  font-size: 1rem;
  line-height: 1.65rem;
  color: #3d413f;
}
.roles__cols {
  margin-top: 1.25rem;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.5rem;
}
.roles__sub {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #0c0d0c;
}
.roles__points {
  margin: 0.75rem 0 0;
  padding-left: 1.1rem;
  list-style: disc;
  font-size: 0.95rem;
  line-height: 1.55rem;
  color: #3d413f;
}
.roles__points li + li { margin-top: 0.35rem; }
.roles__points li::marker { color: #32c1df; }
.roles__apply {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding: 0.75rem 1.25rem;
  border: 1px solid #0c0d0c;
  border-radius: 9999px;
  color: #0c0d0c;
  font-size: 0.875rem;
  font-weight: 700;
  text-decoration: none;
  transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease;
}
.roles__apply:hover { background: #0c0d0c; color: #fff; }
.roles__apply--solid { background: #0c0d0c; color: #fff; margin-top: 0; flex: none; }
.roles__apply--solid:hover { background: #32c1df; border-color: #32c1df; color: #0c0d0c; }
.roles__empty {
  margin-top: 2rem;
  max-width: 62ch;
  padding: 1.5rem;
  border: 1px dashed #d9dcd8;
  border-radius: 1rem;
  font-size: 1rem;
  line-height: 1.65rem;
  color: #3d413f;
}
.roles__inline-link { color: #137c93; font-weight: 700; text-decoration: none; }
.roles__inline-link:hover { text-decoration: underline; }
.roles__intern {
  margin-top: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.75rem;
  border-radius: 1.25rem;
  background: #f4fbfd;
  border: 1px solid #d3eff6;
}
.roles__intern-title {
  margin-top: 0.6rem;
  font-size: clamp(1.4rem, 3vw, 2.2rem);
  text-transform: uppercase;
  color: #0c0d0c;
}
.roles__intern-body {
  margin-top: 0.75rem;
  max-width: 62ch;
  font-size: 1rem;
  line-height: 1.65rem;
  color: #3d413f;
}
@media (min-width: 640px) {
  .roles { padding-block: 5rem; }
  .roles__cols { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 2.5rem; }
  .roles__intern {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 2.25rem 2.5rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  .roles__toggle::before, .roles__toggle::after, .roles__apply { transition: none; }
}
`;
