/**
 * Names and roles are real. Everything else is a placeholder.
 *
 * `photo: null` renders a monogram instead of a headshot - no stock photos of
 * strangers standing in for real people. `tagline: null` renders nothing rather
 * than words we invented on their behalf. `linkedin: null` hides the icon.
 *
 * Per the brief, locations are deliberately omitted site-wide.
 */
export const founders = [
  {
    name: "Amitesh",
    role: "Analytics (AI/ML) & Management",
    photo: null,
    tagline: null,
    linkedin: null,
  },
  {
    name: "Bishal",
    role: "Website & Design",
    photo: null,
    tagline: null,
    linkedin: null,
  },
  {
    name: "Muzammil",
    role: "Marketing, Sales & Analytics",
    photo: null,
    tagline: null,
    linkedin: null,
  },
];

export const team = [
  { name: "Rumi", role: null, photo: null, tagline: null, linkedin: null },
  { name: "Crish", role: null, photo: null, tagline: null, linkedin: null },
  { name: "Adithi", role: null, photo: null, tagline: null, linkedin: null },
  { name: "Aakriti", role: null, photo: null, tagline: null, linkedin: null },
];

/** First letter, for the monogram avatar shown when `photo` is null. */
export const initial = (name) => name.trim().charAt(0).toUpperCase();
