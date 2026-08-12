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

/** Small outlined hero badge ("SERVICES", "CUSTOMER CASES", "TEAM"). */
export function HeroPill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-purple/40 px-3.5 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-purple">
      {children}
    </span>
  );
}
