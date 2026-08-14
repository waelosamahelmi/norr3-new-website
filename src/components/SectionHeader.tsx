import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { PillButton } from "./PillButton";

/** Figma's recurring centered section intro: heading, two-line copy, black pill CTA. */
export function SectionHeader({
  heading,
  body,
  cta,
  ctaHref,
  tone = "dark",
}: {
  heading: ReactNode;
  body?: string;
  cta?: string;
  ctaHref?: string;
  tone?: "dark" | "light";
}) {
  return (
    <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
      <h2
        className={`text-4xl font-medium leading-[1.1] tracking-tight lg:text-5xl ${tone === "light" ? "text-white" : "text-ink dark:text-white"}`}
      >
        {heading}
      </h2>
      {/* Body sits at the brand body size (15/16px) — 14px read as fine print. */}
      {body && (
        <p className={`text-[15px] leading-relaxed lg:text-base ${tone === "light" ? "text-white/80" : "text-ink/70 dark:text-white/70"}`}>
          {body}
        </p>
      )}
      {cta && ctaHref && (
        <PillButton href={ctaHref} variant={tone === "light" ? "lavender" : "primary"}>
          {cta}
        </PillButton>
      )}
    </Reveal>
  );
}
