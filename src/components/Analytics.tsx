"use client";

import { useEffect } from "react";

/**
 * Loads Google Analytics (GA4) gtag.js, gated on the cookie-consent choice the
 * CookieConsent component stores under `norr3-cookie-consent` ("accepted").
 * Fires on the current page load when consent is already given, and listens for
 * cross-tab consent changes. No tracking happens before consent.
 */
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __norr3GtagLoaded?: boolean;
  }
}

export function Analytics({ ga4 }: { ga4: string }) {
  useEffect(() => {
    if (!ga4) return;

    const consent = () => {
      try {
        return localStorage.getItem("norr3-cookie-consent");
      } catch {
        return null;
      }
    };

    const load = () => {
      if (consent() !== "accepted" || window.__norr3GtagLoaded) return;
      window.__norr3GtagLoaded = true;
      const script = document.createElement("script");
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4)}`;
      script.async = true;
      document.head.appendChild(script);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer!.push(args);
      };
      window.gtag("js", new Date());
      window.gtag("config", ga4);
    };

    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, [ga4]);

  return null;
}
