import { isLocale } from "@/i18n/config";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Container, HeroPill } from "@/components/Container";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/Icon";
import { linkTo } from "@/lib/links";

export const metadata: Metadata = {
  title: "SEO-kilpailija-analyysi: NØRR3 vs SDM — sisäinen raportti",
  robots: { index: false, follow: false },
};

/* ------------------------------------------------------------------ data */

const sitemap = {
  sdm: {
    urls: "1 053",
    breakdown: [
      { label: "Blogi-artikkelit", value: 812, tone: "sdm" },
      { label: "Sivut (oppaat, palvelut, kampanjat)", value: 114, tone: "sdm" },
      { label: "Referenssit (caset)", value: 38, tone: "sdm" },
      { label: "Uutiset (news-sitemap)", value: 64, tone: "sdm" },
      { label: "Tekijäsivut", value: 24, tone: "sdm" },
      { label: "Materiaalit", value: 1, tone: "sdm" },
    ],
    notes: "Yoast SEO ‑hallittu sitemap-indeksi (post/page/material/news/reference/author). Uutissitemap → Google Discover ‑kelpoisuus.",
  },
  us: {
    urls: "68",
    breakdown: [
      { label: "Koodatut sivut (FI + EN)", value: 24, tone: "us" },
      { label: "Palvelusivut (FI + EN)", value: 10, tone: "us" },
      { label: "Caset (FI + EN)", value: 18, tone: "us" },
      { label: "Blogi-artikkelit (FI + EN)", value: 16, tone: "us" },
    ],
    notes: "Yksi yhtenäinen sitemap.xml + luettava /sitemap. Jokaisella sivulla hreflang-pari FI/EN.",
  },
};

