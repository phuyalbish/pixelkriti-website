import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiCode,
  FiCpu,
  FiCreditCard,
  FiDatabase,
  FiFileText,
  FiHeart,
  FiKey,
  FiLayers,
  FiLifeBuoy,
  FiMessageSquare,
  FiPackage,
  FiPhone,
  FiSearch,
  FiTarget,
  FiTool,
  FiUserCheck,
  FiZap,
} from "react-icons/fi";
import Reveal from "@/components/Reveal.jsx";
import SectionHeading from "@/components/SectionHeading.jsx";
import LottiePlayer from "@/components/LottiePlayer.jsx";
import LottieCursor from "@/components/LottieCursor.jsx";
import { spine } from "@/data/content.js";
import stickman from "@/data/lottie/stickman.json";
import pixelStickman from "@/data/lottie/pixelstickman.json";
import { buildDitherMask, CELL } from "@/lib/dither.js";

/* Where the process rail runs: the centre of a 32px badge sitting at the list's
   left edge. One constant, read by both the rail and nothing else - the badges
   are placed by the same left-0/w-8 that defines it, so the two cannot drift. */
const RAIL_X = 16;

/* One icon per STEP, replacing the numerals. Same id-keyed rule as the items
   below, and deliberately none of the same glyphs: a step and one of its own
   items wearing the same icon reads as the item being the step. */
const STEP_ICONS = {
  count: FiSearch,
  build: FiTool,
  agents: FiCpu,
  "stand-behind": FiHeart,
};

/* One icon per step-item, keyed by the item's OWN id rather than its position -
   these lists get reordered, and an index-keyed icon follows the slot instead
   of the meaning, which is the kind of wrong nobody notices for months. */
const ITEM_ICONS = {
  // We study your Business
  spend: FiCreditCard,
  hours: FiClock,
  budget: FiTarget,
  honest: FiAlertCircle,
  // Build the system
  shaped: FiLayers,
  written: FiCode,
  weeks: FiZap,
  source: FiKey,
  // Deliver the best system
  leads: FiMessageSquare,
  invoices: FiFileText,
  records: FiDatabase,
  signoff: FiUserCheck,
  // We stay Partner
  finish: FiCheckCircle,
  yours: FiPackage, // handed over, not FiKey again - that one is the source code
  support: FiLifeBuoy,
  person: FiPhone,
};

/**
 * The four steps, walked down a fire-escape.
 *
 * The staircase sits in the left half of the section; the four steps are
 * listed in the right half, and a stick figure walks the stairs as you scroll
 * past. Its vertical position is tied to how far the artwork has travelled
 * through the viewport and its horizontal position zig-zags to follow the
 * flights, so it steps down the real staircase rather than floating past it.
 *
 * The order is fixed and the same four appear wherever we describe how we
 * work - a method that changes shape between pages is a vibe, not a method.
 * Step titles are the only place besides the primary button where the green
 * runs at full strength, which is what keeps it worth something.
 */

const STAIRS_IMG = "/stairs.jpg";

/*
 * The walker's path, as fractions of the artwork (x across, y down).
 *
 * These are MEASURED, not eyeballed: every stop is a landing on the real fire
 * escape, read off the artwork with a percentage grid. The landings alternate
 * left and right, and a flight is dead straight between two of them, so linear
 * interpolation between consecutive stops tracks the treads on its own. Nudge
 * one of these and the figure walks off into the air - the artwork is fixed, so
 * the numbers are not free.
 *
 * Progress runs 0 (artwork entering from the bottom of the viewport) to 1
 * (artwork fully past the top).
 */
const WALK_STOPS = [0, 0.2, 0.4, 0.6, 0.8, 1];
const WALK_X = [0.13, 0.5, 0.13, 0.5, 0.13, 0.5];
const WALK_Y = [0.161, 0.319, 0.468, 0.635, 0.751, 0.918];
// Facing per flight (between consecutive stops): +1 walks right, -1 left.
const WALK_DIR = [1, -1, 1, -1, 1];

/* Run cycles over the whole descent. The artwork is one cycle of eight poses,
   so this is the stride rate: too few and the figure moonwalks down the
   flights, too many and its legs blur. */
