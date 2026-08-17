# Three workstreams from Antti's feedback — cases, brief form, services restructure

Repo: /root/norr3-new-website (Next 16, React 19, Tailwind v4, next-intl FI-EN). Brand tokens only, Host Grotesk, Material outlined icons, light+dark correct, FI/EN parity. `npm run build` must pass. Do NOT commit. Do NOT touch HomeHero/CityHero/StickerHero/HeroRandomizer/heroes components.

## WORKSTREAM 1: Update cases with real spreadsheet data

Two cases from Antti's spreadsheet are READY (not approved but has full data). Update `src/content/cases.ts`:

### Case 1: Oomi (NEW case)
- slug: "oomi"
- client: "Oomi"
- image: "/images/cases/oomi.webp" (we'll add the image later — use a placeholder path)
- size: "large"
- summary FI: "Oomi lanseerasi täysin uuden tuotteen, Oomi Mobiilin, laajalle kohderyhmälle. Laaja monikanavakampanja nosti näkyvyyttä ja hakuosuutta merkittävästi."
- summary EN: "Oomi launched an entirely new product, Oomi Mobiili, to a wide audience. A broad multichannel campaign significantly boosted visibility and search share."
- tagline FI: "Uuden tuotteen lanseeraus monikanavaisesti"
- tagline EN: "Launching a new product across every channel"
- intro FI: "Oomi lanseerasi täysin uuden tuotteen, Oomi Mobiilin, laajalle 25–65-vuotiaiden kohderyhmälle Suomessa — tavoitteena rakentaa tunnettuutta ja luottamusta täysin uudelle tuotekategorialle energiayhtiön brändin alla."
- intro EN: "Oomi launched an entirely new product, Oomi Mobiili, to a broad 25–65 audience in Finland — aiming to build awareness and trust for a completely new product category under an energy company's brand."
- objectives FI: "Lanseerattava täysin uusi tuote (Oomi Mobiili) laajalle 25–65v kohderyhmälle Suomessa. Nostaa tunnettuutta +20 % ja Oomin Share of Search 40 %:iin yhdessä lähdössä. Rakennettava luottamusta täysin uudelle tuotekategorialle energiayhtiön brändin alla."
- objectives EN: "Launch an entirely new product (Oomi Mobiili) to a broad 25–65 audience in Finland. Lift awareness +20 % and Oomi's Share of Search to 40 % in one go. Build trust for a completely new product category under an energy company's brand."
- solution FI: "Rakensimme laajan yli kymmenen kanavan monikanavamixin (Total TV, YouTube CTV, Cinema, radio, DOOH, display, Meta, TikTok) ja kaksivaiheisen rakenteen somessa: ensin peitto, sitten aktivointi. Korkean huomioarvon formaatit rakentamaan brändi-engagementtia. Mitattu vaikutus systemaattisesti: YouTube Brand Lift -tutkimus ja Cinema-kampanjatutkimus rinnalla. Viestinä selkeä hyötyväite: 'Puhelinliittymä, joka pienentää sähkölaskuasi'."
- solution EN: "We built a broad 10+ channel mix (Total TV, YouTube CTV, Cinema, radio, DOOH, display, Meta, TikTok) with a two-phase social structure: reach first, then traffic optimization for activation. High-attention formats to build brand engagement over CTR. Impact measured systematically with YouTube Brand Lift and Cinema campaign research. The message: a clear value proposition — 'A mobile plan that lowers your electricity bill.'"
- methods: 3 items with icons (campaign, analytics, insights)
- results FI: "Oomi + Lumme -konsernin Share of Search nousi 40,6 %:iin, YouTube Brand Lift +9,74 % absoluuttista (Googlen mukaan yli 'high average' -tason), ja kampanja saavutti lähes 99 % nettopeiton kohderyhmässä neljässä viikossa."
- results EN: "Oomi + Lumme group's Share of Search reached 40.6 %, YouTube Brand Lift showed +9.74 % absolute (above Google's 'high average' benchmark), and the campaign achieved ~99 % net reach in the target group over four weeks."
- metrics: 
  - 40.6 suffix "%" label FI "Share of Search (Oomi + Lumme)" EN "Share of Search (Oomi + Lumme)"
  - 9.74 suffix "%" label FI "YouTube Brand Lift (absoluuttinen)" EN "YouTube Brand Lift (absolute)"
  - 99 suffix "%" label FI "Nettopeitto kohderyhmässä 4 viikossa" EN "Net reach in target group over 4 weeks"
- kpi: 40.6 suffix "%" label FI "Share of Search" EN "Share of Search"
- parallax: false

### Case 2: Suun Terveystalo (REPLACE existing terveystalo case)
- slug: "suun-terveystalo"
- client: "Suun Terveystalo"
- image: "/images/cases/terveystalo.webp" (keep existing)
- size: "large"
- summary FI: "Mediabudjettia leikattiin 45 %, silti ajanvaraukset kasvoivat 15 % ja kustannus per varaus laski 38 %."
- summary EN: "Media budget was cut 45 %, yet appointments grew 15 % and cost per booking dropped 38 %."
- tagline FI: "Pienemmällä budjetilla enemmän varauksia"
- tagline EN: "More bookings on a smaller budget"
- intro FI: "Suun Terveystalon mediabudjettia leikattiin 45 % edellisestä kampanjasta, ja budjetti/päivä puolittui. Silti 830 000 kohderyhmäläistä ei vielä tuntenut brändiä lainkaan."
- intro EN: "Suun Terveystalo's media budget was cut 45 % from the previous campaign, and budget per day halved. Yet 830,000 people in the target group didn't know the brand at all."
- objectives FI: "Mediabudjettia leikattiin 45 % edellisestä kampanjasta. Budjetti/päivä puolittui, vaikka kampanja-aika piteni +25 %. 830 000 kohderyhmäläistä ei tunne Suun Terveystaloa lainkaan. Tasapaino brändin ja suorien varausten välillä 10+ kanavassa, 25 kaupungissa."
- objectives EN: "Media budget was cut 45 % from the previous campaign. Budget per day halved, even though the campaign period grew +25 %. 830,000 people in the target group don't know Suun Terveystalo at all. Balance brand and direct bookings across 10+ channels, 25 cities."
- solution FI: "Rakensimme laajan monikanavamixin (TV, YouTube CTV, Cinema, radio, printti, DOOH, PDOOH, display, Meta) ja siirsimme budjettia kalliista kanavista kustannustehokkaisiin reach-kanaviin. Alueellinen kohdennus: TV Lapissa hiihtolomalla, lokalisoitu printti per toimipiste. Jatkuva optimointi tavoittavuuteen + taktinen tarjous rinnalla. Brändiviesti: 'Hymyile. Olet hyvissä käsissä.' Taktinen viesti: 49 € hammastarkastus uusille asiakkaille."
- solution EN: "We built a broad multichannel mix (TV, YouTube CTV, Cinema, radio, print, DOOH, PDOOH, display, Meta) and shifted budget from expensive channels to cost-efficient reach channels. Regional targeting: TV in Lapland during ski holiday, localized print per clinic. Continuous optimization toward reach + tactical offer alongside. Brand message: 'Smile. You're in good hands.' Tactical message: €49 dental check-up for new patients."
- methods: 3 items (targeting, optimization, measurement)
- results FI: "Kokonaisvaraukset kasvoivat 15 % edellisvuoteen verrattuna, kustannus per varaus laski 38 % ja orgaaniset varaukset kasvoivat 4,4 % — budjetin puolituksesta huolimatta. 71 % tunnistaa brändin, preferenssi nousi 16 % → 18 %."
- results EN: "Total appointments grew 15 % year-over-year, cost per booking dropped 38 %, and organic appointments grew 4.4 % — despite the halved budget. 71 % recognize the brand, preference rose from 16 % to 18 %."
- metrics:
  - 15 suffix "%" label FI "Kokonaisvaraukset kasvoivat (YoY)" EN "Total appointments grew (YoY)"
  - -38 suffix "%" label FI "Kustannus per varaus laski" EN "Cost per booking dropped"
  - 4.4 suffix "%" label FI "Orgaanisten varausten kasvu" EN "Organic appointments growth"
- kpi: -38 prefix "" suffix "%" label FI "kustannus per varaus" EN "cost per booking"
- parallax: false

Keep the existing cases (flow-festival, kokkola, st1, kiinteistomaailma) as-is. Just ADD oomi and REPLACE terveystalo with suun-terveystalo. Also update any references to the old terveystalo slug (homepage, cases page, sitemap) to suun-terveystalo.

## WORKSTREAM 2: Services restructure

Restructure `src/content/services.ts` and `src/app/[locale]/services/page.tsx` to use 6 categories with sub-items per Antti's spec:

1. **Insight & Strategy** (Insight & Strategia)
   - Tunnettuustutkimukset / Brand awareness studies
   - Kohderyhmätutkimukset / Audience research
   - Mediankäyttötutkimukset – NØRR3 Media Insights / Media usage studies
2. **Data & Measurement** (Data & Mittaus)
   - NØRR3 Dashboard
   - Konversiomittaus / Conversion measurement
3. **SEO, GEO & SEM**
   - Hakukonelöydettävyys / Search engine discoverability
   - AI-löydettävyys / AI discoverability
   - Hakukonemainonta / Search engine advertising
   - Auditit / Audits
4. **Media Services** (Mediapalvelut) — keep as a single card, no sub-items
5. **Performance Marketing**
   - Dynamisen markkinoinnin palvelut / Dynamic marketing services
   - Performance markkinoinnin palvelut / Performance marketing services
6. **Marketing Engine**
   - Esittely & demo / Presentation & demo
   - Appit / Apps
   - Hinnoittelu / Pricing

Update the services page to render these 6 categories as cards, with sub-items listed within each card (as a bullet list or small chips). Keep the existing card design pattern (icon tile, index number, heading, body). Add the sub-items as a list within each card.

Add full FI/EN dictionary entries for all new sub-item labels.

## WORKSTREAM 3: Brief form (native, multi-step, AI-assisted)

Create `src/app/[locale]/brief/page.tsx` — a native multi-step briefing form. This replaces the old Google Form. The form has these steps:

### Step 0: Email + intro
- Intro text: "Kampanjan tai jatkuvan tekemisen brief NØRR3:lle..." (FI) / "Brief NØRR3 on a campaign or continuous marketing..." (EN)
- Email field
- "Send me a copy of my responses" checkbox
- Continue button

### Step 1: Company & contact basics (Yrityksesi ja sinun perustiedot)
- Company name (text)
- Your name (text)
- Phone number (text)
- Do you have an ad agency? (text)
- Have you used a media agency before? (yes/no radio)
- How did you hear about NØRR3? (select: Another client recommended / NØRR3's own marketing / Vuoden Toimisto study / Google / Other: [text])
- How should NØRR3 proceed after the brief? (select: Meet live / Google Meets or Teams / Straight to a meeting with proposal + team / Other: [text])
- When would you like to meet? (date picker)

### Step 2: Campaign details (Kampanjan tiedot)
- Campaign name (text)
- Cost center / PO number (text)
- Campaign or continuous? (select: Campaign / Continuous / Both)
- Start date (date)
- End date (date)
- Media budget excl. labour (textarea — note about VAT etc.)
- NØRR3 labour budget (textarea)
- Channel preferences (a TABLE: rows = channels [TV, Streaming, YouTube, Radio, Digital audio, Print, Display, Native, OOH, Cinema, Influencer, PR, SEM, App ads, Facebook, Instagram, LinkedIn, Jodel, TikTok, Snapchat, Organic FB&IG], columns = [Don't use / We'll do this ourselves / Definitely include NØRR3 / Very desirable NØRR3 / Possible NØRR3] — radio per cell)
- Dynamic campaign interest? (multi-select: Interested / Not needed / Yes definitely / Other: [text])
- Services sought (multi-checkbox: Media planning / Audience definition / Goal clarification / Competitor media analysis / Brand awareness study / Media negotiations / Offline channels / Digital channels / SEM / Analytics & measurement / Other: [text])
- Division of labour (textarea)
- Digital channel setup (textarea)

### Step 3: Target group (Kohderyhmän tiedot)
- What's being targeted? (select: B2C / B2B / Existing customers / Multiple groups — describe / Other: [text])
- Primary target group (textarea)
- Secondary target group (textarea)
- Do you have audience research? (select: No, needs to be done / Yes, will provide separately)

### Step 4: Goals, reporting & measurement (Tavoitteet, raportointi ja mittaus)
- Primary goal (textarea)
- Secondary goal (textarea)
- Other goals (textarea)
- Awareness vs tactical? (select: Can't say — request NØRR3 proposal / More awareness / More activation)
- Measurement approach? (select: We'll build it ourselves / Want NØRR3 proposal / Want NØRR3 dashboard / Other: [text])
- Reporting frequency? (select: Monthly / Bi-weekly / Weekly / Dashboard suffices / Other: [text])

### Step 5: Materials (Aineistot)
- Are materials ready? (textarea)
- Where is campaign traffic directed? (text)

### Step 6: Free comments (Vapaat kommentit)
- Thoughts about the campaign (textarea)
- Expectations for collaboration (textarea)

### AI assistance:
After step 2 (campaign details), show an AI-generated suggestion box: "Based on your brief, NØRR3 suggests..." — call a new API route `/api/brief-assist` that takes the form data so far and returns a short suggestion (channels to consider, budget allocation tips, etc.). Use the same Ollama kimi/glm pattern as the sticker hero API. Keep it OPTIONAL (a "Get AI suggestion" button, not automatic).

### Technical:
- Multi-step with a progress indicator (Step 1/7, etc.)
- "Back" and "Continue" buttons
- Form state persists between steps (React state, not URL-based)
- On final submit: show a success screen ("Kiitos briefistä! Otamme sinuun yhteyttä pian." / "Thanks for the brief! We'll be in touch soon.")
- No backend submission yet — just console.log the data and show success (can wire to email/CRM later)
- Brand-styled (Host Grotesk, brand tokens, card layout, rounded inputs like ContactForm)
- FI/EN: all labels in the dictionary, full parity
- Add a "Brief us" link in the nav header next to "Contact us" (as Antti requested)

## After all three workstreams
Run `npm run build` — must pass. Report files changed + any decisions made. Do NOT commit.