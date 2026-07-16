import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Reveal from "@/components/Reveal.jsx";
import SectionHeading from "@/components/SectionHeading.jsx";
import { spine } from "@/data/content.js";

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
 * The walker's path, as fractions of the artwork (x across, y down). Tuned to
 * the fire escape: the flights zig-zag, so x alternates left/right per flight
 * while y falls straight down. One stop per landing, so the descent reads as a
 * continuous walk rather than four jumps. Progress runs 0 (artwork entering
 * from the bottom) to 1 (artwork fully past the top).
 */
const WALK_STOPS = [0, 0.2, 0.4, 0.6, 0.8, 1];
const WALK_X = [0.15, 0.47, 0.11, 0.46, 0.15, 0.4];
const WALK_Y = [0.08, 0.28, 0.45, 0.62, 0.79, 0.93];
// Facing per flight (between consecutive stops): +1 walks right, -1 left.
const WALK_DIR = [1, -1, 1, -1, 1];

/** A little stick figure, mid-stride. Limbs swing via the CSS walk-* classes. */
function Walker() {
  return (
    <svg
      viewBox="0 0 40 64"
      className="walker h-full w-full overflow-visible"
      role="img"
      aria-label="A figure walking down the stairs"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="20" cy="9" r="6" fill="currentColor" stroke="none" />
        <line x1="20" y1="15" x2="20" y2="38" />
        <line
          className="walker-arm-back"
          x1="20"
          y1="20"
          x2="12"
          y2="31"
          style={{ transformOrigin: "20px 20px", transformBox: "fill-box" }}
        />
        <line
          className="walker-arm-front"
          x1="20"
          y1="20"
          x2="28"
          y2="31"
          style={{ transformOrigin: "20px 20px", transformBox: "fill-box" }}
        />
        <line
          className="walker-leg-back"
          x1="20"
          y1="38"
          x2="12"
          y2="58"
          style={{ transformOrigin: "20px 38px", transformBox: "fill-box" }}
        />
        <line
          className="walker-leg-front"
          x1="20"
          y1="38"
          x2="28"
          y2="58"
          style={{ transformOrigin: "20px 38px", transformBox: "fill-box" }}
        />
      </g>
    </svg>
  );
}

function Method() {
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

  return (
    <section className="relative overflow-hidden border-t border-line bg-paper text-ink">
      {/*
        A full-bleed split, not a Container: the artwork IS the right half of
        the screen, flush to the edge - exactly 50% wide with no gutter. The
        copy keeps the site's gutters on its own side, capped at half the
        shell width so it still lines up with every other section's grid.
      */}
      <div className="md:grid md:grid-cols-2">
        {/* The staircase: right half on desktop, banner on mobile. */}
        <div ref={stairsRef} className="relative md:order-2">
          <img
            src={STAIRS_IMG}
            alt="A green fire-escape staircase zig-zagging down a concrete wall"
            className="block w-full select-none"
            draggable="false"
          />

          {!reduce && (
            <motion.div
              className="absolute z-10 aspect-[40/64] w-[7%] min-w-[26px] max-w-[54px] text-ink [filter:drop-shadow(0_2px_3px_rgba(11,11,12,0.35))]"
              style={{ top: walkTop, left: walkLeft, x: "-50%", y: "-50%" }}
            >
              <motion.div
                className="h-full w-full"
                style={{ scaleX: walkFace }}
              >
                <Walker />
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* The four steps, on the left, aligned to the site grid. */}
        <div className="md:order-1">
          <div className="w-full px-6 py-14 sm:px-10 md:ml-auto md:max-w-[42rem] md:px-16 md:py-20 lg:py-28 lg:pl-24 lg:pr-16">
            <SectionHeading
              eyebrow={spine.eyebrow}
              title={spine.title}
            />

            <ol className="mt-12 space-y-12 md:mt-16">
              {spine.steps.map((step, index) => (
                <Reveal as="li" key={step.id} delay={index * 0.05}>
                  <div className="flex items-baseline gap-3">
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-brand bg-paper font-mono text-xs text-brand"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-title tracking-display text-brand">
                      {step.title}
                    </h3>
                  </div>
                  <p className="mt-3 max-w-prose text-pretty leading-relaxed text-ink/80">
                    {step.body}
                  </p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Method;
