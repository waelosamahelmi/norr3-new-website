import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "lavender" | "outlineLight" | "outlineInk" | "text";

// Keyboard users got no visible focus state on the site's main CTA at all, so
// the ring lives in `base` and each variant only picks its ring colour — purple
// on the light/base surface, white on the coloured bands.
const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium uppercase tracking-[0.08em] text-xs transition-[transform,background-color,color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-white rounded-full px-6 py-3 hover:bg-purple dark:bg-purple dark:hover:bg-violet focus-visible:outline-purple dark:focus-visible:outline-light-purple",
  secondary:
    "bg-transparent text-ink border border-ink/60 rounded-full px-6 py-3 hover:bg-ink hover:text-white dark:text-white dark:border-white/50 dark:hover:bg-white dark:hover:text-ink focus-visible:outline-purple dark:focus-visible:outline-light-purple",
  lavender: "bg-light-purple text-ink rounded-full px-6 py-3 hover:bg-white focus-visible:outline-white",
  // For CTAs sitting on a purple/violet/ink band, where the outlined
  // `secondary` variant's ink border would disappear.
  outlineLight:
    "bg-transparent text-white border border-white/50 rounded-full px-6 py-3 hover:bg-white hover:text-ink focus-visible:outline-white",
  // For CTAs on surfaces that stay light in BOTH themes (yellow/lavender
  // bands), where `secondary`'s dark: overrides would go white-on-light.
  outlineInk:
    "bg-transparent text-ink border border-ink/60 rounded-full px-6 py-3 hover:bg-ink hover:text-white focus-visible:outline-ink",
  text: "text-ink normal-case tracking-normal font-normal text-sm hover:text-purple dark:text-white dark:hover:text-light-purple focus-visible:outline-purple dark:focus-visible:outline-light-purple",
};

export function PillButton({
  href,
  children,
  variant = "primary",
  className = "",
  onClick,
  type,
}: {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  const classes = `${base} ${variants[variant]} ${className}`;
  const content =
    variant === "text" ? (
      <>
        {children}
        <span
          aria-hidden
          className="inline-block transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
        >
          →
        </span>
      </>
    ) : (
      children
    );

  if (href) {
    return (
      <Link href={href} className={`group ${classes}`}>
        {content}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} onClick={onClick} className={`group ${classes}`}>
      {content}
    </button>
  );
}
