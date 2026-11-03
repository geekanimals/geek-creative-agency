import NavClient from "./NavClient";
import { getNavigation } from "@/lib/cms/globals";

/**
 * Server wrapper: resolves the navigation model (CMS-first, static fallback,
 * cached + tagged "globals") and hands it to the client header. Rendered once
 * for every page by app/(frontend)/layout.jsx.
 */
export default async function Nav() {
  const nav = await getNavigation();
  return <NavClient nav={nav} />;
}
