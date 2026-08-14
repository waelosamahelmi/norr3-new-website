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
};

// Case imagery: real NØRR3 studio photography (the team behind each engagement).
// The 2026 shoot has no client-campaign shots, so we lead with authentic
// candids rather than misleading stock — a distinct shot per case.
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
    slug: "terveystalo",
    client: "Terveystalo",
    image: "/images/cases/terveystalo.webp",
    size: "small",
    summary: {
      fi: "Terveystalo markkinaykköseksi strategisella otteella. Top-of-mind, mainonnan muistaminen ja preferenssi nousuun datalla johdetulla mediastrategialla.",
      en: "Terveystalo to market leadership with a strategic approach. Top-of-mind, ad recall and preference lifted by a data-led media strategy.",
    },
    tagline: {
      fi: "Markkinaykköseksi strategisella otteella",
      en: "To market leadership with a strategic approach",
    },
    intro: {
      fi: "Terveystalo halusi nousta markkinaykköseksi mielikuvamittareissa. Rakensimme datalla johdetun mediastrategian, jolla panostukset ohjattiin sinne, missä ne liikuttavat mittareita.",
      en: "Terveystalo wanted to take the top spot in brand metrics. We built a data-led media strategy that steered investments where they actually move the numbers.",
    },
    objectives: {
      fi: "Terveystalo oli 2022 tasossa tunnettuudessa kakkospaikalla ja preferenssissäkin oli kasvun varaa. Terveystalo tavoitteli asemaa, jossa se on ensimmäisenä mielessä, kun terveyspalveluita harkitaan — ja halusi mediastrategian, joka todennetusti tukee tätä.",
      en: "In 2022 Terveystalo sat second in awareness, with room to grow in preference. It wanted to be first in mind when health services are considered — and a media strategy proven to support that.",
    },
    solution: {
      fi: "Aloitimme työn tarkastelemalla ja analysoimalla kaikkia Suomen kärkipäivien mediapanostuksia ja -mediatiloja. Lisäksi tarkastelimme tiettyjen metriikoiden kehitystä kilpailijoihin nähden — kuten top-of-mind, mainonnan muistaminen, preferenssi sekä harkinta. Datasta rakennettiin analyysi- ja regressiomallit, joilla haettiin selkeyttä mittareiden käyttäytymiseen, ja rakennettiin kaksi vaihtoehtoista mediastrategiaa ja panostusskenaariota vuodelle 2023.",
      en: "We began by reviewing and analyzing the media investments and placements of Finland's market leaders, and tracking key metrics against competitors — top-of-mind, ad recall, preference and consideration. From the data we built analysis and regression models to clarify how the metrics behave, and produced two alternative media strategies and investment scenarios for 2023.",
    },
    methods: [
      { icon: "schedule", fi: { title: "Datan keräys", body: "Mediapanostukset ja mielikuvamittarit koottiin sekä avoimista että suljetuista tutkimustietokannoista." }, en: { title: "Data collection", body: "Media investments and brand metrics were gathered from open and closed research databases." } },
      { icon: "track_changes", fi: { title: "Analyysi", body: "Metriikoiden kehitystä kilpailijoihin verrattiin regressiomalleilla, jotka selittivät mittareiden käyttäytymistä." }, en: { title: "Analysis", body: "Metric development versus competitors was modeled with regressions explaining how the numbers behave." } },
      { icon: "space_dashboard", fi: { title: "Mediastrategia ja panostukset", body: "Kaksi vaihtoehtoista strategiaa ja panostusskenaariota vuodelle 2023, selkein perusteluin." }, en: { title: "Media strategy & investment", body: "Two alternative strategies and investment scenarios for 2023, with clear reasoning." } },
    ],
    results: {
      fi: "Vuoden 2023 ensimmäisellä puoliskolla Terveystalo nousi ykköseksi muun muassa seuraavilla mittareilla: top-of-mind, mainonnan muistaminen sekä preferenssi. Data: Kantarin Terveystalolle toteuttama brand-tracking, 2023.",
      en: "In the first half of 2023 Terveystalo rose to first place in metrics including top-of-mind, ad recall and preference. Data: Kantar brand tracking for Terveystalo, 2023.",
    },
    metrics: [
      { value: 13, suffix: " %", label: { fi: "Top-of-mind nousi kilpailijoita nopeammin", en: "Top-of-mind grew faster than competitors" } },
      { value: 15, suffix: " %", label: { fi: "Preferenssin kasvu tavoiteyleisössä", en: "Preference growth in the target audience" } },
      { value: 10, suffix: " %", label: { fi: "Mainonnan muistaminen nousi vuodessa", en: "Ad recall lift in one year" } },
      { value: 1, label: { fi: "Sija mielikuvamittareissa H1/2023", en: "Rank in brand metrics H1/2023" } },
    ],
    kpi: { value: 1, prefix: "#", label: { fi: "mielikuvamittareissa H1/2023", en: "in brand metrics H1/2023" } },
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
];

export function getCase(slug: string) {
  return cases.find((c) => c.slug === slug);
}
