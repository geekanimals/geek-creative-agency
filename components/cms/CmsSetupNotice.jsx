/**
 * Shown at /admin when the CMS can't run yet — instead of a crashed 500 page.
 * Props: problem ("not-configured" | other non-null CmsAdminProblem from "@/lib/cms/adminGuard").
 * Rendered by the Payload admin root layout, which does not load the site's
 * global layout, so these styles are fully self-contained (no CSS variables,
 * no global helpers). Payload's own admin CSS is all inside @layer, so these
 * unlayered rules win over it exactly like the former inline styles did.
 */
export default function CmsSetupNotice({ problem }) {
  const notConfigured = problem === "not-configured";
  return (
    <html lang="en">
      <body className="cms-notice">
        <style href="cms-notice" precedence="default">
          {styles}
        </style>
        <main className="cms-notice__main">
          <div className="cms-notice__card">
            <p className="cms-notice__eyebrow">Geek CMS</p>
            <h1 className="cms-notice__title">
              {notConfigured ? "CMS is not set up yet" : "CMS can't reach its database"}
            </h1>
            <p className="cms-notice__text">
              {notConfigured
                ? "The website is running normally with its built-in content. The admin panel needs a Postgres database before it can open."
                : "The database connection is configured, but the server couldn't connect to it. The website keeps running with its built-in content."}
            </p>
            <ol className="cms-notice__steps">
              {notConfigured ? (
                <>
                  <li>
                    Add <code>DATABASE_URL</code> and <code>PAYLOAD_SECRET</code> to the
                    server&apos;s <code>.env.local</code>.
                  </li>
                  <li>
                    Run <code>npm run payload:migrate</code> once to create the tables.
                  </li>
                  <li>
                    Run <code>npm run build</code> and restart the app.
                  </li>
                </>
              ) : (
                <>
                  <li>
                    Check that <code>DATABASE_URL</code> (host, port, password) is correct.
                  </li>
                  <li>
                    Check that the database is running and allows connections from this server.
                  </li>
                  <li>See the server logs for the exact error, then restart the app.</li>
                </>
              )}
            </ol>
            <p className="cms-notice__back">
              <a href="/" className="cms-notice__link">
                ← Back to the website
              </a>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}

const styles = `
.cms-notice {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  background: #f6f8f9;
  color: #0c0d0c;
}

.cms-notice__main {
  max-width: 640px;
  margin: 10vh auto;
  padding: 0 20px;
}

.cms-notice__card {
  background: #fff;
  border: 1px solid #e3e8ea;
  border-radius: 12px;
  padding: 32px;
}

.cms-notice__eyebrow {
  margin: 0;
  font-size: 13px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #137c93;
  font-weight: 600;
}

.cms-notice__title {
  margin: 8px 0 12px;
  font-size: 26px;
}

.cms-notice__text {
  margin: 0 0 20px;
  line-height: 1.6;
  color: #3b4448;
}

.cms-notice__steps {
  margin: 0;
  padding-left: 20px;
  line-height: 1.8;
  color: #3b4448;
}

.cms-notice__back {
  margin: 24px 0 0;
}

.cms-notice__link {
  color: #137c93;
  font-weight: 600;
}
`;
