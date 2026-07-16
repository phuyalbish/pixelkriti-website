import { LOGO_PATH, LOGO_SIZE } from "@/lib/logoPath.js";

/**
 * Puts the Pixel Kriti mark at the centre of the OnePlatform animation.
 *
 * The document is stock artwork, and the logo it ships with is a REAL third
 * party's brand mark (the layer is named LogoMetodoViral.png). That is not
 * ours to display, so this swap is not decoration - the animation cannot go on
 * the site without it.
 *
 * The vendored JSON is left exactly as it was downloaded and the substitution
 * happens here, on the way to the player. Editing 38KB of base64 in place would
 * hide the one line that matters - that we replaced someone's logo - inside a
 * diff nobody can read, and it would be silently undone the day the file is
 * re-exported.
 *
 * The replacement is an SVG data URI rather than a rasterised PNG: the mark is
 * a vector we already have, and the animation is scaled up past its native
 * 900px in the layout, where a 97px raster of it would be visibly soft.
 */

/* Which layer wears the logo. Matched by name, not by asset id: `image_4` says
   nothing about what it is, and would quietly point at the wrong picture the
   day the file is re-exported with its assets in a different order. */
const LOGO_LAYER = /logo/i;

/** The mark's green. The standalone mark is brand green everywhere else. */
const MARK_COLOUR = "#31ae49";

/*
 * Where the old logo actually SAT inside its 97x82 asset, measured off the
 * original PNG's opaque pixels: 75x69 of ink, centred at (48, 37) - up and left
 * of the box's own centre, with transparent margin around it.
 *
 * Those margins are why this is not simply "fill the asset": the artwork was
 * composed around a mark of that size in that spot - it is what the platform
 * ellipse was drawn to hold. A mark stretched to the full 97x82 comes out a
 * fifth too big and sits low, spilling over the ellipse it is meant to rest on.
 *
 * MARK is the ink box's HEIGHT, not its width: our mark is square where theirs
 * was wide, so matching the width would make ours the taller of the two.
 */
const INK = { cx: 48, cy: 37, size: 69 };

/**
 * The mark, drawn into the exact footprint the old logo occupied.
 *
 * `width`/`height` match the asset, so the layer's anchor point - which sits at
 * that box's exact centre - keeps meaning what it meant, and no keyframe has to
 * be touched. Inside that box the mark is placed by hand rather than by
 * `meet`: `meet` centres on the BOX, and the artwork centres on the ink.
 */
const markUri = (w, h, colour) => {
  const scale = INK.size / LOGO_SIZE;
  const x = INK.cx - INK.size / 2;
  const y = INK.cy - INK.size / 2;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" ` +
    `viewBox="0 0 ${w} ${h}">` +
    `<g transform="translate(${x} ${y}) scale(${scale})">` +
    `<path d="${LOGO_PATH}" fill="${colour}"/></g></svg>`;
  /* encodeURIComponent, not a bare string: the path is full of '#' and '+',
     either of which truncates a data URI into a picture that never loads. */
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

/**
 * Holds the mark still.
 *
 * The document is an INTRO: it was drawn to play once, so the logo fades up at
 * frame 32, pops to 139%, settles, and fades back to nothing by frame 105. Run
 * on a loop - which is the only way a background can run - that reveal becomes
 * a mark that blinks out for a third of every cycle and throbs through the
 * rest. A logo that flashes reads as a page still loading.
 *
 * So the reveal is dropped and the mark simply sits there, while everything
 * around it - the dots crossing the dashed paths - keeps moving. The traffic is
 * what should be animate; the platform is the thing it all arrives at.
 */
const steady = (layer) => ({
  ...layer,
  ks: {
    ...layer.ks,
    o: { ...layer.ks.o, a: 0, k: 100 },
    s: { ...layer.ks.s, a: 0, k: [100, 100, 100] },
  },
});

/**
 * Returns the document with our mark in the middle, or null if the artwork no
 * longer looks like what this was written against - a re-export that renames or
 * drops the logo layer. Null means the caller draws NOTHING, which is the point:
 * the failure has to be a missing animation, never a stranger's logo silently
 * reappearing on our own biggest claim.
 */
export function withPixelKritiMark(doc, colour = MARK_COLOUR) {
  const layer = doc.layers?.find((l) => LOGO_LAYER.test(l.nm || ""));
  if (!layer?.ks?.o || !layer?.ks?.s) return null;

  const asset = doc.assets?.find((a) => a.id === layer.refId);
  if (!asset) return null;

  return {
    ...doc,
    layers: doc.layers.map((l) => (l === layer ? steady(l) : l)),
    assets: doc.assets.map((a) =>
      a.id === layer.refId
        ? { ...a, p: markUri(a.w, a.h, colour), e: 1 }
        : a,
    ),
  };
}

export default withPixelKritiMark;
