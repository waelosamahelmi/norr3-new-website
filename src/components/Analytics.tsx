"use client";

import { useEffect } from "react";
import { useLocalStorageItem } from "@/lib/useLocalStorageItem";
import { track } from "@/lib/track";

/**
 * Analytics and marketing tags, gated on the cookie banner's choice
 * (`norr3-cookie-consent` = "accepted" | "declined").
 *
 * - `gtm` set (CMS → Settings → Google Tag Manager ID): loads the GTM container,
 *   which carries GA4, Google Ads, LinkedIn, Meta and the rest. `ga4` is then
 *   ignored so GA4 is never counted twice.
 * - only `ga4` set: loads GA4 directly with gtag.js.
 *
 * Google Consent Mode v2 (required for Google Ads / GA4 in the EEA): consent is
 * declared "denied" first, and switched to "granted" when the visitor accepts.
 * No tag is loaded at all before acceptance ("basic" consent mode), which keeps
 * the privacy policy's promise that nothing tracks before consent.
 *
 * The consent value is read through the same store the banner writes to, so
 * accepting loads the tags on *that* page — the landing page view and its
 * traffic source are counted, not just the next page.
 *
 * Also emits `email_click` / `phone_click` for every mailto:/tel: link.
 */
export function Analytics({ ga4, gtm }: { ga4: string; gtm?: string }) {
  const [consent] = useLocalStorageItem("norr3-cookie-consent", { serverValue: null, errorValue: null });
  const containerId = (gtm ?? "").trim();
  const measurementId = containerId ? "" : ga4.trim();

  // Consent Mode defaults, before any tag can exist on the page.
  useEffect(() => {
    if (!containerId && !measurementId) return;
    window.dataLayer = window.dataLayer || [];
    if (!window.gtag) {
      // gtag must push the real `arguments` object — gtag.js ignores plain arrays.
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer!.push(arguments);
      };
      window.gtag("consent", "default", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
        wait_for_update: 500,
      });
    }
  }, [containerId, measurementId]);

  // Grant and load once the visitor accepts.
  useEffect(() => {
    if (consent !== "accepted" || (!containerId && !measurementId)) return;
    const w = window as Window & { __norr3TagsLoaded?: boolean };
    if (w.__norr3TagsLoaded) return;
    w.__norr3TagsLoaded = true;

    window.gtag?.("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    });

    const script = document.createElement("script");
    script.async = true;
    if (containerId) {
      window.dataLayer!.push({ "gtm.start": Date.now(), event: "gtm.js" });
      script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(containerId)}`;
    } else {
      window.__norr3Ga4Direct = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      window.gtag?.("js", new Date());
      window.gtag?.("config", measurementId);
    }
    document.head.appendChild(script);
  }, [consent, containerId, measurementId]);

  // mailto: / tel: clicks anywhere on the site.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href^='mailto:'], a[href^='tel:']");
      if (!link) return;
      const href = link.getAttribute("href") ?? "";
      track(href.startsWith("tel:") ? "phone_click" : "email_click", { link_url: href.replace(/^(mailto|tel):/, "") });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}
