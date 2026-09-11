import type { Payload } from "payload";

/**
 * When a Project changes, both its OLD and NEW related portfolio hubs can go
 * stale (hub pages are SSG/dynamic and cached until revalidated). This resolves
 * every affected route from `doc` + `previousDoc`, deduplicates, and revalidates
 * exactly those paths — never the whole site. Relationship values may be IDs,
 * populated docs, arrays, or null.
 */

const idsOf = (v: unknown): (number | string)[] => {
  if (v == null) return [];
  const arr = Array.isArray(v) ? v : [v];
  return arr
    .map((x) => (x && typeof x === "object" ? (x as { id?: number | string }).id : x))
    .filter((x): x is number | string => x != null);
};

async function slugsFor(payload: Payload, collection: string, ids: (number | string)[]): Promise<string[]> {
  const uniq = [...new Set(ids.map(String))];
  if (!uniq.length) return [];
  const res = await payload.find({
    collection: collection as never,
    where: { id: { in: uniq } },
    depth: 0,
    limit: 1000,
    pagination: false,
    overrideAccess: true,
  });
  return res.docs.map((d) => (d as { slug?: string }).slug).filter((s): s is string => !!s);
}

type ProjectLike = Record<string, unknown> | null | undefined;

/** Compute + revalidate all paths affected by a Project change. Safe no-op
 *  outside a request/render context (seed/CLI). */
export async function revalidateProjectAndHubs(payload: Payload, doc: ProjectLike, previousDoc: ProjectLike): Promise<void> {
  try {
    const { revalidatePath } = await import("next/cache");
    const paths = new Set<string>(["/work"]);
    for (const d of [doc, previousDoc]) {
      const slug = d && typeof d.slug === "string" ? d.slug : undefined;
      if (slug) paths.add(`/work/${slug}`);
    }
    const rel = (field: string) => [...idsOf(doc?.[field]), ...idsOf(previousDoc?.[field])];
    const [industries, companies, brands, services, solutions] = await Promise.all([
      slugsFor(payload, "business-categories", rel("businessCategories")),
      slugsFor(payload, "companies", rel("company")),
      slugsFor(payload, "brands", rel("brand")),
      slugsFor(payload, "services", rel("services")),
      slugsFor(payload, "solutions", rel("solutions")),
    ]);
    industries.forEach((s) => paths.add(`/industries/${s}`));
    companies.forEach((s) => paths.add(`/companies/${s}`));
    brands.forEach((s) => paths.add(`/brands/${s}`));
    services.forEach((s) => paths.add(`/services/${s}`));
    solutions.forEach((s) => paths.add(`/solutions/${s}`));
    for (const p of paths) revalidatePath(p);
  } catch {
    /* not in a request/render context, or revalidation unavailable — ignore */
  }
}