const content = [
  {
    area: "Sisällön määrä",
    sdm: "812 blogiartikkelia, ~3 000–3 800 sanaa palvelusivulla. Julkaisuvauhti juloin: uutissitemap päivittyy jatkuvasti.",
    us: "8 blogiartikkelia, 608 sanaa palveluhubilla, ~280 sanaa palvelusivulla. Uutta sisältöä harvoin.",
    verdict: "them",
    fix: "Suurin yksittäinen kuilu. Blogeissa 100× määräero — sijoitukset rakentuvat tästä.",
  },
  {
    area: "Sisällön laatu & relevanttius",
    sdm: "Määrä yltää laadun: sivut ovat Yoast-mallin mukaan optimoituja, mutta geneerisiä (\"Mahdollistamme... mitattavilla menetelmillä\"). Moni sivu ohjaa lataamaan PDF-oppaan (lead magnet).",
    us: "Teroittunut, brändätty copywriting (\"jokainen mediaeuro mitataan\", \"tulos näytetään, ei väitetä\"). Ydinviesti erottuu — mutta ohuus verkkoon.",
    verdict: "split",
    fix: "Voima: tekstimme on aidosti parempi. Puute: määrä. Emme tarvitse 812 artikkelia — 30–50 vahvaa artikkelia oikeilla avainsanoilla riittää erottautumaan.",
  },
  {
    area: "Avainsanasivujen kattavuus",
    sdm: "13 palvelusivua (hakukonemainonta, somemarkkinointi, SEO-CRO, AI-optimointi, sisältömarkkinointi, visuaalinen suunnittelu, automaatio, web-analytiikka, video, verkkosivut, strategia, kasvustrategia, display). + kymmenet alasivut.",
    us: "5 palvelusivua (hakukoneoptimointi, ohjelmallinen, mediasuunnittelu, ulkomainonta, performance). Ei omia sivuja somelle, analytiikalle, sisällölle.",
    verdict: "them",
    fix: "Kattavuus selvästi heille. Meidän 5 sivua on hyvä alku — lisää puuttuvat avainsanasivut (some, sisältö, analytiikka) prioriteettijärjestyksessä hakumäärän mukaan.",
  },
  {
    area: "Tekninen SEO",
    sdm: "Yoast SEO (metat, sitemap, breadcrumb-schema, hreflang). Ei mitattavia latausongelmia. Legacy WordPress.",
    us: "Next.js 16, yhtenäinen sitemap.xml + news-tyyppinen luettava /sitemap, hreflang FI/EN kaikilla sivuilla, JSON-LD Organization + WebSite, CMS:n robot/canonical/redirect-hallinta, keskeneräinen mutta moderni.",
    verdict: "us",
    fix: "Meidän tekninen kanta on nykyaikaisempi ja nopeampi (Next.js vs WordPress). Pieni puute: meiltä puuttuu BreadcrumbList + Service/FAQPage schema.",
  },
  {
    area: "Rakenne & sisäinen linkitys",
    sdm: "Suuri sisäinen linkkiverkosto (72+ sisäistä linkkiä palvelusivulla), breadcrumb-navigaatio kaikilla sivuilla.",
    us: "Hyvä sisäinen linkitys (navi-dropdown, palvelusivujen ristikytkennät, caset, hub). Ei breadcrumbia.",
    verdict: "them",
    fix: "Lisää breadcrumb-navigaatio palvelusivuille + BreadcrumbList schema.",
  },
  {
    area: "Kaksikielisyys",
    sdm: "EN-sivusto olemassa (hreflang), mutta erillinen eikä täysin peilattu (en/sitemap.xml 404).",
    us: "Täysi FI/EN-peili kaikilla sivuilla, hreflang-parit jokaisessa URL:ssa, <html lang> oikein.",
    verdict: "us",
    fix: "Meillä parempi kansainvälisyyskanta.",
  },
  {
    area: "E-E-A-T ja brändi",
    sdm: "Tekijäsivut (24 kirjoittajaa), referenssit (38), \"Vuoden toimisto\" -maine, Avainlukuja-numerot. Asiakaskokemukset + tulokset mainittu, mutta ei selkeitä lukuja case-sivuilla julkisivulla.",
    us: "Senioritiimi, lähes kaikki partnereita — aito erottuvuus. Numerot (NPS 83, 800+ verkosto, liikevaihto) esillä. Todelliset case-numerot case-sivuilla (\"+298\", \"800+\").",
    verdict: "split",
    fix: "Voima: meidän case-sivut ovat numerojohtoisia. Puute: ei tekijäsivuja blogeille (E-E-A-T-signaali).",
  },
  {
    area: "UI/UX ja visuaalinen laatu",
    sdm: "Editoriaalinen, serif-vetoinen design, teal-aksentti, tummat kuvat. 7/10 — yhtenäinen, mutta palveluruudukko litteä (pelkkä teksti, ei kuvia/ikoneja), matala kontrasti kuva-overlayissa. Vain yksi CTA per palvelu.",
    us: "Moderni tuotesivumainen kokemus: interaktiivinen simulaattori, pyörivät headline-sanat, animoidut KPI:t, liukuväribrändi (violetti/keltainen), dokumentoitu design system. Palveluhubilla 6 korttia ikoneilla + alakohdat, case-kortit kuvilla ja keltainen tilastopill.",
    verdict: "us",
    fix: "Meidän UI on ilmeikkäämpi ja nykyaikaisempi. Peli- ja konversioelementit (simulaattori, brief-lomake) ovat ainutlaatuisia erottuvia tekijöitä.",
  },
  {
    area: "Liidien hallinta",
    sdm: "Ilmaiset PDF-oppaat (\"Verkkokauppaopas\", \"Google Ads -ostajan opas\") sähköpostia vastaan. Uutiskirje tilattavissa. Kuvitettu lead-magnet mainosbannerissa.",
    us: "Brief-lomake (monivaiheinen, AI-avusteinen). Yhteydenottolomake. Ei ladattavia oppaita, ei uutiskirjettä.",
    verdict: "them",
    fix: "SDM:n suurin konversioetu: ilmaiset oppaat keräävät sähköposteja. Meidän brief-lomake on hyvä työkalu mutta raskas ensikontaktiin.",
  },
];

