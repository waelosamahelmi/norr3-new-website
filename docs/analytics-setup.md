# Analytics & ad tags — setup guide for the new norr3.fi

Checked 12.9.2026 against the live WordPress site and its public GTM container.

## 1. What the old site has today

Everything except the Meta Pixel base code runs through **one Google Tag
Manager container**. Keep using it: it holds the history and the ad-platform
links.

| Tool | ID | Where it runs today | Keep? |
| --- | --- | --- | --- |
| Google Tag Manager | `GTM-WGKJ9MK` | site `<head>` | **Yes** — the new site loads it |
| Google Analytics 4 | `G-R71FDQ7VS1` | in GTM (Google tag + 6 event tags) | Yes |
| Google Ads conversions | account `746203269`, 4 conversion labels | in GTM | Yes, re-trigger |
| Google Ads conversion linker | — | in GTM | Yes |
| LinkedIn Insight Tag | partner `3675010` | in GTM (base + 4 `lintrk` + 3 pixel conversions) | Yes, re-trigger |
| LinkedIn pixel, old partner | partner `1436489` | in GTM | Delete (old account) |
| Meta Pixel | `798828254649062` | **hardcoded in the WP theme** + base code in GTM | Yes, GTM only |
| Meta custom events | 4 × `fbq('trackCustom', …)` | in GTM | Replace with `Lead` |
| Adform Trackpoint | `1764633` | in GTM (3 tags) | Only if you still buy via Adform |
| jQuery AJAX listener | — | in GTM | Delete (no jQuery on the new site) |
| 4 paused tags | — | in GTM | Delete |
| Search Console | meta-tag token `XOXV8IH-…` | site `<head>` | **Done** — already in the CMS |

**Why the old container cannot just be switched on:** its triggers fire on
things that don't exist on the new site. It watches for clicks on the text
"Sovitaanko treffit?" and "Kampanjabrief", for the WordPress AJAX
`formSubmissionSuccess` event, and for URLs like `/meista/#ota-yhteytta` and
`/tiktok-trendiraportit/`. The tags would load, but no conversion would ever
count.

## 2. What the new site already does (no work needed)

- **Loads GTM only after cookie consent.** It sets up Google Consent Mode v2:
  everything starts `denied` and flips to `granted` when the visitor accepts.
  A visitor who declines loads no tracking at all.
- **Pushes clean events to the dataLayer.** Every tag should listen to these
  instead of button texts:

| Event | Parameters | When |
| --- | --- | --- |
| `generate_lead` | `form_name`: `contact` · `brief` · `booking_demo` · `booking_meeting` | A form was **successfully** sent |
| `job_application` | `form_name`: `open_application` | Open application sent |
| `booking_open` | `booking_kind`: `demo` · `meeting` | Someone opened the booking popup |
| `email_click` | `link_url` | Any `mailto:` link |
| `phone_click` | `link_url` | Any `tel:` link |

- **Page views:** the site changes pages without full reloads. GA4 counts them
  through "page changes based on browser history events" (on by default).

## 3. Step by step

### Step 1 — Get access (15 min)

Check that you (Wael) are an **admin/publisher** in each of these. If you're
not, ask whoever set up the old site (usually the person in the account's user
list with the oldest date):

1. **Tag Manager**: tagmanager.google.com → container `GTM-WGKJ9MK` → Admin → User Management → you need *Publish*.
2. **GA4**: analytics.google.com → property with stream `G-R71FDQ7VS1` → Admin → Property access management → *Administrator*.
3. **Google Ads**: ads.google.com → account `746-203-269` → Admin → Access and security.
4. **LinkedIn**: linkedin.com/campaignmanager → the ad account with Insight Tag partner `3675010` → Account settings → Manage access.
5. **Meta**: business.facebook.com → Events Manager → dataset/pixel `798828254649062` → you need *Manage*.
6. **Adform** (if used): ask the media team who owns Trackpoint `1764633`.
7. **Search Console**: search.google.com/search-console → property `norr3.fi` → Settings → Users.

