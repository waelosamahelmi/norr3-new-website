"use client";

import { useState } from "react";
import { SocialIcon } from "./SocialIcon";
import { fill, type Embed } from "@/lib/socialFormat";

const PROVIDERS: Record<Embed["provider"], { name: string; hosts: RegExp; ratio: string }> = {
  youtube: { name: "YouTube", hosts: /^(www\.)?(youtube\.com|youtube-nocookie\.com)$/, ratio: "16 / 9" },
  vimeo: { name: "Vimeo", hosts: /^player\.vimeo\.com$/, ratio: "16 / 9" },
  linkedin: { name: "LinkedIn", hosts: /^(www\.)?linkedin\.com$/, ratio: "4 / 5" },
};

/** The embed URL, only if it really points at the provider's player. */
function playerUrl(embed: Embed): URL | null {
  try {
    const url = new URL(embed.embedUrl);
    if (url.protocol !== "https:" || !PROVIDERS[embed.provider]?.hosts.test(url.hostname)) return null;
    return url;
  } catch {
    return null;
  }
}

function youtubeId(url: URL): string | null {
  const match = /\/embed\/([\w-]{6,})/.exec(url.pathname);
  return match?.[1] ?? null;
}

/**
 * YouTube / Vimeo / LinkedIn embeds as click-to-load facades.
 *
 * A single YouTube iframe costs ~1 MB of script and a round of third-party
 * requests before anyone presses play; a feed of them would sink the page. So
 * the card shows a thumbnail (YouTube's still, or a brand panel) and a play
 * button, and swaps in the real player only on click — autoplaying, since the
 * click already expressed the intent.
 */
export function EmbedFacade({ embed, title, labels }: { embed: Embed; title: string; labels: { embedLoad: string; embedNote: string } }) {
  const [active, setActive] = useState(false);
  const url = playerUrl(embed);
  const provider = PROVIDERS[embed.provider];
  if (!url || !provider) return null;

  const ratio = provider.ratio;
  const label = fill(labels.embedLoad, { provider: provider.name });

  if (active) {
    const src = new URL(url);
    if (embed.provider !== "linkedin") src.searchParams.set("autoplay", "1");
    return (
      <div className="relative w-full bg-black" style={{ aspectRatio: ratio }}>
        <iframe
          src={src.toString()}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    );
  }

  const id = embed.provider === "youtube" ? youtubeId(url) : null;

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      aria-label={`${label}: ${title}`}
      className="group/embed relative block w-full overflow-hidden bg-violet text-left focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-yellow"
      style={{ aspectRatio: embed.provider === "linkedin" ? "16 / 9" : ratio }}
    >
      {id ? (
        <img
          src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/embed:scale-[1.02]"
        />
      ) : (
        <span aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,var(--color-purple),var(--color-violet)_55%,#1b0a3a)]" />
      )}
      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
      <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-ink shadow-lg transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/embed:scale-105">
        <SocialIcon name="play" size={28} className="translate-x-0.5" />
      </span>
      <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-4 py-3 text-white">
        <span className="truncate text-[13px] font-medium">{provider.name}</span>
        <span className="hidden text-[12px] text-white/75 sm:inline">{fill(labels.embedNote, { provider: provider.name })}</span>
      </span>
    </button>
  );
}
