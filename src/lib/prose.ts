/**
 * Narrative copy as HTML.
 *
 * The CMS delivers case sections as sanitised rich text; the bundled fallback
 * content in `src/content/cases.ts` is still plain prose. Both render through
 * `dangerouslySetInnerHTML`, so the plain variety is wrapped in paragraphs
 * here — the same rule the CMS applies before it sends anything.
 */
export function proseHtml(value: string | null | undefined): string {
  const text = String(value ?? "").trim();
  if (!text) return "";
  if (/<[a-z][^>]*>/i.test(text)) return text;
  return text
    .split(/\n\s*\n|\r\n\s*\r\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => `<p>${escapeHtml(block).replace(/\r?\n/g, "<br />")}</p>`)
    .join("");
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
