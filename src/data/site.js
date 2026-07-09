export const site = {
  name: "Pixel Kriti",
  motto: "Delivering technology people trust. And a partner they can count on.",
  subheadline:
    "Websites, analytics, and AI solutions built by a small team that works inside your business, not just for it.",
  positioning: "Your growth partner, not your vendor.",
  /** Used for the document title on routes that set none of their own. */
  titleDefault: "Pixel Kriti - Delivering technology people trust.",
  // TODO: confirm these before launch.
  email: "info@pixelkriti.com",
  bookingUrl: null, // e.g. a Calendly link; falls back to the contact page.
  foundedYear: 2025,
};

/**
 * The portfolio showreel on the home page.
 *
 * `src` must point at a file that exists, or the section renders a black box -
 * drop it at `public/showreel.mp4` (already un-ignored in .gitignore). Set `src`
 * to null to hide the section entirely until the video is ready.
 *
 * Keep it short and small: it autoplays on every visit, so anything past a few
 * megabytes is paid for by the visitor. A `poster` frame is shown while it
 * loads, and is what mobile users on a data saver will see instead.
 */
export const showreel = {
  src: "/showreel.mp4",
  poster: null,
  caption: "Selected work, 2025-2026",
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
