import config from "@payload-config";
import { GRAPHQL_PLAYGROUND_GET } from "@payloadcms/next/routes";

/**
 * The interactive GraphQL playground is a development/introspection convenience.
 * GraphQL itself (POST /api/graphql) stays enabled in every environment — only
 * the playground UI is disabled in production to reduce attack surface.
 */
export const GET =
  process.env.NODE_ENV === "production"
    ? async () => new Response("Not Found", { status: 404 })
    : GRAPHQL_PLAYGROUND_GET(config);
