import Link from "next/link";

/**
 * The tertiary CTA from the brand system: plain text + arrow, no chrome
 * (BRAND_GUIDELINES §5). Used as the secondary action under page heroes next
 * to the primary pill, and between sections — a way to move deeper into the
 * page without adding another button.
 */
export function TextCta({
  href,
  children,
  className = "",
  tone = "ink",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** `ink` for light surfaces, `white` for coloured bands / photo overlays. */
  tone?: "ink" | "white";
}) {
  const tones = {
    ink: "text-ink dark:text-white hover:text-purple dark:hover:text-light-purple",
    white: "text-white hover:text-white",
  };
  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-2 rounded-sm text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
        tone === "white" ? "focus-visible:outline-white" : "focus-visible:outline-purple dark:focus-visible:outline-light-purple"
      } ${tones[tone]} ${className}`}
    >
      {children}
      <span
        aria-hidden
        className="inline-block transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
