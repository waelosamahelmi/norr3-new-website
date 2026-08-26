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
];

export function servicePageFor(slug: string): ServicePage | undefined {
  return servicePages.find((p) => p.slug === slug);
}

export function servicePageLocalised(page: ServicePage, locale: Locale) {
  return page[locale];
}
