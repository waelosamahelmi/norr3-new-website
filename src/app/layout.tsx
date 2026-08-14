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

/**
 * Runs before first paint so the stored theme is on <html> ahead of hydration —
 * without it the page paints light, then snaps to dark (FOUC). Kept
 * dependency-free and tiny on purpose; it ships inside every document.
 */
const THEME_SCRIPT = `try{var t=localStorage.getItem("norr3-theme");var d=t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d)}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the script above mutates <html>'s class list
    // before React hydrates, so the client class never matches the SSR one.
    <html
      lang="fi"
      className={`${hostGrotesk.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-offwhite text-ink dark:bg-background dark:text-foreground">
        {children}
      </body>
    </html>
  );
}
