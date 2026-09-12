"use client";

import { useState } from "react";
import { BookingModal } from "@/components/BookingModal";
import { PillButton } from "@/components/PillButton";
import type { Locale } from "@/i18n/config";
import { track } from "@/lib/track";

/**
 * A CTA button that opens its booking modal. Variants mirror PillButton's so
 * it can drop into any existing button row unchanged.
 */
export function BookingButton({
  kind,
  locale,
  variant = "primary",
  children,
}: {
  kind: "demo" | "meeting";
  locale: Locale;
  variant?: "primary" | "secondary" | "lavender" | "outlineLight";
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <PillButton variant={variant} onClick={() => {
          track("booking_open", { booking_kind: kind });
          setOpen(true);
        }}>
        {children}
      </PillButton>
      <BookingModal kind={kind} locale={locale} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
