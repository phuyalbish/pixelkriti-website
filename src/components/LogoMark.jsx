import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { LOGO_PATH, LOGO_SIZE } from "@/lib/logoPath.js";
import { solidPetals } from "@/lib/petals.js";

/**
 * The solid mark, drawn in `currentColor` so it can inherit hover states.
 *
 * This replaces the PNG that used to sit in the header: a raster cannot be
 * recoloured on hover without filter hacks that only approximate the target
 * colour. Same geometry as the splash mark and the outline watermark - all
 * three read from one path.
 *
 * `interactive` swaps that single compound path for the four petals it is made
 * of, each its own hover target: hovering one lifts it OUT of the mark, away
 * from the centre, and drops a deeper green beneath it. The petals are drawn on
 * the same 263-unit canvas and assemble back into the identical silhouette, so
 * the two renderings are interchangeable - the plain path stays the default
 * because four hit targets inside a 32px header logo would just be four ways to
 * miss.
 *
 * Because the petals travel outward, the svg is `overflow-visible`: an SVG
 * viewport clips to its viewBox by default, and a petal leaning out of a box
 * sized exactly to the mark would be sliced off at the very edge it is moving
 * toward. Callers must not wrap this in an `overflow-hidden` box.
 *
 * `demoDelay` (seconds) plays that same gesture once per petal, clockwise from
 * the top left, so the mark shows what it does before anyone thinks to point at
 * it. It fires once and never again - a mark that keeps twitching on its own
 * stops reading as a response to you.
 */
const LEAN = 4.5; // units on the 263 canvas the petal travels outward
const EASE = [0.22, 1, 0.36, 1];
const STEP = 0.16; // seconds between petals in the demo ripple

/**
 * The shadow's green: the brand green taken down, not blackened - a mark whose
 * shadow is grey looks like it was printed on top of something rather than made
 * of one material.
 *
 * CAST is where it falls, and it is the SAME for all four petals. Tying it to
 * each petal's own direction of travel would light the mark from four different
 * places at once, which reads as an error even when nobody can say why.
 */
const SHADOW_GREEN = "#1d7a31";
const CAST = { x: 2.6, y: 3.6 };

/** The ripple's order, which is not the order the petals are drawn in. */
const CLOCKWISE = ["top-left", "top-right", "bottom-right", "bottom-left"];

function LogoMark({ className = "", style, interactive = false, demoDelay }) {
  const reduceMotion = useReducedMotion();
  const [demo, setDemo] = useState(false);

  const runsDemo =
    interactive && !reduceMotion && typeof demoDelay === "number";

  useEffect(() => {
    if (!runsDemo) return undefined;
    const id = setTimeout(() => setDemo(true), demoDelay * 1000);
    return () => clearTimeout(id);
  }, [runsDemo, demoDelay]);

  return (
    <svg
      viewBox={`0 0 ${LOGO_SIZE} ${LOGO_SIZE}`}
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className={`overflow-visible ${className}`}
      style={style}
    >
      {interactive ? (
        solidPetals.map((petal) => {
          /* `lean` points at the centre of the mark; the gesture is the
             opposite of it, so the petal opens away from the seam. */
          const out = { x: -petal.lean.x * LEAN, y: -petal.lean.y * LEAN };
          /* The shadow travels with the petal, then falls toward the light's
             one direction. */
          const cast = { x: out.x + CAST.x, y: out.y + CAST.y };
          const order = CLOCKWISE.indexOf(petal.id);
          const pulse = (transition) => ({ ...transition, duration: 0.9, delay: order * STEP, ease: EASE });

          return (
            <motion.g
              key={petal.id}
              transform={petal.transform}
              initial={false}
              animate={demo ? "pulse" : "rest"}
              whileHover={reduceMotion ? undefined : "hover"}
              /* The group carries the state; the two paths under it read it and
                 move by different amounts, which is what separates the petal
                 from its shadow. */
              style={{ pointerEvents: "all" }}
            >
              {/* The cast shadow, under the petal and further out. */}
              <motion.path
                d={petal.d}
                fill={SHADOW_GREEN}
                variants={{
                  rest: { x: 0, y: 0, opacity: 0 },
                  hover: { x: cast.x, y: cast.y, opacity: 0.55 },
                  pulse: {
                    x: [0, cast.x, 0],
                    y: [0, cast.y, 0],
                    opacity: [0, 0.55, 0],
                    transition: pulse({}),
                  },
                }}
                transition={{ duration: 0.45, ease: EASE }}
              />

              {/* The petal itself. The fill is the hit area - the shapes are
                  solid, so the pointer only has to be somewhere inside one. */}
              <motion.path
                d={petal.d}
                fill="currentColor"
                variants={{
                  rest: { x: 0, y: 0, opacity: 1 },
                  hover: { x: out.x, y: out.y, opacity: 1 },
                  /* Out and back in one run: the keyframes ARE the gesture, so
                     the petal cannot be left leaning if the timer and a hover
                     land together. */
                  pulse: {
                    x: [0, out.x, 0],
                    y: [0, out.y, 0],
                    transition: pulse({}),
                  },
                }}
                transition={{ duration: 0.45, ease: EASE }}
              />
            </motion.g>
          );
        })
      ) : (
        <path d={LOGO_PATH} fill="currentColor" />
      )}
    </svg>
  );
}

export default LogoMark;
