import { Icon } from "@/components/Icon";
import { Reveal } from "@/components/Reveal";

/**
 * The three principles as equal cards side by side in a simple 3-column grid
 * (stacking to one column on small screens). Replaces the earlier triangle
 * arrangement. The line about what the three add up to is rendered by the
 * page's section header, not here.
 */

export type Principle = { icon: string; title: string; body: string };

export function PrinciplesGrid({ items }: { items: Principle[] }) {
  return (
    <div className="grid gap-card-gap sm:grid-cols-3">
      {items.map((p, i) => (
        <PrincipleCard key={p.title} principle={p} index={i} />
      ))}
    </div>
  );
}

function PrincipleCard({ principle, index }: { principle: Principle; index: number }) {
  return (
    <Reveal delay={index * 0.12} className="h-full">
      <div className="flex h-full flex-col gap-6 rounded-card bg-white p-card-pad ring-1 ring-black/[0.06] dark:bg-[#141118] dark:ring-white/10">
        <div className="flex items-center justify-between">
          {/* Violet tile + white icon — the brand icon-tile treatment,
              identical in both themes. */}
          <div className="flex h-[64px] w-[64px] items-center justify-center rounded-[5px] bg-violet text-white">
            <Icon name={principle.icon} style={{ fontSize: "28px" }} />
          </div>
          <span className="text-[12px] font-medium tabular-nums tracking-[0.14em] text-purple dark:text-light-purple">
            0{index + 1}
          </span>
        </div>
        <div>
          <h3 className="text-lg font-medium text-ink dark:text-white">{principle.title}</h3>
          <p className="mt-2.5 text-sm leading-relaxed text-ink/65 dark:text-white/65">{principle.body}</p>
        </div>
      </div>
    </Reveal>
  );
}