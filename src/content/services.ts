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

// The six service categories per Wael's 2026-08-25 service map. Products are
// no longer boxes: the Marketing Engine lives in its own band below the grid
// (see the Services page), so box 06 is now the fixed-price Audits & Projects.
// Boxes 01, 05 and 06 carry no search demand on purpose — they are reached via
// the hub and sales conversations, not optimised for keywords.
export const serviceCards: ServiceCard[] = [
  {
    number: "01",
    icon: "strategy",
    fi: { title: "Insight & Strategia", body: "Liiketoimintalähtöistä strategiatyötä — kohderyhmästä ja kilpailijoista mediankäyttöön." },
    en: { title: "Insight & Strategy", body: "Business-driven strategy work — from audience and competitors to media behaviour." },
    items: [
      { fi: "Brändi- ja tunnettuusseuranta", en: "Brand & awareness tracking", desc_fi: "Mittarit, joiden pohjalta mediaa voidaan ohjata — ei arvailua.", desc_en: "The metrics media decisions can hang on — not guesswork." },
      { fi: "Kohderyhmätutkimus", en: "Audience research", desc_fi: "Kuka oikeasti ostaa sinulta — ja mitä mediaa hän kuluttaa.", desc_en: "Who actually buys from you — and what media they use." },
      { fi: "Mediankäyttötutkimus", en: "Media consumption research", desc_fi: "Kanavien tavoittavuus ja hinta suhteessa juuri sinun yleisöösi.", desc_en: "Channel reach and pricing against your specific audience." },
      { fi: "Mediastrategia", en: "Media strategy", desc_fi: "Strateginen raami, joka kääntää tavoitteet mediaksi.", desc_en: "The strategic frame that turns goals into media." },
    ],
  },
  {
    number: "02",
    icon: "campaign",
    fi: { title: "Mediapalvelut", body: "Suunnittelemme, ostamme ja optimoimme tuloksia kaikissa median kanavissa." },
    en: { title: "Media Services", body: "We plan, buy and optimise results across every media channel." },
    items: [
      { fi: "Mediasuunnittelu ja -ostaminen", en: "Media planning & buying", desc_fi: "Kanavariippumaton suunnitelma ja ostovoima — TV:stä DOOH:iin ja sosiaaliseen mediaan.", desc_en: "A channel-agnostic plan and buying power — from TV to DOOH and social." },
      { fi: "Ohjelmallinen ostaminen", en: "Programmatic buying", desc_fi: "Display, ulkomainonta/pDOOH, video, audio, DCO — kaikki, mikä ostetaan ohjelmallisesti.", desc_en: "Display, out-of-home/pDOOH, video, audio, DCO — everything buyable programmatically." },
      { fi: "Kampanja- ja jatkuva mainonta", en: "Campaign & always-on advertising", desc_fi: "Isot lanseeraukset ja ympärivuotinen näkyvyys, joka ei katkea.", desc_en: "Big launch pushes and year-round visibility that never breaks." },
    ],
  },
  {
    number: "03",
    icon: "trending_up",
    fi: { title: "Performance Marketing", body: "Tulospohjaista mainontaa, joka tuottaa konkreettisia tuloksia." },
    en: { title: "Performance Marketing", body: "Performance-based advertising that produces concrete results." },
    items: [
      { fi: "Tulospohjainen ostaminen", en: "Performance-based buying", desc_fi: "Tulosvastuinen ostaminen: hinta per konversio, ei per näyttö.", desc_en: "Accountable buying: price per conversion, not per impression." },
      { fi: "Dynaaminen ja personoitu mainonta", en: "Dynamic & personalised advertising", desc_fi: "Tuhansia versioita yhdestä masterista tuote- ja asiakasdatan pohjalta.", desc_en: "Thousands of versions from one master, driven by product and customer data." },
      { fi: "Aineistojen automaatio", en: "Asset automation", desc_fi: "Aineistot päivittyvät itsestään syötteestä — ei manuaalisia kierroksia.", desc_en: "Assets update themselves from the feed — no manual rounds." },
    ],
  },
  {
    number: "04",
    icon: "search",
    fi: { title: "Hakukoneoptimointi & hakumainonta", body: "Löydyt sieltä, mistä sinua etsitään — hakukoneissa ja tekoälyn vastauksissa." },
    en: { title: "SEO & Search Advertising", body: "Be found where you're searched for — in search engines and AI answers." },
    items: [
      { fi: "Hakukoneoptimointi", en: "Search engine optimisation", desc_fi: "Tekninen ja sisällöllinen SEO, joka nostaa orgaanista näkyvyyttä.", desc_en: "Technical and content SEO that lifts organic visibility." },
      { fi: "Hakukonemarkkinointi", en: "Search advertising", desc_fi: "Hakutulosten kärkeen mainoksilla — siellä, missä ostoaikeus on korkein.", desc_en: "The top of search results with ads — where purchase intent is highest." },
      { fi: "GEO / AI-löydettävyys", en: "GEO / AI discoverability", desc_fi: "Tekoälyavustajat suosittelevat yhä useammin — varmistamme, että ne suosittelevat sinua.", desc_en: "AI assistants increasingly recommend brands — we make sure they recommend you." },
    ],
  },
  {
    number: "05",
    icon: "monitoring",
    fi: { title: "Data & Mittaus", body: "Optimaalinen mediastrategia alkaa datasta — ja päättyy todennettuun tulokseen." },
    en: { title: "Data & Measurement", body: "An optimal media strategy starts with data — and ends with a verified result." },
    items: [
      { fi: "Konversiomittaus", en: "Conversion measurement", desc_fi: "Mittaus myynti-/CRM-dataan asti — ei vain klikkejä.", desc_en: "Measurement all the way to sales/CRM data — not just clicks." },
      { fi: "Mittausmalli ja todentaminen", en: "Measurement model & verification", desc_fi: "Mittaripuu, joka todentaa mitä media oikeasti tuottaa.", desc_en: "A metric tree that verifies what media actually produces." },
      { fi: "Data layer ja integraatiot", en: "Data layer and integrations", desc_fi: "Tuote-, varasto-, CRM- ja kampanjadata yhteen ketjuun.", desc_en: "Product, inventory, CRM and campaign data into one chain." },
    ],
  },
  {
    number: "06",
    icon: "fact_check",
    fi: { title: "Auditit & projektit", body: "Kiinteähintaisia, kestoltaan rajattuja toimeksiantoja — tiedät etukäteen mitä maksat ja milloin valmistuu." },
    en: { title: "Audits & Projects", body: "Fixed-price, fixed-duration work — you know the cost and the deadline up front." },
    items: [
      { fi: "AI & Marketing Readiness Audit", en: "AI & Marketing Readiness Audit", desc_fi: "2–3 vkoa", desc_en: "2–3 wks" },
      { fi: "Data Consolidation", en: "Data Consolidation", desc_fi: "3–4 vkoa", desc_en: "3–4 wks" },
      { fi: "Search & GEO Audit", en: "Search & GEO Audit", desc_fi: "2 vkoa", desc_en: "2 wks" },
      { fi: "Some Audit", en: "Some Audit", desc_fi: "2 vkoa", desc_en: "2 wks" },
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
