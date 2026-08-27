// Exports the 8 SEO playbooks from the skill into public/seo-playbooks/*.md
// so they are downloadable from /seo-report. Run: node scripts/export-playbooks.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUT = join(process.cwd(), "public", "seo-playbooks");
mkdirSync(OUT, { recursive: true });

const header = (n, title) => `# Playbook ${n}: ${title}\n\n_NØRR3 SEO-sisältökone — tämä tiedosto on ladattavissa osoitteesta /seo-report/seo-playbooks/_\n\n`;

const playbooks = [
  {
    file: "01-blogiartikkeli.md",
    title: "Blogiartikkelin tuotanto",
    body: `## Milloin
2–4× / kuukausi, yksi avainsana kerrallaan. Tavoite: sulkea 8 vs 812 blogiartikkelin kuilu SDM:ään nähden.

## Askeleet agentille
1. Varmista avainsana ja kohderyhmä Waelin kanssa.
2. Aja prompti alla. Vaadi Markdown-tulos.
3. Tarkista äänisäännöt; kielletyt sanat pois, todentamattomat luvut \`[TARKISTA]\`-merkinnällä.
4. Hanki hero-kuva (aito valokuva ensisijaisesti; WebP 1600×1066 CMS:n kautta).
5. Luo postaus CMS:ssä → Posts (FI+EN, SEO-kentät, kansikuva, kirjoittaja = oikea tiimiläinen).
6. Varmista: sivu latautuu /slugin alta, ilmestyy sitemap.xml:ään, CMS SEO -auditista ei virheitä.

## Prompti
\`\`\`
Olet NØRR3:n sisältöstrategi. NØRR3 on pohjoismainen insight- ja mediatoimisto Helsingissä, jonka ääni on suora, itsevarma ja tuloshakuinen — ei jargonia, ei corporate-tyhjää puhetta. Tunnuslause: "jokainen mediaeuro mitataan".

Kirjoita blogiartikkeli aiheesta: [AIHE].
Avainsana: [AVAINSANA]. Kohderyhmä: [esim. markkinointipäälliköt B2B-yrityksissä].

Vaativat:
- 600–900 sanaa, suomeksi. Otsikko sisältää avainsanan, alle 60 merkkiä.
- Meta-kuvaus: 150–155 merkkiä, avainsana mukana.
- H1 sisältää avainsanan. Vähintään 3 H2-aliosiota, jotka vastaavat oikeisiin hakokysymyksiin.
- Aloita konkreettisella ongelmalla, älä määritelmällä.
- Käytä esimerkkejä tosielämästa (kuvitteellisia mutta uskottavia, [TARKISTA]-kohdat merkitään).
- Päätä CTA:lla joka vie joko /services-sivulle tai brief-lomakkeeseen.
- Älä käytä sanoja: "dynaaminen", "innovatiivinen", "kokonaisvaltainen", "seamless".
- Kirjoita lopuksi englanninkielinen lokalisoitu versio (ei käännös).

Muoto: Markdown — H1, meta-kuvaus, H2-osiot, CTA selvästi eroteltuna.
\`\`\`
`,
  },
  {
    file: "02-palvelusivun-syventaminen.md",
    title: "Palvelusivun syventäminen (280 → 600–900 sanaa)",
    body: `## Milloin
Jokaiselle viidelle olemassa olevalle palvelusivulle, sitten jokaiselle uudelle avainsanasivulle. Aloita suurimmalla hakumäärällä (hakukoneoptimointi 1600/kk).

## Askeleet agentille
1. Valitse sivu.
2. Aja prompti → Markdown-runko.
3. Ihminen tarkistaa mini-casen luvut; korvaa [CASE] oikealla tai hyväksytyllä esimerkillä.
4. Päivitä src/content/servicePages.ts (tai CMS) — säilytä hero/rakenne, lisää uudet osiot.
5. Builddaa, varmista ≥600 sanaa, sitemap kunnossa.

## Prompti
\`\`\`
Olet NØRR3:n palvelusisällön suunnittelija. Meillä on palvelusivu [PALVELU] joka on tällä hetkellä 280 sanaa. SDM:n vastaava sivu on 3000 sanaa mutta geneerinen.

Strategia: emme kilpaile pituudella vaan tiiviydellä. Tavoite: 600–900 sanaa, joista jokainen ansaitsee paikkansa.

Rakenne:
1. Hero: otsikko jossa avainsana, 2-lauseinen intro joka lupaa konkreettisen lopputuloksen.
2. "Miten se toimii" — 3-osainen numeroitu prosessi: mitä teemme, mitä asiakas saa.
3. "Miten eroamme" — 3 kohtaa (data→media→todentaminen, oma teknologia, senioritiimi).
4. Yksi mini-case: uskottava esimerkki, [TARKISTA]-merkinnällä jos luvut pitää tarkistaa.
5. FAQ: 4 oikeaa asiakaskysymystä (ei "mikä on X").
6. CTA: "Ota yhteyttä" + "Varaa 30 min palaveri".

Kielletty: "kokonaisvaltainen", "seamless", "dynaaminen", "innovatiivinen".

Palauta: Markdown, H1 + intro + numeroidut osiot + FAQ + CTA. Suomeksi + lokalisoitu englanninkielinen versio.
\`\`\`
`,
  },
  {
    file: "03-lead-magnet-opas.md",
    title: "Lead magnet -opas (sähköpostien keruu)",
    body: `## Milloin
Ensimmäinen: kampanjasuunnitelma-opas (80/kk, kilpailu 0). Sitten: mediamix-työkalu, some-auditti-tsekki.

## Askeleet agentille
1. Aja prompti → oppaan sisältö + landing-teksti.
2. Ihmiskatselmus; suunnittele PDF (brändipohja, max 8–12 sivua).
3. Rakenna landing-sivu (CMS lohkosivu /[oppaan-slug]) lomakkeella; kytkä lomake CMS inboxiin tai sähköpostiin.
4. Mainostapahtuma: yläpalkki + footer-linkki.

## Prompti
\`\`\`
Olet NØRR3:n kasvumarkkinoija. Suunnittele ladattava opas aiheesta: [AIHE].

Filosofia: ei 40-sivuista myynti-PDF:ää. Tiivis, käytännöllinen työkalu jota asiakas käyttää heti.

Suunnittele:
1. Otsikko: lupaa konkreettisen lopputuloksen, alle 60 merkkiä.
2. Sisällysluettelo: 5–7 lukua, jokainen toimintaohje.
3. Yhden luvun koko sisältö: 400–600 sanaa + taulukko tai checklist.
4. Loppumainos: "Haluatko että NØRR3 tekee tämän puolestasi? Varaa 30 min palaveri".
5. Landing-sivun teksti: hero-otsikko, 3 hyötyä, lomaketeksti ("Saat oppaan heti sähköpostiisi").

Muoto: Markdown, (a) opaan sisältö (b) landing-teksti eroteltuna. Suomeksi.
\`\`\`
`,
  },
  {
    file: "04-schema-markup.md",
    title: "Schema-markup (rich snippets)",
    body: `## Milloin
Kerran per palvelusivu syventämisen (#2) jälkeen. Myös blogeihin (Article-schema).

## Askeleet agentille
1. Kerää sivun URL, nimi, meta-kuvaus, 4 FAQ-paria.
2. Aja prompti → kolme JSON-LD-lohkoa.
3. Lisää sivulle ([...slug]-reitissä <script type="application/ld+json">); validoi validator.schema.org.
4. Aja CMS SEO -audit uudelleen.

## Prompti
\`\`\`
Olet tekninen SEO-asiantuntija. Generoi JSON-LD schema-markup NØRR3:n palvelusivulle: [SIVU].

Sivun tiedot:
- URL: https://norr3.fi/[SLUG]
- Nimi: [NIMI]
- Kuvaus: [META-KUVAUS]
- Palvelutyyppi: [esim. "SearchEngineOptimization"]
- FAQ: [4 Q&A-paria]

Generoi kolme erillistä JSON-LD-lohkoa:
1. BreadcrumbList: Etusivu > Palvelut > [Nimi]
2. Service: nimi, kuvaus, provider (NØRR3, https://norr3.fi), areaServed (Helsinki, Finland)
3. FAQPage: kysymykset + 2–3 lauseen vastaukset suoraan sivun sisällöstä

Suomenkieliset tekstit, englanninkieliset schema-tyypit. Palauta valmiina <script type="application/ld+json"> -tageissa, jokainen lohko erillisenä.
\`\`\`
`,
  },
  {
    file: "05-tekijasivut.md",
    title: "Tekijäsivut (E-E-A-T)",
    body: `## Milloin
Kun 2+ artikkelia on julkaistu; yksi sivu per julkaiseva tiimiläinen.

## Askeleet agentille
1. Kerää nimi, rooli, 3 osaamisaluetta (CMS tiimitaulusta).
2. Aja prompti → tekijäsivun tekstit.
3. Henkilö hyväksyy oman sivunsa.
4. Toteutus: kirjoittaja-kentä postauksiin (CMS), /tekijat/[nimi]-reitti joka listaa artikkelit, byline-linkki jokaisesta artikkelista.

## Prompti
\`\`\`
Olet NØRR3:n sisältötuottaja. Kirjoita tekijäsivun sisältö tiimiläiselle: [NIMI, ROOLI].

Erottuvuus: lähes kaikki ovat partnereita, senioritiimi. Ei LinkedIn-ansioluetteloa — asiantuntemus ja persoona.

Kirjoita:
1. Intro (2–3 lausetta): kuka hän on ja mitä arvoa hän tuo asiakkaalle.
2. Asiantuntemus (3 kohtaa): mihin kysymyksiin hän vastaa paremmin kuin kukaan muu.
3. Kirjoitustyyli: "[Nimi] kirjoittaa [tyyli] aiheista [aiheet]."
4. Quote: yksi hänen suhtautumistaan kuvaava lause (NØRR3:n sävy).
5. Loppuun: "Lue [Nimen] artikkelit:" — lista joka täytetään CMS:llä.

150–250 sanaa. Suomeksi + englanniksi.
\`\`\`
`,
  },
  {
    file: "06-uutiskirje.md",
    title: "Uutiskirjeen konsepti",
    body: `## Milloin
Rakenna kerran; kuukausittainen tuotanto ≤1h/numero (playbookit 1 + 7 syöttävät).

## Askeleet agentille
1. Aja prompti → konsepti + ensimmäinen numero.
2. Valitse työkalu (CMS:n SMTP-asetukset tai ulkoinen), rakenna tilauslomake (footer + insights-sivu).
3. Kuukausittain: kuukauden tilasto, yksi testi, yksi asiakaskysymys, yksi linkki; ihminen editoi; lähetä.

## Prompti
\`\`\`
Olet NØRR3:n uutiskirjeen päätoimittaja. Suunnittele kuukausittaisen uutiskirjeen konsepti.

Erottuvuus: itsenäisesti arvokas — lukija oppii vaikka ei klikkaisi mitään (SDM lähettää linkkilistan).

1. Nimi: lyhyt, NØRR3:n sävyinen (esim. "Media€ / kk" tai "Signaali").
2. Kiinteä rakenne (4 osiota):
   - "Kuukauden luku": tilasto + 2 lauseen tulkinta.
   - "Tämä testasimme": mitä testasimme ja mitä opimme (myös epäonnistumiset).
   - "Kysymys johon vastasimme": asiakkaan kysymys + 3-lauseinen vastaus.
   - "Yksi klikkaus": yksi linkki.
3. Esimerkkinumeron koko sisältö, 300–400 sanaa.
4. Tilausteksti footeriin: 1 lause joka saa tilaamaan.

Markdown. Suomeksi.
\`\`\`
`,
  },
  {
    file: "07-kilpailijaseuranta.md",
    title: "Kilpailijaseuranta (15 min/kk)",
    body: `## Milloin
Jokainen kuun ensimmäinen arkipäivä.

## Askeleet agentille
1. Kerää data: curl sdm.fi/sitemap_index.xml + alim sitemapit, laske URLit; hae 5 uusinta postauksen otsikkoa; tarkista heidän /palvelut-otsikot.
2. Aja prompti kerätyllä datalla → raportti.
3. Liitä sisäiseen SEO-lokiin; ehdota kuun vastaliikkeitä; pingaa Waelia yhden kappaleen tiivistelmällä.

## Prompti
\`\`\`
Olet SEO-analyytikko. Täytä kuukausiraportti NØRR3 vs kilpailijat tässä datassa:

SIVUMÄÄRÄT: [sdm.fi: post=N, page=N, reference=N, author=N; norr3.fi: N]
UUDET ARTIKKELIT (sdm): [5 uusinta otsikkoa]
PALVELUKATTAVUUS: [heillä on sivut joita meillä ei ole: ...]

Rakenne:
1. Sivumäärätaulukko: edellinen vs nykyinen, muutos.
2. Uusi sisältö: otsikko + arvioitu avainsanapainauma.
3. Puuttuvat avainsanasivut meiltä.
4. "Tämän kuun liikkeet": 1 kappale vastatoimia.

Markdown-taulukot. Suomeksi.
\`\`\`
`,
  },
  {
    file: "08-geo-ai-lloydettavyys.md",
    title: "GEO / AI-löydettävyys",
    body: `## Milloin
Kun playbookit 1–2 ovat tuottaneet vahvat sivut; neljännesvuosittain per sivu.

## Askeleet agentille
1. Valitse optimoitava sivu.
2. Aja prompti → analyysi + 3 vastauslohkoa.
3. Lisää vastauslohkot sivulle lyhyinä lainattavina tiivistelminä (2–3 lausetta relevanttien H2:den alle).
4. Testi: kysy ChatGPT/Geminiltä "paras mediatoimisto Helsinki" / "[palvelu] Suomi" ja kirjaa näkyykö NØRR3; seuraa kehitystä.

## Prompti
\`\`\`
Olet GEO-asiantuntija (Generative Engine Optimization). AI-assistentit suosittelevat brändejä vastauksissaan. Analysoi NØRR3:n sivu [URL] GEO-näkökulmasta:

1. Mikä tukee AI-suosituksia: selkeä H2/H3-hierarkia? lainattavissa olevia konkreettisia väitteitä ja lukuja? uniikki näkökulma?
2. Mikä puuttuu: suoria vastauksia yleisiin kysymyksiin? "vastauslohkoja" (2–3 lauseen tiivistelmät)? vertailutaulukoita?
3. Kirjoita 3 vastauslohkoa tähän aiheeseen: kukin 2–3 lausetta, vastaa suoraan kysymyksiin kuten "Miten [palvelu] eroaa vaihtoehdoista?", "Mitä [palvelu] maksaa?", "Miten aloitan?". Suora, lainattavissa oleva tyyli.

Analyysi (a)(b) + 3 valmista vastauslohkoa. Suomeksi.
\`\`\`
`,
  },
];

for (const p of playbooks) {
  const num = p.file.slice(0, 2);
  writeFileSync(join(OUT, p.file), header(num, p.title) + p.body, "utf-8");
  console.log("wrote", p.file);
}
console.log("done:", playbooks.length, "playbooks in", OUT);