### Step 2 — Prepare GTM in a new workspace (1–2 h, nothing goes live)

In Tag Manager → container `GTM-WGKJ9MK` → **Workspace → New workspace**, name it "New site 2026".
Do **not** publish yet: the old WordPress site uses this same container until the DNS switch.

**2a. Variables** → New → *Data Layer Variable*, one each:
`form_name`, `booking_kind`, `link_url` (name them `DLV - form_name` etc.).

**2b. Triggers** → New → *Custom Event*:

| Trigger name | Event name | Fires on |
| --- | --- | --- |
| `CE - lead (all)` | `generate_lead` | All custom events |
| `CE - lead contact` | `generate_lead` | Some: `DLV - form_name` equals `contact` |
| `CE - lead brief` | `generate_lead` | Some: `DLV - form_name` equals `brief` |
| `CE - lead booking` | `generate_lead` | Some: `DLV - form_name` starts with `booking_` |
| `CE - job application` | `job_application` | All |
| `CE - email click` | `email_click` | All |
| `CE - phone click` | `phone_click` | All |
| `CE - booking open` | `booking_open` | All |

**2c. GA4.**
- Keep the **Google tag** `G-R71FDQ7VS1` on *Initialization – All Pages*.
- Replace the 6 old GA4 event tags with 4 new *GA4 Event* tags:
  - `generate_lead`: trigger `CE - lead (all)`, event parameter `form_name` = `{{DLV - form_name}}`.
  - `job_application`: trigger `CE - job application`.
  - `email_click`: trigger `CE - email click`, parameter `link_url` = `{{DLV - link_url}}`.
  - `phone_click`: trigger `CE - phone click`, parameter `link_url` = `{{DLV - link_url}}`.
- Pause the old event tags ("Sovitaanko treffit - click", "Form submit treffit",
  "Kampanjabrief-lomake click", "Email click", "tiktoktrend_download",
  "Insights_form_submit"). Delete them after launch.

**2d. Google Ads.**
- In Google Ads → Goals → Conversions → Summary, open each conversion and note
  its label (`bJy8CP7_3eMYEIXR6OMC`, `MYEIXR6OMC`, `6HgSCMno9eMYEIXR6OMC`,
  `vKzBCO_89eMYEIXR6OMC`) and what it measures.
- In GTM, point each of the 4 *Google Ads Conversion Tracking* tags at the
  matching new trigger. Contact form → `CE - lead contact`, brief →
  `CE - lead brief`, meeting/demo → `CE - lead booking`, email → `CE - email click`.
- The label `MYEIXR6OMC` looks truncated compared to the other three. Copy the
  correct label from Google Ads.
- Keep the **Conversion Linker** on All Pages.

**2e. LinkedIn.**
- Add the official *LinkedIn Insight* tag template (Templates → Search Gallery
  → "LinkedIn Insight"), Partner ID `3675010`, trigger *All Pages*. Delete the
  old custom-HTML base code if there is one.
- For each conversion in Campaign Manager → Analyze → Conversion tracking
  (IDs `14112362`, `14112378`, `14112442`, `14112482`, `6354274`, `16499658`,
  `19574778`, `23033450`): open it and check what it measures.
  - Still wanted: create a LinkedIn Insight tag of type *Conversion* with that
    ID, on the matching `CE -` trigger.
  - Not wanted: archive it in LinkedIn.
- Delete the pixel tag with partner `1436489`.

**2f. Meta.**
- Keep one *Custom HTML* Meta Pixel base code tag (ID `798828254649062`) on
  *All Pages*, and add a second trigger *History Change* so client-side page
  changes send `PageView`.
- Replace the 4 `trackCustom` tags with one Custom HTML tag on `CE - lead (all)`:
  ```html
  <script>fbq('track', 'Lead', {content_name: {{DLV - form_name}}});</script>
  ```
  Under *Advanced → Tag sequencing*, fire the base code tag first.

**2g. Adform** (only if still used). Keep the Trackpoint tag on All Pages. Put
the conversion variants on `CE - lead (all)`, or delete all three.

