export type CaseMetric = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: { fi: string; en: string };
};

export type CaseGalleryImage = {
  src: string;
  alt: { fi: string; en: string };
  caption: { fi: string; en: string };
};

export type CaseStudy = {
  slug: string;
  client: string;
  image: string;
  size: "large" | "small";
  summary: { fi: string; en: string };
  tagline: { fi: string; en: string };
  intro: { fi: string; en: string };
  /**
   * The narrative sections. From the CMS these are sanitised HTML (headings,
   * lists, inline pictures); in this bundled fallback they are plain prose.
   * Render either through `proseHtml()`.
   */
  objectives: { fi: string; en: string };
  solution: { fi: string; en: string };
  methods: { icon: string; fi: { title: string; body: string }; en: { title: string; body: string } }[];
  results: { fi: string; en: string };
  metrics: CaseMetric[];
  /** Pictures attached to the case in the CMS, shown as a gallery on the page. */
  gallery?: CaseGalleryImage[];
  /**
   * The one headline figure the case card and the detail pull-quote lead with.
   * Always a restatement of one of `metrics` in badge-length form — never a new
   * claim — so the card, the quote and the results grid can never disagree.
   */
  kpi: CaseMetric;
  /** When true, the case-detail hero image uses the parallax scroll effect. */
  parallax?: boolean;
  /** Client testimonial shown as a quote block on the case detail page. */
  testimonial?: {
    author: string;
    role: { fi: string; en: string };
    text: { fi: string; en: string };
    /** Optional client logo or author portrait shown above the quote. */
    image?: string;
  } | null;
  /**
   * Marks the case the index opens with. Set in the CMS rather than here — the
   * bundled fallback leaves it unset and the index falls back to Flow Festival.
   */
  featured?: boolean;
  /** case_copies workbook: the campaign theme (e.g. "Lanseeraus") and the NØRR3
   *  products used, shown as chips on the detail page. */
  theme?: string;
  products?: string[];
  /** The Luova 1-4 creative lines, rendered as a "Luovat / Creative" block. */
  creatives?: { fi: string[]; en: string[] };
  /** The woven "tarinallinen versio" story — an editing reference in the CMS. */
  story?: { fi: string; en: string };
};