const actions = [
  {
    priority: "1",
    title: "Julkaise 2–4 blogiartikkelia kuukaudessa oikeilla avainsanoilla",
    body: "SDM voittaa hakukoneissa määrällä: 812 artikkelia vs meidän 8. Emme tarvitse saman verran, mutta säännöllisyys on hakukoneille elintärkeä signaali. Aloita avainsanoista joilla on hakumäärää ja 0–10 kilpailu: ohjelmallinen ostaminen, some-markkinointi, markkinoinnin automaatio, DCO, GEO.",
    icon: "edit_note",
  },
  {
    priority: "2",
    title: "Lisää puuttuvat avainsanasivut",
    body: "SDM kattaa 13 palvelusivulla. Meillä on 5. Lisää seuraavaksi: some-markkinointi (30+10/kk), sisältömarkkinointi, web-analytiikka, markkinoinnin automaatio, verkkosivut. Jokainen sivu: 300–600+ sanaa, avainsana H1:ssä ja titlessä, uniikki sisältö, ristikytkentä muihin palvelusivuihin.",
    icon: "web",
  },
  {
    priority: "3",
    title: "Luo ladattavia oppaita (lead magnetit)",
    body: "SDM kerää sähköposteja ilmaisilla PDF-oppailla — jokainen on myöhemmin konvertoitavissa asiakkaaksi. Meillä ei ole yhtään. Ensimmäinen ehdokas oli jo suunniteltu: kampanjasuunnitelma-opas (80/kk, kilpailu 0). Lisää: mediamix-työkalu, some-auditti-tsekki.",
    icon: "download",
  },
  {
    priority: "4",
    title: "Lisää schema-markupia",
    body: "SDM:llä BreadcrumbList jokaisella sivuilla (Yoast). Meiltä puuttuu kokonaan. Lisää: BreadcrumbList palvelusivuille, Service-schema palvelusivuille, FAQPage jos lisätään FAQ-osiot, Article-schema blogiin. Tämä on nopea voitto, vaikuttaa Rich Snippet -näyttöön.",
    icon: "code",
  },
  {
    priority: "5",
    title: "Tekijäsivut blogeille (E-E-A-T)",
    body: "SDM:llä 24 tekijäsivua — Google näkee aidot asiantuntijat. Meillä blogit kirjoitetaan \"NØRR3\"-nimellä. Lisää jokaiselle blogiartikkelille kirjoittaja (tiimiläinen) + oma tekijäsivu, joka listaa heidän artikkelinsa. Vahvistaa E-E-A_T-signaalia merkittävästi.",
    icon: "badge",
  },
  {
    priority: "6",
    title: "News-sitemap aktiiviseen käyttöön",
    body: "SDM:llä on erillinen news-sitemap (Google Discover -kelpoisuus). Meillä on /sitemap luettavassa muodossa mutta ei news-sitemap.xml -eriötä. Lisää /news-sitemap.xml joka sisältää viimeisen 30 päivän artikkelit.",
    icon: "feed",
  },
  {
    priority: "7",
    title: "Uutiskirje",
    body: "SDM kerää tilaajia \"Digitaalisen markkinoinnin hiljainen tieto\" -uutiskirjeellä. Meillä ei uutiskirjettä. Yksinkertainen tilaustyökalu footeriin + kuukausittainen markkinointikatsaus olisi pysyvä liidilähde.",
    icon: "mark_email_read",
  },
  {
    priority: "8",
    title: "Syvennä palvelusivujen sisältöä 600+ sanaan",
    body: "SDM:n palvelusivut ovat 2 500–3 800 sanaa. Meidän ovat ~280 sanaa. Tämä on isoero — Google palkitsee kattavuuden. Jokaiselle palvelusivulle: prosessikuvaus, case-esimerkki, FAQ-osio, hinnoittelun lähestymistapa. CMS:n sivu-editorilla hallittavissa.",
    icon: "article",
  },
];

const scores = [
  { label: "Tekninen SEO", us: 85, them: 78 },
  { label: "Sisällön määrä", us: 15, them: 95 },
  { label: "Sisällön laatu", us: 75, them: 65 },
  { label: "Avainsanasivut", us: 40, them: 90 },
  { label: "Kaksikielisyys", us: 95, them: 70 },
  { label: "E-E-A-T", us: 60, them: 75 },
  { label: "UI/UX", us: 90, them: 70 },
  { label: "Liidien keruu", us: 45, them: 85 },
];

/* ------------------------------------------------------------------ view */

function Tone({ tone, children }: { tone: "them" | "us" | "split"; children: React.ReactNode }) {
  if (tone === "them")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-red/15 px-3 py-1 text-[11px] font-medium text-accent-red">
        <Icon name="arrow_downward" style={{ fontSize: "13px" }} /> {children}
      </span>
    );
  if (tone === "us")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-green/15 px-3 py-1 text-[11px] font-medium text-accent-green">
        <Icon name="arrow_upward" style={{ fontSize: "13px" }} /> {children}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow/25 px-3 py-1 text-[11px] font-medium text-ink">
      <Icon name="drag_handle" style={{ fontSize: "13px" }} /> {children}
    </span>
  );
}

