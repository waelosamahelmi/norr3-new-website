import { Icon } from "@/components/Icon";

/** Purple culture-principle card (Team page "Our Culture"). */
export function CultureCard({
  number,
  icon,
  title,
  body,
}: {
  number: string;
  icon: string;
  title: string;
  body: string;
}) {
  return (
    <div className="flex h-full flex-col items-center gap-4 rounded-[5px] bg-purple px-7 pb-8 pt-20 text-center text-white">
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[5px] bg-yellow text-ink">
        <Icon name={icon} style={{ fontSize: "32px" }} />
      </div>
      <span className="text-2xl font-medium text-yellow">{number}</span>
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm leading-relaxed text-white/80">{body}</p>
    </div>
  );
}
