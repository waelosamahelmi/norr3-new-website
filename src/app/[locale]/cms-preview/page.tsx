import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getSiteContent, getCmsPage } from "@/lib/cms";
import { buildBlockContext } from "@/components/blocks/context";
import PreviewCanvas from "./PreviewCanvas";

export const dynamic = "force-dynamic";

/**
 * The page editor's live preview target.
 *
 * It renders the requested page's saved blocks on first load, then hands control
 * to the client so the editor can push an unsaved document over postMessage and
 * see it drawn with the real brand components. Kept out of the sitemap and
 * robots by `noindex` below — it is a tool surface, not a page.
 */
export const metadata = { robots: { index: false, follow: false } };

export default async function CmsPreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ slug?: string; origin?: string }>;
}) {
  const { locale } = await params;
  const { slug, origin } = await searchParams;
  if (!isLocale(locale)) notFound();

  const content = await getSiteContent();
  const context = buildBlockContext(content, locale);

  // Only the published version is fetched here, and deliberately so: the browser
  // sends cookies for *this* origin, not the CMS's, so a draft could not be
  // authenticated from inside the frame anyway. The editor pushes the working
  // document over postMessage the moment this page reports itself ready, which
  // is what an editor is actually looking at — saved or not.
  const page = slug ? await getCmsPage(slug) : null;

  return (
    <PreviewCanvas
      initialBlocks={page?.blocks ?? []}
      context={context}
      allowedOrigin={origin ?? ""}
      title={page ? page.title[locale] || page.title.fi : ""}
      slug={slug ?? ""}
    />
  );
}
