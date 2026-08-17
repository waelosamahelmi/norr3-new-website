export type CaseMetric = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: { fi: string; en: string };
};

export type CaseStudy = {
  slug: string;
  client: string;
  image: string;
  size: "large" | "small";
  summary: { fi: string; en: string };
  tagline: { fi: string; en: string };
  intro: { fi: string; en: string };
  objectives: { fi: string; en: string };
  solution: { fi: string; en: string };
  methods: { icon: string; fi: { title: string; body: string }; en: { title: string; body: string } }[];
  results: { fi: string; en: string };
  metrics: CaseMetric[];
  /**
   * The one headline figure the case card and the detail pull-quote lead with.
   * Always a restatement of one of `metrics` in badge-length form — never a new
   * claim — so the card, the quote and the results grid can never disagree.
   */
  kpi: CaseMetric;
  /** When true, the case-detail hero image uses the parallax scroll effect. */
  parallax?: boolean;
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
      fi: "Kiinteistömaailman some-näkyvyyttä kasvatettiin visuaalisella ja tunnistettavalla kampanjalla, joka teki brändistä erottuvan kilpailijoiden joukossa.",
      en: "Kiinteistömaailma's social-media visibility was grown with a visual, recognisable campaign that made the brand stand out from competitors.",
    },
    tagline: {
      fi: "Some-näkyvyys, joka erottuu joukosta",
      en: "Social visibility that stands out from the crowd",
    },
    intro: {
      fi: "Kiinteistömaailma halusi kasvattaa some-näkyvyyttään ja erottua kilpailijoiden joukosta visuaalisesti tunnistettavalla kampanjalla.",
      en: "Kiinteistömaailma wanted to grow its social-media visibility and stand out from competitors with a visually recognisable campaign.",
    },
    objectives: {
      fi: "Kiinteistömaailman tavoitteena oli kasvattaa brändin tunnettuutta ja some-aktiivisuutta sekä vahvistaa visuaalista identiteettiä kilpailijoiden joukossa.",
      en: "Kiinteistömaailma's objective was to grow brand awareness and social-media activity, and strengthen its visual identity among competitors.",
    },
    solution: {
      fi: "Rakensivat visuaalisen some-kampanjan, joka hyödynsi Kiinteistömaailman brändivärejä ja tunnistettavaa tyyliä johdonmukaisesti kaikissa kanavissa.",
      en: "They built a visual social campaign that leveraged Kiinteistömaailma's brand colours and recognisable style consistently across all channels.",
    },
    methods: [
      { icon: "palette", fi: { title: "Visuaalinen suunnittelu", body: "Brändivärit ja tyyli mukautettiin some-formaatteihin tunnistettavasti." }, en: { title: "Visual design", body: "Brand colours and style adapted recognisably for social formats." } },
      { icon: "share", fi: { title: "Some-jakelu", body: "Kampanja rullattiin kanavakohtaisesti optimoiden julkaisuajat ja formaatit." }, en: { title: "Social distribution", body: "The campaign rolled out per channel with optimised timing and formats." } },
      { icon: "analytics", fi: { title: "Mittaus ja optimointi", body: "Näkyvyyttä ja vuorovaikutusta seurattiin ja optimoitiin lennossa." }, en: { title: "Measurement & optimization", body: "Visibility and engagement tracked and optimized in flight." } },
    ],
    results: {
      fi: "Kiinteistömaailman some-näkyvyys ja vuorovaikutus kasvoivat kampanjan aikana, ja brändi erottui kilpailijoiden joukosta johdonmukaisella visuaalisella linjalla.",
      en: "Kiinteistömaailma's social visibility and engagement grew during the campaign, and the brand stood out from competitors with a consistent visual line.",
    },
    metrics: [
      { value: 1080, suffix: "px", label: { fi: "Some-julkaisut formaatissa", en: "Social posts in format" } },
      { value: 2024, label: { fi: "Kampanjavuosi", en: "Campaign year" } },
      { value: 100, suffix: " %", label: { fi: "Brändivärien mukaiset julkaisut", en: "Brand-consistent posts" } },
    ],
    kpi: { value: 2024, label: { fi: "some-kampanja käynnissä", en: "social campaign live" } },
  },
];

export function getCase(slug: string) {
  return cases.find((c) => c.slug === slug);
}
