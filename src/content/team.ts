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
};

// Roster from the photo-shoot schedule. Portrait photos are placeholders until
// the real shots arrive (see selectedShot). Roles are only set where the brand
// materials state them — do not invent titles for real people.
const placeholder = (gender: "men" | "women", n: number) =>
  `https://randomuser.me/api/portraits/${gender}/${n}.jpg`;

const bio = {
  fi: "Rohkea, innovatiivinen ja strateginen mediatoimistokentän uudistaja.",
  en: "A bold, innovative and strategic renewer of the media agency field.",
};

export const team: TeamMember[] = [
  { id: "maria-malila", name: "Maria Malila", photo: placeholder("women", 44), selectedShot: "Norr33113.jpg", bio },
  { id: "antti-ujainen", name: "Antti Ujainen", photo: placeholder("men", 32), selectedShot: "TBD (omat suosikit)", role: { fi: "CEO", en: "CEO" }, bio },
  { id: "anne-mari-lahtinen", name: "Anne-Mari Lahtinen", photo: placeholder("women", 65), selectedShot: "Norr33286.jpg", role: { fi: "Senior Concept Designer, Project Lead", en: "Senior Concept Designer, Project Lead" }, bio },
  { id: "elina-rossi", name: "Elina Rossi", photo: placeholder("women", 33), selectedShot: "Norr33374.jpg", bio },
  { id: "anton-kallio", name: "Anton Kallio", photo: placeholder("men", 41), selectedShot: "Norr33595.jpg", bio },
  { id: "anna-liina-harrivaara", name: "Anna-Liina Harrivaara", photo: placeholder("women", 68), selectedShot: "TBD (valittu kuvauksissa)", bio },
  { id: "maija-etokari", name: "Maija Etokari", photo: placeholder("women", 21), selectedShot: "Norr33739.jpg / Norr33804.jpg", bio },
  { id: "dina-barbis", name: "Dina Barbis", photo: placeholder("women", 90), selectedShot: "TBD (omat suosikit)", bio },
  { id: "marika-salovaara", name: "Marika Salovaara", photo: placeholder("women", 26), selectedShot: "Norr34062.jpg", bio },
  { id: "lotta-brech", name: "Lotta Brech", photo: placeholder("women", 51), selectedShot: "Norr34138.jpg", bio },
  { id: "salla-sofia-lahti", name: "Salla-Sofia Lahti", photo: placeholder("women", 12), selectedShot: "Norr34300.jpg", bio },
  { id: "aino-lehtinen", name: "Aino Lehtinen", photo: placeholder("women", 79), selectedShot: "Norr34653.jpg", bio },
  { id: "janne-savela", name: "Janne Savela", photo: placeholder("men", 22), selectedShot: "TBD (omat suosikit)", bio },
  { id: "geir-siirde", name: "Geir Siirde", photo: placeholder("men", 55), selectedShot: "Norr34687.jpg / Norr34711.jpg", bio },
  { id: "teppo-lipsanen", name: "Teppo Lipsanen", photo: placeholder("men", 75), selectedShot: "Norr34853.jpg", bio },
  { id: "michael-oshea", name: "Michael O'Shea", photo: placeholder("men", 11), selectedShot: "Norr35115.jpg", bio },
  { id: "karoliina-makela", name: "Karoliina Mäkelä", photo: placeholder("women", 57), selectedShot: "Norr35036.jpg", bio },
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
