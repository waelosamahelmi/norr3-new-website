import { Icon } from "@/components/Icon";
import { mediaSrc, safeHttpUrl, type PortfolioItem } from "@/lib/socialFormat";

const focusRing =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple dark:focus-visible:outline-light-purple";

/** Portfolio work: image, title, description, and the whole tile links out when there is a URL. */
export function PortfolioGrid({ items, openLabel }: { items: PortfolioItem[]; openLabel: string }) {
  const shown = items.filter((item) => item.title || item.image);
  if (shown.length === 0) return null;
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {shown.map((item, i) => {
        const href = safeHttpUrl(item.url) ?? (item.url.startsWith("/") ? item.url : null);
        const image = mediaSrc(item.image);
        const inner = (
          <>
            <span className="block aspect-[16/10] overflow-hidden rounded-card bg-grey dark:bg-white/[0.06]">
              {image ? (
                <img
                  src={image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/work:scale-[1.04]"
                />
              ) : (
                <span aria-hidden className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pastel-purple to-light-purple text-4xl font-medium text-white/90 dark:from-violet/60 dark:to-purple/40">
                  {item.title.slice(0, 1)}
                </span>
              )}
            </span>
            <span className="mt-3 flex items-start justify-between gap-3">
              <span className="text-[15px] font-medium leading-snug text-ink group-hover/work:text-purple dark:text-white dark:group-hover/work:text-light-purple">
                {item.title}
              </span>
              {href && (
                <span className="mt-0.5 inline-flex shrink-0 items-center gap-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-ink/50 dark:text-white/50">
                  {openLabel}
                  <Icon name="arrow_outward" style={{ fontSize: "14px" }} />
                </span>
              )}
            </span>
            {item.description && (
              <span className="mt-1 line-clamp-3 block text-[13.5px] leading-relaxed text-ink/60 dark:text-white/60">{item.description}</span>
            )}
          </>
        );
        return (
          <li key={`${item.title}-${i}`}>
            {href ? (
              <a
                href={href}
                {...(href.startsWith("/") ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                className={`group/work block rounded-card ${focusRing}`}
              >
                {inner}
              </a>
            ) : (
              <div className="group/work">{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
