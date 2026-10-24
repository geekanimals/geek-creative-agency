import type { CmsAdminProblem } from "@/lib/cms/adminGuard";

/** Shown at /admin when the CMS can't run yet — instead of a crashed 500 page. */
export default function CmsSetupNotice({ problem }: { problem: Exclude<CmsAdminProblem, null> }) {
  const notConfigured = problem === "not-configured";
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "system-ui, -apple-system, sans-serif", background: "#f6f8f9", color: "#0c0d0c" }}>
        <main style={{ maxWidth: 640, margin: "10vh auto", padding: "0 20px" }}>
          <div style={{ background: "#fff", border: "1px solid #e3e8ea", borderRadius: 12, padding: 32 }}>
            <p style={{ margin: 0, fontSize: 13, letterSpacing: 1, textTransform: "uppercase", color: "#137C93", fontWeight: 600 }}>Geek CMS</p>
            <h1 style={{ margin: "8px 0 12px", fontSize: 26 }}>
              {notConfigured ? "CMS is not set up yet" : "CMS can't reach its database"}
            </h1>
            <p style={{ margin: "0 0 20px", lineHeight: 1.6, color: "#3b4448" }}>
              {notConfigured
                ? "The website is running normally with its built-in content. The admin panel needs a Postgres database before it can open."
                : "The database connection is configured, but the server couldn't connect to it. The website keeps running with its built-in content."}
            </p>
            <ol style={{ margin: 0, paddingLeft: 20, lineHeight: 1.8, color: "#3b4448" }}>
              {notConfigured ? (
                <>
                  <li>Add <code>DATABASE_URL</code> and <code>PAYLOAD_SECRET</code> to the server&apos;s <code>.env.local</code>.</li>
                  <li>Run <code>npm run payload:migrate</code> once to create the tables.</li>
                  <li>Run <code>npm run build</code> and restart the app.</li>
                </>
              ) : (
                <>
                  <li>Check that <code>DATABASE_URL</code> (host, port, password) is correct.</li>
                  <li>Check that the database is running and allows connections from this server.</li>
                  <li>See the server logs for the exact error, then restart the app.</li>
                </>
              )}
            </ol>
            <p style={{ margin: "24px 0 0" }}>
              <a href="/" style={{ color: "#137C93", fontWeight: 600 }}>← Back to the website</a>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
