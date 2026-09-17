"use client";

import { useEffect } from "react";
import { useLocalStorageItem } from "@/lib/useLocalStorageItem";
import { CONSENT_STORAGE_KEY, parseConsent } from "@/lib/consent";
import { track } from "@/lib/track";

/**
 * Analytics and marketing tags, gated on the granular cookie choice
 * (`norr3-cookie-consent` — see lib/consent).
 *
 * - `gtm` set (CMS → Settings → Google Tag Manager ID): loads the GTM container,
 *   which carries GA4, Google Ads, LinkedIn, Meta and the rest. `ga4` is then
 *   ignored so GA4 is never counted twice.
 * - only `ga4` set: loads GA4 directly with gtag.js.
 *
 * Google Consent Mode v2 (required for Google Ads / GA4 in the EEA): every
 * signal is declared "denied" first and updated when the visitor decides —
 * `measurement` maps to analytics_storage, `marketing` to ad_storage,
 * ad_user_data and ad_personalization. No tag is loaded at all before at least
 * one of those two is granted ("basic" consent mode), which keeps the privacy
 * policy's promise that nothing tracks before consent. Withdrawing consent
 * updates the signals back to denied; previously loaded tags stop measuring.
 *
 * The consent value is read through the same store the banner writes to, so
 * accepting loads the tags on *that* page — the landing page view and its
 * traffic source are counted, not just the next page.
 *
 * Also emits `email_click` / `phone_click` for every mailto:/tel: link.
 */
export function Analytics({ ga4, gtm }: { ga4: string; gtm?: string }) {
  const [raw] = useLocalStorageItem(CONSENT_STORAGE_KEY, { serverValue: null, errorValue: null });
  const categories = parseConsent(raw);
  const measurement = categories?.measurement === true;
  const marketing = categories?.marketing === true;
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

  // Apply the visitor's choice and load the tags once anything is granted.
  useEffect(() => {
    if (!categories || (!containerId && !measurementId)) return;

    window.gtag?.("consent", "update", {
      analytics_storage: measurement ? "granted" : "denied",
      ad_storage: marketing ? "granted" : "denied",
      ad_user_data: marketing ? "granted" : "denied",
      ad_personalization: marketing ? "granted" : "denied",
    });

    if (!measurement && !marketing) return; // nothing to load (or consent withdrawn)

    const w = window as Window & { __norr3TagsLoaded?: boolean };
    if (w.__norr3TagsLoaded) return;
    w.__norr3TagsLoaded = true;

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
  }, [categories, containerId, measurementId, measurement, marketing]);

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
