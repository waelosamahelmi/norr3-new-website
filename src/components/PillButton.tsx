import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "lavender" | "text";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium uppercase tracking-[0.08em] text-xs transition-[transform,background-color,color] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.97]";

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-white rounded-full px-6 py-3 hover:bg-purple dark:bg-purple dark:hover:bg-violet",
  secondary:
    "bg-transparent text-ink border border-ink/60 rounded-full px-6 py-3 hover:bg-ink hover:text-white dark:text-white dark:border-white/50 dark:hover:bg-white dark:hover:text-ink",
  lavender: "bg-light-purple text-ink rounded-full px-6 py-3 hover:bg-white",
  text: "text-ink normal-case tracking-normal font-normal text-sm hover:text-purple dark:text-white dark:hover:text-light-purple",
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
        <span aria-hidden className="inline-block transition-transform duration-200 group-hover:translate-x-1">
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
