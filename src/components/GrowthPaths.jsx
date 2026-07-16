import { FiCheck } from "react-icons/fi";
import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import SectionHeading from "@/components/SectionHeading.jsx";
import ArrowLink from "@/components/ArrowLink.jsx";
import { paths } from "@/data/content.js";

/**
 * The self-sort.
 *
 * Two full-bleed tiles, each its own subtle colour. The visitor decides which
 * one is theirs inside a screen, which is what makes the call that follows a
 * scoping conversation rather than a discovery one. The qualifiers are written
 * as sentences the reader recognises about themselves, not as feature lists.
 *
 * The seam between the tiles is not a rule but a dissolve: the first tile's
 * colour breaks into pixels and scatters into the second, drawn with an
 * ordered (Bayer) dither so it reads as a deliberate pixel fade rather than a
 * blur. The pattern is generated once at module load - deterministic, so the
 * prerender and the browser paint the same seam.
 *
 * The `meta` line (weeks / months) is the only commitment on the tile. There
 * is deliberately no price: the path qualifies, the conversation prices.
 */

const TILE_A = "#d3e6c7"; // soft green wash - the first tile
const TILE_B = "#f0e6d1"; // warm sand - the second

/*
 * An ordered-dither mask, as an SVG data URI. White cells show, gaps hide;
 * cell density falls left -> right on a Bayer 4x4 threshold, so a solid layer
 * masked with it pixel-dissolves across the width. preserveAspectRatio=none
 * lets the same pattern stretch to any tile height.
 */
const buildDitherMask = () => {
  const BAYER = [
    [0, 8, 2, 10],
    [12, 4, 14, 6],
    [3, 11, 1, 9],
    [15, 7, 13, 5],
  ];
  const COLS = 30; // chunkier cells read more clearly as pixels
  const ROWS = 40;
  let rects = "";
  for (let y = 0; y < ROWS; y += 1) {
    for (let x = 0; x < COLS; x += 1) {
      /* Density falls seam -> edge. Squared so the field starts breaking into
         pixels early instead of staying solid for the first half. */
      const density = (1 - x / (COLS - 1)) ** 1.6;
      const threshold = (BAYER[y % 4][x % 4] + 0.5) / 16;
      if (density > threshold) rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
    }
  }
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${COLS} ${ROWS}" preserveAspectRatio="none" fill="#fff">${rects}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
};

const DITHER_MASK = buildDitherMask();

function GrowthPaths() {
  return (
    <section
      data-tone="paper"
      id="paths"
      className="relative overflow-hidden bg-paper py-24 text-ink md:py-32"
    >
      {/* The ghost, full-bleed: sized in viewport units so "TWO WAYS" spans
          the whole width of the section, bleeding off both edges. Decorative
          and aria-hidden - it only repeats the heading's own theme. Section is
          relative overflow-hidden, so it clips clean. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-6 select-none whitespace-nowrap text-center font-display text-[24vw] uppercase leading-none tracking-display text-ink opacity-[0.09] md:top-4"
      >
        Two ways
      </span>

      <Container>
        <SectionHeading className="relative max-w-3xl" title={paths.title} />
      </Container>

      {/* Full-bleed tiles: out of the Container so they run edge to edge. */}
      <div className="relative mt-16 grid md:mt-24 md:grid-cols-2">
        {paths.options.map((option, index) => {
          const first = index === 0;

          return (
            <div
              key={option.id}
              className="group relative flex flex-col px-6 py-12 sm:px-10 md:px-14 md:py-16 lg:px-20 lg:py-20"
              style={{ backgroundColor: first ? TILE_A : TILE_B }}
            >
              {/* The pixel dissolve: a slab of the FIRST tile's colour laid
                  over the SECOND tile's left edge, masked so it scatters into
                  pixels as it crosses. Only the second tile carries it, and
                  only where the two meet side by side (md+). */}
              {!first && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 hidden w-[60%] md:block"
                  style={{
                    backgroundColor: TILE_A,
                    WebkitMaskImage: DITHER_MASK,
                    maskImage: DITHER_MASK,
                    WebkitMaskSize: "100% 100%",
                    maskSize: "100% 100%",
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                  }}
                />
              )}

              <Reveal delay={index * 0.1} className="relative">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">
                  {option.kicker}
                </p>

                <h3 className="mt-6 font-display text-title tracking-display">
                  {option.title}
                </h3>

                <ul className="mt-8 space-y-3 border-t border-ink/10 pt-8">
                  {option.qualifiers.map((qualifier) => (
                    <li
                      key={qualifier}
                      className="flex gap-3 text-sm leading-relaxed"
                    >
                      <FiCheck
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-brand"
                        size={15}
                      />
                      <span className="text-pretty text-ink/70">
                        {qualifier}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Pushed to the bottom so both tiles align regardless of copy. */}
                <div className="mt-10 flex items-baseline justify-between gap-6 pt-2">
                  <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink/55">
                    {option.meta}
                  </span>
                  <ArrowLink to="/contact" tone="ink">
                    Talk it through
                  </ArrowLink>
                </div>
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default GrowthPaths;
