export type ServiceSubItem = {
  fi: string;
  en: string;
  /** One plain-language line under the chip: what this service actually is. */
  desc_fi?: string;
  desc_en?: string;
};

export type ServiceCard = {
  number: string;
  icon: string;
  fi: { title: string; body: string };
  en: { title: string; body: string };
  /**
   * The named services sold under this category. Rendered inside the card's
   * expansion — a chip plus a one-line description each — on both the home and
   * services pages.
   *
   * Both locales live here beside the card's own title/body — the same file is
   * already the FI/EN source for service copy, and splitting the sub-items into
   * dictionary.ts would mean two index-aligned arrays that can silently drift.
   */
  items?: ServiceSubItem[];
  /**
   * The concrete deliverables the expansion closes on: "what you get" when you
   * buy this category. Skipped when empty.
   */
  outcomes?: { fi: string[]; en: string[] };
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
      { fi: "Tunnettuustutkimukset", en: "Brand awareness studies", desc_fi: "Mittaatko oikeita asioita? Rakennamme tunnettuus- ja brändimittarit, joiden pohjalta mediaa voidaan ohjata.", desc_en: "Are you measuring the right things? We build awareness and brand metrics that media decisions can hang on." },
      { fi: "Kohderyhmätutkimukset", en: "Audience research", desc_fi: "Kuka oikeasti ostaa sinulta — ja mitä mediaa hän kuluttaa? Kohderyhmän koostumus paneelidatalla, ei mutulla.", desc_en: "Who actually buys from you — and what media do they use? Audience composition from panel data, not guesswork." },
      { fi: "Mediankäyttötutkimukset – NØRR3 Media Insights", en: "Media usage studies – NØRR3 Media Insights", desc_fi: "Oma työkalumme, joka näyttää kanavien tavoittavuuden ja pintasivat suhteessa juuri sinun yleisöösi.", desc_en: "Our own tool showing channel reach and pricing against your specific audience." },
    ],
    outcomes: {
      fi: ["Kohderyhmämääritys ja insight-raportti", "Mediasuunnitelman strateginen raami", "Mittarit ja tavoitteet kampanjalle"],
      en: ["Audience definition and insight report", "The strategic frame for the media plan", "Metrics and goals for the campaign"],
    },
  },
  {
    number: "02",
    icon: "monitoring",
    fi: { title: "Data & Mittaus", body: "Optimaalisen mediastrategian rakentaminen alkaa datasta — ja päättyy siihen, että tulos on todennettu." },
    en: { title: "Data & Measurement", body: "Building an optimal media strategy starts with data — and ends with the result actually verified." },
    items: [
      { fi: "NØRR3 Dashboard", en: "NØRR3 Dashboard", desc_fi: "Asiakasportaali, jossa kampanjoiden tulokset näkyvät reaaliajassa — ei odottelua raportointikierroon asti.", desc_en: "A client portal where campaign results show in real time — no waiting for the reporting round." },
      { fi: "Konversiomittaus", en: "Conversion measurement", desc_fi: "Todennamme mitä media oikeasti tuottaa: mittaukset Myynti-/CRM-dataan asti, ei vain klikkejä.", desc_en: "We verify what media actually produces: measurement all the way to sales/CRM data, not just clicks." },
    ],
    outcomes: {
      fi: ["Todentamisen malli ja mittaripuu", "Reaaliaikainen näkyvyys tuloksiin", "Optimointisuositukset datan pohjalta"],
      en: ["A verification model and metric tree", "Real-time visibility into results", "Data-driven optimization recommendations"],
    },
  },
  {
    number: "03",
    icon: "travel_explore",
    fi: { title: "SEO, GEO & SEM", body: "Löydyt sieltä, mistä sinua etsitään — hakukoneista ja yhä useammin myös tekoälyn vastauksista." },
    en: { title: "SEO, GEO & SEM", body: "Be found where you are searched for — in search engines and, increasingly, in AI answers too." },
    items: [
      { fi: "Hakukonelöydettävyys", en: "Search engine discoverability", desc_fi: "Tekninen ja sisällöllinen SEO: sivustosi nousee sinne, missä päätökset tehdään.", desc_en: "Technical and content SEO: your site rises where the decisions are made." },
      { fi: "AI-löydettävyys", en: "AI discoverability", desc_fi: "Tekoälyavustajat (ChatGPT, Gemini) suosittelevat yhä useammin — varmistetaan että ne suosittelevat sinua.", desc_en: "AI assistants (ChatGPT, Gemini) increasingly recommend brands — we make sure they recommend you." },
      { fi: "Hakukonemainonta", en: "Search engine advertising", desc_fi: "Google- ja Bing-mainonta, joka nappaa kysynnän siellä missä se syntyy.", desc_en: "Google and Bing advertising that captures demand where it's born." },
      { fi: "Auditit", en: "Audits", desc_fi: "Tekninen ja sisältöaudit: miksi et löydy — ja mitä korjataan ensin.", desc_en: "Technical and content audit: why you're not found — and what to fix first." },
    ],
    outcomes: {
      fi: ["Löydettävyysaudit ja korjauslista", "Näkyvyys kasvussa hakutuloksissa ja AI-vastauksissa", "Jatkuva seuranta ja raportointi"],
      en: ["Discoverability audit and fix list", "Growth in search results and AI answers", "Continuous tracking and reporting"],
    },
  },
  {
    number: "04",
    icon: "paid",
    fi: { title: "Mediapalvelut", body: "Kokenut tiimimme suunnittelee, ostaa ja optimoi sinulle tuloksia kaikissa median kanavissa." },
    en: { title: "Media Services", body: "Our experienced team plans, buys and optimizes results for you across every media channel." },
    items: [
      { fi: "Mediasuunnittelu ja -osto", en: "Media planning and buying", desc_fi: "Kanavaviestämätön suunnitelma ja ostovoima — TV:stä DOOH:iin ja sosiaalisesta mediaan.", desc_en: "A channel-agnostic plan and buying power — from TV to DOOH and social." },
      { fi: "Kampanja- ja jatkuva mainonta", en: "Campaign and always-on advertising", desc_fi: "Sekä isot lanseerausponnistukset että ympärivuotinen näkyvyys, joka ei pääse katkeamaan.", desc_en: "Both big launch pushes and year-round visibility that never breaks." },
    ],
    outcomes: {
      fi: ["Mediamix ja budjettiraami", "Neuvotellut mediatalosopimukset", "Optimointi lennossa kampanjan aikana"],
      en: ["Media mix and budget frame", "Negotiated media house agreements", "In-flight optimization during the campaign"],
    },
  },
  {
    number: "05",
    icon: "trending_up",
    fi: { title: "Performance Marketing", body: "Tulospohjainen mainonta on tehokas tapa tavoittaa kohdeyleisö ja saada konkreettisia tuloksia." },
    en: { title: "Performance Marketing", body: "Performance-based advertising is an effective way to reach the target audience and get concrete results." },
    items: [
      { fi: "Dynamisen markkinoinnin palvelut", en: "Dynamic marketing services", desc_fi: "Personoitu mainonta, joka rakentuu tuote- ja asiakasdatasta — tuhansia versioita yhdestä masterista.", desc_en: "Personalized advertising built from product and customer data — thousands of versions from one master." },
      { fi: "Performance markkinoinnin palvelut", en: "Performance marketing services", desc_fi: "Tulosvastuinen ostaminen: hinta per konversio, ei per näyttö.", desc_en: "Accountable buying: price per conversion, not per impression." },
    ],
    outcomes: {
      fi: ["Personoidut aineistot ja automaatio", "Hintatehokkuus per konversio", "Skaalautuva malli kasvuun"],
      en: ["Personalized creatives and automation", "Cost efficiency per conversion", "A scalable model for growth"],
    },
  },
  {
    number: "06",
    icon: "rocket_launch",
    fi: { title: "Marketing Engine", body: "Yksi alusta, joka yhdistää datan, tekoälyn ja monikanavaisen toteutuksen briiffistä tuloksiin." },
    en: { title: "Marketing Engine", body: "One platform connecting data, AI and multichannel execution — from brief to results." },
    items: [
      { fi: "Esittely & demo", en: "Presentation & demo", desc_fi: "30 minuuttia, oma mediallasi ajettuna läpi — ilman myyntiputkea.", desc_en: "30 minutes, run through with your own media — no sales funnel." },
      { fi: "Appit", en: "Apps", desc_fi: "Briiffistä toteutukseen: työkalut joilla kampanja rakennetaan, ostetaan ja todennetaan.", desc_en: "From brief to execution: the tools a campaign is built, bought and verified with." },
      { fi: "Hinnoittelu", en: "Pricing", desc_fi: "Lisensoitava alusta, skaalautuu käyttöön — ei kertamaksua vaan jatkuva hyöty.", desc_en: "A licensable platform that scales with use — not a one-off fee but continuous value." },
    ],
    outcomes: {
      fi: ["Yksi alusta kaikille kanaville", "Automaatio vähentää manuaalista työtä", "Reaaliaikainen ohjaus budjetilla"],
      en: ["One platform for all channels", "Automation cutting manual work", "Real-time budget steering"],
    },
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
