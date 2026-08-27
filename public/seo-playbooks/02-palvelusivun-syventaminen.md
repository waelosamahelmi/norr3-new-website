# Playbook 02: Palvelusivun syventäminen (280 → 600–900 sanaa)

_NØRR3 SEO-sisältökone — tämä tiedosto on ladattavissa osoitteesta /seo-report/seo-playbooks/_

## Milloin
Jokaiselle viidelle olemassa olevalle palvelusivulle, sitten jokaiselle uudelle avainsanasivulle. Aloita suurimmalla hakumäärällä (hakukoneoptimointi 1600/kk).

## Askeleet agentille
1. Valitse sivu.
2. Aja prompti → Markdown-runko.
3. Ihminen tarkistaa mini-casen luvut; korvaa [CASE] oikealla tai hyväksytyllä esimerkillä.
4. Päivitä src/content/servicePages.ts (tai CMS) — säilytä hero/rakenne, lisää uudet osiot.
5. Builddaa, varmista ≥600 sanaa, sitemap kunnossa.

## Prompti
```
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
```
