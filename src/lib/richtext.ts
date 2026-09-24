/**
 * Section body copy as renderable segments.
 *
 * Section bodies arrive as plain text with two light conventions:
 *
 *  - Two or more newlines separate paragraphs; a single newline is just a
 *    line break inside a paragraph (rendered as whitespace, as it always
 *    has been).
 *  - `[text](/path)` is an internal link. Only site-relative targets are
 *    linkified: `http(s)://` — or any target not starting with `/` — and
 *    malformed brackets render as literal text. The convention never
 *    produces external links.
 *
 * Parsing returns plain data (no JSX), so any component can render the
 * segments with its own link treatment — the site's internal-link pattern is
 * Next `Link` + `linkTo(locale, href)`.
 */

/** One run of body copy: plain text, or an internal link when `href` is set. */
export type Segment = { text: string; href?: string };

/**
 * `[text](/path)`: text without nested brackets, target without parens or
 * whitespace. Anything that fails to match this shape stays literal.
 */
const LINK_PATTERN = /\[([^[\]]+)\]\(([^()\s]+)\)/g;

/**
 * Split a body into paragraphs, each a list of text/link segments in order.
 * Paragraphs are trimmed and empty ones dropped (the same rule `prose.ts`
 * applies to case copy). A body that uses neither convention comes back as a
 * single text segment in a single paragraph — rendering is byte-identical to
 * the old plain-string output.
 */
export function renderBodySegments(body: string): Segment[][] {
  return String(body ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => parseSegments(paragraph.trim()))
    .filter((paragraph) => paragraph.length > 0);
}

/** Parse one paragraph into ordered text/link segments. */
function parseSegments(paragraph: string): Segment[] {
  if (!paragraph) return [];
  const segments: Segment[] = [];
  let cursor = 0;
  for (const match of paragraph.matchAll(LINK_PATTERN)) {
    const [raw, text, href] = match;
    const start = match.index ?? 0;
    // Internal paths only — and `//host` is a protocol-relative external URL,
    // not a path. A rejected match does not advance the cursor, so it stays
    // literal text.
    if (!href.startsWith("/") || href.startsWith("//")) continue;
    if (start > cursor) segments.push({ text: paragraph.slice(cursor, start) });
    segments.push({ text, href });
    cursor = start + raw.length;
  }
  if (cursor < paragraph.length) segments.push({ text: paragraph.slice(cursor) });
  return segments;
}
