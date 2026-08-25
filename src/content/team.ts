export type TeamMember = {
  id: string;
  name: string;
  photo: string;
  /**
   * The photo chosen at the 2.6.2026 shoot (NORR3-valokuvaukset-02062026.xlsx).
   * When the photographer's files arrive, save each as
   * `public/images/team/<id>.jpg` and switch `photo` to `/images/team/<id>.jpg`.
   * "TBD" = the person marked favourites in the gallery but no filename was
   * recorded in the schedule yet.
   */
  selectedShot: string;
  role?: { fi: string; en: string };
  bio: { fi: string; en: string };
  /** True for the management team (drives the Contact page's lead-contact row). */
  lead?: boolean;
  /** Optional per-person links. Left undefined until real URLs/addresses are
   *  supplied — the card falls back to the company LinkedIn + info@norr3.fi
   *  rather than fabricating personal contacts. */
  linkedin?: string;
  email?: string;
  phone?: string;
};

// Roster from the photo-shoot schedule. Portrait photos are placeholders until
// the real shots arrive (see selectedShot). Roles are only set where the brand
// materials state them — do not invent titles for real people.

/**
 * The shared house line every member currently carries, because per-person bios
 * have not been written yet. Cards compare against this object and skip it: 17
 * identical paragraphs read as filler, and the same claim is already made in
 * full by the "Attitude." pillar above the roster. As soon as a member gets a
 * real bio object, their card starts showing it — no code change needed.
 */
export const houseBio = {
  fi: "Rohkea, innovatiivinen ja strateginen mediatoimistokentän uudistaja.",
  en: "A bold, innovative and strategic renewer of the media agency field.",
};

const bio = houseBio;

