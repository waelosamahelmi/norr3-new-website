# Playbook 04: Schema-markup (rich snippets)

_NØRR3 SEO-sisältökone — tämä tiedosto on ladattavissa osoitteesta /seo-report/seo-playbooks/_

## Milloin
Kerran per palvelusivu syventämisen (#2) jälkeen. Myös blogeihin (Article-schema).

## Askeleet agentille
1. Kerää sivun URL, nimi, meta-kuvaus, 4 FAQ-paria.
2. Aja prompti → kolme JSON-LD-lohkoa.
3. Lisää sivulle ([...slug]-reitissä <script type="application/ld+json">); validoi validator.schema.org.
4. Aja CMS SEO -audit uudelleen.

## Prompti
```
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
```
