import { mediaSrc, safeHttpUrl, type LinkPreview } from "@/lib/socialFormat";

/** The link card under a post: image, site, title and description, one tab stop. */
export function LinkPreviewCard({ link }: { link: LinkPreview }) {
  const href = safeHttpUrl(link.url);
  if (!href) return null;
  const image = mediaSrc(link.image);
  let site = link.site;
  if (!site) {
    try {
      site = new URL(href).hostname.replace(/^www\./, "");
    } catch {
      site = "";
    }
  }
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow ugc"
      className="group/link block overflow-hidden border-y border-black/[0.06] bg-grey/50 transition-colors hover:bg-grey focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-purple dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06] dark:focus-visible:outline-light-purple"
    >
      {image && (
        <span className="block aspect-[1.91/1] overflow-hidden bg-grey dark:bg-white/[0.06]">
          <img
            src={image}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/link:scale-[1.02]"
          />
        </span>
      )}
      <span className="block px-4 py-3">
        {site && (
          <span className="block truncate text-[11px] font-medium uppercase tracking-[0.12em] text-ink/50 dark:text-white/50">{site}</span>
        )}
        <span className="mt-1 line-clamp-2 block text-[15px] font-medium leading-snug text-ink group-hover/link:text-purple dark:text-white dark:group-hover/link:text-light-purple">
          {link.title || href}
        </span>
        {link.description && (
          <span className="mt-1 line-clamp-2 block text-[13px] leading-relaxed text-ink/60 dark:text-white/60">{link.description}</span>
        )}
      </span>
    </a>
  );
}
