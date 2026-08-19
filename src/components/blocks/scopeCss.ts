/**
 * Prefix every top-level selector in a stylesheet with `scope`, so a code
 * block's CSS cannot leak into the rest of the page.
 *
 * A full CSS parser is not warranted for this, but the naive version — splitting
 * on commas with a regex — gets at-rules, keyframes and quoted values wrong. So
 * this is a single-pass tokeniser that tracks three things a regex cannot: the
 * nesting stack (to know whether the next `{` opens a rule or a declaration
 * block), quoted strings, and comments. A `}` inside `content: "}"` or a `{`
 * inside `url("a{b.png")` used to shift the depth and silently leave every
 * following rule unscoped.
 *
 * `:root`, `html` and `body` are deliberately left global: declaring custom
 * properties is a legitimate reason to reach the document, and rewriting them to
 * a selector that never matches would be worse than letting them through.
 */

/** What the innermost open brace was. */
type Frame =
  | "rule" // a style rule — its contents are declarations
  | "nested" // @media / @supports / @layer / @container — contents are rules
  | "keyframes"; // @keyframes — contents are percentage selectors, left alone

const GLOBAL_SELECTOR = /^(:root|html|body)\b/;
const NESTED_AT_RULE = /^@(media|supports|layer|container|scope)\b/i;
const KEYFRAMES_AT_RULE = /^@(-\w+-)?keyframes\b/i;

export function scopeCss(css: string, scope: string): string {
  let out = "";
  let prelude = "";
  const stack: Frame[] = [];

  /** True when the next `{` opens a style rule whose selector we should prefix. */
  const collectingSelector = () => {
    const top = stack[stack.length - 1];
    return top === undefined || top === "nested";
  };

  const prefix = (selectors: string) =>
    selectors
      .split(",")
      .map((selector) => {
        const trimmed = selector.trim();
        if (!trimmed) return "";
        if (GLOBAL_SELECTOR.test(trimmed)) return trimmed;
        // `&` lets an author target the block element itself.
        if (trimmed.startsWith("&")) return `${scope}${trimmed.slice(1)}`;
        return `${scope} ${trimmed}`;
      })
      .filter(Boolean)
      .join(", ");

  for (let i = 0; i < css.length; i++) {
    const char = css[i];
    const next = css[i + 1];

    // Comments pass through verbatim and never affect the stack.
    if (char === "/" && next === "*") {
      const close = css.indexOf("*/", i + 2);
      const end = close === -1 ? css.length : close + 2;
      const comment = css.slice(i, end);
      if (collectingSelector()) prelude += comment;
      else out += comment;
      i = end - 1;
      continue;
    }

    // Quoted strings pass through verbatim, braces and all.
    if (char === '"' || char === "'") {
      let j = i + 1;
      while (j < css.length) {
        if (css[j] === "\\") j += 2;
        else if (css[j] === char) break;
        else j++;
      }
      const literal = css.slice(i, Math.min(j + 1, css.length));
      if (collectingSelector()) prelude += literal;
      else out += literal;
      i = Math.min(j, css.length - 1);
      continue;
    }

    if (char === "{") {
      const raw = prelude.trim();
      prelude = "";

      if (raw.startsWith("@")) {
        // An at-rule keeps its prelude exactly as written.
        out += `${raw} {`;
        stack.push(KEYFRAMES_AT_RULE.test(raw) ? "keyframes" : NESTED_AT_RULE.test(raw) ? "nested" : "rule");
        continue;
      }

      const parent = stack[stack.length - 1];
      if (parent === "keyframes") {
        // `0%`, `from`, `to` — a keyframe selector, not a page selector.
        out += `${raw} {`;
        stack.push("rule");
        continue;
      }

      out += `${prefix(raw)} {`;
      stack.push("rule");
      continue;
    }

    if (char === "}") {
      // Flush whatever was pending, then close.
      out += collectingSelector() ? prelude : "";
      prelude = "";
      stack.pop();
      out += "}";
      continue;
    }

    if (collectingSelector()) prelude += char;
    else out += char;
  }

  return out + prelude;
}
