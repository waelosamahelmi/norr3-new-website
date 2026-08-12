export type ServiceCard = {
  number: string;
  icon: string;
  highlighted?: boolean;
  fi: { title: string; body: string };
  en: { title: string; body: string };
};

// The six service cards from the Figma "Services" grid — card 02 is the
// purple highlighted variant in the design.
export const serviceCards: ServiceCard[] = [
  {
    number: "01",
    icon: "zoom_in_map",
    fi: { title: "Insight & Strategy", body: "Meiltä saat tehokasta ja liiketoimintalähtöistä strategiatyötä kohderyhmä-, kilpailija- ja mediatarpeisiin." },
    en: { title: "Insight & Strategy", body: "Effective, business-driven strategy work for audience, competitor and media needs." },
  },
  {
    number: "02",
    icon: "monitoring",
    highlighted: true,
    fi: { title: "Data & Analytics", body: "Optimaalisen mediastrategian rakentaminen alkaa tutkimalla saatavilla olevaa dataa." },
    en: { title: "Data & Analytics", body: "Building an optimal media strategy starts by studying the available data." },
  },
  {
    number: "03",
    icon: "paid",
    fi: { title: "Paid Media", body: "Kokenut tiimimme operoi ja optimoi sinulle tuloksia kaikissa maksetun mainonnan kanavissa." },
    en: { title: "Paid Media", body: "Our experienced team operates and optimizes results for you across all paid advertising channels." },
  },
  {
    number: "04",
    icon: "query_stats",
    fi: { title: "Measurement", body: "Laaja tutkimus- ja mittaustyökalupakkimme varmistaa ja todentaa suunnitelmat ja tulokset." },
    en: { title: "Measurement", body: "Our broad research and measurement toolkit verifies and validates plans and results." },
  },
  {
    number: "05",
    icon: "trending_up",
    fi: { title: "Performance Marketing", body: "Tulospohjainen mainonta on tehokas tapa tavoittaa kohdeyleisö ja saada konkreettisia tuloksia." },
    en: { title: "Performance Marketing", body: "Performance-based advertising is an effective way to reach the target audience and get concrete results." },
  },
  {
    number: "06",
    icon: "draw",
    fi: { title: "Creative Production", body: "Olemme erikoistuneet dynaamisiin ja html-aineistoihin sekä luovien A/B-testaukseen." },
    en: { title: "Creative Production", body: "We specialize in dynamic and HTML assets as well as creative A/B testing." },
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
