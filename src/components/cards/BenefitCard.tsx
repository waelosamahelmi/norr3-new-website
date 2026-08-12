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
      <div className="flex h-full flex-col gap-5 rounded-[5px] bg-grey/70 p-7">
        <div className="flex h-[64px] w-[64px] items-center justify-center rounded-[5px] bg-yellow text-ink">
          <Icon name={icon} style={{ fontSize: "28px" }} />
        </div>
        <div>
          <h3 className="text-base font-medium text-ink">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/60">{body}</p>
        </div>
      </div>
    </HoverLift>
  );
}
