export type Insight = {
  slug: string;
  date: string;
  ghost?: string;
  image?: string;
  fi: { title: string; excerpt: string; body: string[] };
  en: { title: string; excerpt: string; body: string[] };
};

// Blog cards from the Figma design: some lead with a photo, others with a
// lavender tile carrying a giant "ghost" figure (e.g. 2026, 360).
export const insights: Insight[] = [
  {
    slug: "tre-kronor-media",
    date: "25.8.2026",
    image: "/images/brand/space-arch.webp",
    fi: {
      title: "Tre Kronor Media laajentuu Suomeen NØRR3:n kanssa",
      excerpt: "Pohjoismainen palkittu mediatoimisto Tre Kronor Media laajentuu Suomeen yhdessä NØRR3:n kanssa.",
      body: [
        "Pohjoismainen palkittu mediatoimisto Tre Kronor Media laajentuu Suomeen yhdessä NØRR3:n kanssa. Yhteistyö tuo suomalaisasiakkaille pääsyn pohjoismaiseen osaamiseen ja ostovoimaan ilman, että paikallinen palvelu ohenee.",
        "Käytännössä laajentuminen tarkoittaa yhteisiä työkaluja, jaettua dataa ja yhteispohjoismaisia neuvotteluasemia mediataloihin — asiakkaalle se näkyy parempina hintoina ja laajempana näkymänä.",
        "Ensimmäiset yhteiset asiakkuudet käynnistyvät syksyllä 2026.",
      ],
    },
    en: {
      title: "Tre Kronor Media expands to Finland with NØRR3",
      excerpt: "The awarded Nordic media agency Tre Kronor Media expands to Finland together with NØRR3.",
      body: [
        "The awarded Nordic media agency Tre Kronor Media is expanding to Finland together with NØRR3. The partnership gives Finnish clients access to Nordic expertise and buying power without thinning out local service.",
        "In practice the expansion means shared tools, shared data and a pan-Nordic negotiating position with media houses — for the client it shows up as better prices and a wider view.",
        "The first joint accounts start in autumn 2026.",
      ],
    },
  },
  {
    slug: "isojen-ruutujen-trendit",
    date: "25.8.2026",
    ghost: "2026",
    fi: {
      title: "Isojen ruutujen trendit",
      excerpt: "Kirjoituksessa pohditaan mitä trendejä liittyy isoihin ruutuihin.",
      body: [
        "Iso ruutu ei kadonnut minnekään — se muutti muotoaan. TV:n, suoratoiston ja digitaalisen ulkomainonnan rajat hämärtyvät, ja suunnittelijan on ajateltava ruutuja yhtenä jatkumona.",
        "Kun sama sisältö elää olohuoneen televisiossa, kauppakeskuksen näytöllä ja puhelimen ruudulla, mittaamisen on seurattava katsojaa eikä laitetta.",
        "Isojen ruutujen vahvuus on edelleen huomioarvo — mutta vain, jos luova on suunniteltu ruudun kokoon eikä skaalattu siihen jälkikäteen.",
      ],
    },
    en: {
      title: "Big screen trends",
      excerpt: "What trends are shaping the big screens.",
      body: [
        "The big screen didn't disappear — it changed shape. The lines between TV, streaming and digital out-of-home are blurring, and a planner has to treat screens as one continuum.",
        "When the same content lives on the living-room TV, the mall screen and the phone, measurement has to follow the viewer, not the device.",
        "The big screen's strength is still attention — but only if the creative is designed for the screen size rather than scaled to it afterwards.",
      ],
    },
  },
  {
    slug: "voittava-mediamix-2026",
    date: "25.7.2026",
    image: "/images/brand/data-desk.webp",
    fi: {
      title: "Voittava mediamix vuodelle 2026",
      excerpt: "Kirjoituksessa pohditaan voittavan mediamixin rakentamista vuodelle 2026 ja mitä siinä voisi huomioida.",
      body: [
        "Voittava mediamix ei synny kanavalistasta vaan tavoitteesta: mitä kohderyhmän ajattelussa tai käytöksessä pitää muuttua?",
        "Vuonna 2026 kolme asiaa korostuu: vähittäismedian nousu, isojen ruutujen paluu huomion lähteeksi ja AI-avusteinen budjetin uudelleenjako kesken kampanjan.",
        "Paras suoja hukkaan menneiltä euroilta on edelleen tylsä perusasia: tutkittu data siitä, missä yleisösi oikeasti on.",
      ],
    },
    en: {
      title: "The winning media mix for 2026",
      excerpt: "How to build a winning media mix for 2026 and what to consider.",
      body: [
        "A winning media mix doesn't start from a channel list but from a goal: what has to change in how the audience thinks or acts?",
        "Three things stand out in 2026: the rise of retail media, big screens returning as the source of attention, and AI-assisted budget reallocation mid-campaign.",
        "The best protection against wasted euros is still the boring basic: researched data on where your audience actually is.",
      ],
    },
  },
  {
    slug: "media-insights-360",
    date: "25.6.2026",
    ghost: "360",
    fi: {
      title: "360° näkymä yleisöön — mitä Media Insights kertoo",
      excerpt: "Miten tutkittu paneelidata muuttaa mediasuunnittelun arjen.",
      body: [
        "Kun yleisödata kerätään 3–4 kertaa vuodessa yli 1500 kuluttajalta, mediasuunnittelu lakkaa olemasta arvailua.",
        "Media Insights näyttää, miten B2C- tai B2B-yleisösi mediankäyttö oikeasti jakautuu — kanavittain, ikäryhmittäin ja sukupuolittain.",
        "Tuloksena asiakkaamme säästävät keskimäärin 25 % mainoskuluissaan karsimalla hukkakontaktit pois suunnitelmasta.",
      ],
    },
    en: {
      title: "A 360° view of the audience — what Media Insights shows",
      excerpt: "How researched panel data changes everyday media planning.",
      body: [
        "When audience data is collected 3–4 times a year from over 1,500 consumers, media planning stops being guesswork.",
        "Media Insights shows how your B2C or B2B audience's media use actually splits — by channel, age group and gender.",
        "As a result our clients save an average of 25% of their ad spend by cutting wasted contacts out of the plan.",
      ],
    },
  },
];

export function getInsight(slug: string) {
  return insights.find((i) => i.slug === slug);
}

/**
 * Estimated reading time at ≈200 words per minute, rounded to at least one
 * minute. One helper for the blog cards, the index feature and the article
 * header, so the same post never advertises two different figures.
 */
export function readingMinutes(body: string[]) {
  const words = body.join(" ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
