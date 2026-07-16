import { useRef } from "react";
import { FiCheck } from "react-icons/fi";
import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import ArrowLink from "@/components/ArrowLink.jsx";
import LottieCursor from "@/components/LottieCursor.jsx";
import { paths } from "@/data/content.js";
import pixelStickman from "@/data/lottie/pixelstickman.json";
import { buildDitherMask, BAYER_PERIOD, CELL } from "@/lib/dither.js";

/**
 * The self-sort, at full screen.
 *
 * The visitor decides which of the two they are inside one screen, which is
 * what makes the call that follows a scoping conversation rather than a
 * discovery one. The qualifiers are written as sentences the reader recognises
 * about themselves, not as feature lists. The two options are NOT colour-coded
 * - they sit side by side on one ground, because colouring them would imply a
 * hierarchy the section is explicitly trying not to imply.
 *
 * The ground is solid at the left and breaks into pixels as it travels right,
 * until it is gone. The dither is an ordered (Bayer 4x4) threshold rather than
 * a blur, so the fade reads as pixels; the pattern is generated once at module
 * load, so the prerender and the browser paint the same field.
 *
 * The stickman that replaces the pointer is drawn in the ground's own colour on
 * the ground's own pixel pitch - the artwork is pixel art on a 19.8-unit grid
 * at 200% scale, so one of its blocks is 39.6/500 of the cursor box, and
 * CURSOR sizes that box to land a block on exactly CELL. Same colour, same
 * pitch: the figure reads as the background assembling itself under the
 * pointer, which only works if the two numbers stay locked together.
 *
 * The `meta` line (weeks / months) is the only commitment on the tile. There is
 * deliberately no price: the path qualifies, the conversation prices.
 */

/**
 * The ground is a vertical fade: paper at the top, where the section has to
 * arrive out of the page without a seam, deepening to #dddddb at the floor.
 *
 * The SAME gradient paints the solid and the dissolving band. That is the whole
 * trick on the right-hand side: masking a gradient rather than a flat fill
 * leaves every surviving pixel holding the shade the gradient had at that
 * height, so the grid boxes carry the fade themselves and no container needs a
 * background of its own.
 *
 * The cursor is drawn in whichever end of the fade it is furthest from, so it
 * never disappears into the ground it is standing on.
 */
const PAPER = "#f2f2f0";
const GROUND = "#dddddb";
const FADE = `linear-gradient(to bottom, ${PAPER}, ${GROUND})`;

/*
 * The fade is measured in whole pixels, never in percentages - see dither.js
 * for why. The band is a whole number of cells so the field ends on a cell
 * boundary rather than mid-pixel.
 */
const BAND = { lg: 704, sm: 288 }; // px of dissolve before the colour is gone

/* Pixels taper to a third of a cell as they travel, so the field scatters into
   the distance instead of just thinning out at a constant size. */
const MIN_SCALE = 0.34;

/* The artwork's pixel pitch is 19.8 units at 200% scale on a 500-unit board, so
   a block is 39.6/500 of the box: this box lands a block on half of CELL. */
const CURSOR = Math.round((CELL * 500) / 39.6 / 2);

const maskFor = (band) =>
  buildDitherMask({
    cols: band / CELL,
    rows: BAYER_PERIOD, // one period; it repeats down y
    axis: "x",
    minScale: MIN_SCALE,
  });

const MASK = { lg: maskFor(BAND.lg), sm: maskFor(BAND.sm) };

/** The dissolving right edge of the ground, at one band width. */
function FadeEdge({ band, mask, className }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-y-0 right-0 ${className}`}
      style={{
        width: band,
        /* The gradient, not a flat fill: each pixel the mask keeps holds the
           shade the fade had at its own height. */
        backgroundImage: FADE,
        WebkitMaskImage: mask,
        maskImage: mask,
        WebkitMaskSize: `${band}px ${CELL * BAYER_PERIOD}px`,
        maskSize: `${band}px ${CELL * BAYER_PERIOD}px`,
        WebkitMaskRepeat: "repeat-y",
        maskRepeat: "repeat-y",
      }}
    />
  );
}

function GrowthPaths() {
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      data-tone="paper"
      id="paths"
      /*
       * The breathing room above is PADDING, not margin. A margin would let the
       * page's own background through as a band across the gap; padding keeps
       * the gap inside the section, where the ground paints it - and the ground
       * starts at paper, so the join with the section above stays seamless.
       */
      className="relative flex min-h-screen w-full flex-col justify-center overflow-hidden bg-paper pb-16 pt-36 text-ink md:cursor-none md:pb-20 md:pt-52"
    >
      {/* The ground: solid to the left of the band, pixels across it, gone at
          the right edge. Two spans rather than one gradient - a percentage
          mask would distort the cells per viewport. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 right-[288px] md:right-[704px]"
        style={{ backgroundImage: FADE }}
      />
      <FadeEdge band={BAND.sm} mask={MASK.sm} className="md:hidden" />
      <FadeEdge band={BAND.lg} mask={MASK.lg} className="hidden md:block" />

      {/* The ghost, full-bleed: sized in viewport units so "TWO WAYS" spans the
          section, bleeding off both edges. Decorative and aria-hidden - it only
          repeats the heading's own theme. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-6 select-none whitespace-nowrap text-center font-display text-[24vw] uppercase leading-none tracking-display text-ink opacity-[0.09] md:top-4"
      >
        Two ways
      </span>

      {/* The ground is full-bleed, but the content is not: it sits on the same
          shell grid as the header, so a column's first word lines up with the
          logo and its last with the nav. Only the colour runs edge to edge. */}
      <Container className="relative mt-12 grid md:mt-16 md:grid-cols-2 md:gap-16 lg:gap-24">
        {paths.options.map((option, index) => (
          <div key={option.id} className="group relative flex flex-col py-10 md:py-12">
            <Reveal delay={index * 0.1} className="relative">
              <h3 className="font-display text-headline tracking-display">
                {option.title}
              </h3>

              <ul className="mt-8 space-y-4 border-t border-ink/10 pt-8">
                {option.qualifiers.map((qualifier) => (
                  <li
                    key={qualifier}
                    className="flex gap-3 leading-relaxed md:text-lg"
                  >
                    <FiCheck
                      aria-hidden="true"
                      className="mt-1.5 shrink-0 text-brand"
                      size={18}
                    />
                    <span className="text-pretty text-ink/70">{qualifier}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex items-baseline justify-between gap-6 pt-2">
                <span className="font-mono text-sm uppercase tracking-[0.14em] text-ink/55">
                  {option.meta}
                </span>
                {/* Keeps the real pointer: you cannot aim a cursor you cannot see. */}
                <ArrowLink
                  to="/contact"
                  tone="ink"
                  className="text-base md:cursor-pointer"
                  data-cursor-default=""
                >
                  Talk it through
                </ArrowLink>
              </div>
            </Reveal>
          </div>
        ))}
      </Container>

      <LottieCursor
        animationData={pixelStickman}
        targetRef={sectionRef}
        size={CURSOR}
        /* Over the band the page's own paper shows through, so the figure takes
           the ground's colour. Over the solid it takes whichever end of the
           fade is furthest from the shade underneath it - a single paper figure
           would be invisible at the top of the section, where the ground has
           faded to paper itself. */
        fill={(x, y, rect) =>
          x < rect.width - (rect.width < 768 ? BAND.sm : BAND.lg)
            ? (y < rect.height / 2 ? GROUND : PAPER)
            : GROUND
        }
      />
    </section>
  );
}

export default GrowthPaths;
