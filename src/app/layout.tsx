import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import "material-symbols/outlined.css";
import "./globals.css";

const hostGrotesk = Host_Grotesk({
  variable: "--font-host-grotesk",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "NØRR3 — A new way to grow",
  description:
    "NØRR3 is a Nordic media agency turning media investments into growth and competitive advantage.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fi" className={`${hostGrotesk.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-offwhite text-ink">
        {children}
      </body>
    </html>
  );
}
