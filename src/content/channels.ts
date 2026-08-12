export type Channel = {
  id: string;
  icon: string;
  color: string;
  cpm: number;
  fi: string;
  en: string;
};

// Illustrative CPM baselines (EUR per 1,000 impressions) used to drive the
// media-mix simulator on the Engine page. Not real rate-card data.
export const channels: Channel[] = [
  { id: "social", icon: "share", color: "var(--color-accent-magenta)", cpm: 4.5, fi: "Sosiaalinen media", en: "Social Media" },
  { id: "streaming", icon: "live_tv", color: "var(--color-accent-blue)", cpm: 12, fi: "Streaming", en: "Streaming" },
  { id: "display", icon: "grid_view", color: "var(--color-accent-green)", cpm: 2.5, fi: "Display", en: "Display" },
  { id: "pdooh", icon: "location_on", color: "var(--color-accent-orange)", cpm: 8, fi: "Ulkomainonta (PDOOH)", en: "PDOOH" },
  { id: "audio", icon: "graphic_eq", color: "var(--color-accent-pink)", cpm: 6, fi: "Audio & radio", en: "Audio & Radio" },
  { id: "vision", icon: "tv", color: "var(--color-accent-red)", cpm: 15, fi: "Vision (TV)", en: "Vision (TV)" },
  { id: "search", icon: "search", color: "var(--color-purple)", cpm: 3.2, fi: "Haku", en: "Search" },
  { id: "distribution", icon: "call_split", color: "var(--color-violet)", cpm: 5, fi: "Jakelu", en: "Distribution" },
];

// Extra chip-only entries for the decorative scroll row (Home / Services hero) —
// mirrors the Figma pill+icon row, which lists more categories than the simulator needs.
export const mediaGroups: { id: string; icon: string; fi: string; en: string }[] = [
  { id: "vision", icon: "visibility", fi: "Vision", en: "Vision" },
  { id: "streaming", icon: "live_tv", fi: "Streaming", en: "Streaming" },
  { id: "social", icon: "share", fi: "Sosiaalinen media", en: "Social Media" },
  { id: "radio", icon: "graphic_eq", fi: "Radio", en: "Radio" },
  { id: "distribution", icon: "call_split", fi: "Jakelu", en: "Distribution" },
  { id: "display", icon: "grid_view", fi: "Display", en: "Display" },
  { id: "pdooh", icon: "location_on", fi: "Ulkomainonta", en: "Out-of-home" },
  { id: "search", icon: "search", fi: "Haku", en: "Search" },
];
