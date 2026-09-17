/**
 * Cookie consent record.
 *
 * Finnish Act on Electronic Communications Services (917/2014) + GDPR: storing
 * or reading anything on the visitor's device requires prior, granular,
 * informed and revocable consent — except for what is strictly necessary to
 * provide the service the visitor asked for. The banner collects the choice,
 * this module owns its shape, and `Analytics` translates it into Google Consent
 * Mode v2 signals. Nothing beyond necessary cookies runs before a record exists.
 */

export const CONSENT_STORAGE_KEY = "norr3-cookie-consent";

/** Bump when the category set changes — an old record then asks again. */
export const CONSENT_VERSION = 2;

export type ConsentCategories = {
  experience: boolean;
  measurement: boolean;
  marketing: boolean;
};

export type ConsentRecord = {
  v: number;
  /** ISO timestamp — proof of when the consent was given (GDPR art. 7(1)). */
  ts: string;
  categories: ConsentCategories;
};

/** Everything off. Customise starts here: no boxes are pre-ticked. */
export const NO_CONSENT: ConsentCategories = {
  experience: false,
  measurement: false,
  marketing: false,
};

export const ALL_CONSENT: ConsentCategories = {
  experience: true,
  measurement: true,
  marketing: true,
};

/** The banner's `norr3-consent-open` event re-opens the settings from the footer. */
export const CONSENT_OPEN_EVENT = "norr3-consent-open";

/**
 * `null` means no valid choice is stored — the banner is shown. Version-1
 * records ("accepted" / "declined" plain strings) are honoured: an acceptance
 * covered analytics and marketing, so it keeps both.
 */
export function parseConsent(raw: string | null | undefined): ConsentCategories | null {
  if (!raw || raw === "pending") return null;
  if (raw === "accepted") return ALL_CONSENT;
  if (raw === "declined") return NO_CONSENT;
  try {
    const parsed = JSON.parse(raw) as Partial<ConsentRecord>;
    if (parsed?.v !== CONSENT_VERSION || !parsed.categories) return null;
    return {
      experience: parsed.categories.experience === true,
      measurement: parsed.categories.measurement === true,
      marketing: parsed.categories.marketing === true,
    };
  } catch {
    return null;
  }
}

export function serializeConsent(categories: ConsentCategories): string {
  const record: ConsentRecord = {
    v: CONSENT_VERSION,
    ts: new Date().toISOString(),
    categories,
  };
  return JSON.stringify(record);
}
