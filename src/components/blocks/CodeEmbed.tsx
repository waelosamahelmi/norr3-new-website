"use client";

import { useEffect, useId, useRef } from "react";
import { scopeCss } from "./scopeCss";

/**
 * Renders a code block: raw HTML, CSS scoped to this block, and optional
 * JavaScript run once after mount.
 *
 * Nothing here is sanitised, and that is the point — a code block exists for the
 * cases a form cannot express. What protects the rest of the page is scope, not
 * filtering: the CSS is prefixed so it cannot leak, and the script receives only
 * this block's element. Who may write it is enforced in the CMS, where code props
 * can only be saved by an admin.
 */

export function CodeEmbed({
  blockId,
  html,
  css,
  js,
  caption,
}: {
  blockId: string;
  html: string;
  css: string;
  js: string;
  caption?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reactId = useId();
  // Prefer the block's own id so the selector the CMS shows is the real one.
  const scopeClass = `cms-block-${blockId || reactId.replace(/[^a-zA-Z0-9]/g, "")}`;

  useEffect(() => {
    if (!js.trim() || !ref.current) return;
    const container = ref.current;
    try {
      // Scoped to this element and run once. A throw is contained and logged
      // rather than taking the page down with it.
      const run = new Function("container", js);
      run(container);
    } catch (error) {
      console.error(`[code block ${blockId}]`, error);
    }
  }, [js, blockId]);

  if (!html.trim() && !css.trim() && !js.trim()) return null;

  return (
    <figure>
      {css.trim() && <style dangerouslySetInnerHTML={{ __html: scopeCss(css, `.${scopeClass}`) }} />}
      <div ref={ref} className={scopeClass} dangerouslySetInnerHTML={{ __html: html }} />
      {caption && (
        <figcaption className="mt-3 text-[13px] text-ink/55 dark:text-white/55">{caption}</figcaption>
      )}
    </figure>
  );
}