export const team: TeamMember[] = [
  { id: "maria-malila", name: "Maria Malila", photo: "/images/team/maria-malila.webp", selectedShot: "Norr33113.jpg", role: { fi: "Client & Team Lead", en: "Client & Team Lead" }, lead: true, email: "maria.malila@norr3.fi", bio },
  { id: "antti-ujainen", name: "Antti Ujainen", photo: "/images/team/antti-ujainen.webp", selectedShot: "TBD (omat suosikit)", role: { fi: "Managing Director", en: "Managing Director" }, lead: true, email: "antti.ujainen@norr3.fi", linkedin: "https://www.linkedin.com/in/ujainen/", bio },
  { id: "anne-mari-lahtinen", name: "Anne-Mari Lahtinen", photo: "/images/team/anne-mari-lahtinen.webp", selectedShot: "Norr33286.jpg", role: { fi: "Senior Concept Designer, Team Lead, Partner", en: "Senior Concept Designer, Team Lead, Partner" }, lead: true, email: "anne-mari.lahtinen@norr3.fi", bio },
  { id: "elina-rossi", name: "Elina Rossi", photo: "/images/team/elina-rossi.webp", selectedShot: "Norr33374.jpg", role: { fi: "Senior Marketing Specialist, Partner", en: "Senior Marketing Specialist, Partner" }, email: "elina.rossi@norr3.fi", bio },
  { id: "anton-kallio", name: "Anton Kallio", photo: "/images/team/anton-kallio.webp", selectedShot: "Norr33595.jpg", role: { fi: "Senior Marketing Specialist, Partner", en: "Senior Marketing Specialist, Partner" }, email: "anton.kallio@norr3.fi", bio },
  { id: "anna-liina-harrivaara", name: "Anna-Liina Harrivaara", photo: "/images/team/anna-liina-harrivaara.webp", selectedShot: "TBD (valittu kuvauksissa)", role: { fi: "Senior Marketing Specialist, Partner", en: "Senior Marketing Specialist, Partner" }, email: "anna-liina.harrivaara@norr3.fi", bio },
  { id: "maija-etokari", name: "Maija Etokari", photo: "/images/team/maija-etokari.webp", selectedShot: "Norr33739.jpg / Norr33804.jpg", role: { fi: "Senior Marketing Specialist, Partner", en: "Senior Marketing Specialist, Partner" }, email: "maija.etokari@norr3.fi", bio },
  { id: "dina-barbis", name: "Dina Barbis", photo: "/images/team/dina-barbis.webp", selectedShot: "TBD (omat suosikit)", role: { fi: "Senior Media Planner, Partner", en: "Senior Media Planner, Partner" }, email: "dina.barbis@norr3.fi", bio },
  { id: "marika-salovaara", name: "Marika Salovaara", photo: "/images/team/marika-salovaara.webp", selectedShot: "Norr34062.jpg", role: { fi: "Client & Team Lead", en: "Client & Team Lead" }, lead: true, email: "marika.salovaara@norr3.fi", bio },
  { id: "lotta-brech", name: "Lotta Brech", photo: "/images/team/lotta-brech.webp", selectedShot: "Norr34138.jpg", role: { fi: "Client & Team Lead, Partner", en: "Client & Team Lead, Partner" }, lead: true, email: "lotta.brech@norr3.fi", bio },
  { id: "salla-sofia-lahti", name: "Salla-Sofia Lahti", photo: "/images/team/salla-sofia-lahti.webp", selectedShot: "Norr34300.jpg", role: { fi: "Senior Marketing Specialist", en: "Senior Marketing Specialist" }, email: "salla-sofia.lahti@norr3.fi", bio },
  { id: "aino-lehtinen", name: "Aino Lehtinen", photo: "/images/team/aino-lehtinen.webp", selectedShot: "Norr34653.jpg", role: { fi: "Media Specialist", en: "Media Specialist" }, email: "aino.lehtinen@norr3.fi", bio },
  { id: "janne-savela", name: "Janne Savela", photo: "/images/team/janne-savela.webp", selectedShot: "TBD (omat suosikit)", role: { fi: "Senior Marketing Specialist", en: "Senior Marketing Specialist" }, email: "janne.savela@norr3.fi", bio },
  { id: "geir-siirde", name: "Geir Siirde", photo: "/images/team/geir-siirde.webp", selectedShot: "Norr34687.jpg / Norr34711.jpg", role: { fi: "Senior Marketing Specialist", en: "Senior Marketing Specialist" }, email: "geir.siirde@norr3.fi", bio },
  { id: "teppo-lipsanen", name: "Teppo Lipsanen", photo: "/images/team/teppo-lipsanen.webp", selectedShot: "Norr34853.jpg", role: { fi: "Data Analyst & Project Manager, Partner", en: "Data Analyst & Project Manager, Partner" }, email: "teppo.lipsanen@norr3.fi", bio },
  { id: "michael-oshea", name: "Michael O'Shea", photo: "/images/team/michael-oshea.webp", selectedShot: "Norr35115.jpg", role: { fi: "Senior Marketing Specialist, Partner", en: "Senior Marketing Specialist, Partner" }, email: "michael.oshea@norr3.fi", bio },
  { id: "karoliina-makela", name: "Karoliina Mäkelä", photo: "/images/team/karoliina-makela.webp", selectedShot: "Norr35036.jpg", role: { fi: "Business Controller", en: "Business Controller" }, lead: true, email: "karoliina.makela@norr3.fi", bio },
];

/**
 * Group + mood shots picked at the same shoot — for the hero collage, values
 * interstitials and About section once the files arrive:
 * group: Norr33485.jpg, Norr33502.jpg
 * mood ("fiiliskuvat"): Norr35218, Norr35344, Norr35374, Norr35406, Norr35410,
 * Norr35464, Norr35493, Norr35502
 */

export type OpenRole = {
  id: string;
  title: { fi: string; en: string };
  location: { fi: string; en: string };
};

export const openRoles: OpenRole[] = [
  { id: "programmatic", title: { fi: "Ohjelmallisen ostamisen asiantuntija", en: "Programmatic Trading Specialist" }, location: { fi: "Helsinki", en: "Helsinki" } },
  { id: "engine-dev", title: { fi: "Marketing Engine -kehittäjä", en: "Marketing Engine Developer" }, location: { fi: "Helsinki / etä", en: "Helsinki / remote" } },
  { id: "client-director", title: { fi: "Asiakkuuspäällikkö, B2B", en: "Client Director, B2B" }, location: { fi: "Helsinki", en: "Helsinki" } },
];