const WALK_CYCLES = 14;

/** The section's tint - the colour the copy sits on, and the pixels are made of. */
const TINT = "#dededc";

/*
 * The bottom edge, into the section below. Both halves - the tint and the
 * photograph - dissolve into the paper the next section is painted on, so the
 * join is a fade rather than a line.
 *
 * Deliberately NOT dithered: the pixel field belongs to the seam ABOVE, where
 * it carries a meaning (the paths section breaking apart). Repeating it here
 * would make it decoration. This one is a plain smooth gradient.
 *
 * It spans the section rather than each column, which is also what makes it
 * right on a phone: there the columns stack, and a per-column fade would put
 * one across the middle of the page.
 */
const NEXT_SECTION = "#f2f2f0"; // ServicesShowcase's paper ground
const FADE_OUT = `linear-gradient(to bottom, transparent, ${NEXT_SECTION})`;
const FADE_HEIGHT = 220;

/*
 * The pixel field from the section above does not stop dead at the artwork's
 * edge - it carries a few rows ON TO the photograph and runs out there, so the
 * two sections meet in a dissolve rather than on a ruled line.
 *
 * It borrows the band's width and the shared CELL pitch, but pins to the
 * artwork's own left edge rather than to the band's - see Spill.
 *
 * The falloff runs the diagonal: densest at the top left, thinning evenly to
 * the bottom right. A single-axis falloff laid a solid row straight across the
 * top of the photograph, which is the one thing the field above does NOT do at
 * that edge.
 */
const SPILL_ROWS = 5;
const SPILL_HEIGHT = SPILL_ROWS * CELL;
const SPILL_BAND = { lg: 704, sm: 288 }; // the paths section's band widths

/* Linear on each axis: the density has to come down evenly across the whole
   field rather than dropping off a cliff near the corner. */
const SPILL_POWER = 1;
const SPILL_SCALE = 0.34; // the pixels taper as they go, as they do above

/* Half density at the strongest end, which the Bayer thresholds resolve to as
   one cell on, one off. The field opens as an alternation rather than as a
   solid bar laid across the top of the photograph. */
const SPILL_DENSITY = 0.5;

const spillMask = (band) =>
  buildDitherMask({
    cols: band / CELL,
    rows: SPILL_ROWS,
    axis: "xy",
    power: SPILL_POWER,
    minScale: SPILL_SCALE,
    maxDensity: SPILL_DENSITY,
    solidFirstColumn: true,
  });

const SPILL_MASK = { lg: spillMask(SPILL_BAND.lg), sm: spillMask(SPILL_BAND.sm) };

/**
 * The spill, anchored to the artwork's LEFT edge.
 *
 * That edge is where the field has to open on a filled column, so it is the
 * edge the mask is pinned to: column 0 is the densest column, and the thinning
 * starts at the second. Anchoring to the right instead left the opening column
 * wherever the tile phase happened to fall - a 16px sliver of an empty cell at
 * 1440 - and needed a second patch strip beside it to cover the artwork at all.
 *
 * It does not need to span the whole artwork: the density reaches zero by the
 * end of the band, so on a screen wider than 2 x BAND the mask simply stops
 * where there was nothing left to draw anyway.
 */
