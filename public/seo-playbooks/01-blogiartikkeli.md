# Playbook 01: Blogiartikkelin tuotanto

_NØRR3 SEO-sisältökone — tämä tiedosto on ladattavissa osoitteesta /seo-report/seo-playbooks/_

## Milloin
2–4× / kuukausi, yksi avainsana kerrallaan. Tavoite: sulkea 8 vs 812 blogiartikkelin kuilu SDM:ään nähden.

## Askeleet agentille
1. Varmista avainsana ja kohderyhmä Waelin kanssa.
2. Aja prompti alla. Vaadi Markdown-tulos.
3. Tarkista äänisäännöt; kielletyt sanat pois, todentamattomat luvut `[TARKISTA]`-merkinnällä.
4. Hanki hero-kuva (aito valokuva ensisijaisesti; WebP 1600×1066 CMS:n kautta).
5. Luo postaus CMS:ssä → Posts (FI+EN, SEO-kentät, kansikuva, kirjoittaja = oikea tiimiläinen).
6. Varmista: sivu latautuu /slugin alta, ilmestyy sitemap.xml:ään, CMS SEO -auditista ei virheitä.

## Prompti
```
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
```
