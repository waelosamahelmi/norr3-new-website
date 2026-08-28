import type { Locale } from "@/i18n/config";

export type ServicePage = {
  slug: string;
  icon: string;
  fi: {
    title: string;
    metaTitle: string;
    metaDescription: string;
    heroLeft: string;
    heroAccent: string;
    intro: string;
    sections: { heading: string; body: string }[];
    bullets: string[];
  };
  en: {
    title: string;
    metaTitle: string;
    metaDescription: string;
    heroLeft: string;
    heroAccent: string;
    intro: string;
    sections: { heading: string; body: string }[];
    bullets: string[];
  };
};

export const servicePages: ServicePage[] = [
  {
    slug: "insight-strategia",
    icon: "zoom_in_map",
    fi: {
      title: "Insight & strategia",
      metaTitle: "Insight ja strategiapalvelut | NØRR3 Helsinki",
      metaDescription: "Brändi- ja tunnettuusseuranta, kohderyhmätutkimus, mediankäyttötutkimus ja mediastrategia — dataan perustuva suunnittelu Helsingissä.",
      heroLeft: "Strategia alkaa",
      heroAccent: "ymmärryksestä",
      intro: "Ennen kuin mediaan sijoitetaan euroa, me ymmärrämme kenet tavoitellaan, missä hän liikkuu ja mitä kilpailijat tekevät. Insight&strategia on se perusta, jolle jokainen kasvava kampanja rakennetaan.",
      sections: [{ heading: "Brändi- ja tunnettuusseuranta", body: "Mittaatko oikeita asioita? Rakennamme tunnettuus- ja brändimittarit, joiden pohjalta mediaa ohjataan — etukäteen ja jälkeenpäin." }, { heading: "Kohderyhmätutkimus", body: "Kuka oikeasti ostaa sinulta ja mitä mediaa hän kuluttaa? Kohderyhmän koostumus paneelidatalla, ei mutulla." }, { heading: "Mediankäyttötutkimus", body: "Kanavien tavoittavuus ja hinta suhteessa juuri sinun yleisöösi — oma Media Insights -työkalumme näyttää sen." }, { heading: "Mediastrategia", body: "Strateginen raami, joka kääntää liiketoiminnan tavoitteet mediaksi: kanavat, ajoitus, budjetti ja mittarit." }],
      bullets: ["Kohderyhmämääritys ja insight-raportti", "Mediasuunnitelman strateginen raami", "Tunnettuus- ja brändimittarit", "Kilpailija-analyysi", "Mittarit ja tavoitteet kampanjalle"],
    },
    en: {
      title: "Insight & Strategy",
      metaTitle: "Insight and Strategy Services | NØRR3 Helsinki",
      metaDescription: "Brand and awareness tracking, audience research, media consumption research and media strategy — data-driven planning in Helsinki.",
      heroLeft: "Strategy starts",
      heroAccent: "with insight",
      intro: "Before a single euro goes into media, we understand who to reach, where they move and what competitors are doing. Insight and strategy is the foundation every growth campaign is built on.",
      sections: [{ heading: "Brand and awareness tracking", body: "Are you measuring the right things? We build awareness and brand metrics that media decisions can hang on — before and after." }, { heading: "Audience research", body: "Who actually buys from you and what media do they use? Audience composition from panel data, not guesswork." }, { heading: "Media consumption research", body: "Channel reach and pricing against your specific audience — our own Media Insights tool shows it." }, { heading: "Media strategy", body: "The strategic frame that turns business goals into media: channels, timing, budget and metrics." }],
      bullets: ["Audience definition and insight report", "The strategic frame for the media plan", "Awareness and brand metrics", "Competitor analysis", "Metrics and goals for the campaign"],
    },
  },
  {
    slug: "data-ja-mittaus",
    icon: "monitoring",
    fi: {
      title: "Data ja mittaus",
      metaTitle: "Data ja mittaus — konversiomittaus, mallit ja integraatiot | NØRR3",
      metaDescription: "Konversiomittaus myyntiin asti, mittausmallit ja todentaminen, data layer ja integraatiot. Jokainen mediaeuro mitataan — Helsingissä.",
      heroLeft: "Jokainen euro",
      heroAccent: "mitataan",
      intro: "Mediastrategia alkaa datasta ja päättyy todennettuun tulokseen. Mittaamme aina myynti- tai CRM-dataan asti — ei pelkkiä klikkejä — joten tiedät mitä jokainen mediaeuro oikeasti tuotti.",
      sections: [{ heading: "Konversiomittaus", body: "Todennamme mitä media oikeasti tuottaa: mittaukset myynti-/CRM-dataan asti, ei vain liikennettä verkkosivulle." }, { heading: "Mittausmalli ja todentaminen", body: "Mittaripuu, joka yhdistää liiketoiminnan tavoitteet kanavatason mittareihin — ja todentaa tulokset numeroilla." }, { heading: "Data layer ja integraatiot", body: "Tuote-, varasto-, CRM- ja kampanjadata yhteen ketjuun: mediat ja järjestelmäsi puhuvat toisilleen ilman manuaalista kopiointia." }],
      bullets: ["Todentamisen malli ja mittaripuu", "Konversiomittaus myyntidataan asti", "Reaaliaikaiset dashboardit", "Data layer ja integraatiot", "Optimointisuositukset datan pohjalta"],
    },
    en: {
      title: "Data & Measurement",
      metaTitle: "Data and Measurement — Conversion, Models, Integrations | NØRR3",
      metaDescription: "Conversion measurement down to sales, measurement models and verification, data layer and integrations. Every media euro is measured — in Helsinki.",
      heroLeft: "Every euro",
      heroAccent: "is measured",
      intro: "A media strategy starts with data and ends with a verified result. We always measure down to sales or CRM data — not just clicks — so you know what every media euro actually produced.",
      sections: [{ heading: "Conversion measurement", body: "We verify what media actually produces: measurement all the way to sales/CRM data, not just site traffic." }, { heading: "Measurement model and verification", body: "A metric tree that connects business goals to channel-level metrics — and verifies results with numbers." }, { heading: "Data layer and integrations", body: "Product, inventory, CRM and campaign data into one chain: your media and your systems talk to each other without manual copying." }],
      bullets: ["Verification model and metric tree", "Conversion measurement down to sales data", "Real-time dashboards", "Data layer and integrations", "Data-driven optimisation recommendations"],
    },
  },
  {
    slug: "data-ja-mittaus/dashboardit",
    icon: "space_dashboard",
    fi: {
      title: "Dashboardit",
      metaTitle: "Dashboardit — reaaliaikainen raportointi | NØRR3",
      metaDescription: "Reaaliaikaiset asiakasdashboardit, joissa kampanjoiden tulokset näkyvät ilman odottelua — NØRR3 Dashboard -asiakasportaali.",
      heroLeft: "Tulokset näkyvät",
      heroAccent: "reaaliajassa",
      intro: "Kampanjan tulokset eivät odota raportointikierrosta. NØRR3 Dashboard näyttää tavoittavuuden, hinnan ja konversiot reaaliajassa — aina auki, aina ajantasainen.",
      sections: [{ heading: "NØRR3 Dashboard", body: "Asiakasportaali, jossa kampanjoiden tulokset näkyvät reaaliajassa. Ei odottelua kuukausiraporttiin — data on aina ajantasainen." }, { heading: "Räätälöidyt näkymät", body: "Jokaiselle sidosryhmälle oma näkymä: johdolle kokonaisuus, markkinoinnille kanavakohtaisuus, kaupalle myyntidata." }],
      bullets: ["Reaaliaikainen näkyvyys tuloksiin", "Kanava- ja kampanjakohtaiset näkymät", "Myyntidataan asti -mittaus", "Automaattiset raportit", "Käyttöoikeudet rooleittain"],
    },
    en: {
      title: "Dashboards",
      metaTitle: "Dashboards — Real-time Reporting | NØRR3",
      metaDescription: "Real-time client dashboards where campaign results are visible without waiting — the NØRR3 Dashboard client portal.",
      heroLeft: "Results visible",
      heroAccent: "in real time",
      intro: "Campaign results don't wait for a reporting round. The NØRR3 Dashboard shows reach, cost and conversions in real time — always open, always current.",
      sections: [{ heading: "NØRR3 Dashboard", body: "A client portal where campaign results show in real time. No waiting for a monthly report — the data is always up to date." }, { heading: "Tailored views", body: "Each stakeholder gets their own view: the big picture for management, channel detail for marketing, sales data for commerce." }],
      bullets: ["Real-time visibility into results", "Channel and campaign level views", "Measurement down to sales data", "Automated reports", "Role-based access"],
    },
  },
  {
    slug: "data-ja-mittaus/datan-mallintaminen",
    icon: "query_stats",
    fi: {
      title: "Datan mallintaminen",
      metaTitle: "Datan mallintaminen — ROMI, ROAS ja arviointi | NØRR3",
      metaDescription: "ROMI- ja ROAS-laskenta, mediamix-mallintaminen ja tulosten arviointi datalla. Tiedät mitä media investointina tuotti.",
      heroLeft: "Data mallinnetaan",
      heroAccent: "tulokseksi",
      intro: "Mitä media investointina tuotti? Mallinnamme mediamixin vaikutuksen ja laskemme ROMIn ja ROASin — numeroina, jotka kestävät hallituksen katseen.",
      sections: [{ heading: "ROMI- ja ROAS-laskenta", body: "Palautus mediaan sijoitetulle pääomalle, laskettuna myyntiin asti ulottuvalla datalla." }, { heading: "Mediamix-mallintaminen", body: "Mallinnamme miten kanavat vaikuttavat yhdessä — ja missä seuraava euro kannattaa sijoittaa." }],
      bullets: ["ROMI ja ROAS myyntidataan perustuen", "Mediamix-mallinnus", "Kanavien välinen vaikutusanalyysi", "Budjetin allokaatiosuositukset"],
    },
    en: {
      title: "Data Modelling",
      metaTitle: "Data Modelling — ROMI, ROAS and Evaluation | NØRR3",
      metaDescription: "ROMI and ROAS calculation, media mix modelling and results evaluation with data. Know what media produced as an investment.",
      heroLeft: "Data modelled",
      heroAccent: "into results",
      intro: "What did media produce as an investment? We model the media mix effect and calculate ROMI and ROAS — numbers that survive boardroom scrutiny.",
      sections: [{ heading: "ROMI and ROAS calculation", body: "Return on media investment, calculated on data that reaches down to sales." }, { heading: "Media mix modelling", body: "We model how channels work together — and where the next euro should go." }],
      bullets: ["ROMI and ROAS based on sales data", "Media mix modelling", "Cross-channel impact analysis", "Budget allocation recommendations"],
    },
  },
  {
    slug: "markkinointistrategia",
    icon: "strategy",
    fi: {
      title: "Markkinointistrategia",
      metaTitle: "Markkinointistrategia — suunnittelu datalla | NØRR3 Helsinki",
      metaDescription: "Markkinointistrategia, joka perustuu mediapanostusdataan ja tutkimukseen — ei mutuun. Suunnitelma kasvulle Helsingissä.",
      heroLeft: "Suunnitelma",
      heroAccent: "kasvulle",
      intro: "Markkinointistrategia, joka perustuu tutkimukseen ja mediapanostusdataan. Määrittelemme tavoitteet, kohderyhmät, kanavat ja budjetit — ja mittarit joilla onnistuminen todennetaan.",
      sections: [{ heading: "Dataan perustuva suunnittelu", body: "Kohderyhmä-, kilpailija- ja mediapanostusdata määrittävät suunnan — emme arvaile." }, { heading: "Liiketoiminnasta mediaan", body: "Strategia kääntyy konkreettiseksi mediamixiksi: kanavat, ajoitus, budjetti ja vastuut." }],
      bullets: ["Tavoitteet ja mittarit", "Kohderyhmä- ja kilpailija-analyysi", "Mediamix ja budjettiraami", "Kanaval valinta ja ajoitus", "Vuosikello kampanjoille"],
    },
    en: {
      title: "Marketing Strategy",
      metaTitle: "Marketing Strategy — Data-driven Planning | NØRR3 Helsinki",
      metaDescription: "Marketing strategy based on media investment data and research — not guesswork. A plan for growth in Helsinki.",
      heroLeft: "A plan",
      heroAccent: "for growth",
      intro: "A marketing strategy built on research and media investment data. We define goals, audiences, channels and budgets — and the metrics that prove success.",
      sections: [{ heading: "Data-driven planning", body: "Audience, competitor and media investment data set the direction — we don't guess." }, { heading: "From business to media", body: "The strategy becomes a concrete media mix: channels, timing, budget and ownership." }],
      bullets: ["Goals and metrics", "Audience and competitor analysis", "Media mix and budget frame", "Channel selection and timing", "Annual campaign calendar"],
    },
  },

  {
    slug: "hakukoneoptimointi",
    icon: "search",
    fi: {
      title: "Hakukoneoptimointi ja hakumainonta",
      metaTitle: "Hakukoneoptimointi (SEO) ja hakumainonta (SEM) | NØRR3 Helsinki",
      metaDescription:
        "Hakukoneoptimointi, hakukonemarkkinointi ja GEO: löydy Googlesta ja tekoälyavustajien vastauksista. SEO-auditista jatkuvaan optimointiin — Helsingissä.",
      heroLeft: "Löydy sieltä, mistä",
      heroAccent: "sinua etsitään",
      intro:
        "Kun asiakas hakee ratkaisua, hän aloittaa Googlesta — ja yhä useammin ChatGPT:stä tai Geministä. Varmistamme, että sinä olet siellä, missä ostopäätös alkaa.",
      sections: [
        {
          heading: "Hakukoneoptimointi (SEO)",
          body: "Rakennamme teknisen ja sisällöllisen perustan, joka nostaa sivustosi orgaanista näkyvyyttä pitkäjänteisesti. Auditista löydämme esteet, korjaamme ne ja luomme sisältöstrategian, joka vastaa siihen, mitä asiakkaasi oikeasti hakevat.",
        },
        {
          heading: "Hakukonemarkkinointi (SEM)",
          body: "Hakutulosten kärkeen heti — mainoksilla siellä, missä ostoaikeus on korkein. Optimoimme sanat, mainokset ja laskeutumissivut niin, että jokainen klikki tuo mitattavaa tulosta.",
        },
        {
          heading: "GEO — näkyvyys tekoälyn vastauksissa",
          body: "Tekoälyavustajat suosittelevat brändejä vastauksissaan. Varmistamme, että yrityksesi data ja sisältö ovat siinä kunnossa, että ChatGPT ja Gemini suosittelevat juuri sinua.",
        },
      ],
      bullets: ["SEO-audit ja korjauslista", "Avainsanatutkimus ja sisältöstrategia", "Hakutulosten kärkeen mainoksilla", "GEO / AI-löydettävyys", "Jatkuva optimointi ja raportointi"],
    },
    en: {
      title: "SEO and Search Advertising",
      metaTitle: "SEO and Search Advertising (SEM) | NØRR3 Helsinki",
      metaDescription:
        "Search engine optimisation, search advertising and GEO: get found on Google and in AI assistant answers. From an SEO audit to continuous optimisation — in Helsinki.",
      heroLeft: "Get found where",
      heroAccent: "you're searched for",
      intro:
        "When a customer looks for a solution, they start on Google — and increasingly in ChatGPT or Gemini. We make sure you show up where the buying decision begins.",
      sections: [
        {
          heading: "Search engine optimisation (SEO)",
          body: "We build the technical and content foundation that lifts your organic visibility for the long term. The audit finds the blockers, we fix them, and we build a content strategy that matches what your customers actually search for.",
        },
        {
          heading: "Search advertising (SEM)",
          body: "To the top of the results immediately — with ads where purchase intent is highest. We optimise keywords, ads and landing pages so every click produces measurable results.",
        },
        {
          heading: "GEO — visibility in AI answers",
          body: "AI assistants recommend brands in their answers. We make sure your data and content are in the shape that makes ChatGPT and Gemini recommend you.",
        },
      ],
      bullets: ["SEO audit and fix list", "Keyword research and content strategy", "To the top of search with ads", "GEO / AI discoverability", "Continuous optimisation and reporting"],
    },
  },
  {
    slug: "ohjelmallinen-ostaminen",
    icon: "hub",
    fi: {
      title: "Ohjelmallinen ostaminen",
      metaTitle: "Ohjelmallinen ostaminen ja DOOH | NØRR3 Helsinki",
      metaDescription:
        "Ohjelmallinen ostaminen: display, video, audio ja ulkomainonta (pDOOH) yhdestä alustasta. Reaaliaikainen optimointi ja läpinäkyvä raportointi — Helsingissä.",
      heroLeft: "Media ostetaan",
      heroAccent: "ohjelmallisesti",
      intro:
        "Ohjelmallinen ostaminen tarkoittaa mediaa, joka ostetaan ja optimoidaan datalla reaaliajassa — ilman manuaalisia kierroksia. Display, video, audio ja ulkomainonta samasta alustasta.",
      sections: [
        {
          heading: "Display ja video",
          body: "Ohjelmallinen display ja video tavoittavat oikean yleisön oikeassa kontekstissa — ja optimoituvat automaattisesti sen mukaan, mikä toimii.",
        },
        {
          heading: "Ulkomainonta ja pDOOH",
          body: "Ohjelmallinen ulkomainonta (programmatic DOOH) yhdistää digitaalisten näyttöjen tavoittavuuden datapohjaiseen ostoon — joustavasti ja mitattavasti.",
        },
        {
          heading: "Digitaalinen audio",
          body: "Podcastit, suoratoisto ja radiodigitointi ohjelmallisesti — kohdennettuna kuunteluhetkeen ja yleisöön.",
        },
      ],
      bullets: ["Kanavariippumaton suunnittelu", "Reaaliaikainen optimointi", "Läpinäkyvä hinnoittelu ja raportointi", "DCO ja syötepohjaiset luovat", "Yksi alusta, kaikki kanavat"],
    },
    en: {
      title: "Programmatic Buying",
      metaTitle: "Programmatic Buying and DOOH | NØRR3 Helsinki",
      metaDescription:
        "Programmatic buying: display, video, audio and out-of-home (pDOOH) from one platform. Real-time optimisation and transparent reporting — in Helsinki.",
      heroLeft: "Media, bought",
      heroAccent: "programmatically",
      intro:
        "Programmatic buying means media that is bought and optimised with data in real time — without manual rounds. Display, video, audio and out-of-home from one platform.",
      sections: [
        {
          heading: "Display and video",
          body: "Programmatic display and video reach the right audience in the right context — and optimise automatically toward what works.",
        },
        {
          heading: "Out-of-home and pDOOH",
          body: "Programmatic DOOH combines the reach of digital screens with data-driven buying — flexibly and measurably.",
        },
        {
          heading: "Digital audio",
          body: "Podcasts, streaming and digital radio programmatically — targeted to the listening moment and the audience.",
        },
      ],
      bullets: ["Channel-agnostic planning", "Real-time optimisation", "Transparent pricing and reporting", "DCO and feed-based creatives", "One platform, every channel"],
    },
  },
  {
    slug: "mediasuunnittelu",
    icon: "edit_note",
    fi: {
      title: "Mediasuunnittelu ja -ostaminen",
      metaTitle: "Mediasuunnittelu ja median osto | NØRR3 Helsinki",
      metaDescription:
        "Mediasuunnittelu ja median osto, joka muuttaa budjetin kasvuksi. Dataan perustuva mediamix, neuvotellut sopimukset ja optimointi — Helsingissä.",
      heroLeft: "Budjetti muuttuu",
      heroAccent: "kasvuksi",
      intro:
        "Mediasuunnittelu alkaa liiketoiminnan tavoitteesta, ei kanavasta. Rakennamme datalla perustellun mediamixin, neuvottelemme ostot ja optimoimme kampanjan elinkaaren jokaisen vaiheen.",
      sections: [
        {
          heading: "Dataan perustuva suunnitelma",
          body: "Kohderyhmä-, kilpailija- ja mediankäyttödata määrittävät, mihin euro kannattaa laittaa — ei mutu, vaan tutkittu tieto.",
        },
        {
          heading: "Osto ja neuvottelu",
          body: "Neuvottelemme mediatalojen kanssa ja ostamme kaikki kanavat yhdestä paikasta — TV:stä sosiaaliseen mediaan ja ulkomainontaan.",
        },
        {
          heading: "Optimointi lennossa",
          body: "Kampanjan aikana siirrämme panoksia sinne, mikä toimii — jokainen euro tuottaa enemmän.",
        },
      ],
      bullets: ["Mediamix ja budjettiraami", "Neuvotellut mediatalosopimukset", "Kanavariippumaton osto", "Jatkuva optimointi", "Todennettu raportointi"],
    },
    en: {
      title: "Media Planning and Buying",
      metaTitle: "Media Planning and Buying | NØRR3 Helsinki",
      metaDescription:
        "Media planning and buying that turns budget into growth. Data-driven media mix, negotiated deals and optimisation — in Helsinki.",
      heroLeft: "Budget, turned into",
      heroAccent: "growth",
      intro:
        "Media planning starts with the business goal, not the channel. We build a data-backed media mix, negotiate the buys and optimise every stage of the campaign lifecycle.",
      sections: [
        {
          heading: "A data-based plan",
          body: "Audience, competitor and media-usage data decide where each euro should go — not gut feel, but researched fact.",
        },
        {
          heading: "Buying and negotiation",
          body: "We negotiate with media houses and buy every channel from one place — from TV to social and out-of-home.",
        },
        {
          heading: "Optimisation in flight",
          body: "During the campaign we shift spend toward what works — every euro produces more.",
        },
      ],
      bullets: ["Media mix and budget frame", "Negotiated media house deals", "Channel-agnostic buying", "Continuous optimisation", "Verified reporting"],
    },
  },
  {
    slug: "ulkomainonta",
    icon: "location_on",
    fi: {
      title: "Ulkomainonta ja pDOOH",
      metaTitle: "Ulkomainonta ja pDOOH | NØRR3 Helsinki",
      metaDescription:
        "Ulkomainonta ja ohjelmallinen DOOH: digitaaliset näytöt, joustava ostaminen ja mitattava tavoittavuus — suunnittelusta toteutukseen Helsingissä.",
      heroLeft: "Näkyvyyttä, jota ei voi",
      heroAccent: "ohittaa",
      intro:
        "Ulkomainonta tavoittaa siellä, missä ihminen liikkuu — kadulla, terminaalissa ja kaupan edustalla. Ohjelmallinen DOOH tekee siitä joustavaa ja mitattavaa.",
      sections: [
        {
          heading: "Digitaalinen ulkomainonta",
          body: "Digitaaliset näytöt tuovat liikkuvan kuvan ja ajantasaisen viestin — vaihdettavissa hetkessä, ei painoaikatauluissa.",
        },
        {
          heading: "Ohjelmallinen DOOH",
          body: "Ostamme näyttöjä datalla: oikea viesti, oikeassa paikassa, oikeaan aikaan — ja tulokset mitataan.",
        },
      ],
      bullets: ["Digitaaliset näytöt ja pinnat", "pDOOH-osto ja optimointi", "Ajantasaiset, vaihdettavat luovat", "Mitatattu tavoittavuus"],
    },
    en: {
      title: "Out-of-Home and pDOOH",
      metaTitle: "Out-of-Home and pDOOH | NØRR3 Helsinki",
      metaDescription:
        "Out-of-home and programmatic DOOH: digital screens, flexible buying and measurable reach — from planning to execution in Helsinki.",
      heroLeft: "Visibility you",
      heroAccent: "can't skip",
      intro:
        "Out-of-home reaches people where they move — on the street, in terminals and outside stores. Programmatic DOOH makes it flexible and measurable.",
      sections: [
        {
          heading: "Digital out-of-home",
          body: "Digital screens bring moving imagery and up-to-date messaging — changeable in a moment, not bound to print schedules.",
        },
        {
          heading: "Programmatic DOOH",
          body: "We buy screens with data: the right message, in the right place, at the right time — and the results are measured.",
        },
      ],
      bullets: ["Digital screens and inventory", "pDOOH buying and optimisation", "Up-to-date, swappable creatives", "Measured reach"],
    },
  },
  {
    slug: "performance-markkinointi",
    icon: "trending_up",
    fi: {
      title: "Performance-markkinointi",
      metaTitle: "Performance-markkinointi | NØRR3 Helsinki",
      metaDescription:
        "Performance-markkinointi: tulospohjainen ostaminen, dynaaminen ja personoitu mainonta sekä aineistojen automaatio — konkreettisia tuloksia Helsingistä.",
      heroLeft: "Mainonta, joka",
      heroAccent: "tuottaa",
      intro:
        "Performance-markkinointi tarkoittaa mainontaa, jonka tulos mitataan — ei näyttöjä, vaan konversioita. Ostamme tulospohjaisesti ja automatisoimme aineistot.",
      sections: [
        {
          heading: "Tulospohjainen ostaminen",
          body: "Maksat tuloksesta, et näytöstä. Hinta per konversio, ja jokainen euro ohjataan sinne, mikä konvertoi.",
        },
        {
          heading: "Dynaaminen ja personoitu mainonta",
          body: "Tuhansia versioita yhdestä masterista — tuote- ja asiakasdata muuttaa viestin oikeaksi jokaiselle katsojalle.",
        },
        {
          heading: "Aineistojen automaatio",
          body: "Aineistot päivittyvät itsestään syötteestä. Ei manuaalisia kierroksia, vaan aina ajantasainen luova.",
        },
      ],
      bullets: ["Tulosvastuinen ostaminen", "Hintatehokkuus per konversio", "Personoidut aineistot ja automaatio", "Skaalautuva malli kasvuun"],
    },
    en: {
      title: "Performance Marketing",
      metaTitle: "Performance Marketing | NØRR3 Helsinki",
      metaDescription:
        "Performance marketing: performance-based buying, dynamic and personalised advertising, and asset automation — concrete results from Helsinki.",
      heroLeft: "Advertising that",
      heroAccent: "delivers",
      intro:
        "Performance marketing means advertising whose result is measured — not impressions, but conversions. We buy on results and automate the assets.",
      sections: [
        {
          heading: "Performance-based buying",
          body: "You pay for results, not impressions. Price per conversion, with every euro steered toward what converts.",
        },
        {
          heading: "Dynamic and personalised advertising",
          body: "Thousands of versions from one master — product and customer data make the message right for every viewer.",
        },
        {
          heading: "Asset automation",
          body: "Assets update themselves from the feed. No manual rounds — always-current creative.",
        },
      ],
      bullets: ["Accountable buying", "Cost efficiency per conversion", "Personalised creatives and automation", "A scalable model for growth"],
    },
  },

  {
    slug: "mediasuunnittelu/norr3-media-insights",
    icon: "insights",
    fi: {
      title: "NØRR3 Media Insights",
      metaTitle: "NØRR3 Media Insights — mediankäyttötutkimus | NØRR3",
      metaDescription: "Oma työkalumme, joka näyttää kanavien tavoittavuuden ja hinnat suhteessa juuri sinun yleisöösi — data, ei mutu.",
      heroLeft: "Kanavat",
      heroAccent: "datalla valittuna",
      intro: "NØRR3 Media Insights näyttää miten B2C- tai B2B-yleisösi mediaa käyttää: tavoittavuus ja hinta kanavittain, suhteessa juuri sinun kohderyhmääsi. Lopeta arvailu, aloita datalla suunnittelu.",
      sections: [{ heading: "Tavoittavuus ja hinta omalle yleisöllesi", body: "Työkalu näyttää kanavien tavoittavuuden ja pintasivät suhteessa juuri sinun yleisöösi — ei keskiarvoihin." }, { heading: "Päivitetty data", body: "Norstat-kerätty data 3–4 kertaa vuodessa, yli 1500 kuluttajaa ja 300+ B2B-päätöksentekijää per kierros." }],
      bullets: ["Kanavakohtainen tavoittavuus", "Hintatiedot mediavaihtoehdoista", "B2C- ja B2B-yleisöt", "Säästä 25 % mainoskuluissa", "Aina ajantasainen panelidata"],
    },
    en: {
      title: "NØRR3 Media Insights",
      metaTitle: "NØRR3 Media Insights — Media Consumption Research | NØRR3",
      metaDescription: "Our own tool showing channel reach and pricing against your specific audience — data over guesswork.",
      heroLeft: "Channels",
      heroAccent: "chosen by data",
      intro: "NØRR3 Media Insights shows how your B2C or B2B audience uses media: reach and pricing per channel, relative to your specific audience. Stop guessing, start planning with data.",
      sections: [{ heading: "Reach and price for your audience", body: "The tool shows channel reach and pricing against your specific audience — not averages." }, { heading: "Up-to-date data", body: "Norstat-collected data 3–4 times a year, over 1,500 consumers and 300+ B2B decision-makers per round." }],
      bullets: ["Channel-level reach", "Pricing data for media options", "B2C and B2B audiences", "Save 25% on ad spend", "Always-current panel data"],
    },
  },
  {
    slug: "mediasuunnittelu/radio",
    icon: "graphic_eq",
    fi: {
      title: "Radiomainonta",
      metaTitle: "Radiomainonta — suunnittelu ja osto | NØRR3",
      metaDescription: "Radiomainonta tavoittaa ja liikuttaa: suunnittelu, ostot ja optimointi kaikilla kanavilla — NØRR3 Helsingissä.",
      heroLeft: "Radio",
      heroAccent: "liikuttaa",
      intro: "Radiomainonta tavoittaa kuulijan kotona, autossa ja työmatkalla. Suunnittelemme ja ostamme radiokampanjat osana kokonaismediamixiä — mitattuna.",
      sections: [{ heading: "Suunnittelu ja osto", body: "Kanava- ja ohjelmavalinnat yleisödatalla, neuvotellut hinnat ja optimointi kampanjan aikana." }, { heading: "Radio osana mixiä", body: "Radio toimii parhaiten yhdessä: se rakentaa tunnettuutta, jonka digikanavat konvertoivat." }],
      bullets: ["Kanava- ja ohjelmavalinta datalla", "Neuvotellut radiotalosopimukset", "Optimointi lennossa", "Mittaus tavoittavuuteen"],
    },
    en: {
      title: "Radio Advertising",
      metaTitle: "Radio Advertising — Planning and Buying | NØRR3",
      metaDescription: "Radio advertising reaches and moves: planning, buying and optimisation across channels — NØRR3 in Helsinki.",
      heroLeft: "Radio",
      heroAccent: "moves people",
      intro: "Radio reaches the listener at home, in the car and on the commute. We plan and buy radio campaigns as part of the total media mix — measured.",
      sections: [{ heading: "Planning and buying", body: "Channel and programme selections on audience data, negotiated rates and in-flight optimisation." }, { heading: "Radio as part of the mix", body: "Radio works best together: it builds the awareness that digital channels convert." }],
      bullets: ["Data-driven channel and programme selection", "Negotiated radio house deals", "In-flight optimisation", "Reach measurement"],
    },
  },
  {
    slug: "mediasuunnittelu/televisio",
    icon: "tv",
    fi: {
      title: "TV-mainonta",
      metaTitle: "TV-mainonta — suunnittelu ja osto | NØRR3",
      metaDescription: "TV-mainonta rakentaa tunnettuutta mittakaavalla: suunnittelu, ostot ja optimointi — NØRR3 mediatoimisto Helsingissä.",
      heroLeft: "TV rakentaa",
      heroAccent: "mittakaavaa",
      intro: "TV-mainonta rakentaa tunnettuutta kuten mikään muu kanava. Suunnittelemme TV-ostot yleisödatalla ja yhdistämme ne digikanaviin mitattavaksi kokonaisuudeksi.",
      sections: [{ heading: "Suunnittelu ja osto", body: "Ohjelmat, ajankohdat ja hinnat yleisödatalla — neuvoteltuna, ei hinnaston mukaan." }, { heading: "TV + digi yhdessä", body: "Yhdistämme TV-tunnettuuden digikonversioon: sama viesti, mitattava lopputulos." }],
      bullets: ["Ohjelma- ja aikavalinta datalla", "Neuvotellut TV-sopimukset", "Yhdistetty TV+digi-mittaus", "Optimointi kampanjan aikana"],
    },
    en: {
      title: "TV Advertising",
      metaTitle: "TV Advertising — Planning and Buying | NØRR3",
      metaDescription: "TV advertising builds awareness at scale: planning, buying and optimisation — NØRR3 media agency in Helsinki.",
      heroLeft: "TV builds",
      heroAccent: "at scale",
      intro: "TV advertising builds awareness like no other channel. We plan TV buys on audience data and combine them with digital into a measurable whole.",
      sections: [{ heading: "Planning and buying", body: "Programmes, slots and rates on audience data — negotiated, not list price." }, { heading: "TV + digital together", body: "We combine TV awareness with digital conversion: the same message, a measurable result." }],
      bullets: ["Data-driven programme and slot selection", "Negotiated TV deals", "Combined TV+digital measurement", "In-flight optimisation"],
    },
  },
  {
    slug: "mediasuunnittelu/elokuvamainonta-eli-cinema",
    icon: "movie",
    fi: {
      title: "Elokuvamainonta (Cinema)",
      metaTitle: "Elokuvamainonta — Cinema | NØRR3",
      metaDescription: "Elokuvamainonta tavoittaa katsojan suurella elämyksellä: suunnittelu ja osto elokuvateattereihin — NØRR3 Helsingissä.",
      heroLeft: "Suurella",
      heroAccent: "elämyksellä",
      intro: "Elokuvamainonta tavoittaa katsojan silloin, kun hän on keskittynyt ja vastaanottavainen. Isolla ruudulla viesti jää mieleen — ja mittaa on.",
      sections: [{ heading: "Suunnittelu ja osto", body: "Elokuvateatteriketjut, elokuvat ja ajankohdat kohderyhmän mukaan neuvoteltuna." }, { heading: "Mitta ja elämys", body: "Cinema tarjoaa television mittakaavan ilman kaukosäädintä — katsoja on paikallaan viestin edessä." }],
      bullets: ["Teatteri- ja elokuvavalinta", "Neuvotellut sopimukset", "Kohdennus elokuvan mukaan", "Tunnettuusvaikutus suurella ruudulla"],
    },
    en: {
      title: "Cinema Advertising",
      metaTitle: "Cinema Advertising | NØRR3",
      metaDescription: "Cinema advertising reaches the viewer with a big experience: planning and buying for movie theatres — NØRR3 in Helsinki.",
      heroLeft: "On the big",
      heroAccent: "screen",
      intro: "Cinema advertising reaches the viewer when they are focused and receptive. On the big screen the message stays — at scale.",
      sections: [{ heading: "Planning and buying", body: "Theatre chains, films and slots selected by target audience, negotiated." }, { heading: "Scale and experience", body: "Cinema offers TV-scale attention without the remote — the viewer is seated in front of your message." }],
      bullets: ["Theatre and film selection", "Negotiated deals", "Targeting by film", "Awareness impact on the big screen"],
    },
  },
  {
    slug: "mediasuunnittelu/printti-eli-lehtimainonta",
    icon: "newspaper",
    fi: {
      title: "Printti eli lehtimainonta",
      metaTitle: "Lehtimainonta — printtimainonta | NØRR3",
      metaDescription: "Lehti- ja printtimainonta: suunnittelu, ostot ja tuotanto sanoma- ja aikakauslehtiin — NØRR3 Helsingissä.",
      heroLeft: "Printti",
      heroAccent: "elää",
      intro: "Printtimainonta elää yhä: lehti luetaan keskittyneesti ja mainos jää sivulle. Suunnittelemme ja ostamme lehtimainonnan osana kokonaisuutta.",
      sections: [{ heading: "Suunnittelu ja osto", body: "Lehdet, numerot ja sijoitukset kohderyhmän mukaan — neuvoteltuna." }, { heading: "Printti osana mixiä", body: "Printti tuo syvyyttä ja pysyvyyttä: se toimii maineen rakentajana digikanavien rinnalla." }],
      bullets: ["Lehti- ja numerovalinta", "Neuvotellut sopimukset", "Sijoitus- ja kampanjasuunnittelu", "Mainosmateriaalien koordinointi"],
    },
    en: {
      title: "Print Advertising",
      metaTitle: "Print Advertising — Newspapers and Magazines | NØRR3",
      metaDescription: "Print and magazine advertising: planning, buying and production for newspapers and magazines — NØRR3 in Helsinki.",
      heroLeft: "Print",
      heroAccent: "lives on",
      intro: "Print advertising still lives: magazines are read with focus and the ad stays on the page. We plan and buy print as part of the whole.",
      sections: [{ heading: "Planning and buying", body: "Publications, issues and placements by target audience — negotiated." }, { heading: "Print as part of the mix", body: "Print adds depth and permanence: it works as a reputation builder alongside digital." }],
      bullets: ["Publication and issue selection", "Negotiated deals", "Placement and campaign planning", "Ad material coordination"],
    },
  },
  {
    slug: "mediasuunnittelu/luovat",
    icon: "draw",
    fi: {
      title: "Luovat",
      metaTitle: "Luovat — mainosaineistot ja tuotanto | NØRR3",
      metaDescription: "Mainosaineistot, luova suunnittelu ja tuotanto kaikille kanaville —dynaamiset materiaalit automaatiolla.",
      heroLeft: "Luovat",
      heroAccent: "kaikille kanaville",
      intro: "Yksi master-ajattelu, tuhansia versioita. Suunnittelemme ja tuotamme mainosaineistot kaikille kanaville — dynaamiset ja personoidut aineistot automaatiolla.",
      sections: [{ heading: "Luova suunnittelu", body: "Konseptit ja mainosaineistot, jotka toimivat kanavassa missä ne julkaistaan." }, { heading: "Dynaaminen tuotanto", body: "Syötteestä tuhansia versioita automaattisesti: hinta, tarjous ja kohde vaihtuvat ilman manuaalista työtä." }],
      bullets: ["Konseptit ja master-aineistot", "Dynaamiset ja personoidut versiot", "Kaikki formaatit ja mitat", "A/B-testaus", "Syötepohjainen automaatio"],
    },
    en: {
      title: "Creatives",
      metaTitle: "Creatives — Ad Materials and Production | NØRR3",
      metaDescription: "Ad creatives, creative design and production for all channels — dynamic materials with automation.",
      heroLeft: "Creatives",
      heroAccent: "for every channel",
      intro: "One master, thousands of versions. We design and produce ad materials for every channel — dynamic and personalised creatives with automation.",
      sections: [{ heading: "Creative design", body: "Concepts and ad materials that work in the channel where they run." }, { heading: "Dynamic production", body: "Thousands of versions generated automatically from a feed: price, offer and target change without manual work." }],
      bullets: ["Concepts and master assets", "Dynamic and personalised versions", "All formats and sizes", "A/B testing", "Feed-based automation"],
    },
  },
  {
    slug: "mediasuunnittelu/kampanjat-ja-jatkuva-mainonta",
    icon: "campaign",
    fi: {
      title: "Kampanjat ja jatkuva mainonta",
      metaTitle: "Kampanja- ja jatkuva mainonta | NØRR3",
      metaDescription: "Sekin isot lanseeraukset että ympärivuotinen näkyvyys: kampanjasuunnittelu ja jatkuva mainonta — NØRR3.",
      heroLeft: "Näkyvyyttä",
      heroAccent: "ympäri vuoden",
      intro: "Isot lanseerausponnistukset ja ympärivuotinen näkyvyys, joka ei katkea. Suunnittelemme kampanjat ja jatkuvan mainonnan yhdeksi tasaiseksi putkeksi.",
      sections: [{ heading: "Kampanjat", body: "Lanseeraukset, sesonkit ja tehot — suunniteltu, ostettu ja mitattu." }, { heading: "Jatkuva mainonta", body: "Always-on-läsnäolo, joka pitää brändin mukana ostopolulla ympäri vuoden." }],
      bullets: ["Lanseaus- ja sesonkikampanjat", "Always-on-näkyvyys", "Kanavat ja ajoitus kokonaisuutena", "Optimointi jatkuvasti"],
    },
    en: {
      title: "Campaigns and Always-on",
      metaTitle: "Campaign and Always-on Advertising | NØRR3",
      metaDescription: "Both big launches and year-round visibility: campaign planning and always-on advertising — NØRR3.",
      heroLeft: "Visibility",
      heroAccent: "all year round",
      intro: "Big launch pushes and year-round visibility that never breaks. We plan campaigns and always-on advertising as one continuous flow.",
      sections: [{ heading: "Campaigns", body: "Launches, seasons and bursts — planned, bought and measured." }, { heading: "Always-on", body: "Continuous presence that keeps the brand on the purchase path all year." }],
      bullets: ["Launch and seasonal campaigns", "Always-on visibility", "Channels and timing as a whole", "Continuous optimisation"],
    },
  },
  {
    slug: "mediastrategia",
    icon: "hub",
    fi: {
      title: "Mediastrategia",
      metaTitle: "Mediastrategia — kanavalinjaus ja budjetit | NØRR3",
      metaDescription: "Mediastrategia: kanavavalinnat, budjettien jako ja mittarit datalla. Strateginen raami medialle — NØRR3 Helsinki.",
      heroLeft: "Media",
      heroAccent: "strategisesti",
      intro: "Mediastrategia kääntää liiketoiminnan tavoitteet kanavalinjaukseksi: mitkä kanavat, missä suhteessa, millä budjetilla ja miten mitattuna. Data ensin, mielipiteet sitten.",
      sections: [{ heading: "Kanavavalinta", body: "Yleisö- ja kohdehimot- data ratkaisevat kanavat — emme suosi omia suosikkejamme." }, { heading: "Budjetin jako", body: "Mallinnettu budjettiallokaatio, joka kertoo missä seuraava euro tuottaa eniten." }, { heading: "Mittarit", body: "Jokaisella kanavalla selvät tavoitteet ja mittarit — todennettuna kampanjan jälkeen." }],
      bullets: ["Kanavalinjaus datalla", "Budjettiallokaatio", "Ajoitus- ja vuosikello", "Mittarit ja todentaminen", "Kilpailijoiden mediaseuranta"],
    },
    en: {
      title: "Media Strategy",
      metaTitle: "Media Strategy — Channel Selection and Budgets | NØRR3",
      metaDescription: "Media strategy: channel selection, budget split and metrics with data. The strategic frame for media — NØRR3 Helsinki.",
      heroLeft: "Media",
      heroAccent: "strategically",
      intro: "Media strategy turns business goals into a channel plan: which channels, in what proportion, at what budget, and how measured. Data first, opinions second.",
      sections: [{ heading: "Channel selection", body: "Audience and intent data decide the channels — we don't favour our own favourites." }, { heading: "Budget split", body: "A modelled budget allocation that tells where the next euro produces the most." }, { heading: "Metrics", body: "Clear goals and metrics for every channel — verified after the campaign." }],
      bullets: ["Data-driven channel plan", "Budget allocation", "Timing and annual calendar", "Metrics and verification", "Competitor media monitoring"],
    },
  },
  {
    slug: "dynaaminen-mainonta",
    icon: "auto_awesome",
    fi: {
      title: "Dynaaminen mainonta",
      metaTitle: "Dynaaminen mainonta ja DCO | NØRR3 Helsinki",
      metaDescription: "Dynaaminen ja personoitu mainonta: tuhansia aineistoversioita tuote- ja asiakasdatasta — DCO automaatiolla.",
      heroLeft: "Yksi viesti",
      heroAccent: "tuhansin versioin",
      intro: "Dynaaminen mainonta rakentuu tuote- ja asiakasdatasta: hinta, tarjous ja kuva vaihtuvat katsojan mukaan automaattisesti. Tuhansia versioita yhdestä masterista.",
      sections: [{ heading: "DCO — dynaaminen luova optimointi", body: "Aineistot muuttuvat ajon aikana: mikä konvertoi, sitä näytetään enemmän." }, { heading: "Syötepohjainen tuotanto", body: "Tuote-, varasto- ja hintadata muuttuu aineistoksi automaattisesti — ei manuaalisia kierroksia." }],
      bullets: ["Personointi katsojatason datasta", "Hinta ja tarjous reaaliajassa", "A/B-testaus automaattisesti", "Tuhansia versioita yhdestä masterista", "Konversiopohjainen optimointi"],
    },
    en: {
      title: "Dynamic Advertising",
      metaTitle: "Dynamic Advertising and DCO | NØRR3 Helsinki",
      metaDescription: "Dynamic and personalised advertising: thousands of creative versions from product and customer data — DCO with automation.",
      heroLeft: "One message",
      heroAccent: "a thousand versions",
      intro: "Dynamic advertising is built from product and customer data: price, offer and image change automatically per viewer. Thousands of versions from one master.",
      sections: [{ heading: "DCO — dynamic creative optimisation", body: "Creatives change during the run: what converts gets shown more." }, { heading: "Feed-based production", body: "Product, inventory and pricing data becomes creative automatically — no manual rounds." }],
      bullets: ["Personalisation from viewer-level data", "Price and offer in real time", "Automatic A/B testing", "Thousands of versions from one master", "Conversion-based optimisation"],
    },
  },
  {
    slug: "hakukonemainonta",
    icon: "search",
    fi: {
      title: "Hakukonemainonta",
      metaTitle: "Hakukonemainonta SEM — Google Ads | NØRR3 Helsinki",
      metaDescription: "Hakukonemainonta: Google Ads ja hakutulosten kärkeen siellä missä ostoaikeus on korkein — NØRR3 Helsingissä.",
      heroLeft: "Löydy",
      heroAccent: "ostoaiheessa",
      intro: "Hakukonemainonta tavoittaa asiakkaan silloin, kun hän etsii juuri sinun ratkaisuasi. Sanat, mainokset ja laskeutumissivut optimoidaan konversioon — jokainen klikki mitataan.",
      sections: [{ heading: "Sanat ja mainokset", body: "Avainsanatutkimus, mainostekstit ja laajennukset jotka vastaavat oikeaan hakointentioon." }, { heading: "Laskeutumissivut ja konversio", body: "Mainos lupaa, sivu toteaa: optimoimme koko polun klikistä konversioon." }],
      bullets: ["Avainsanatutkimus ja -strategia", "Mainostekstit ja laajennukset", "Laskeutumissivuoptimointi", "Budjetin jako ja tarjoukset", "Konversioseuranta myyntiin asti"],
    },
    en: {
      title: "Search Advertising",
      metaTitle: "Search Advertising SEM — Google Ads | NØRR3 Helsinki",
      metaDescription: "Search advertising: Google Ads to the top of the results where purchase intent is highest — NØRR3 in Helsinki.",
      heroLeft: "Get found",
      heroAccent: "at the intent",
      intro: "Search advertising reaches the customer exactly when they are looking for your solution. Keywords, ads and landing pages are optimised for conversion — every click measured.",
      sections: [{ heading: "Keywords and ads", body: "Keyword research, ad copy and extensions that match the real search intent." }, { heading: "Landing pages and conversion", body: "The ad promises, the page delivers: we optimise the whole path from click to conversion." }],
      bullets: ["Keyword research and strategy", "Ad copy and extensions", "Landing page optimisation", "Budget split and bidding", "Conversion tracking down to sales"],
    },
  },
  {
    slug: "display-ja-videomainonta",
    icon: "grid_view",
    fi: {
      title: "Display- ja videomainonta",
      metaTitle: "Display- ja videomainonta | NØRR3 Helsinki",
      metaDescription: "Display- ja videomainonta: bannerit, video ja ohjelmallinen ostaminen yhdestä paikasta — mitattuna, NØRR3.",
      heroLeft: "Näytä",
      heroAccent: "ja kerro",
      intro: "Display-mainonta rakentaa tunnettuutta, video kertoo tarinan. Suunnittelemme ja ostamme molemmat — usein ohjelmallisesti — ja mittaat tuloksen reaaliajassa.",
      sections: [{ heading: "Display-mainonta", body: "Bannerit ja native-muodot oikeissa ympäristöissä, tavoittavuus ja frekvenssi hallittuna." }, { heading: "Videomainonta", body: "TrueView, in-stream ja out-stream: tarina, joka katsojan pysäyttää — 6 sekunnista minuuttiin." }],
      bullets: ["Banneri- ja videoformaattien suunnittelu", "Ohjelmallinen osto", "Tavoittavuus ja frekvenssin hallinta", "Näkyvyys (viewability) mittauksena", "Yhdistetty display+digi-mittaus"],
    },
    en: {
      title: "Display and Video Advertising",
      metaTitle: "Display and Video Advertising | NØRR3 Helsinki",
      metaDescription: "Display and video advertising: banners, video and programmatic buying from one place — measured, NØRR3.",
      heroLeft: "Show",
      heroAccent: "and tell",
      intro: "Display advertising builds awareness, video tells the story. We plan and buy both — often programmatically — with results measured in real time.",
      sections: [{ heading: "Display advertising", body: "Banners and native formats in the right environments, reach and frequency managed." }, { heading: "Video advertising", body: "TrueView, in-stream and out-stream: a story that stops the viewer — from 6 seconds to a minute." }],
      bullets: ["Banner and video format planning", "Programmatic buying", "Reach and frequency management", "Viewability measurement", "Combined display+digital measurement"],
    },
  },
  {
    slug: "somemarkkinointi",
    icon: "share",
    fi: {
      title: "Somemarkkinointi",
      metaTitle: "Somemarkkinointi — Facebook, Instagram, LinkedIn, TikTok | NØRR3",
      metaDescription: "Somemarkkinointi kaikilla kanavilla: Facebook, Instagram, LinkedIn ja TikTok — suunnittelu, ostot ja mittaus NØRR3:ltä.",
      heroLeft: "Ole",
      heroAccent: "siellä missä yleisösi",
      intro: "Somemarkkinointi on nykyaikaa: yleisösi on Facebookissa, Instagramissa, LinkedInissä ja TikTokissa. Suunnittelemme ja ostamme somemainonnan — kohdennettuna, mitattuna, tuloksekkaasti.",
      sections: [{ heading: "Kanavalinjaus", body: "Facebook, Instagram, LinkedIn ja TikTok — jokaiselle oma rooli: LinkedIn B2B:ssä, TikTok nuoremmille." }, { heading: "Kohdennus ja aineistot", body: "Yleisödatalla kohdennetut aineistot jotka toimivat kanavassaan — pystyvideo TikTokiin, artikkeli-linkki LinkedIniin." }],
      bullets: ["Kanavalinjaus ja roolit", "Kohdennus yleisödatalla", "Kaikki formaatit (feed, story, reels)", "Yhteisöjen rakentaminen", "Tulokset mitattuna"],
    },
    en: {
      title: "Social Media Marketing",
      metaTitle: "Social Media Marketing — Facebook, Instagram, LinkedIn, TikTok | NØRR3",
      metaDescription: "Social media marketing across channels: Facebook, Instagram, LinkedIn and TikTok — planning, buying and measurement from NØRR3.",
      heroLeft: "Be",
      heroAccent: "where your audience is",
      intro: "Social media marketing is the present: your audience is on Facebook, Instagram, LinkedIn and TikTok. We plan and buy social advertising — targeted, measured, effective.",
      sections: [{ heading: "Channel plan", body: "Facebook, Instagram, LinkedIn and TikTok — each with its own role: LinkedIn for B2B, TikTok for the younger crowd." }, { heading: "Targeting and creatives", body: "Creatives targeted with audience data that work in their channel — vertical video for TikTok, article links for LinkedIn." }],
      bullets: ["Channel plan and roles", "Audience-data targeting", "All formats (feed, story, reels)", "Community building", "Measured results"],
    },
  },
  {
    slug: "tutkimukset",
    icon: "science",
    fi: {
      title: "Tutkimukset",
      metaTitle: "Tutkimukset — brand-, kampanja- ja ennakkomittaus | NØRR3",
      metaDescription: "Brand Performance-, Campaign Performance- ja Pre-campaign -tutkimukset. Tiedä ennen, tänä ja jälkeen — NØRR3.",
      heroLeft: "Tiedä",
      heroAccent: "ennen ja jälkeen",
      intro: "Tutkimme ennen kampanjaa, sen aikana ja jälkeen: brändin kunnon, kampanjan vaikutuksen ja ennakko-odotukset. Yksi tutkimusperhe — kolme näkökulmaa.",
      sections: [{ heading: "Brand Performance", body: "Brändin tunnettuus, asennoituminen ja harkinta ennen ja jälkeen — näet muutoksen numeroina." }, { heading: "Campaign Performance", body: "Mitä kampanja sai aikaan: tunnettuus, mielikuvat ja ostoaikomus mitattuna." }, { heading: "Pre-campaign", body: "Ennakkomittaus ennen kampanjaa: lähtötaso, johon vaikutusta verrataan." }],
      bullets: ["Brand Performance -tutkimus", "Campaign Performance -tutkimus", "Pre-campaign -lähtötaso", "Express-versiot nopeisiin tarpeisiin", "Räätälöidyt kysymyssetit"],
    },
    en: {
      title: "Research",
      metaTitle: "Research — Brand, Campaign and Pre-campaign Studies | NØRR3",
      metaDescription: "Brand Performance, Campaign Performance and Pre-campaign studies. Know before, during and after — NØRR3.",
      heroLeft: "Know",
      heroAccent: "before and after",
      intro: "We research before the campaign, during it and after: brand health, campaign impact and baseline expectations. One research family — three perspectives.",
      sections: [{ heading: "Brand Performance", body: "Brand awareness, attitude and consideration before and after — you see the change in numbers." }, { heading: "Campaign Performance", body: "What the campaign achieved: awareness, image and purchase intent measured." }, { heading: "Pre-campaign", body: "A baseline measurement before the campaign: the starting level to compare impact against." }],
      bullets: ["Brand Performance study", "Campaign Performance study", "Pre-campaign baseline", "Express versions for fast needs", "Tailored question sets"],
    },
  },
  {
    slug: "ai-optimointi",
    icon: "neurology",
    fi: {
      title: "AI-optimointi",
      metaTitle: "AI-optimointi — tekoäly markkinoinnissa | NØRR3 Helsinki",
      metaDescription: "AI-optimointi: tekoäly kampanjasuunnittelun, luovien automaation ja datan analyysin moottorina — NØRR3.",
      heroLeft: "Tekoäly",
      heroAccent: "moottorina",
      intro: "Tekoäly ei ole slidellä — se on työkalu, joka ajaa suunnittelua, luovien automaatiota ja data-analyysiä. NØRR3:n AI-optimointi tekee markkinoinnista nopeampaa, tarkempaa ja tehokkaampaa.",
      sections: [{ heading: "Tekoälyavusteinen suunnittelu", body: "Mallit jakavat panostukset uudelleen kesken lennon yleisödatan pohjalta — sama logiikka kuin Marketing Enginessä." }, { heading: "Luovien automaatio", body: "Yksi master-suunnittelu tuhansiksi versioiksi: AI generoi personoituja aineistoja tuote- ja asiakasdatasta." }, { heading: "GEO — näkyvyys AI-vastauksissa", body: "Tekoälyavustajat suosittelevat brändejä vastauksissaan. Varmistamme, että ne suosittelevat sinua." }],
      bullets: ["AI-lähtöinen mediamix-suunnittelu", "Automaattinen aineistotuotanto", "GEO / AI-löydettävyys", "Datan analyysi ja ennakointi", "AI-workshopit tiimeillesi"],
    },
    en: {
      title: "AI Optimisation",
      metaTitle: "AI Optimisation — AI in Marketing | NØRR3 Helsinki",
      metaDescription: "AI optimisation: artificial intelligence as the engine of campaign planning, creative automation and data analysis — NØRR3.",
      heroLeft: "AI",
      heroAccent: "as the engine",
      intro: "AI isn't a slide in our deck — it's a tool driving planning, creative automation and data analysis. NØRR3's AI optimisation makes marketing faster, sharper and more effective.",
      sections: [{ heading: "AI-assisted planning", body: "Models reallocate spend mid-flight on audience data — the same logic that runs the Marketing Engine." }, { heading: "Creative automation", body: "One master design into thousands of versions: AI generates personalised creatives from product and customer data." }, { heading: "GEO — visibility in AI answers", body: "AI assistants recommend brands in their answers. We make sure they recommend you." }],
      bullets: ["AI-driven media mix planning", "Automated creative production", "GEO / AI discoverability", "Data analysis and forecasting", "AI workshops for your team"],
    },
  },];

export function servicePageFor(slug: string): ServicePage | undefined {
  return servicePages.find((p) => p.slug === slug);
}

export function servicePageLocalised(page: ServicePage, locale: Locale) {
  return page[locale];
}
