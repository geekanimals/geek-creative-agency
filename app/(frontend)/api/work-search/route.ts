import { NextRequest, NextResponse } from "next/server";
import { getWorkProjects } from "@/lib/cms/projects";
import { buildSearchDocs, searchDocs } from "@/lib/work/search";

/**
 * GET /api/work-search?q=pepsi  →  { q, results: [{ slug, score }] }
 * Searches published case studies (title, brand, company, taxonomy, summary and
 * full story text). Uses the cached /work project list — no extra DB query.
 */
export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").slice(0, 100).trim();
  if (!q) return NextResponse.json({ q, results: [] });
  try {
    const projects = (await getWorkProjects()).filter((p) => p.publishStatus === "published");
    const results = searchDocs(buildSearchDocs(projects), q);
    return NextResponse.json(
      { q, results },
      { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } },
    );
  } catch {
    return NextResponse.json({ q, results: [], error: "search_unavailable" }, { status: 503 });
  }
}