export default async function SeoReportPage({ params }: PageProps<"/[locale]/seo-report">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <Container className="pb-24 pt-12 lg:pb-32 lg:pt-20">
      <Reveal>
        <HeroPill>SDM vs NØRR3</HeroPill>
      </Reveal>
      <Reveal delay={0.05}>
        <h1 className="mt-6 max-w-4xl text-[9vw] font-medium leading-[0.95] tracking-tight text-ink lg:text-[5rem] dark:text-white">
          Kilpailija-analyysi
        </h1>
      </Reveal>
      <Reveal delay={0.1} className="mt-6 flex flex-col items-start gap-4">
        <p className="max-w-2xl text-[15px] leading-relaxed text-ink/70 lg:text-base dark:text-white/70">
          SDM Digital (sdm.fi) on yksi Suomen näkyvimmistä digitoimistoista hakukoneissa. Tämä raportti vertaa heidän
          sivustoaan meidän: sitemap, sisältö, tekninen SEO, UI/UX ja liidien hallinta — sekä tarkat toimenpiteet, joilla
          ohitamme heidät.
        </p>
        <p className="text-xs text-ink/45 dark:text-white/45">
          Sisäinen raportti · laadittu 27.8.2026 · ei indeksoida
        </p>
      </Reveal>

      {/* Scoreboard */}
      <Reveal delay={0.15} className="mt-16">
        <h2 className="text-2xl font-medium tracking-tight text-ink lg:text-3xl dark:text-white">Pisteet</h2>
        <div className="mt-8 space-y-4">
          {scores.map((s) => (
            <div key={s.label} className="grid grid-cols-[1fr_auto] items-center gap-4 sm:grid-cols-[220px_1fr_1fr]">
              <p className="text-sm font-medium text-ink dark:text-white">{s.label}</p>
              <div className="col-span-2 flex items-center gap-4 sm:col-span-2">
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between text-[11px] text-ink/50 dark:text-white/50">
                    <span>NØRR3</span>
                    <span>{s.us}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                    <div className="h-full rounded-full bg-purple transition-all" style={{ width: `${s.us}%` }} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex items-center justify-between text-[11px] text-ink/50 dark:text-white/50">
                    <span>SDM</span>
                    <span>{s.them}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                    <div className="h-full rounded-full bg-black/30 dark:bg-white/30" style={{ width: `${s.them}%` }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Sitemap comparison */}
      <Reveal delay={0.1} className="mt-20">
        <h2 className="text-2xl font-medium tracking-tight text-ink lg:text-3xl dark:text-white">Sitemap: 1 053 vs 68</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-card bg-ink p-card-pad text-white ring-1 ring-white/10">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/50">SDM · sdm.fi</p>
            <p className="mt-3 text-5xl font-medium tabular-nums">{sitemap.sdm.urls}</p>
            <ul className="mt-6 space-y-2.5">
              {sitemap.sdm.breakdown.map((b) => (
                <li key={b.label} className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-white/70">{b.label}</span>
                  <span className="font-medium tabular-nums text-white">{b.value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-white/10 pt-4 text-[12px] leading-relaxed text-white/50">{sitemap.sdm.notes}</p>
          </div>
          <div className="rounded-card bg-pastel-purple/60 p-card-pad dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-ink/50 dark:text-white/50">NØRR3 · norr3.fi</p>
            <p className="mt-3 text-5xl font-medium tabular-nums text-ink dark:text-white">{sitemap.us.urls}</p>
            <ul className="mt-6 space-y-2.5">
              {sitemap.us.breakdown.map((b) => (
                <li key={b.label} className="flex items-center justify-between gap-3 text-sm text-ink dark:text-white">
                  <span className="text-ink/70 dark:text-white/70">{b.label}</span>
                  <span className="font-medium tabular-nums">{b.value}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 border-t border-black/10 pt-4 text-[12px] leading-relaxed text-ink/55 dark:border-white/10 dark:text-white/55">
              {sitemap.us.notes}
            </p>
          </div>
        </div>
      </Reveal>

      {/* Content head-to-head */}
      <Reveal delay={0.1} className="mt-20">
        <h2 className="text-2xl font-medium tracking-tight text-ink lg:text-3xl dark:text-white">Eri osa-alueet</h2>
        <div className="mt-8 space-y-4">
          {content.map((c) => (
            <div
              key={c.area}
              className="rounded-card bg-white p-card-pad ring-1 ring-black/5 dark:bg-white/[0.04] dark:ring-white/10"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-medium text-ink dark:text-white">{c.area}</h3>
                {c.verdict === "them" && <Tone tone="them">Heille</Tone>}
                {c.verdict === "us" && <Tone tone="us">Meille</Tone>}
                {c.verdict === "split" && <Tone tone="split">Tasan</Tone>}
              </div>
              <div className="mt-4 grid gap-4 text-sm leading-relaxed sm:grid-cols-2">
                <div>
                  <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-black/40 dark:text-white/40">SDM</p>
                  <p className="text-ink/70 dark:text-white/70">{c.sdm}</p>
                </div>
                <div>
                  <p className="mb-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-purple dark:text-light-purple">NØRR3</p>
                  <p className="text-ink/70 dark:text-white/70">{c.us}</p>
                </div>
              </div>
              <p className="mt-4 border-t border-black/5 pt-3 text-[13px] leading-relaxed text-ink/60 dark:border-white/10 dark:text-white/60">
                <Icon name="lightbulb" className="mr-1.5 text-[15px] text-yellow" style={{ color: "var(--color-yellow)" }} />
                {c.fix}
              </p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Action plan */}
      <Reveal delay={0.1} className="mt-20">
        <h2 className="text-2xl font-medium tracking-tight text-ink lg:text-3xl dark:text-white">
          Toimenpiteet — näin ohitamme heidät
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/60 dark:text-white/60">
          Järjestetty vaikuttavuuden ja vaivan suhteeseen. Kohdat 1–3 ovat ratkaisevia; loput vahvistavat.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {actions.map((a) => (
            <div
              key={a.priority}
              className="flex h-full flex-col gap-3 rounded-card bg-pastel-purple/60 p-card-pad dark:bg-white/[0.04] dark:ring-1 dark:ring-white/10"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[5px] bg-violet text-white">
                  <Icon name={a.icon} style={{ fontSize: "22px" }} />
                </span>
                <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-purple dark:text-light-purple">
                  Prioriteetti {a.priority}
                </span>
              </div>
              <h3 className="text-base font-medium leading-snug text-ink dark:text-white">{a.title}</h3>
              <p className="text-[13px] leading-relaxed text-ink/65 dark:text-white/65">{a.body}</p>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Summary */}
      <Reveal delay={0.1} className="mt-20">
        <div className="rounded-card bg-violet p-card-pad text-white">
          <h2 className="text-2xl font-medium tracking-tight lg:text-3xl">Yhteenveto</h2>
          <div className="mt-5 grid gap-8 lg:grid-cols-2">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-yellow">Vahvuutemme</p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/85">
                <li className="flex gap-2"><Icon name="check" className="mt-0.5 text-[16px] text-yellow" /> Tekninen kanta: Next.js, nopeus, moderni arkkitehtuuri, CMS-hallittu SEO</li>
                <li className="flex gap-2"><Icon name="check" className="mt-0.5 text-[16px] text-yellow" /> Täysi FI/EN-peili hreflang-pareilla</li>
                <li className="flex gap-2"><Icon name="check" className="mt-0.5 text-[16px] text-yellow" /> Selvästi parempi UI/UX: animaatiot, simulaattori, design-järjestelmä</li>
                <li className="flex gap-2"><Icon name="check" className="mt-0.5 text-[16px] text-yellow" /> Numerojohtoiset caset ja erottuva brändiääni</li>
                <li className="flex gap-2"><Icon name="check" className="mt-0.5 text-[16px] text-yellow" /> Ainutlaatuinen tuote (Marketing Engine) jollaista SDM:llä ei ole</li>
              </ul>
            </div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-yellow">Heikkoutemme (SDM:n edut)</p>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/85">
                <li className="flex gap-2"><Icon name="close" className="mt-0.5 text-[16px] text-white/60" /> Sisällön määrä: 8 vs 812 blogiartikkelia</li>
                <li className="flex gap-2"><Icon name="close" className="mt-0.5 text-[16px] text-white/60" /> Avainsanasivujen kattavuus: 5 vs 13 palvelusivua</li>
                <li className="flex gap-2"><Icon name="close" className="mt-0.5 text-[16px] text-white/60" /> Ei ladattavia oppaita (lead magnetit)</li>
                <li className="flex gap-2"><Icon name="close" className="mt-0.5 text-[16px] text-white/60" /> Palvelusivujen sisältö liian ohut (280 vs 3 000+ sanaa)</li>
                <li className="flex gap-2"><Icon name="close" className="mt-0.5 text-[16px] text-white/60" /> Ei breadcrumbia, schemaa, tekijäsivuja tai uutiskirjettä</li>
              </ul>
            </div>
          </div>
          <p className="mt-8 border-t border-white/15 pt-5 text-sm leading-relaxed text-white/80">
            <strong>Johtopäätös:</strong> SDM voittaa määrällä — me voimme voittaa laadulla ja erottuvuudella. Tekninen
            pohjamme on parempi ja tuotteemme ainutlaatuinen. Kun lisäämme sisältöä systemaattisesti (prioriteetit 1–3),
            rakennamme aukottoman kilpailuedun, jota on vaikea kopioida.
          </p>
        </div>
      </Reveal>
    </Container>
  );
}
