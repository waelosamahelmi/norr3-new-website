export type ServiceCard = {
  number: string;
  icon: string;
  fi: { title: string; body: string };
  en: { title: string; body: string };
  /**
   * The named services sold under this category. Rendered as chips inside the
   * card on the Services page; the home page shows the categories alone, so the
   * short grid there stays a summary rather than a price list.
   *
   * Both locales live here beside the card's own title/body — the same file is
   * already the FI/EN source for service copy, and splitting the sub-items into
   * dictionary.ts would mean two index-aligned arrays that can silently drift.
   */
  items?: { fi: string; en: string }[];
};

// The six service categories per Antti's service map. The purple treatment
// once pinned to card 02 by a flag here is now a hover state on every card
// (see ServiceCard.tsx) — no card is special-cased any more.
export const serviceCards: ServiceCard[] = [
  {
    number: "01",
    icon: "zoom_in_map",
    fi: { title: "Insight & Strategia", body: "Meiltä saat tehokasta ja liiketoimintalähtöistä strategiatyötä kohderyhmä-, kilpailija- ja mediatarpeisiin." },
    en: { title: "Insight & Strategy", body: "Effective, business-driven strategy work for audience, competitor and media needs." },
    items: [
      { fi: "Tunnettuustutkimukset", en: "Brand awareness studies" },
      { fi: "Kohderyhmätutkimukset", en: "Audience research" },
      { fi: "Mediankäyttötutkimukset – NØRR3 Media Insights", en: "Media usage studies – NØRR3 Media Insights" },
    ],
  },
  {
    number: "02",
    icon: "monitoring",
    fi: { title: "Data & Mittaus", body: "Optimaalisen mediastrategian rakentaminen alkaa datasta — ja päättyy siihen, että tulos on todennettu." },
    en: { title: "Data & Measurement", body: "Building an optimal media strategy starts with data — and ends with the result actually verified." },
    items: [
      { fi: "NØRR3 Dashboard", en: "NØRR3 Dashboard" },
      { fi: "Konversiomittaus", en: "Conversion measurement" },
    ],
  },
  {
    number: "03",
    icon: "travel_explore",
    fi: { title: "SEO, GEO & SEM", body: "Löydyt sieltä, mistä sinua etsitään — hakukoneista ja yhä useammin myös tekoälyn vastauksista." },
    en: { title: "SEO, GEO & SEM", body: "Be found where you are searched for — in search engines and, increasingly, in AI answers too." },
    items: [
      { fi: "Hakukonelöydettävyys", en: "Search engine discoverability" },
      { fi: "AI-löydettävyys", en: "AI discoverability" },
      { fi: "Hakukonemainonta", en: "Search engine advertising" },
      { fi: "Auditit", en: "Audits" },
    ],
  },
  {
    number: "04",
    icon: "paid",
    fi: { title: "Mediapalvelut", body: "Kokenut tiimimme suunnittelee, ostaa ja optimoi sinulle tuloksia kaikissa median kanavissa." },
    en: { title: "Media Services", body: "Our experienced team plans, buys and optimizes results for you across every media channel." },
  },
  {
    number: "05",
    icon: "trending_up",
    fi: { title: "Performance Marketing", body: "Tulospohjainen mainonta on tehokas tapa tavoittaa kohdeyleisö ja saada konkreettisia tuloksia." },
    en: { title: "Performance Marketing", body: "Performance-based advertising is an effective way to reach the target audience and get concrete results." },
    items: [
      { fi: "Dynamisen markkinoinnin palvelut", en: "Dynamic marketing services" },
      { fi: "Performance markkinoinnin palvelut", en: "Performance marketing services" },
    ],
  },
  {
    number: "06",
    icon: "rocket_launch",
    fi: { title: "Marketing Engine", body: "Yksi alusta, joka yhdistää datan, tekoälyn ja monikanavaisen toteutuksen briiffistä tuloksiin." },
    en: { title: "Marketing Engine", body: "One platform connecting data, AI and multichannel execution — from brief to results." },
    items: [
      { fi: "Esittely & demo", en: "Presentation & demo" },
      { fi: "Appit", en: "Apps" },
      { fi: "Hinnoittelu", en: "Pricing" },
    ],
  },
];

// Media/values pill rows (the colorful scrolling chips). Colors cycle through
// the brand set the way the Figma hero row does.
export const mediaPills: { id: string; icon: string; fi: string; en: string }[] = [
  { id: "vision", icon: "tv", fi: "Vision", en: "Vision" },
  { id: "streaming", icon: "live_tv", fi: "Streaming", en: "Streaming" },
  { id: "social", icon: "share", fi: "Social Media", en: "Social Media" },
  { id: "radio", icon: "graphic_eq", fi: "Radio", en: "Radio" },
  { id: "display", icon: "grid_view", fi: "Display", en: "Display" },
  { id: "ooh", icon: "location_on", fi: "Ulkomainonta", en: "Out-of-home" },
  { id: "search", icon: "search", fi: "Haku", en: "Search" },
  { id: "print", icon: "newspaper", fi: "Printti", en: "Print" },
];

export const valuePills: { id: string; icon: string; fi: string; en: string }[] = [
  { id: "together", icon: "diversity_3", fi: "Yhdessä", en: "Together" },
  { id: "experiment", icon: "science", fi: "Kokeileminen", en: "Experimentation" },
  { id: "courage", icon: "bolt", fi: "Rohkeus", en: "Courage" },
  { id: "independence", icon: "self_improvement", fi: "Itsenäisyys", en: "Independence" },
  { id: "learning", icon: "school", fi: "Oppiminen", en: "Learning" },
];

// Clients — used for the logo strip and the black Highlights band.
export const clients = [
  "ST1",
  "Kokkola",
  "Metsä Forest",
  "RedGO",
  "Helsinki",
  "Flow Festival",
  "Terveystalo",
  "Kiinteistömaailma",
  "HelmiSimpukka",
  "Shell",
  "Perfect Autopesu",
  "Tre Kronor Media",
];
