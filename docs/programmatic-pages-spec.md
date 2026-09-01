# Marketing Engine — programmatic landing pages: spec

Goal: generate high-intent, product-led landing pages from Marketing Engine
data, without hand-writing each one. This is the volume answer to SDM that the
product makes possible.

## Data fields (source: Marketing Engine / terveystalo-engine data model)

Each programmatic page is driven by a row with:

| Field | Type | Purpose |
|---|---|---|
| `industry` | slug | e.g. `terveydenhuolto`, `kiinteistonvalitys`, `autokauppa` |
| `industry_label_fi` / `_en` | text | headline noun |
| `channel` | enum | Meta, Display, PDOOH, Digital Audio, Search, Video |
| `pain_point_fi` / `_en` | text | the specific local-marketing problem |
| `outcome_fi` / `_en` | text | the measurable result the Engine drives |
| `metric` | text | e.g. "peitto kohderyhmässä", "CPA", "ROAS" |
| `metric_value` | number | template number, flagged `[TARKISTA]` until verified |
| `case_slug` | ref | optional linked NØRR3 case study |

## Page template

- **H1**: `{industry_label} markkinointi — {outcome}` (contains keyword).
- **Intro**: 2 sentences, concrete outcome, no jargon.
- **Miten Marketing Engine toimii** (3 numbered steps, same copy as the pillar).
- **{industry} + {channel}** — 3 section bullets with the pain→outcome mapping.
- **Mini-case / data point** — metric_value with `[TARKISTA]` flag.
- **FAQ** — 4 real questions, answer-block style (GEO).
- **CTA** — "Varaa 30 min" + brief form.
- SEO: title ≤60, meta description 150–155, og image from the brand set.

## Implementation notes

- Render from a `src/content/programmaticPages.ts` data module (same pattern as
  `servicePages.ts`), served by the existing `[locale]/[...slug]` catch-all.
- Each page bilingual (FI + EN), canonical per locale.
- Schema: `Service` + `FAQPage` JSON-LD per page.
- Reuse the SEO publish gate already added to the CMS.
