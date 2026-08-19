"use client";

import { useEffect, useState } from "react";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import type { BlockContext } from "@/components/blocks/context";
import type { Block } from "@/content/blocks";

/**
 * Receives a block document from the CMS editor and renders it.
 *
 * The editor and the website are different origins, so the editor cannot reach
 * into this document — but postMessage crosses the boundary fine. That is enough
 * for a true live preview: the editor posts the working document on every
 * change, and clicks here post the block id back so selecting on the preview
 * selects in the editor.
 */
export default function PreviewCanvas({
  initialBlocks,
  context,
  allowedOrigin,
  title,
  slug,
}: {
  initialBlocks: Block[];
  context: BlockContext;
  allowedOrigin: string;
  title: string;
  slug: string;
}) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selected, setSelected] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (allowedOrigin && event.origin !== allowedOrigin) return;
      const data = event.data as { type?: string; blocks?: Block[]; selected?: string | null };
      if (data?.type !== "norr3:blocks") return;
      if (Array.isArray(data.blocks)) setBlocks(data.blocks);
      setSelected(data.selected ?? null);
      setConnected(true);
    };
    window.addEventListener("message", onMessage);

    // Tell the editor we are ready to receive; it replies with the document.
    if (window.parent !== window) {
      window.parent.postMessage({ type: "norr3:preview-ready", slug }, allowedOrigin || "*");
    }
    return () => window.removeEventListener("message", onMessage);
  }, [allowedOrigin, slug]);

  const report = (blockId: string) => {
    if (window.parent === window) return;
    window.parent.postMessage({ type: "norr3:select", blockId }, allowedOrigin || "*");
  };

  return (
    <div data-cms-preview data-selected={selected ?? ""}>
      {blocks.length === 0 ? (
        <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 text-center">
          <p className="text-lg font-medium text-ink dark:text-white">
            {title ? `“${title}” has no blocks yet` : "Nothing to preview yet"}
          </p>
          <p className="mt-2 text-[14px] leading-relaxed text-ink/55 dark:text-white/55">
            {connected
              ? "Drag a block onto the canvas in the editor and it will appear here."
              : "Waiting for the editor…"}
          </p>
        </div>
      ) : (
        <BlockRenderer blocks={blocks} context={context} selectable onSelect={report} />
      )}
    </div>
  );
}
