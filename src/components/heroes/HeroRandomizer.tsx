"use client";

import { useState, useEffect } from "react";
import { HomeHero } from "@/components/HomeHero";
import { CityHero } from "@/components/heroes/CityHero";
import type { Locale } from "@/i18n/config";

/**
 * Picks one of the two heroes at random on each page load.
 * When CityHero is shown, it adds `data-city-hero-active` to <html> so the
 * nav can force its dark-mode styling regardless of the theme toggle.
 */
export function HeroRandomizer({
  locale,
  left,
  accent,
  alts,
  heroBody,
  contactLabel,
  contactHref,
  logoStrip,
}: {
  locale: Locale;
  left: string;
  accent: string;
  alts: [string, string, string];
  heroBody: string;
  contactLabel: string;
  contactHref: string;
  logoStrip: React.ReactNode;
}) {
  const [variant, setVariant] = useState<"home" | "city" | null>(null);

  useEffect(() => {
    const pick = Math.random() < 0.5 ? "home" : "city";
    setVariant(pick);
    if (pick === "city") {
      document.documentElement.setAttribute("data-city-hero-active", "");
    } else {
      document.documentElement.removeAttribute("data-city-hero-active");
    }
  }, []);

  // Pre-hydration: render nothing (avoids flash of wrong hero)
  if (variant === null) return <div className="h-[100svh] min-h-[620px]" />;

  if (variant === "city") {
    return (
      <>
        <CityHero locale={locale} />
        {/* Logo strip sits below the city hero */}
        <div className="relative z-10">{logoStrip}</div>
      </>
    );
  }

  return (
    <>
      <section className="relative flex min-h-[calc(100svh-4.25rem)] flex-col overflow-hidden">
        <div className="relative flex flex-1 flex-col justify-start overflow-hidden pt-4 sm:pt-6 lg:justify-center lg:pt-0">
          <HomeHero left={left} accent={accent} alts={alts} />
        </div>
        <div className="relative z-10">{logoStrip}</div>
      </section>
    </>
  );
}