**2h. Consent on non-Google tags.** For every LinkedIn, Meta and Adform tag:
Advanced Settings → Consent Settings → *Require additional consent* →
`ad_storage`. Google's own tags respect Consent Mode automatically.
Admin → Container Settings → turn on *Enable consent overview*.

**2i. Delete** the jQuery AJAX listener, the 4 paused tags, and every trigger
that matches old texts or URLs (Sovitaanko treffit, Kampanjabrief, Katso
kaikki caset, `/contact/`, `/meista/#ota-yhteytta`, `/tiktok-trendiraportit/`,
`/norr3-marketing-engine/`, `formSubmissionSuccess`, `ajaxComplete`). Before
deleting, pause the tags that depend on them rather than deleting outright.

### Step 3 — Test on staging with Tag Assistant (30 min)

1. **CMS** → Settings → Integrations → *Google Tag Manager container ID* =
   `GTM-WGKJ9MK`. Leave the GA4 field empty. It goes live on staging within a
   second. Staging is hidden from search engines, but real tags will fire, so
   do step 4 right after testing.
2. **GTM** → *Preview* → enter `https://site.srv1160035.hstgr.cloud`.
3. Accept cookies, then do each action once:
   - send the contact form
   - send a brief
   - book a meeting
   - click an email link
   Tag Assistant should show `generate_lead` / `email_click` with the right
   tags firing under each.
4. **GA4** → Admin → DebugView: check the events arrive with `form_name`.
5. **Clear** the GTM field in the CMS again until launch day, so staging
   visits don't land in the real GA4.

### Step 4 — GA4 settings (20 min)

In analytics.google.com → Admin:
1. **Events → Key events**: mark `generate_lead` and `job_application` as key events.
2. **Custom definitions → Create custom dimension** (event scope): `form_name`, `booking_kind`.
3. **Data streams → web stream → Enhanced measurement**: on, including
   "Page changes based on browser history events".
4. **Data streams → Configure tag settings → Define internal traffic**: the
   office IP. Then Admin → Data filters → set *Internal traffic* to Active.
5. **Data retention**: 14 months.
6. **Product links**: link Google Ads (`746-203-269`) and Search Console.
7. In Google Ads → Goals, import `generate_lead` from GA4 if you'd rather
   count conversions from GA4 than from the Ads tags. Don't use both as
   *primary*, or every conversion counts twice.

### Step 5 — Platform checks (20 min)

- **Meta** → Events Manager → Settings → verify domain `norr3.fi`: add the DNS
  TXT record Meta shows, in Cloudflare. After launch, check `Lead` appears
  under Test events.
- **LinkedIn** → Campaign Manager → Insight Tag: after launch it should show
  "Active" for `norr3.fi`.
- **Google Ads** → Goals → Conversions → *Diagnostics*: "Consent mode" should
  show as detected after launch.

### Step 6 — Launch day (15 min, right after DNS points to the new site)

1. CMS → Settings → *Google Tag Manager container ID* = `GTM-WGKJ9MK`.
2. GTM → **Submit → Publish** the "New site 2026" workspace. Version name:
   "norr3.fi relaunch".
3. On the live site, accept cookies and send one test form. In GA4 →
   Realtime, check `generate_lead` shows up.
4. The next day, check Google Ads, LinkedIn and Meta each recorded the test
   conversion.

### Step 7 — Privacy policy

The *Tietosuojaseloste* and the cookie banner should name the tools:
Google Analytics, Google Ads, LinkedIn Insight Tag, Meta Pixel, and Adform if
kept. Say that they load only after consent. The Finnish regulator (Traficom)
requires this. It is a copy change on the privacy page in the CMS.

## For developers

- Loader: `src/components/Analytics.tsx`. Events: `src/lib/track.ts`. Add new
  events there and list them in the table above.
- GTM and GA4 IDs come from CMS Settings (`gtm_container_id`,
  `ga4_measurement_id`). When a GTM ID is set, the GA4 field is ignored.