function Spill({ band, mask, className }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute left-0 top-0 z-10 ${className}`}
      style={{
        width: band,
        height: SPILL_HEIGHT,
        backgroundColor: TINT,
        WebkitMaskImage: mask,
        maskImage: mask,
        WebkitMaskSize: `${band}px ${SPILL_HEIGHT}px`,
        maskSize: `${band}px ${SPILL_HEIGHT}px`,
        /* No repeat: the field runs out once and does not start again. */
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
      }}
    />
  );
}

/*
 * The artwork ships with a full-bleed white plate behind the figure (a 512x512
 * rect, the last layer) - fine in a player, fatal over a photograph, where it
 * would punch a white square out of the staircase. Dropped once at module load.
 * The figure itself is already drawn in near-black, which is the ink the rest of
 * the section uses, so it needs no recolouring.
 */
const WALKER_ART = {
  ...stickman,
  layers: stickman.layers.filter((layer) => layer.nm !== "xztc1"),
};

/* The same box as the paths section's cursor: a 16px pixel pitch, so the figure
   that follows you out of that section is the identical size in this one. */
const CURSOR = 202;

function Method() {
  const sectionRef = useRef(null);
  const stairsRef = useRef(null);
  const reduce = useReducedMotion();

  /* Anchored to the artwork over its whole pass through the viewport, so the
     walk has room to breathe even though the half-width image is not tall. */
  const { scrollYProgress } = useScroll({
    target: stairsRef,
    offset: ["start end", "end start"],
  });

  const asPct = (v) => `${v * 100}%`;
  const walkTop = useTransform(scrollYProgress, WALK_STOPS, WALK_Y.map(asPct));
  const walkLeft = useTransform(scrollYProgress, WALK_STOPS, WALK_X.map(asPct));
  /* Facing snaps at each landing - interpolating scaleX would flatten the
     figure to nothing as it crossed zero mid-flight. */
  const walkFace = useTransform(scrollYProgress, (p) => {
    let i = 0;
    while (i < WALK_DIR.length - 1 && p >= WALK_STOPS[i + 1]) i += 1;
    return WALK_DIR[i];
  });

  /*
   * The rail's own scroll, measured against the LIST rather than the artwork
   * beside it: the two are different heights, so sharing the walker's progress
   * would have the line arrive somewhere the reader is not.
   *
   * It finishes early ("end 0.55") on purpose - a line that only completes as
   * the last step leaves the screen is a line nobody sees complete.
   */
  const railRef = useRef(null);
  const { scrollYProgress: railProgress } = useScroll({
    target: railRef,
    offset: ["start 0.85", "end 0.55"],
  });
  const railDraw = useTransform(railProgress, [0, 1], [0, 1]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-paper text-ink">
      {/*
        A full-bleed split, not a Container: the artwork IS the right half of
        the screen, flush to the edge - exactly 50% wide with no gutter. The
        copy keeps the site's gutters on its own side, capped at half the
        shell width so it still lines up with every other section's grid.
      */}
      <div className="md:grid md:grid-cols-2">
        {/* The staircase: right half on desktop, banner on mobile. It keeps the
            real pointer - the artwork already has a figure walking down it, and
            a second one riding the mouse over the top reads as a bug. */}
        <div ref={stairsRef} data-cursor-default="" className="relative md:order-2">
          <img
            src={STAIRS_IMG}
            alt="A green fire-escape staircase zig-zagging down a concrete wall"
            /* Lazy: this sits four sections down, and was costing every visitor
               145KB before they had scrolled past the hero.
               width/height are the file's real pixels - they do not size it
               (w-full does), they give the box an aspect ratio to hold before
               the bytes arrive, so nothing below it jumps when they do. */
            loading="lazy"
            decoding="async"
            width={1400}
            height={2137}
            className="block w-full select-none"
            draggable="false"
          />

          {/* The pixels from the section above, spilling on to the top of the
              photograph and running out within a few rows. */}
          <Spill band={SPILL_BAND.sm} mask={SPILL_MASK.sm} className="md:hidden" />
          <Spill
            band={SPILL_BAND.lg}
            mask={SPILL_MASK.lg}
            className="hidden md:block"
          />

          {!reduce && (
            <motion.div
              /* Square, because the artwork's board is square: an aspect box
                 cropped to the figure would letterbox it and break the
                 fractions the walk path is tuned against. */
              className="absolute z-10 aspect-square w-[13%] min-w-[52px] max-w-[104px] [filter:drop-shadow(0_2px_3px_rgba(11,11,12,0.35))]"
              /* The stops ARE the tread surfaces, so the box is hung by the
                 figure's soles rather than by its centre: the artwork's soles
                 sit at 93.8% of its board, so -94% puts them on the stop
                 exactly. A -50% centre would sink the figure half its own
                 height through the staircase. */
              style={{ top: walkTop, left: walkLeft, x: "-50%", y: "-94%" }}
            >
              <motion.div
                className="h-full w-full"
                style={{ scaleX: walkFace }}
              >
                {/* The stride is driven by the same scroll progress that
                    carries the figure down the stairs, so it never runs on the
                    spot: stop scrolling and it freezes mid-step. */}
                <LottiePlayer
                  animationData={WALKER_ART}
                  progress={scrollYProgress}
                  cycles={WALK_CYCLES}
                  className="h-full w-full"
                />
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* The four steps, on the left, aligned to the site grid. The tint runs
            full-bleed to the screen edge while the copy stays on the grid. */}
        <div className="md:order-1 md:cursor-none" style={{ backgroundColor: TINT }}>
          {/* Above the bottom fade: the GROUND dissolves into the next section,
              the words do not - a fade that eats the last step's copy is just a
              readability bug wearing a gradient. */}
          <div className="relative z-30 w-full px-6 py-14 sm:px-10 md:ml-auto md:max-w-[42rem] md:px-16 md:py-20 lg:py-28 lg:pl-24 lg:pr-16">
            <SectionHeading title={spine.title} />

            {/*
              The rail. Two lines in the same place: a faint one that shows the
              whole run at once, and the brand one drawn over it as you scroll -
              so the method reads as a path with a distance still to go, rather
              than four things that happen to be stacked.

              RAIL_X is shared by the rail and the badges' own centres. The
              badges sit ON the line and are painted after it, so their ground
              punches the line out behind each one - which is what makes the
              rail look like it runs between them rather than through them.
            */}
            <ol ref={railRef} className="relative mt-12 space-y-12 md:mt-16">
              <span
                aria-hidden="true"
                className="absolute bottom-0 top-0 w-px -translate-x-1/2 bg-ink/10"
                style={{ left: RAIL_X }}
              />
              <motion.span
                aria-hidden="true"
                className="absolute bottom-0 top-0 w-px origin-top bg-brand"
                /* x here, not a -translate-x class: scaleY writes `transform`,
                   and a Tailwind translate on the same element would be the
                   thing it overwrites. Reduced motion gets the finished line
                   rather than one that never draws. */
                style={{ left: RAIL_X, x: "-50%", scaleY: reduce ? 1 : railDraw }}
              />

              {spine.steps.map((step, index) => {
                const StepIcon = STEP_ICONS[step.id];

                return (
                <Reveal
                  as="li"
                  key={step.id}
                  delay={index * 0.05}
                  className="relative pl-12"
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-0.5 flex h-8 w-8 items-center justify-center rounded-full border-2 border-brand bg-paper text-brand"
                  >
                    {StepIcon && <StepIcon size={14} />}
                  </span>
                  <div className="flex items-baseline gap-3">
                    <h3 className="font-display text-title tracking-display text-brand">
                      {step.title}
                    </h3>
                  </div>

                  {/* What the step actually consists of, two up. The icons are
                      decorative and the text says the whole thing without them
                      - so they are aria-hidden, and no item depends on one
                      being recognised. */}
                  <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {step.items.map((item) => {
                      const Icon = ITEM_ICONS[item.id];

                      return (
                        <li
                          key={item.id}
                          className="flex items-start gap-3 rounded-lg border border-line-ink/35 px-3.5 py-3"
                        >
                          {Icon && (
                            <Icon
                              aria-hidden="true"
                              size={15}
                              className="mt-0.5 shrink-0 text-ink/45"
                            />
                          )}
                          <span className="text-pretty text-[13px] leading-snug text-ink/80">
                            {item.text}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </Reveal>
                );
              })}
            </ol>
          </div>
        </div>
      </div>

      {/* Both halves fading out into the next section's ground. Above the
          artwork and the walker, so nothing stands proud of the join. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-20"
        style={{ height: FADE_HEIGHT, backgroundImage: FADE_OUT }}
      />

      {/* The pixel figure carries over from the section above, on the tinted
          half only: paper, because #dededc is the ground it has to hold against. */}
      <LottieCursor
        animationData={pixelStickman}
        targetRef={sectionRef}
        size={CURSOR}
        fill="#f2f2f0"
      />
    </section>
  );
}

export default Method;
