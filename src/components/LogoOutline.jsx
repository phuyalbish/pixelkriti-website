import { motion, useReducedMotion } from "framer-motion";
import { petals, PETAL_VIEWBOX } from "@/lib/petals.js";

/**
 * The mark as four open contours, one per petal.
 *
 * Each petal is its own hover target. Hovering it shifts the petal toward the
 * centre, warms its outline to a muted green, and washes its interior with a
 * trace of the same colour. Stroke weight never changes - a watermark that
 * thickens draws attention it has not earned.
 *
 * The hit area is the petal's whole interior plus a band around its outline, so
 * the pointer need only be somewhere inside the shape. Their interiors barely
 * overlap, so a given point resolves to one petal.
 *
 * The petals draw themselves in when scrolled into view, staggered clockwise.
 *
 * A watermark: it carries no information the surrounding copy does not. Callers
 * position it, and the parent needs `relative` and usually `overflow-hidden`
 * since these bleed off an edge.
 *
 * `interactive` is off by default, and turning it on is not enough on its own.
 * These sit behind a positioned content wrapper, which paints later and so
 * swallows the pointer across its whole box. The wrapper above an interactive
 * outline must also be `pointer-events-none`, which is only safe where it holds
 * nothing to click. That is why the footer and the call to action leave this
 * off: their wrappers hold links and buttons.
 */
function LogoOutline({ className = "", strokeWidth = 3, interactive = false }) {
  const reduceMotion = useReducedMotion();
  const lean = 9;

  const ease = [0.22, 1, 0.36, 1];

  return (
    <svg
      viewBox={PETAL_VIEWBOX}
      role="presentation"
      aria-hidden="true"
      focusable="false"
      /*
       * `none` on the root keeps the empty box from swallowing pointer events
       * meant for content beneath. Each petal opts back in with `auto`.
       */
      className={`pointer-events-none select-none ${className}`}
    >
      {petals.map((petal, index) => (
        <g key={petal.id} transform={petal.transform}>
          <motion.g
            className={`group/petal ${interactive ? "pointer-events-auto" : ""}`}
            initial={reduceMotion ? false : "hidden"}
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true, amount: 0.3 }}
            variants={{
              hidden: {},
              visible: {},
              hover: reduceMotion
                ? {}
                : {
                    x: petal.lean.x * lean,
                    y: petal.lean.y * lean,
                    transition: { duration: 0.5, ease },
                  },
            }}
          >
            <motion.path
              d={petal.d}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              fill="currentColor"
              fillOpacity={0}
              className="text-line transition-colors duration-500 ease-out group-hover/petal:text-brand-soft"
              variants={{
                hidden: { pathLength: 0, opacity: 0 },
                visible: {
                  pathLength: 1,
                  opacity: 1,
                  fillOpacity: 0,
                  transition: {
                    duration: 1.4,
                    delay: index * 0.12,
                    ease,
                  },
                },
                // The interior answers the pointer too, at a whisper. The fill
                // is `currentColor`, itself already 45% alpha, so 0.12 lands
                // near 5% effective - a tint, not a shape.
                hover: { fillOpacity: 0.12, transition: { duration: 0.5 } },
              }}
            />

            {/*
              Hit area only, never painted. `pointer-events: all` hit-tests both
              the fill region and the stroke regardless of paint, so the whole
              petal responds - not just its hairline edge. The wide stroke keeps
              the band forgiving right at the boundary.

              Rendered only for interactive outlines: an inline pointer-events
              beats the root's `pointer-events-none`, so on a non-interactive
              watermark this path would quietly re-enable hover.
            */}
            {interactive && (
              <path
                d={petal.d}
                fill="transparent"
                stroke="transparent"
                strokeWidth={28}
                style={{ pointerEvents: "all" }}
              />
            )}
          </motion.g>
        </g>
      ))}
    </svg>
  );
}

export default LogoOutline;
