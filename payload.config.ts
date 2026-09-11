
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { buildConfig } from "payload";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { Services } from "./collections/Services";
import { Projects } from "./collections/Projects";
import { Insights } from "./collections/Insights";
import { BusinessCategories } from "./collections/BusinessCategories";
import { Companies } from "./collections/Companies";
import { Brands } from "./collections/Brands";
import { Solutions } from "./collections/Solutions";
import { Navigation } from "./globals/Navigation";
import { Footer } from "./globals/Footer";
import { SiteSettings } from "./globals/SiteSettings";
import { About } from "./globals/About";
import { WhatWeDo } from "./globals/WhatWeDo";
import { CreatorsPage } from "./globals/CreatorsPage";
import { ContactPage } from "./globals/ContactPage";
import { HomePage } from "./globals/HomePage";

const dirname = path.dirname(fileURLToPath(import.meta.url));

// Defence-in-depth: schema `push` is already computed as false in production
// (see `push` below), but fail LOUD and early if the dangerous combination is
// ever configured, so a stray Production env var can never silently auto-sync
// (and drop) the Production schema. Local push (NODE_ENV!=="production") is
// unaffected.
if (process.env.NODE_ENV === "production" && process.env.PAYLOAD_DB_PUSH === "true") {
  throw new Error(
    "Refusing to start: PAYLOAD_DB_PUSH=true with NODE_ENV=production. " +
      "Production schema changes must go through committed migrations (npm run payload:migrate). " +
      "Remove PAYLOAD_DB_PUSH from the Production environment.",
  );
}

/**
 * Payload CMS — content backbone for the Geek site.
 *
 * Collections: Users (auth + RBAC), Media, Services, Projects, Insights, and the
 * portfolio graph (Business Categories/Industries, Companies, Brands, Solutions).
 * Globals cover the editorial page surfaces (Navigation/Footer/SiteSettings,
 * About, WhatWeDo, Creators, Contact, Home).
 *
 * DB-availability reality (do not over-state independence):
 *   • Admin (/admin) and the REST/GraphQL API always require the DB.
 *   • The portfolio hubs (/industries, /companies, /brands, /services,
 *     /solutions) are CMS-NATIVE: they need the DB to render (a previously
 *     generated ISR/static response can still serve while the DB is briefly
 *     unavailable, but there is no hardcoded fallback for them).
 *   • Several legacy/public surfaces (Home, /work, About, etc.) are CMS-FIRST
 *     with a hardcoded STATIC FALLBACK, so they keep rendering if the DB is down.
 *   • Existing /public/assets are served directly and never depend on the DB.
 *
 * Everything environment-derived (serverURL, DB, Blob, secret) so the same code
 * runs on localhost, staging (*.vercel.app) and the final production domain with
 * no edits — change only environment variables.
 */
export default buildConfig({ sharp,
  // Absolute URLs derive from NEXT_PUBLIC_SITE_URL (never a hardcoded host).
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || undefined,

  admin: {
    user: Users.slug,
    meta: { titleSuffix: " — Geek CMS" },
  },

  collections: [Users, Media, Services, Projects, Insights, BusinessCategories, Companies, Brands, Solutions],
  globals: [Navigation, Footer, SiteSettings, About, WhatWeDo, CreatorsPage, ContactPage, HomePage],

  // Rich-text editor for Projects' flexible content blocks.
  editor: lexicalEditor(),

  // Required. No insecure fallback: an empty secret only ever occurs in a
  // non-CMS static-only context; lib/env.ts fails loudly when the CMS is
  // expected to run without it. Never committed.
  secret: process.env.PAYLOAD_SECRET || "",

  typescript: { outputFile: path.resolve(dirname, "payload-types.ts") },

  // Vendor-agnostic Postgres via a standard connection string (Neon today, any
  // managed Postgres later). Migrations live in ./migrations and are applied
  // with `npm run payload:migrate` (see package.json). `push` (dev auto-sync)
  // is enabled only outside production so local/branch DBs bootstrap instantly;
  // staging/production must use committed migrations.
  db: postgresAdapter({
    // Per-instance node-postgres pool. Kept SMALL for serverless (Vercel spins
    // up many ephemeral instances behind Supabase's TRANSACTION pooler :6543,
    // which does the real multiplexing): set PGPOOL_MAX=1–3 in that env. Locally
    // (session pooler :5432, 15-client cap) the default 6 is fine. idle timeout
    // releases connections promptly so ephemeral instances don't hold the pooler.
    pool: {
      connectionString: process.env.DATABASE_URL || "",
      max: Number(process.env.PGPOOL_MAX ?? 6),
      idleTimeoutMillis: Number(process.env.PG_IDLE_TIMEOUT ?? 10000),
      connectionTimeoutMillis: Number(process.env.PG_CONNECT_TIMEOUT ?? 10000),
    },
    migrationDir: path.resolve(dirname, "migrations"),
    // Schema changes go through MIGRATIONS. Dev auto-`push` is OPT-IN
    // (PAYLOAD_DB_PUSH=true) so it doesn't re-introspect on every init and
    // exhaust the pooler; never on in production.
    push: process.env.NODE_ENV !== "production" && process.env.PAYLOAD_DB_PUSH === "true",
  }),

  plugins: [
    // PUBLIC CMS media → Vercel Blob, with CLIENT UPLOADS so large campaign
    // videos go browser → Blob directly (bypassing the serverless upload
    // limit). The token stays server-side; the browser gets a short-lived
    // client token. Enabled only when a Blob token is present, so the app still
    // boots without Blob configured. Existing /public/assets are NOT touched.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
      clientUploads: true,
    }),
  ],
});
