"use client";

import { motion } from "framer-motion";
import { audienceChannels, type AudienceChannel } from "@/content/datasets";

/**
 * The "NØRR3 Media Insights" grouped bar chart from the Figma black section:
 * men vs women (15–29) media use by channel, bars growing on scroll into view.
 * The figures are illustrative panel data and are managed in the CMS; the
 * bundled list is the fallback.
 */
export function AudienceChart({
  legendMen,
  legendWomen,
  description,
  channels = audienceChannels,
}: {
  legendMen: string;
  legendWomen: string;
  /** Text alternative — the bars carry no accessible content on their own. */
  description: string;
  channels?: AudienceChannel[];
}) {
  return (
    <figure
      role="img"
      aria-label={description}
      className="rounded-card bg-white p-5 sm:p-8"
    >
      <div className="mb-6 flex items-center justify-center gap-6 text-[11px] text-ink/70">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-4 bg-purple" /> {legendMen}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-4 bg-light-purple" /> {legendWomen}
        </span>
      </div>
      <div className="flex h-44 items-end gap-1.5 sm:h-56 sm:gap-2.5">
        {channels.map((c, i) => (
          <div key={c.name} className="flex h-full flex-1 flex-col justify-end">
            <div className="flex h-full items-end justify-center gap-[2px]">
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${c.men}%` }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.03, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-3 bg-purple"
              />
              <motion.div
                initial={{ height: 0 }}
                whileInView={{ height: `${c.women}%` }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.7, delay: i * 0.03 + 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-3 bg-light-purple"
              />
            </div>
            <p className="mt-2 origin-top-left -rotate-45 whitespace-nowrap text-[8px] text-ink/50 sm:text-[9px]">
              {c.name}
            </p>
          </div>
        ))}
      </div>
      <div className="h-6" />
    </figure>
  );
}
