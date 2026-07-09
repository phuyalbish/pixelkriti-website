import { motion, useReducedMotion } from "framer-motion";
import { solidPetals } from "@/lib/petals.js";

/**
 * The construction-grid rendering of the logo, shown beside the wordmark.
 *
 * The grid is not arbitrary: its eight lines sit exactly on the mark's own
 * construction points. The logo is 263x263 placed at (97, 90) in a 457 box, so
 * the outer lines (x 97/360, y 90/353) trace its bounding box and the inner
 * lines (x 219/239, y 212/230.5) trace the seam between the four petals. Move
 * the logo and the grid stops meaning anything.
 *
 * On load the grid fades in line by line, then the four petals assemble: each
 * slides in from outside its resting place, staggered clockwise. After that,
 * every petal answers the pointer on its own: it lifts outward, turns brand
 * green, and two echoes of itself fan out behind it at falling opacity -
 * stacked layers of the same shape, same green.
 *
 * Purely decorative - it carries no information the wordmark does not.
 */

/**
 * Echo layers behind a hovered petal, furthest (and faintest) first so paint
 * order keeps each one underneath the next. `reach` multiplies the petal's own
 * lift, so echoes always fan along its outward line.
 */
const ECHOES = [
  { reach: 5, fade: 0.05 },
  { reach: 4, fade: 0.1 },
  { reach: 3, fade: 0.18 },
  { reach: 2, fade: 0.3 },
];

const LIFT = 8;

const GRID_LINES = [
  // Vertical: bounding box, then the petal seam.
  { x1: 97, y1: 1, x2: 97, y2: 456 },
  { x1: 360, y1: 1, x2: 360, y2: 456 },
  { x1: 219, y1: 1, x2: 219, y2: 456 },
  { x1: 239, y1: 1, x2: 239, y2: 456 },
  // Horizontal: bounding box, then the petal seam.
  { x1: 1, y1: 90, x2: 456, y2: 90 },
  { x1: 1, y1: 353, x2: 456, y2: 353 },
  { x1: 1, y1: 212, x2: 456, y2: 212 },
  { x1: 1, y1: 230.5, x2: 456, y2: 230.5 },
];

const EASE = [0.22, 1, 0.36, 1];

function SplashMark({ className = "" }) {
  const reduceMotion = useReducedMotion();

  return (
    <svg
      viewBox="0 0 457 457"
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className={`group h-auto w-full ${className}`}
    >
      {/*
        Lines first, so the mark sits on top of them as in the drawing.

        They rest at `--line` and rise to `--line-strong` when the pointer is
        anywhere over the mark. Colour transitions, not opacity - opacity is
        framer's, and animating it here would fight the entrance.
      */}
      <g
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray="4 4"
        className="text-line transition-colors duration-500 ease-out group-hover:text-line-strong"
      >
        {GRID_LINES.map((line, index) => (
          <motion.line
            key={`${line.x1},${line.y1},${line.x2},${line.y2}`}
            {...line}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.15 + index * 0.07, ease: EASE }}
          />
        ))}
      </g>

      <g transform="translate(97 90)">
        {solidPetals.map((petal, index) => {
          // `lean` points inward (the watermarks use it); out is its negation.
          const out = { x: -petal.lean.x, y: -petal.lean.y };

          return (
            <g key={petal.id} transform={petal.transform}>
              {/*
                The parent owns the entrance (arriving from outside, so hover
                pushes along the same line it came in on) and propagates the
                hover variant; each child owns its own hover offset.
              */}
              <motion.g
                className="group/petal"
                initial={reduceMotion ? false : "hidden"}
                animate="visible"
                whileHover="hover"
                variants={{
                  hidden: { opacity: 0, x: out.x * 22, y: out.y * 22 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    transition: {
                      duration: 0.9,
                      delay: 0.55 + index * 0.12,
                      ease: EASE,
                    },
                  },
                  hover: {},
                }}
              >
                {!reduceMotion &&
                  ECHOES.map((echo) => (
                    <motion.path
                      key={echo.reach}
                      d={petal.d}
                      fill="var(--brand)"
                      variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 0, x: 0, y: 0 },
                        hover: {
                          opacity: echo.fade,
                          x: out.x * LIFT * echo.reach,
                          y: out.y * LIFT * echo.reach,
                          transition: {
                            duration: 0.45,
                            // Nearest layer moves first, the fan unfolds outward.
                            delay: (echo.reach - 2) * 0.05,
                            ease: EASE,
                          },
                        },
                      }}
                    />
                  ))}

                <motion.path
                  d={petal.d}
                  fill="currentColor"
                  className="text-paper transition-colors duration-300 ease-out group-hover/petal:text-brand"
                  variants={{
                    hidden: {},
                    visible: { x: 0, y: 0 },
                    hover: reduceMotion
                      ? {}
                      : {
                          x: out.x * LIFT,
                          y: out.y * LIFT,
                          transition: { duration: 0.4, ease: EASE },
                        },
                  }}
                />
              </motion.g>
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export default SplashMark;
