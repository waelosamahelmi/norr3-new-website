import Link from "next/link";
import type { Insight } from "@/content/insights";
import type { Locale } from "@/i18n/config";

/**
 * Blog card per Figma: a photo OR a lavender tile with a giant ghost figure,
 * then date, title, excerpt and a "Read more →" text link.
 */
export function BlogCard({
  post,
  locale,
  readMoreLabel,
}: {
  post: Insight;
  locale: Locale;
  readMoreLabel: string;
}) {
  const content = post[locale];
  return (
    <Link href={`/${locale}/insights/${post.slug}`} className="group flex h-full flex-col">
      <div className="aspect-[5/4] overflow-hidden">
        {post.image ? (
          <img
            src={post.image}
            alt={content.title}
            className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-pastel-purple/70">
            <span className="select-none text-7xl font-medium text-white/80 lg:text-8xl">
              {post.ghost}
            </span>
          </div>
        )}
      </div>
      <p className="mt-4 text-xs text-ink/50">{post.date}</p>
      <h3 className="mt-1.5 text-base font-medium leading-snug text-ink">{content.title}</h3>
      <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-ink/60">{content.excerpt}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-ink transition-transform group-hover:translate-x-0.5">
        {readMoreLabel} <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
