/**
 * Shared safety guard for STAGING-ONLY fixture/seed scripts.
 *
 * These scripts create demo/sample/test records used to prove the CMS
 * architecture. They must NEVER populate the Production database. Call this at
 * the top of any such script: it refuses to run when NODE_ENV==="production"
 * unless ALLOW_STAGING_FIXTURES==="true" is explicitly set (an intentional,
 * documented override — never set it in the Production environment).
 */
export function assertStagingFixturesAllowed(scriptName: string): void {
  if (process.env.NODE_ENV === "production" && process.env.ALLOW_STAGING_FIXTURES !== "true") {
    // eslint-disable-next-line no-console
    console.error(
      `Refusing to run ${scriptName}: staging fixtures must not be seeded in production. ` +
        `Set ALLOW_STAGING_FIXTURES=true only if you truly intend to (never in Production).`,
    );
    process.exit(1);
  }
}
