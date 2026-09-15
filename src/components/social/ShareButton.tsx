"use client";

import { useState } from "react";
import { SocialIcon } from "./SocialIcon";
import { actionClass } from "./LikeButton";

/**
 * Share for the public: the device's own share sheet where there is one
 * (phones), a copy-to-clipboard everywhere else. Reposting is a team-member
 * action and lives in the CMS.
 */
export function ShareButton({ url, title, label, copiedLabel }: { url: string; title: string; label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const absolute = new URL(url, window.location.origin).toString();
    if (typeof navigator.share === "function" && window.matchMedia("(pointer: coarse)").matches) {
      try {
        await navigator.share({ url: absolute, title });
        return;
      } catch (error) {
        // The visitor closing the sheet is not a failure to fall back from.
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }
    try {
      await navigator.clipboard.writeText(absolute);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked — nothing honest to announce */
    }
  }

  return (
    <button type="button" onClick={share} className={actionClass}>
      <SocialIcon name={copied ? "link" : "share"} size={19} />
      <span>{copied ? copiedLabel : label}</span>
      <span aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </button>
  );
}