// Case imagery: real campaign photography from norr3.fi — each case leads with
// an authentic client-campaign shot, not stock. (Kiinteistömaailma gets the
// parallax treatment on its detail page via the `parallax` flag.)
export const cases: CaseStudy[] = [
  {
    slug: "flow-festival",
    client: "Flow Festival",
    image: "/images/cases/flow-festival.webp",
    size: "large",
    summary: {
      fi: "Flow Festivalin kansainvälinen kahden kuukauden mittainen kampanja keräsi yhteensä 27,5 miljoonaa mainosnäyttöä eri kanavissa. Display-mainonnan avulla tavoitettiin 5,5 miljoonaa potentiaalista festivaalikävijää ympäri Eurooppaa.",
      en: "Flow Festival's international two-month campaign gathered a total of 27.5 million ad impressions across channels. Display advertising reached 5.5 million potential festival-goers around Europe.",
    },
    tagline: {
      fi: "Flow Festival Eurooppaan display-mainonnan voimin.",
      en: "Taking Flow Festival to Europe on the strength of display.",
    },
    intro: {
      fi: "Kansainvälinen kahden kuukauden kampanja, joka vei suomalaisen festivaalin eurooppalaisen yleisön tietoisuuteen.",
      en: "An international two-month campaign that put a Finnish festival on the European audience's map.",
    },
    objectives: {
      fi: "Flow Festivalin tavoitteena oli kasvattaa kansainvälistä tunnettuutta ja lipunmyyntiä nuorten aikuisten kohderyhmässä ilman, että mediabudjetti kasvaisi edellisvuodesta.",
      en: "Flow Festival's objective was to grow international awareness and ticket sales among young adults without increasing the media budget from the previous year.",
    },
    solution: {
      fi: "Rakensimme monikanavaisen suunnitelman, joka yhdisti displayn, sosiaalisen median ja streamingin yhdeksi ostoksi — optimoiden budjettia reaaliajassa sen mukaan, mikä kanava tuotti parhaan hinnan per tavoitettu katsoja.",
      en: "We built a cross-channel plan combining display, social and streaming into a single buy — optimizing budget in real time toward whichever channel delivered the best cost per reached viewer.",
    },
    methods: [
      { icon: "schedule", fi: { title: "Datan keräys", body: "Yleisödata koottiin kampanjan pohjaksi ennen ensimmäistäkään mediaeuroa." }, en: { title: "Data collection", body: "Audience data was gathered as the campaign's foundation before a single media euro moved." } },
      { icon: "track_changes", fi: { title: "Analyysi", body: "Kanavakohtainen tavoittavuus- ja hinta-analyysi ohjasi painotuksia viikoittain." }, en: { title: "Analysis", body: "Channel-level reach and cost analysis steered the weighting weekly." } },
      { icon: "space_dashboard", fi: { title: "Mediastrategia ja panostukset", body: "Budjetti jaettiin skenaariomallien pohjalta ja optimoitiin lennossa." }, en: { title: "Media strategy & investment", body: "Budget was split on scenario models and optimized in flight." } },
    ],
    results: {
      fi: "Kampanja keräsi 27,5 miljoonaa mainosnäyttöä ja tavoitti 5,5 miljoonaa potentiaalista festivaalikävijää ympäri Eurooppaa — mediabudjetin pysyessä edellisvuoden tasolla.",
      en: "The campaign gathered 27.5 million ad impressions and reached 5.5 million potential festival-goers around Europe — with the media budget held flat year-over-year.",
    },
    metrics: [
      { value: 27.5, decimals: 1, label: { fi: "Miljoonaa mainosnäyttöä eri kanavissa", en: "Million ad impressions across channels" } },
      { value: 5.5, decimals: 1, label: { fi: "Miljoonaa tavoitettua festivaalikävijää", en: "Million festival-goers reached" } },
      { value: 0, suffix: " %", label: { fi: "Budjetin kasvua edellisvuoteen", en: "Budget growth year-over-year" } },
    ],
    kpi: { value: 27.5, decimals: 1, suffix: " M", label: { fi: "mainosnäyttöä", en: "ad impressions" } },
  },
  {
    slug: "oomi",
    client: "Oomi",
    // Placeholder path — the campaign shot is still to come from the client.
    image: "/images/cases/oomi.webp",
    size: "large",
    parallax: false,
    summary: {
      fi: "Oomi lanseerasi täysin uuden tuotteen, Oomi Mobiilin, laajalle kohderyhmälle. Laaja monikanavakampanja nosti näkyvyyttä ja hakuosuutta merkittävästi.",
      en: "Oomi launched an entirely new product, Oomi Mobiili, to a wide audience. A broad multichannel campaign significantly boosted visibility and search share.",
    },
    tagline: {
      fi: "Uuden tuotteen lanseeraus monikanavaisesti",
      en: "Launching a new product across every channel",
    },
    intro: {
      fi: "Oomi lanseerasi täysin uuden tuotteen, Oomi Mobiilin, laajalle 25–65-vuotiaiden kohderyhmälle Suomessa — tavoitteena rakentaa tunnettuutta ja luottamusta täysin uudelle tuotekategorialle energiayhtiön brändin alla.",
      en: "Oomi launched an entirely new product, Oomi Mobiili, to a broad 25–65 audience in Finland — aiming to build awareness and trust for a completely new product category under an energy company's brand.",
    },
    objectives: {
      fi: "Lanseerattava täysin uusi tuote (Oomi Mobiili) laajalle 25–65v kohderyhmälle Suomessa. Nostaa tunnettuutta +20 % ja Oomin Share of Search 40 %:iin yhdessä lähdössä. Rakennettava luottamusta täysin uudelle tuotekategorialle energiayhtiön brändin alla.",
      en: "Launch an entirely new product (Oomi Mobiili) to a broad 25–65 audience in Finland. Lift awareness +20 % and Oomi's Share of Search to 40 % in one go. Build trust for a completely new product category under an energy company's brand.",
    },
    solution: {
      fi: "Rakensimme laajan yli kymmenen kanavan monikanavamixin (Total TV, YouTube CTV, Cinema, radio, DOOH, display, Meta, TikTok) ja kaksivaiheisen rakenteen somessa: ensin peitto, sitten aktivointi. Korkean huomioarvon formaatit rakentamaan brändi-engagementtia. Mitattu vaikutus systemaattisesti: YouTube Brand Lift -tutkimus ja Cinema-kampanjatutkimus rinnalla. Viestinä selkeä hyötyväite: ”Puhelinliittymä, joka pienentää sähkölaskuasi”.",
      en: "We built a broad 10+ channel mix (Total TV, YouTube CTV, Cinema, radio, DOOH, display, Meta, TikTok) with a two-phase social structure: reach first, then traffic optimization for activation. High-attention formats to build brand engagement over CTR. Impact measured systematically with YouTube Brand Lift and Cinema campaign research. The message: a clear value proposition — “A mobile plan that lowers your electricity bill.”",
    },
    methods: [
      { icon: "campaign", fi: { title: "Monikanavainen lanseeraus", body: "Yli kymmenen kanavaa Total TV:stä TikTokiin rakennettiin yhdeksi lanseerauskokonaisuudeksi." }, en: { title: "Multichannel launch", body: "More than ten channels, from Total TV to TikTok, built into a single launch." } },
      { icon: "analytics", fi: { title: "Kaksivaiheinen some", body: "Ensin peitto, sitten liikenteeseen optimointi — sama yleisö, kaksi tehtävää." }, en: { title: "Two-phase social", body: "Reach first, then traffic optimization — one audience, two jobs." } },
      { icon: "insights", fi: { title: "Vaikutuksen todentaminen", body: "YouTube Brand Lift -tutkimus ja Cinema-kampanjatutkimus mittasivat siirtymän mielikuvissa." }, en: { title: "Proving the impact", body: "YouTube Brand Lift and Cinema campaign research measured the shift in perception." } },
    ],
    results: {
      fi: "Oomi + Lumme -konsernin Share of Search nousi 40,6 %:iin, YouTube Brand Lift +9,74 % absoluuttista (Googlen mukaan yli ”high average” -tason), ja kampanja saavutti lähes 99 % nettopeiton kohderyhmässä neljässä viikossa.",
      en: "Oomi + Lumme group's Share of Search reached 40.6 %, YouTube Brand Lift showed +9.74 % absolute (above Google's “high average” benchmark), and the campaign achieved ~99 % net reach in the target group over four weeks.",
    },
    metrics: [
      { value: 40.6, decimals: 1, suffix: " %", label: { fi: "Share of Search (Oomi + Lumme)", en: "Share of Search (Oomi + Lumme)" } },
      { value: 9.74, decimals: 2, suffix: " %", label: { fi: "YouTube Brand Lift (absoluuttinen)", en: "YouTube Brand Lift (absolute)" } },
      { value: 99, suffix: " %", label: { fi: "Nettopeitto kohderyhmässä 4 viikossa", en: "Net reach in target group over 4 weeks" } },
    ],
    kpi: { value: 40.6, decimals: 1, suffix: " %", label: { fi: "Share of Search", en: "Share of Search" } },
  },
  {
    slug: "suun-terveystalo",
    client: "Suun Terveystalo",
    image: "/images/cases/terveystalo.webp",
    size: "large",
    parallax: false,
    summary: {
      fi: "Mediabudjettia leikattiin 45 %, silti ajanvaraukset kasvoivat 15 % ja kustannus per varaus laski 38 %.",
      en: "Media budget was cut 45 %, yet appointments grew 15 % and cost per booking dropped 38 %.",
    },
    tagline: {
      fi: "Pienemmällä budjetilla enemmän varauksia",
      en: "More bookings on a smaller budget",
    },
    intro: {
      fi: "Suun Terveystalon mediabudjettia leikattiin 45 % edellisestä kampanjasta, ja budjetti/päivä puolittui. Silti 830 000 kohderyhmäläistä ei vielä tuntenut brändiä lainkaan.",
      en: "Suun Terveystalo's media budget was cut 45 % from the previous campaign, and budget per day halved. Yet 830,000 people in the target group didn't know the brand at all.",
    },
    objectives: {
      fi: "Mediabudjettia leikattiin 45 % edellisestä kampanjasta. Budjetti/päivä puolittui, vaikka kampanja-aika piteni +25 %. 830 000 kohderyhmäläistä ei tunne Suun Terveystaloa lainkaan. Tasapaino brändin ja suorien varausten välillä 10+ kanavassa, 25 kaupungissa.",
      en: "Media budget was cut 45 % from the previous campaign. Budget per day halved, even though the campaign period grew +25 %. 830,000 people in the target group don't know Suun Terveystalo at all. Balance brand and direct bookings across 10+ channels, 25 cities.",
    },
    solution: {
      fi: "Rakensimme laajan monikanavamixin (TV, YouTube CTV, Cinema, radio, printti, DOOH, PDOOH, display, Meta) ja siirsimme budjettia kalliista kanavista kustannustehokkaisiin reach-kanaviin. Alueellinen kohdennus: TV Lapissa hiihtolomalla, lokalisoitu printti per toimipiste. Jatkuva optimointi tavoittavuuteen + taktinen tarjous rinnalla. Brändiviesti: ”Hymyile. Olet hyvissä käsissä.” Taktinen viesti: 49 € hammastarkastus uusille asiakkaille.",
      en: "We built a broad multichannel mix (TV, YouTube CTV, Cinema, radio, print, DOOH, PDOOH, display, Meta) and shifted budget from expensive channels to cost-efficient reach channels. Regional targeting: TV in Lapland during ski holiday, localized print per clinic. Continuous optimization toward reach + tactical offer alongside. Brand message: “Smile. You're in good hands.” Tactical message: €49 dental check-up for new patients.",
    },
    methods: [
      { icon: "my_location", fi: { title: "Alueellinen kohdennus", body: "TV Lapissa hiihtolomalla ja lokalisoitu printti per toimipiste, 25 kaupungissa." }, en: { title: "Regional targeting", body: "TV in Lapland over the ski holiday and localized print per clinic, across 25 cities." } },
      { icon: "tune", fi: { title: "Budjetin uudelleenallokointi", body: "Panostukset siirrettiin kalliista kanavista kustannustehokkaisiin reach-kanaviin." }, en: { title: "Budget reallocation", body: "Investment moved from expensive channels into cost-efficient reach channels." } },
      { icon: "query_stats", fi: { title: "Brändi ja taktiikka rinnakkain", body: "Brändiviesti ja 49 € tarkastustarjous ajettiin samassa mixissä, mittaus varauksiin asti." }, en: { title: "Brand and tactics in parallel", body: "The brand message and the €49 check-up offer ran in one mix, measured all the way to bookings." } },
    ],
    results: {
      fi: "Kokonaisvaraukset kasvoivat 15 % edellisvuoteen verrattuna, kustannus per varaus laski 38 % ja orgaaniset varaukset kasvoivat 4,4 % — budjetin puolituksesta huolimatta. 71 % tunnistaa brändin, preferenssi nousi 16 % → 18 %.",
      en: "Total appointments grew 15 % year-over-year, cost per booking dropped 38 %, and organic appointments grew 4.4 % — despite the halved budget. 71 % recognize the brand, preference rose from 16 % to 18 %.",
    },
    metrics: [
      { value: 15, suffix: " %", label: { fi: "Kokonaisvaraukset kasvoivat (YoY)", en: "Total appointments grew (YoY)" } },
      { value: -38, suffix: " %", label: { fi: "Kustannus per varaus laski", en: "Cost per booking dropped" } },
      { value: 4.4, decimals: 1, suffix: " %", label: { fi: "Orgaanisten varausten kasvu", en: "Organic appointments growth" } },
    ],
    kpi: { value: -38, suffix: " %", label: { fi: "kustannus per varaus", en: "cost per booking" } },
  },
  {
    slug: "kokkola",
    client: "Kokkola",
    image: "/images/cases/kokkola.webp",
    size: "small",
    summary: {
      fi: "Tutkittuun markkinointiin ja dataan NØRR3 rakensi vuoden kestoisen mediasuunnitelman kolmella pääkohdalla ja välikoilla tapahtuvalla jatkuvalla mainonnalla.",
      en: "On researched marketing and data, NØRR3 built a year-long media plan with three main pushes and continuous advertising in between.",
    },
    tagline: { fi: "Tulkaa Kokkolaan!", en: "Come to Kokkola!" },
    intro: {
      fi: "Kaupunkimarkkinointia, joka kutsuu — vuoden mittainen suunnitelma, joka piti Kokkolan esillä ympäri vuoden.",
      en: "City marketing with an invitation — a year-long plan that kept Kokkola visible all year round.",
    },
    objectives: {
      fi: "Kokkolan kaupunki halusi kasvattaa vetovoimaansa asuin- ja matkailukaupunkina sekä pitää kaupungin esillä kansallisessa mediassa ympäri vuoden — rajallisella budjetilla.",
      en: "The city of Kokkola wanted to grow its pull as a place to live and visit, and stay visible in national media year-round — on a limited budget.",
    },
    solution: {
      fi: "Rakensimme vuoden kestoisen mediasuunnitelman kolmella pääkampanjajaksolla ja niiden välissä jatkuvalla ylläpitomainonnalla, jotta huomio ei pääse katkeamaan kampanjoiden välillä.",
      en: "We built a year-long media plan with three main campaign pushes and continuous maintenance advertising between them, so attention never breaks between campaigns.",
    },
    methods: [
      { icon: "schedule", fi: { title: "Datan keräys", body: "Vetovoima- ja tunnettuusmittaukset ennen suunnittelua." }, en: { title: "Data collection", body: "Attraction and awareness measurement before planning." } },
      { icon: "track_changes", fi: { title: "Analyysi", body: "Kohderyhmien mediankäyttö analysoitiin kanavavalintojen pohjaksi." }, en: { title: "Analysis", body: "Audience media use was analyzed as the basis for channel choices." } },
      { icon: "space_dashboard", fi: { title: "Jatkuva optimointi", body: "Panostuksia siirrettiin jaksojen välillä tulosten mukaan." }, en: { title: "Continuous optimization", body: "Investments shifted between pushes based on results." } },
    ],
    results: {
      fi: "Kokkolan tunnettuus ja vetovoimamittarit kasvoivat suunnitelmakauden aikana, ja kaupunki pysyi esillä kansallisessa mediassa läpi vuoden.",
      en: "Kokkola's awareness and attraction metrics grew over the plan period, and the city stayed visible in national media throughout the year.",
    },
    metrics: [
      { value: 3, label: { fi: "Pääkampanjajaksoa vuodessa", en: "Main campaign pushes per year" } },
      { value: 12, label: { fi: "Kuukautta jatkuvaa näkyvyyttä", en: "Months of continuous visibility" } },
      { value: 1, label: { fi: "Yhtenäinen suunnitelma kaikille kanaville", en: "Unified plan across all channels" } },
    ],
    kpi: { value: 12, label: { fi: "kk jatkuvaa näkyvyyttä", en: "months of continuous visibility" } },
  },
  {
    slug: "st1",
    client: "ST1",
    image: "/images/cases/st1.webp",
    size: "small",
    summary: {
      fi: "St1-brändin 360-mediastrategia, suunnittelu ja ostaminen kaikissa kanavissa. Yhteistyö laajeni entisestään loppuvuodesta 2022, kun St1-brändin lisäksi mukaan tulivat myös HelmiSimpukka, Shell ja Perfect Autopesu.",
      en: "St1's 360 media strategy, planning and buying across all channels. The partnership grew further in late 2022 when HelmiSimpukka, Shell and Perfect Autopesu joined alongside the St1 brand.",
    },
    tagline: { fi: "360-mediastrategia kaikissa kanavissa", en: "A 360 media strategy across every channel" },
    intro: {
      fi: "Yksi kumppani neljälle brändille — strategia, suunnittelu ja ostaminen saman katon alta.",
      en: "One partner for four brands — strategy, planning and buying under one roof.",
    },
    objectives: {
      fi: "St1 haki yhtä kumppania, joka kantaa vastuun koko mediatekemisestä — strategiasta operointiin — ja skaalautuu useamman brändin tarpeisiin.",
      en: "St1 sought one partner to own the whole of media — from strategy to operations — and scale to the needs of multiple brands.",
    },
    solution: {
      fi: "Rakensimme 360-mediastrategian ja keskitetyn suunnittelu- ja osto-operoinnin, joka laajeni loppuvuodesta 2022 kattamaan myös HelmiSimpukan, Shellin ja Perfect Autopesun.",
      en: "We built a 360 media strategy and centralized planning and buying operation, which expanded in late 2022 to cover HelmiSimpukka, Shell and Perfect Autopesu.",
    },
    methods: [
      { icon: "schedule", fi: { title: "Datan keräys", body: "Brändi- ja kanavadata koottiin neljän brändin yhteiseen näkymään." }, en: { title: "Data collection", body: "Brand and channel data gathered into one view across four brands." } },
      { icon: "track_changes", fi: { title: "Analyysi", body: "Brändien roolit ja päällekkäisyydet analysoitiin panostusten pohjaksi." }, en: { title: "Analysis", body: "Brand roles and overlaps analyzed as the basis for investments." } },
      { icon: "space_dashboard", fi: { title: "Keskitetty operointi", body: "Yksi tiimi operoi kaikki kanavat kaikille brändeille." }, en: { title: "Centralized operations", body: "One team operates every channel for every brand." } },
    ],
    results: {
      fi: "Yhteistyö laajeni yhden brändin mediakumppanuudesta neljän brändin kokonaisvastuuseen — merkki siitä, että malli toimii.",
      en: "The partnership grew from a single-brand media assignment to full responsibility for four brands — a sign the model works.",
    },
    metrics: [
      { value: 4, label: { fi: "Brändiä saman katon alla", en: "Brands under one roof" } },
      { value: 360, suffix: "°", label: { fi: "Mediastrategia kaikissa kanavissa", en: "Media strategy across all channels" } },
      { value: 2022, label: { fi: "Yhteistyön laajenemisvuosi", en: "Year the partnership expanded" } },
    ],
    kpi: { value: 4, label: { fi: "brändiä yhdellä tiimillä", en: "brands, one team" } },
  },
  {
    slug: "kiinteistomaailma",
    client: "Kiinteistömaailma",
    image: "/images/cases/kiinteistomaailma.webp",
    size: "small",
    parallax: true,
    summary: {
      fi: "Asuntovälityksessä on kriittistä tavoittaa juuri ne asiakkaat, jotka ovat valmiita ostamaan, myymään tai vuokraamaan – ja tämä vaatii tarkasti kohdennettua, oivaltavaa markkinointia. Kiinteistömaailma etsi kumppania, joka pystyy tarjoamaan kattavia tutkimuksia, suunnittelemaan ja toteuttamaan monikanavaisia kampanjoita sekä rakentamaan monimutkaisen, dynaamisen uudelleenmarkkinointimallin.",
      en: "In real-estate brokerage it is critical to reach exactly the customers who are ready to buy, sell or rent — and that demands precisely targeted, insightful marketing. Kiinteistömaailma sought a partner able to provide comprehensive research, plan and execute multichannel campaigns, and build a complex, dynamic remarketing model.",
    },
    tagline: {
      fi: "Monipuolisia ratkaisuja haastavaan tilanteeseen",
      en: "Versatile solutions for a demanding situation",
    },
    intro: {
      fi: "Asuntovälityksessä on kriittistä tavoittaa juuri ne asiakkaat, jotka ovat valmiita ostamaan, myymään tai vuokraamaan – ja tämä vaatii tarkasti kohdennettua, oivaltavaa markkinointia. Kiinteistömaailma etsi kumppania, joka pystyy tarjoamaan kattavia tutkimuksia, suunnittelemaan ja toteuttamaan monikanavaisia kampanjoita sekä rakentamaan monimutkaisen, dynaamisen uudelleenmarkkinointimallin.",
      en: "In real-estate brokerage it is critical to reach exactly the customers who are ready to buy, sell or rent — and that demands precisely targeted, insightful marketing. Kiinteistömaailma sought a partner able to provide comprehensive research, plan and execute multichannel campaigns, and build a complex, dynamic remarketing model.",
    },
    objectives: {
      fi: "<h3>Miten projekti alkoi</h3><p>Keväällä 2023 Kiinteistömaailma etsi uutta kumppania ratkaisemaan vaativia digitaalisen mainonnan haasteita, toteuttamaan brändi- ja kilpailijatutkimuksia sekä suunnittelemaan ja operoimaan moderneja mediastrategioita. Yhteistyö käynnistyi dynaamisen uudelleenmarkkinoinnin ongelmanratkaisulla ja laajeni nopeasti kattamaan koko maksetun mainonnan toimenpiteet. Syvällinen toimialaymmärrys vaatii digitaalisen mainonnan ja koko brändifunnelin hallintaa, mikä kattaa kuluttajien mieltymykset ja asenteet.</p><h3>Erityistä yhteistyössä</h3><p>Kiinteistömaailma on johtava valtakunnallinen toimija, joka operoi franchising-periaatteella 500 välittäjän voimin. Tämä toimintamalli tuo omat haasteensa tehokkaan maksetun mainonnan strategian suunnitteluun ja toteutukseen. Laaja feed kaikkien tarjolla olevien asuntojen tiedoilla ja kuvilla asettaa vaatimuksia tehokkaalle dynaamiselle mainonnalle, ja valtakunnallinen toiminta luo painetta varmistaa mainonnan riittävä teho pienilläkin budjeteilla.</p>",
      en: "<h3>How the project began</h3><p>In spring 2023 Kiinteistömaailma sought a new partner to solve demanding digital-advertising challenges, run brand and competitor research, and plan and operate modern media strategies. The collaboration began with solving the dynamic remarketing challenge and quickly expanded to cover the whole scope of paid media. Deep industry understanding requires command of digital advertising and the entire brand funnel — including consumer preferences and attitudes.</p><h3>What made the collaboration special</h3><p>Kiinteistömaailma is a leading national player operating on a franchise model with 500 brokers. That model brings its own challenges to planning and executing an effective paid-media strategy. A broad feed of all available properties with their data and images sets high demands on effective dynamic advertising, and nationwide operations create pressure to secure sufficient advertising impact even on small budgets.</p>",
    },
    solution: {
      fi: "<h3>Mitä olemme saavuttaneet?</h3><ul><li>Dynaamisten aineistojen suunnittelu ja toteutus display- ja some-mainontaa varten (Adform, Smartly, Meta).</li><li>Tekniikan rakentaminen dynaamisuutta ja optimointitarpeita varten (pikselit, feedin implementointi, dashboard).</li><li>Kattavan brändi- ja kilpailijatutkimuksen toteutus sekä sen pohjalta optimoitu mediastrategia.</li><li>Kampanjoiden ja jatkuvan mainonnan operointi ja optimointi löydöksien pohjalta.</li><li>Syventynyt yhteistyö luovan toimiston ja Kiinteistömaailman kanssa tulosten jatkuvaan parantamiseen.</li></ul><p>Yhteistyö alkoi erityisen haastavasta dynaamisesta retargeting-kampanjasta, joka toteutettiin räätälöidyllä setupilla Metan ja ohjelmallisen display-mainonnan alustoilla. Tavoitteena oli tavoittaa potentiaaliset asiakkaat, jotka olivat olleet vuorovaikutuksessa Kiinteistömaailman digitaalisten kanavien kanssa mutta eivät vielä konvertoituneet.</p><p>Franchising-toimintamalli sekä laajan feedin yhdistäminen mainonta-alustoihin lisäsivät haastetta, kun oikeat viestit piti kohdistaa oikeille yleisöille. NØRR3 oli kolmas toimisto tarttumaan tähän monimutkaiseen projektiin, ja se vaati tarkkaa segmentointia ja datan hallintaa tuloksellisuuden varmistamiseksi.</p>",
      en: "<h3>What we achieved</h3><ul><li>Design and execution of dynamic assets for display and social advertising (Adform, Smartly, Meta).</li><li>Building the technology for dynamism and optimization (pixels, feed implementation, dashboard).</li><li>Comprehensive brand and competitor research, and a media strategy optimized on its findings.</li><li>Operating and optimizing campaigns and always-on advertising based on the findings.</li><li>Deepened collaboration with the creative agency and Kiinteistömaailma to keep improving results.</li></ul><p>The collaboration began with an especially challenging dynamic retargeting campaign, built on a tailored setup across Meta and programmatic display platforms. The goal was to reach potential customers who had interacted with Kiinteistömaailma's digital channels but had not yet converted.</p><p>The franchise model and connecting a broad feed to the advertising platforms added difficulty, as the right messages had to be targeted at the right audiences. NØRR3 was the third agency to take on this complex project, and it required precise segmentation and data management to secure results.</p>",
    },
    methods: [
      { icon: "campaign", fi: { title: "Dynaaminen uudelleenmarkkinointi", body: "Räätälöity dynaaminen retargeting Metan ja ohjelmallisen display-mainonnan alustoilla." }, en: { title: "Dynamic remarketing", body: "Tailored dynamic retargeting across Meta and programmatic display platforms." } },
      { icon: "space_dashboard", fi: { title: "Tekniikka ja data", body: "Pikselit, feedin implementointi ja dashboard dynaamisuutta ja optimointia varten." }, en: { title: "Technology and data", body: "Pixels, feed implementation and a dashboard to power dynamism and optimization." } },
      { icon: "query_stats", fi: { title: "Tutkimus ja optimointi", body: "Brändi- ja kilpailijatutkimus sekä kampanjoiden jatkuva operointi ja optimointi." }, en: { title: "Research and optimization", body: "Brand and competitor research, with continuous campaign operations and optimization." } },
    ],
    results: {
      fi: "Dynaamisen uudelleenmarkkinoinnin haaste saatiin ratkaistua ja mainonta tavoittaa nyt tehokkaasti sivustolla käyneet vierailijat. Mainonta näyttää katsottuja kohteita valituilla kriteereillä, ja osaa suositella myös relevantteja muita kohteita.",
      en: "The dynamic remarketing challenge was solved, and the advertising now effectively reaches visitors who have been on the site. The ads show viewed properties against chosen criteria, and can also recommend relevant other properties.",
    },
    metrics: [
      { value: 28, suffix: " %", label: { fi: "Asuntokaupan kasvu heinäkuussa 2024 (vrt. 07/2023, +20 % vrt. 06/2024)", en: "Growth in property sales in July 2024 (vs. 07/2023, +20 % vs. 06/2024)" } },
      { value: 81, suffix: " %", label: { fi: "Toimialan tunnetuin toimija (08/2024, autettu tunnettuus, n=1000)", en: "Best-known player in the industry (08/2024, aided awareness, n=1000)" } },
      { value: 1, suffix: ".", label: { fi: "Markkinoinnin näkyvyys ja ammattimaisuus (08/2024, n=1000)", en: "Marketing visibility and professionalism (08/2024, n=1000)" } },
      { value: 20, suffix: " %", label: { fi: "Dynaamisen uudelleenmarkkinoinnin klikkaus-% parhaimmillaan (Facebook 11/2024)", en: "Dynamic remarketing CTR at its best (Facebook 11/2024)" } },
    ],
    kpi: { value: 28, suffix: " %", label: { fi: "asuntokaupan kasvu heinäkuussa 2024", en: "growth in property sales in July 2024" } },
    testimonial: {
      author: "Hanna Pasanen",
      role: { fi: "Senior Marketing Manager, Kiinteistömaailma", en: "Senior Marketing Manager, Kiinteistömaailma" },
      text: {
        fi: "NØRR3 on osoittautunut meille arvokkaaksi ja ammattitaitoiseksi kumppaniksi niin strategisessa kuin operatiivisessakin työssä. Vaikka toimialan haasteet ovat olleet merkittäviä, markkinointimme tulokset ovat silti olleet erinomaisia.",
        en: "NØRR3 has proven to be a valuable and professional partner for us in both strategic and operational work. Even though the industry's challenges have been significant, our marketing results have still been excellent.",
      },
    },
    gallery: [
      {
        src: "/images/cases/kiinteistomaailma-gallery.webp",
        alt: { fi: "Kiinteistömaailman Facebook-karusellimainos", en: "Kiinteistömaailma Facebook carousel ad" },
        caption: { fi: "Dynaaminen Facebook-karusellimainos", en: "Dynamic Facebook carousel ad" },
      },
    ],
  },
  {
    slug: "frantsila",
    client: "Frantsila",
    image: "/images/cases/frantsila.webp",
    size: "small",
    summary: {
      fi: "Frantsilan toiveena oli tavoittaa heille aiemmin tuntematonta kohderyhmää, kosmetiikan käyttäjiä sekä lisätä kivijalkaverkoston ja oman verkkokaupan kautta tuotteiden kysyntää. NØRR3 mediasuunnitelman kautta varmistettiin, että mainonta tukee Frantsilan vahvaa kivijalkamyyntiä ja tavoittaa kohderyhmää relevanteissa, brändin arvon mukaisissa mediaympäristöissä.",
      en: "Frantsila wanted to reach a target group that was previously unfamiliar to them — cosmetics users — and increase demand for their products through their retail stores and their own webshop. Through the NØRR3 media plan we made sure the advertising supports Frantsila's strong in-store sales and reaches the target group in relevant media environments that match the brand's values.",
    },
    tagline: {
      fi: "Visuaalisesti vaikuttavalle mainoskonseptille näkyvyyttä",
      en: "Visibility for a visually striking creative concept",
    },
    intro: {
      fi: "Frantsila etsi uutta, ketterää ja näkemyksellistä mediatoimistoa syksyllä 2023 vauhdittamaan heidän uuden strategian ja brändin mukaisia kasvutavoitteita. Yhteinen sävel löytyi heti ensitapaamisesta alkaen ja nyt 2 kampanjan sekä always on -mainonnan kokemuksella yhteistyö on ollut menestys molemmille osapuolille.",
      en: "Frantsila was looking for a new, agile and visionary media agency in autumn 2023 to accelerate their growth goals aligned with their new strategy and brand. The chemistry was right from the very first meeting, and now with two campaigns and always-on advertising behind us, the collaboration has been a success for both parties.",
    },
    objectives: {
      fi: "<h3>Miten projekti alkoi</h3><p>Yhteistyö alkoi syksyllä 2023 Frantsilan Terve Maa, Terve Iho -kampanjan mediasuunnittelulla sekä jalkautuksella. Kampanjan tavoitteena oli lisätä valtakunnallisesti Frantsilan preferenssiä ja myyntiä luonnonkosmetiikan käyttäjien keskuudessa sekä kasvattaa tunnettuutta yleisön parissa. Asiantuntijamme perehtyi huolellisesti briefiin sekä kohderyhmään ja loi mediasuunnitelman kampanjalle sekä auttoi määrittelemään realistiset tavoitteet kampanjalle.</p><h3>Toiveet ja tarpeet</h3><p>Frantsilan toiveena oli tavoittaa heille aiemmin tuntematonta kohderyhmää, kosmetiikan käyttäjiä sekä lisätä kivijalkakauppojen ja oman verkkokaupan kautta tuotteiden kysyntää. NØRR3 mediasuunnitelman kautta varmistettiin, että mainonta tukee Frantsilan vahvaa kivijalkamyyntiä ja tavoittaa kohderyhmää relevanteissa, brändin arvon mukaisissa mediaympäristöissä.</p>",
      en: "<h3>How the project began</h3><p>The collaboration began in autumn 2023 with the media planning and rollout of Frantsila's Terve Maa, Terve Iho (Healthy Soil, Healthy Skin) campaign. The campaign's goal was to nationally increase Frantsila's preference and sales among natural-cosmetics users and to grow awareness among the general public. Our expert carefully studied the brief and the target group, created the media plan for the campaign, and helped define realistic targets for it.</p><h3>Wishes and needs</h3><p>Frantsila's wish was to reach a target group that was previously unfamiliar to them — cosmetics users — and increase demand for their products through their retail stores and their own webshop. Through the NØRR3 media plan we made sure the advertising supports Frantsila's strong in-store sales and reaches the target group in relevant media environments that match the brand's values.</p>",
    },
    solution: {
      fi: "<h3>Mitä ehdotimme</h3><p>Mediasuunnitelman kantava ajatus oli tuoda näyttävissä pinnoissa esiin Frantsilan upea brändi sekä kampanjan visuaalisesti vaikuttava mainoskonsepti. Mukaan valikoitui printtiä ja ulkomainontaa taktisilla sekä näkyvillä paikoilla suurien kaupunkien keskustoissa sekä kauppakeskuksissa, joissa Frantsilan jälleenmyyjät toimivat. Digillä oli vahva rooli Frantsilan oman verkkokaupan myynnin kasvattamisessa sekä markkinointiluvallisten uutiskirjeiden hankinnassa.</p><h3>Mitä teimme?</h3><ul><li>Mediasuunnittelu</li><li>Medioiden neuvottelu ja buukkauset</li><li>Kampanjoiden rakennus</li><li>Mainosmateriaalien versiointi digiin (ml. Html-bannerit ja DOOH-aineisto)</li><li>Kampanjoiden optimointi</li><li>Raportointi ja opit</li></ul>",
      en: "<h3>What we proposed</h3><p>The guiding idea of the media plan was to showcase Frantsila's beautiful brand and the campaign's visually striking creative concept on prominent surfaces. The mix included print and out-of-home in tactical, high-visibility locations in the centres of major cities and in shopping malls where Frantsila's retailers operate. Digital played a strong role in growing sales in Frantsila's own webshop and in acquiring marketing-permission newsletter subscribers.</p><h3>What we did</h3><ul><li>Media planning</li><li>Media negotiation and booking</li><li>Campaign build</li><li>Adapting ad materials for digital (incl. HTML banners and DOOH assets)</li><li>Campaign optimization</li><li>Reporting and learnings</li></ul>",
    },
    methods: [
      { icon: "campaign", fi: { title: "Mediasuunnittelu", body: "Mediasuunnittelu sekä medioiden neuvottelu ja buukkaus." }, en: { title: "Media planning", body: "Media planning, plus negotiation and booking of media." } },
      { icon: "tune", fi: { title: "Kampanjoiden rakennus", body: "Kampanjoiden rakennus ja mainosmateriaalien versiointi digiin (ml. HTML-bannerit ja DOOH-aineisto)." }, en: { title: "Campaign build", body: "Campaign build and adapting ad materials for digital (incl. HTML banners and DOOH assets)." } },
      { icon: "analytics", fi: { title: "Optimointi ja raportointi", body: "Kampanjoiden optimointi sekä raportointi ja opit." }, en: { title: "Optimization & reporting", body: "Campaign optimization, plus reporting and learnings." } },
    ],
    results: {
      fi: "Kampanjan tavoitteet saavutettiin erinomaisesti ja mm. verkkokaupan tuotteiden myynti kasvoi 20% ja kampanjalla saatiin lähes 8 000 uutta uutiskirjeen tilaajaa. Kampanjan huomioarvo oli 20%, mitä voidaan pitää hyvänä tuloksena Frantsilan ensimmäiseksi monimedia-kampanjaksi.",
      en: "The campaign's targets were achieved excellently: among other things, online-store product sales grew by 20% and the campaign gained almost 8,000 new newsletter subscribers. The campaign's attention value was 20%, which can be considered a good result for Frantsila's first multimedia campaign.",
    },
    metrics: [
      { value: 20, suffix: " %", label: { fi: "Verkkokaupan myynnin kasvu", en: "Online-store sales growth" } },
      { value: 20, suffix: " %", label: { fi: "Kampanjan huomioarvo", en: "Campaign attention value" } },
      { value: 8000, prefix: "~", label: { fi: "Uutiskirjeen tilaajaa", en: "Newsletter subscribers" } },
      { value: 4, suffix: " %", label: { fi: "Tunnettuus", en: "Awareness" } },
    ],
    kpi: { value: 20, suffix: " %", label: { fi: "verkkokaupan myynnin kasvu", en: "online-store sales growth" } },
    testimonial: {
      author: "Kimmo Tupala",
      role: { fi: "Toimitusjohtaja, Frantsila Herb Farm", en: "CEO, Frantsila Herb Farm" },
      text: {
        fi: "Kumppanuus NØRR3 kanssa on ollut juuri sitä, mitä odotimme. Saamme heiltä aina asiantuntevasti ja nopeasti näkemyksen sekä konkreettiset ehdotukset, miten kehitämme markkinointiamme. Sen lisäksi he ovat valmiita joustamaan aikatauluissa hyvällä palveluasenteella. NØRR3 on juuri meille sopiva, ketterä 360-mediatoimisto ja odotamme yhteistyön syvenevän entisestään jatkossa.",
        en: "Our partnership with NØRR3 has been exactly what we expected. We always get an expert and fast view from them, together with concrete proposals on how to develop our marketing. On top of that they are ready to be flexible with schedules and have a great service attitude. NØRR3 is exactly the right agile 360 media agency for us, and we look forward to deepening the collaboration further.",
      },
    },
    gallery: [
      {
        src: "/images/cases/frantsila-gallery.webp",
        alt: { fi: "Frantsilan verkkokauppa puhelimessa", en: "Frantsila webshop on a phone" },
        caption: { fi: "Verkkokaupan myynti digin kautta", en: "Online-store sales via digital" },
      },
    ],
  },
  {
    slug: "sambla-group",
    client: "Sambla Group",
    image: "/images/cases/sambla-group.webp",
    size: "small",
    summary: {
      fi: "Rahalaitos ja Omalaina nousivat nopeasti Suomen tunnetuimmiksi brändeiksi kaikissa halutuissa mittareissa luottojen kilpailutuspalveluissa, mm. Top-of-mind, tunnettuus, harkinta ja preferointi. Luottojen kilpailutustoimeksiannoissa tulokset ovat suunnitelman mukaisia.",
      en: "Rahalaitos and Omalaina quickly rose to become Finland's best-known brands across all desired metrics in loan-comparison services, incl. top-of-mind, awareness, consideration and preference. In loan-comparison assignments the results are in line with the plan.",
    },
    tagline: {
      fi: "Tuloksellista mainontaa Omalainalle ja Rahalaitokselle",
      en: "Results-driven advertising for Omalaina and Rahalaitos",
    },
    intro: {
      fi: "Sambla Group on ostanut Pohjoismaista ~15 eri luottojen kilpailutuspalvelua. 2022 Sambla valitsi NØRR3:n rakentamaan Rahalaitos- ja Omalaina-brändeille mediastrategian vuodelle 2023 sekä ostamaan ja operoimaan mediat. Lisäksi NØRR3:n vastuulla on rakentaa attribuutio-mallinnusta yhdessä kv-tiimin kanssa sekä tehdä kilpailjaseurantaa viikkotasolla.",
      en: "Sambla Group has acquired around 15 different loan-comparison services across the Nordics. In 2022 Sambla chose NØRR3 to build a media strategy for 2023 for the Rahalaitos and Omalaina brands, and to buy and operate the media. In addition, NØRR3 is responsible for building attribution modelling together with the international team and for weekly competitor tracking.",
    },
    objectives: {
      fi: "<h3>Miten projekti alkoi</h3><p>NØRR3 osallistui Samblan kilpailutukseen yhdessä Independent Nordic Network -verkoston kanssa, jonka jäsen NØRR3 on. Sambla piti NØRR3:n laatimasta strategiasta ja yhteistyö löysi heti hyvän sävelen.</p><h3>Toiveet ja tarpeet</h3><p>Sambla toivoi uudelta mediatoimistoltaan syvää strategista osaamista, kykyä nopeaan ja dynaamiseen operointiin sekä taitoa tehdä erottuvia mediaplaneja. Tavoitteeksi Sambla asetti nostaa molemmat brändit tulosten kärkeen useilla mittareilla. Tärkeää Samblalle oli myös hyvät neuvottelutaidot mediatalosopimuksia tehdessä.</p>",
      en: "<h3>How the project began</h3><p>NØRR3 took part in Sambla's agency pitch together with the Independent Nordic Network, of which NØRR3 is a member. Sambla liked the strategy NØRR3 had prepared, and the collaboration found its rhythm right away.</p><h3>Wishes and needs</h3><p>Sambla hoped its new media agency would bring deep strategic expertise, the ability to operate quickly and dynamically, and the skill to create standout media plans. Sambla's goal was to lift both brands to the top of results on several metrics. Good negotiation skills when making media-house agreements were also important to Sambla.</p>",
    },
    solution: {
      fi: "<h3>Mitä ehdotimme</h3><p>Omalainalla ja Rahalaitoksella on pitkälti sama kohderyhmä. NØRR3 ehdotti mediastrategiaa, jossa brändit tukevat toisiaan läpi vuoden, mutta mediamixissä on suurehkojakin eroavaisuuksia. Kanavaeroavaisuuksien ja attribuutio-mallinnuksen avulla pääsemme näkemään erityisen hyvin markkinoinnin tehot ja kanava- sekä mediamix-kohtaiset eroavaisuudet ja kehitysalueet. 3 vuoden kilpailijatutkimuksen avulla näimme heti kilpailijoiden heikkoudet ja pääsimme hyödyntämään tämän välittömästi mainonnassa. Mediamixit pitävät sisällään laajan, mutta koherentin kanavavalikoiman.</p><h3>Mitä teimme?</h3><ul><li>Kilpailija-analyysi medioittain ja viikoittain viimeisten 3 vuoden ajalta.</li><li>Mediastrategia ja tarkka mediasuunnitelma kanavaryhmittäin, kanavittain sekä mm. spottipituuksittain Omalainalle ja Rahalaitokselle erikseen sekä strategiset toisiaan tukevat eroavaisuudet.</li><li>Mediaostaminen ja -operointi.</li><li>Tarkka mittaus, jatkuva kilpailija- ja brändiseuranta sekä jatkuva attribuutio-mallinnus.</li></ul>",
      en: "<h3>What we proposed</h3><p>Omalaina and Rahalaitos largely share the same target group. NØRR3 proposed a media strategy where the brands support each other throughout the year, but with fairly large differences in the media mix. Thanks to the channel differences and attribution modelling, we can see the effectiveness of the marketing and the channel- and media-mix-specific differences and development areas especially well. With three years of competitor research we immediately saw the competitors' weaknesses and could leverage that in the advertising right away. The media mixes include a broad but coherent selection of channels.</p><h3>What we did</h3><ul><li>Competitor analysis by media and weekly over the past three years.</li><li>A media strategy and a precise media plan by channel group, by channel, and e.g. by spot length for Omalaina and Rahalaitos separately, plus strategic, mutually supporting differences.</li><li>Media buying and operations.</li><li>Precise measurement, continuous competitor and brand tracking, and continuous attribution modelling.</li></ul>",
    },
    methods: [
      { icon: "track_changes", fi: { title: "Kilpailija-analyysi", body: "Kilpailija-analyysi medioittain ja viikoittain viimeisten 3 vuoden ajalta." }, en: { title: "Competitor analysis", body: "Competitor analysis by media and weekly over the past three years." } },
      { icon: "space_dashboard", fi: { title: "Mediastrategia ja suunnitelma", body: "Tarkka mediasuunnitelma kanavaryhmittäin ja spottipituuksittain Omalainalle ja Rahalaitokselle erikseen." }, en: { title: "Media strategy & plan", body: "A precise media plan by channel group and spot length for Omalaina and Rahalaitos separately." } },
      { icon: "query_stats", fi: { title: "Mittaus ja attribuutio", body: "Tarkka mittaus, jatkuva kilpailija- ja brändiseuranta sekä attribuutio-mallinnus." }, en: { title: "Measurement & attribution", body: "Precise measurement, continuous brand and competitor tracking, and attribution modelling." } },
    ],
    results: {
      fi: "Rahalaitos ja Omalaina nousivat nopeasti Suomen tunnetuimmiksi brändeiksi kaikissa halutuissa mittareissa luottojen kilpailutuspalveluissa, mm. Top-of-mind, tunnettuus, harkinta ja preferointi. Luottojen kilpailutustoimeksiannoissa tulokset ovat suunnitelman mukaisia.",
      en: "Rahalaitos and Omalaina quickly rose to become Finland's best-known brands across all desired metrics in loan-comparison services, incl. top-of-mind, awareness, consideration and preference. In loan-comparison assignments the results are in line with the plan.",
    },
    metrics: [
      { value: 1, suffix: "-2", label: { fi: "Sijat halutuissa mittareissa", en: "Rankings in the key metrics" } },
      { value: 33, suffix: " %", label: { fi: "Tunnettuuden kasvu, esim. Omalaina", en: "Awareness growth, e.g. Omalaina" } },
      { value: 20, suffix: " %", label: { fi: "Mainonnan muistettavuus, esim. Omalaina", en: "Ad recall, e.g. Omalaina" } },
      { value: 1, label: { fi: "Optimoitu mediamix kaikissa kanavissa", en: "Optimized media mix across all channels" } },
    ],
    kpi: { value: 33, suffix: " %", label: { fi: "tunnettuuden kasvu", en: "awareness growth" } },
    testimonial: {
      author: "Martin Dehlin",
      role: { fi: "Media Manager, Sambla Group", en: "Media Manager, Sambla Group" },
      image: "/images/cases/sambla-martin-portrait.webp",
      text: {
        fi: "We are very pleased with the collaboration with NØRR3. They have been a key partner for us in the Finnish market from overall media strategy to operational topics. We also value the flexibility that NØRR3 has shown when our plans have changed at short notice. We are happy to recommend NØRR3.",
        en: "We are very pleased with the collaboration with NØRR3. They have been a key partner for us in the Finnish market from overall media strategy to operational topics. We also value the flexibility that NØRR3 has shown when our plans have changed at short notice. We are happy to recommend NØRR3.",
      },
    },
    gallery: [
      {
        src: "/images/cases/sambla-omalaina-tv.webp",
        alt: { fi: "Omalaina TV-spotti", en: "Omalaina TV spot" },
        caption: { fi: "Omalaina TV-spotti", en: "Omalaina TV spot" },
      },
      {
        src: "/images/cases/sambla-rahalaitos-tv.webp",
        alt: { fi: "Rahalaitos TV-spotti", en: "Rahalaitos TV spot" },
        caption: { fi: "Rahalaitos TV-spotti", en: "Rahalaitos TV spot" },
      },
    ],
  },
  {
    slug: "esperi",
    client: "Esperi",
    // Placeholder path — the campaign shot is still to come from the client.
    image: "/images/cases/esperi.webp",
    size: "small",
    summary: {
      fi: "NØRR3 vahvisti Esperin bränditunnettuutta yhdeksän kuukauden strategialla — Esperistä tuli toimialan toiseksi tunnetuin toimija ja brändimittarit kehittyivät positiivisesti.",
      en: "NØRR3 strengthened Esperi's brand awareness with a nine-month strategy — Esperi became the industry's second most-known player and its brand metrics improved positively.",
    },
    tagline: {
      fi: "Esperi Care & NØRR3 — bränditunnettuuden rakentaminen",
      en: "Esperi Care & NØRR3 — building brand awareness",
    },
    intro: {
      fi: "NØRR3 aloitti yhteistyön Esperin bränditunnettuuden kehittämiseksi keväällä 2024 — vastuulla kokonaisvaltainen mediastrategia, suunnittelu, operointi sekä tulosten mittaaminen ja raportointi.",
      en: "NØRR3 started working with Esperi to develop its brand awareness in spring 2024 — responsible for the full media strategy, planning, operations and the measurement and reporting of results.",
    },
    objectives: {
      fi: "Tavoitteena oli vahvistaa brändin asemaa markkinoilla, lisätä tunnettuutta ja kasvattaa harkintaa alan palveluntarjoajien joukossa.",
      en: "The goal was to strengthen the brand's market position, grow awareness and lift consideration among the industry's providers.",
    },
    solution: {
      fi: "Yhteistyö käynnistyi perusteellisella analyysillä brändin nykytilasta ja markkinapositiosta, kilpailijoiden mediapanostusten kartoituksella sekä strategisella lähestymistavalla seuraavalle yhdeksälle kuukaudelle. Kampanjoissa hyödynnettiin liikkuvaa kuvaa ja emotionaalisesti vetoavaa viestintää — luovana kumppanina toimi Nord DDB.",
      en: "The partnership started with a thorough analysis of the brand's current state and market position, a mapping of competitors' paid-media investment, and a strategic approach for the next nine months. The campaigns used moving image and emotionally resonant messaging — with Nord DDB as the creative partner.",
    },
    methods: [
      { icon: "insights", fi: { title: "Brändianalyysi", body: "Nykytila, markkinapositio ja kilpailijoiden panostukset kartoitettiin." }, en: { title: "Brand analysis", body: "Current state, market position and competitors' investment mapped." } },
      { icon: "space_dashboard", fi: { title: "Mediastrategia", body: "Strateginen lähestyminen seuraavalle yhdeksälle kuukaudelle." }, en: { title: "Media strategy", body: "A strategic approach for the next nine months." } },
      { icon: "campaign", fi: { title: "Luova toteutus", body: "Liikkuva kuva ja kohderyhmälähtöinen viestintä Nord DDB:n kanssa." }, en: { title: "Creative execution", body: "Moving image and audience-led messaging with Nord DDB." } },
    ],
    results: {
      fi: "Esperin brändimittarit kehittyivät positiivisesti: Esperistä tuli toimialan toiseksi tunnetuin toimija ja top-of-mind sekä harkinta nousivat kuuden kuukauden aikana.",
      en: "Esperi's brand metrics developed positively: Esperi became the industry's second most-known player and top-of-mind and consideration rose over six months.",
    },
    metrics: [
      { value: 2, label: { fi: "Toimialan toiseksi tunnetuin toimija", en: "2nd most-known player in the industry" } },
      { value: 9, suffix: " kk", label: { fi: "Strategista suunnittelua", en: "Months of strategic planning" } },
      { value: 6, suffix: " kk", label: { fi: "Brändimittarien kehitysjakso", en: "Brand-metric development window" } },
    ],
    kpi: { value: 2, label: { fi: "toimialan toiseksi tunnetuin", en: "2nd most known in the industry" } },
  },
];

export function getCase(slug: string) {
  return cases.find((c) => c.slug === slug);
}
