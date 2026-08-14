import { Icon } from "@/components/Icon";
import { HoverLift } from "@/components/HoverLift";

/** Pale benefit card ("Miksi valita NØRR3 Media Insights?") — yellow tile, left-aligned. */
export function BenefitCard({
  icon,
  title,
  body,
}: {
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <HoverLift className="h-full" lift={3} scale={1.015}>
      {/* 25px card radius / 36px padding per BRAND_GUIDELINES §5. The 64px tile
          is the deliberate secondary scale — the 100px tile belongs to the
          numbered service cards, which outrank these. */}
      <div className="flex h-full flex-col gap-6 rounded-card bg-grey/70 p-card-pad dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10">
        <div className="flex h-[64px] w-[64px] items-center justify-center rounded-[5px] bg-yellow text-ink">
          <Icon name={icon} style={{ fontSize: "28px" }} />
        </div>
        <div>
          <h3 className="text-lg font-medium text-ink dark:text-white">{title}</h3>
          <p className="mt-2.5 text-sm leading-relaxed text-ink/65 dark:text-white/65">{body}</p>
        </div>
      </div>
    </HoverLift>
  );
}
