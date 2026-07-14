import { motion, useReducedMotion } from "framer-motion";

/**
 * The argument as a drawing: thirty scattered subscriptions on the left,
 * converging into one owned system on the right.
 *
 * This exists because the alternative is a stock icon or an AI-generated
 * image, and both read as filler. Hairlines in the brand green, drawn on
 * scroll - the strokes trace themselves, the nodes fade in, the block lands
 * last. Decorative: the surrounding copy already carries the point, so the
 * whole thing is hidden from assistive tech.
 *
 * Node positions are hand-placed rather than generated - a random scatter
 * looks random, a composed one looks scattered. Do not "tidy" them.
 */

const NODES = [
  [18, 24], [46, 14], [78, 32], [26, 52], [62, 44], [12, 74], [42, 82],
  [74, 66], [96, 20], [104, 54], [34, 34], [88, 84], [56, 68], [22, 96],
  [68, 100], [98, 96], [14, 44], [50, 26], [82, 50], [30, 66], [90, 38],
  [58, 90], [40, 58], [72, 20], [16, 62], [100, 72], [48, 44], [24, 12],
  [86, 62], [64, 56],
];

const VIEW_W = 340;
const VIEW_H = 120;

/* Where every line lands: the left edge of the block, vertically centred. */
const TARGET = [214, 60];

function ConsolidationDiagram({ className = "" }) {
  const reduceMotion = useReducedMotion();

  /*
   * Only a third of the nodes get a line. Thirty converging strokes is a
   * hairball; ten reads as convergence and lets the empty space do its work.
   */
  const wired = NODES.filter((_, index) => index % 3 === 0);

  const draw = (delay) =>
    reduceMotion
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true, margin: "-60px" },
          transition: {
            pathLength: { duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] },
            opacity: { duration: 0.3, delay },
          },
        };

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      fill="none"
      className={`w-full text-brand ${className}`}
    >
      {/* The lines first, so the nodes and the block paint over their ends. */}
      {wired.map(([x, y], index) => (
        <motion.line
          key={`line-${index}`}
          x1={x}
          y1={y}
          x2={TARGET[0]}
          y2={TARGET[1]}
          stroke="currentColor"
          strokeWidth="0.5"
          strokeOpacity="0.35"
          {...draw(0.25 + index * 0.05)}
        />
      ))}

      {/* The thirty. Small, unequal, deliberately not on a grid. */}
      {NODES.map(([x, y], index) => (
        <motion.circle
          key={`node-${index}`}
          cx={x}
          cy={y}
          r={index % 4 === 0 ? 2.4 : 1.6}
          stroke="currentColor"
          strokeWidth="0.75"
          strokeOpacity="0.5"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.4 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{
            duration: 0.5,
            delay: reduceMotion ? 0 : index * 0.02,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      ))}

      {/* The one. Solid where the others are hollow - that is the whole point. */}
      <motion.rect
        x={TARGET[0]}
        y={32}
        width={112}
        height={56}
        rx="2"
        stroke="currentColor"
        strokeWidth="1.25"
        initial={reduceMotion ? false : { opacity: 0, x: 10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{
          duration: 0.7,
          delay: reduceMotion ? 0 : 0.85,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
      <motion.rect
        x={TARGET[0]}
        y={32}
        width={112}
        height={56}
        rx="2"
        fill="currentColor"
        fillOpacity="0.08"
        initial={reduceMotion ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, delay: reduceMotion ? 0 : 1.1 }}
      />
    </svg>
  );
}

export default ConsolidationDiagram;
