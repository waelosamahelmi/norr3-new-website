# Playbook 07: Kilpailijaseuranta (15 min/kk)

_NØRR3 SEO-sisältökone — tämä tiedosto on ladattavissa osoitteesta /seo-report/seo-playbooks/_

## Milloin
Jokainen kuun ensimmäinen arkipäivä.

## Askeleet agentille
1. Kerää data: curl sdm.fi/sitemap_index.xml + alim sitemapit, laske URLit; hae 5 uusinta postauksen otsikkoa; tarkista heidän /palvelut-otsikot.
2. Aja prompti kerätyllä datalla → raportti.
3. Liitä sisäiseen SEO-lokiin; ehdota kuun vastaliikkeitä; pingaa Waelia yhden kappaleen tiivistelmällä.

## Prompti
```
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
```
