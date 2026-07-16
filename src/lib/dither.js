/**
 * Ordered (Bayer 4x4) dither masks, as SVG data URIs.
 *
 * White cells show the layer they mask, gaps hide it, and the density falls
 * along one axis on a Bayer threshold - so a solid layer masked with one of
 * these breaks into pixels as it crosses rather than blurring. Shared, because
 * the fade at the edge of the paths section and the one that spills over the
 * staircase have to be the SAME pattern at the SAME pitch, or they read as two
 * unrelated effects that happen to both be square.
 *
 * Two rules the callers depend on:
 *
 * 1. The URI MUST be encodeURIComponent'd. A malformed mask is not an error the
 *    browser reports - it is silently dropped, and a dropped mask renders the
 *    element fully SOLID, which looks like a design decision rather than a bug.
 *
 * 2. Size the mask in whole pixels and repeat it; never stretch it to the
 *    element's box with a percentage. A stretched grid gives a different cell
 *    aspect at every viewport width, which is how the "pixels" turn into tall
 *    stripes on a phone.
 */

/** The size of one pixel, everywhere it appears on the site. */
export const CELL = 32;

/** One period of the threshold matrix. */
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];
export const BAYER_PERIOD = 4;

/**
 * `axis` is the direction density falls: "x" fades left to right, "y" top to
 * bottom, "xy" runs the diagonal - densest at the top-left corner, thinning
 * evenly to the bottom-right. `power` shapes the falloff - above 1 the field
 * starts breaking up early instead of staying solid for the first half and then
 * falling off a cliff. The pattern is deterministic, so the prerender and the
 * browser paint the same field.
 *
 * `maxDensity` caps the field where it is strongest. At 1 the densest end is a
 * solid slab; at 0.5 it starts as an alternation - one cell on, one off - which
 * is what the Bayer row thresholds ([0.03, 0.53, 0.16, 0.66] across the top)
 * resolve to at exactly that density. Use it wherever the field's dense end
 * lands on top of something the reader still needs to see.
 *
 * `minScale` shrinks each surviving pixel as it travels: the cell GRID stays a
 * fixed pitch (that is what keeps the pixels square and aligned), but the
 * square drawn inside each cell tapers toward this fraction of it. So the field
 * thins out two ways at once - fewer pixels, and smaller ones - which is what
 * makes it read as scattering into the distance rather than simply stopping.
 * Set it to 1 for uniform squares.
 */
export function buildDitherMask({
  cols,
  rows,
  axis = "x",
  power = 1.6,
  minScale = 1,
  maxDensity = 1,
  /* Draw the first column at full size on alternating rows (never the last),
     ignoring the falloff, so the field opens on a clean edge instead of a
     half-dissolved one. See the loop below. */
  solidFirstColumn = false,
}) {
  let rects = "";

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      const acrossX = cols > 1 ? x / (cols - 1) : 0;
      const acrossY = rows > 1 ? y / (rows - 1) : 0;

      /*
       * On the diagonal the two falloffs multiply, which is the only form that
       * reaches zero on BOTH far edges - and it has to, or the field is still
       * a third dense where the mask stops and ends on a visible cut. Keep
       * `power` near 1 for "xy": the exponents compound, so 1.6 on each axis is
       * effectively 3.2 and collapses the whole field into one hot corner.
       */
      const along =
        axis === "xy" ? Math.max(acrossX, acrossY) : axis === "x" ? acrossX : acrossY;
      const density =
        maxDensity *
        (axis === "xy"
          ? (1 - acrossX) ** power * (1 - acrossY) ** power
          : (1 - along) ** power);

      /* The opening column is drawn at full size on alternating rows and never
         on the last one, whatever the falloff says - the field's leading edge
         is a clean alternation that has already run out by the bottom, rather
         than something half dissolved, and the falloff takes its first real
         bite out of the second column. */
      const opening = solidFirstColumn && x === 0;
      if (opening && (y % 2 === 1 || y === rows - 1)) continue;

      const threshold = (BAYER[y % 4][x % 4] + 0.5) / 16;
      if (!opening && density <= threshold) continue;

      /* Centred in its cell, so a shrinking pixel stays on the grid instead of
         drifting toward one corner of it. */
      const scale = opening ? 1 : 1 - along * (1 - minScale);
      const inset = (1 - scale) / 2;
      rects +=
        `<rect x="${(x + inset).toFixed(3)}" y="${(y + inset).toFixed(3)}" ` +
        `width="${scale.toFixed(3)}" height="${scale.toFixed(3)}"/>`;
    }
  }

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${cols} ${rows}" ` +
    `fill="#fff">${rects}</svg>`;

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
