import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NØRR3",
    short_name: "NØRR3",
    description: "NØRR3 is a Nordic media agency turning media investments into growth and competitive advantage.",
    start_url: "/en",
    display: "standalone",
    background_color: "#f9f8f6",
    theme_color: "#7A06D3",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}