import type { Metadata } from "next";
import { Host_Grotesk } from "next/font/google";
import "material-symbols/outlined.css";
import "./globals.css";

const hostGrotesk = Host_Grotesk({
  variable: "--font-host-grotesk",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://norr3.fi"),
  title: "NØRR3 — A new way to grow",
  description:
    "NØRR3 is a Nordic media agency turning media investments into growth and competitive advantage.",
  applicationName: "NØRR3",
  openGraph: {
    type: "website",
    siteName: "NØRR3",
    title: "NØRR3 — A new way to grow",
    description:
      "NØRR3 is a Nordic media agency turning media investments into growth and competitive advantage.",
    images: [
      {
        url: "/images/brand/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "The NØRR3 team in the Helsinki studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NØRR3 — A new way to grow",
    description:
      "NØRR3 is a Nordic media agency turning media investments into growth and competitive advantage.",
    images: ["/images/brand/og-image.jpg"],
  },
  robots: { index: true, follow: true },
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
