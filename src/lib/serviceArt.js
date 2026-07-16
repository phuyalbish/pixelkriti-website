/**
 * The artwork each service pillar wears, keyed by pillar id.
 *
 * One map, imported by every place that draws a pillar - the home showcase, the
 * services index, and each service page. Three copies of this would be three
 * chances for a pillar to wear different artwork on different pages, which
 * reads as a different service.
 *
 * Loaders, not imports: Vite gives each document its own chunk, fetched only
 * when a card is about to be seen (see LottieCard). That is not a nicety here -
 * AI.json alone is 2.6MB, because it is not really a Lottie at all but 108
 * full-frame JPEGs of an animation.
 */
export const SERVICE_ART = {
  websites: () => import("@/data/lottie/Website.json"),
  analytics: () => import("@/data/lottie/Analytics.json"),
  ai: () => import("@/data/lottie/AI.json"),
};

/**
 * The shape of a pillar's artwork box. Callers add their own radius and ground
 * - two competing `rounded-` or `bg-` classes resolve by CSS order rather than
 * by which was written last, so this deliberately sets neither.
 */
export const SERVICE_ART_SHAPE = "aspect-[4/3] overflow-hidden";

/**
 * Which documents carry their own opaque ground and therefore cannot be shown
 * on a transparent box.
 *
 * AI.json is not really a Lottie: it is 108 full-frame JPEGs, and JPEG has no
 * alpha channel, so a white background is baked into every pixel of every
 * frame. It is also portrait art in a landscape box. Take its white ground away
 * and you do not get a chip floating on the page - you get a white rectangle
 * floating on the page, because the rectangle IS the artwork.
 *
 * The other two are vector with real transparency and sit on any ground.
 *
 * Nothing here can be fixed in CSS. On a dark page there is no blend mode that
 * knocks white out and leaves the colours: `multiply` drops the white but
 * crushes the artwork to near-black along with it. The fix is a re-export with
 * transparency - until then, this one keeps its white.
 */
const OPAQUE_GROUND = new Set(["ai"]);

/** True if this pillar's artwork must be given a white ground to sit on. */
export const needsWhiteGround = (id) => OPAQUE_GROUND.has(id);

export default SERVICE_ART;
