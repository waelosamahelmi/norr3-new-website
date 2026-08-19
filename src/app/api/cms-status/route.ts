import { NextResponse } from "next/server";
import { getSiteContent, cmsUrl } from "@/lib/cms";

/**
 * Reports whether this site is currently serving CMS content or has fallen back
 * to its bundled copy. The CMS's own connection check reads this, so a
 * misconfigured link is visible from the admin UI rather than only in logs.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getSiteContent();
  return NextResponse.json({
    source: content.source,
    generatedAt: content.generatedAt,
    error: content.error,
    cmsUrl,
    counts: {
      dictionarySections: Object.keys(content.dictionaries.fi).length,
      services: content.services.length,
      cases: content.cases.length,
      posts: content.posts.length,
      team: content.team.length,
      cmsPages: content.pages.length,
    },
  });
}
