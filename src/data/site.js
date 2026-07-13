export const site = {
  name: "Pixel Kriti",
  motto: "Delivering technology people trust. And a partner they can count on.",
  positioning: "Your growth partner, not your vendor.",
  /** Locked footer copy (brand guide 2.5) - changes need Brand Guardian sign-off. */
  boilerplate:
    "We build, we do not resell. Built for you, not configured for you - written by us, one business at a time.",
  /** Used for the document title on routes that set none of their own. */
  titleDefault: "Pixel Kriti - Custom Software, CRM & AI Sub-Agents",
  // TODO: confirm these before launch.
  email: "info@pixelkriti.com",
  bookingUrl: null, // e.g. a Calendly link; falls back to the contact page.
};

/**
 * The video section right after the splash.
 *
 * `youtubeId` streams that video from YouTube (autoplaying, muted, looped);
 * when it is set, `src` is ignored. Clear it to fall back to a self-hosted
 * file at `src` (drop one at `public/showreel.mp4` - already un-ignored in
 * .gitignore). With neither, the section does not render.
 *
 * TODO: the current ID is Blender's Big Buck Bunny, standing in until the
 * real Pixel Kriti reel is uploaded to youtube.com/@pixelkriti.
 */
export const showreel = {
  youtubeId: "aqz-KE-bpKQ",
  src: "/showreel.mp4",
  poster: null,
  // No caption while the video is a stock stand-in: labelling stock footage
  // "Selected work" would be exactly the invented proof the site forswears.
  caption: null,
};

/** `icon` keys map to components in Footer.jsx - data stays free of JSX. */
export const socials = [
  {
    label: "Instagram",
    icon: "instagram",
    href: "https://www.instagram.com/pixel.kriti",
  },
  {
    label: "LinkedIn",
    icon: "linkedin",
    href: "https://www.linkedin.com/company/pixel-kriti",
  },
  { label: "X", icon: "x", href: "https://x.com/pixelkriti" },
  { label: "YouTube", icon: "youtube", href: "https://www.youtube.com/@pixelkriti" },
];

export const nav = [
  { label: "Work", to: "/work" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];
