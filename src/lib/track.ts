/**
 * Site events for analytics and ad conversions.
 *
 * Every event is pushed to `window.dataLayer` as `{ event, ...params }`, which
 * is what a Google Tag Manager "Custom Event" trigger listens for — so GA4,
 * Google Ads, LinkedIn, Meta and Adform conversions are configured in GTM
 * against these names, not against button texts or URLs that change.
 *
 * When the site runs GA4 directly (no GTM container set in the CMS), the same
 * call is also sent as a GA4 event through gtag.
 *
 * Pushing before consent is harmless: nothing reads the dataLayer until the
 * visitor accepts cookies and a tag loads, and GTM then replays what is queued.
 *
 * Event names (keep docs/analytics-setup.md in sync):
 *   generate_lead   form_name: contact | brief | booking_demo | booking_meeting
 *   job_application form_name: open_application
 *   email_click     link_url
 *   phone_click     link_url
 *   booking_open    booking_kind: demo | meeting
 */
export type TrackEvent = "generate_lead" | "job_application" | "email_click" | "phone_click" | "booking_open";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __norr3Ga4Direct?: boolean;
  }
}

export function track(event: TrackEvent, params: Record<string, string | number | undefined> = {}): void {
  if (typeof window === "undefined") return;
  const clean = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ""));
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...clean });
  if (window.__norr3Ga4Direct) window.gtag?.("event", event, clean);
}
