import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto max-w-[1600px] px-6 lg:px-14 ${className}`}>
      {children}
    </div>
  );
}

/** Small outlined hero badge ("SERVICES", "CUSTOMER CASES", "TEAM").
 *
 *  On the near-black dark base the brand purple is too dim for an 11px
 *  uppercase label, so the pill lightens to light-purple. Set `onLight` for
 *  pills that sit on a surface which stays light in dark mode (the contact
 *  page's yellow hero band) — there the purple ink is correct in both themes. */
export function HeroPill({ children, onLight = false }: { children: ReactNode; onLight?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border border-purple/40 px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-purple ${
        onLight ? "" : "dark:border-light-purple/50 dark:text-light-purple"
      }`}
    >
      {children}
    </span>
  );
}
