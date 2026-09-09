import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { isLocale } from "@/i18n/config";
import { getSiteContent, getCaseViaPreviewApi } from "@/lib/cms";
import { CaseDetailView } from "@/components/views/CaseDetailView";
import { Icon } from "@/components/Icon";
import PreviewTools, { type PreviewComment } from "@/components/preview/PreviewTools";

/**
 * Password-protected draft preview for client approval.
 *
 * /case-preview/<slug> — the client enters the password (set in the CMS case
 * editor) and gets a 30-minute cookie that unlocks the draft. Renders the
 * same CaseDetailView as the public page with a "DRAFT" ribbon on top.
 */
type Params = { params: Promise<{ locale: string; slug: string }> };

export const metadata = {
  title: "Luonnos / Draft — NØRR3",
  robots: { index: false, follow: false },
};

async function previewPassword(slug: string): Promise<string | null> {
  const store = await cookies();
  return store.get(`norr3-draft-${slug.replace(/[^a-z0-9-]/gi, "")}`)?.value ?? null;
}

export default async function CasePreviewPage({ params }: Params) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const fi = locale === "fi";

  const previewPw = await previewPassword(slug);

  if (!previewPw) {
    return (
      <div className="flex min-h-[80svh] flex-col items-center justify-center gap-6 px-6 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-[5px] bg-violet text-white">
          <Icon name="lock" style={{ fontSize: "30px" }} />
        </span>
        <h1 className="text-2xl font-medium text-ink dark:text-white">
          {fi ? "Suojattu esikatselu" : "Protected preview"}
        </h1>
        <p className="max-w-sm text-[14px] leading-relaxed text-ink/60 dark:text-white/60">
          {fi
            ? "Tämä casen luonnos on salasanasuojattu. Syötä saamasi salasana nähdäksesi sen."
            : "This case draft is password-protected. Enter the password you received to view it."}
        </p>
        <form action="/api/case-preview" method="POST" className="flex w-full max-w-xs flex-col gap-3">
          <input type="hidden" name="slug" value={slug} />
          <input
            type="password"
            name="password"
            required
            placeholder={fi ? "Salasana" : "Password"}
            className="w-full rounded-[10px] border border-ink/20 bg-white px-3.5 py-2.5 text-[14px] text-ink outline-none focus:border-purple dark:border-white/20 dark:bg-white/5 dark:text-white"
          />
          <button
            type="submit"
            className="rounded-full bg-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.08em] text-white transition-colors hover:bg-purple dark:bg-purple dark:hover:bg-violet"
          >
            {fi ? "Avaa esikatselu" : "Open preview"}
          </button>
        </form>
      </div>
    );
  }

  const content = await getSiteContent();
  const study = await getCaseViaPreviewApi(slug, previewPw);
  if (!study) notFound();

  // Existing client pins, so a returning reviewer sees the open notes.
  const cmsBase = (process.env.NORR3_CMS_URL ?? "http://127.0.0.1:3848").replace(/\/+$/, "");
  let comments: PreviewComment[] = [];
  try {
    const res = await fetch(
      `${cmsBase}/api/public/case-comments?slug=${encodeURIComponent(slug)}&password=${encodeURIComponent(previewPw)}`,
      { cache: "no-store", signal: AbortSignal.timeout(6000) }
    );
    if (res.ok) comments = ((await res.json()) as { comments?: PreviewComment[] }).comments ?? [];
  } catch {
    comments = [];
  }

  const dict = content.dictionaries[locale];
  return (
    <div className="relative">
      <div className="fixed inset-x-0 top-0 z-[80] bg-yellow py-1.5 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-ink">
        {fi ? "LUONNOS — ei julkinen" : "DRAFT — not published"}
      </div>
      <div className="pt-8">
        <CaseDetailView study={study} locale={locale} dict={dict} />
      </div>
      <PreviewTools slug={slug} locale={locale} initialComments={comments} />
    </div>
  );
}