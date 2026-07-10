import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1];

/**
 * Staggers a string into view word by word: each word rises a fraction of its
 * own height while a blur clears, so headings assemble as you reach them
 * rather than arriving as one block.
 *
 * Renders a span, so it drops inside any heading element - the caller keeps
 * the h1/h2 and its classes, this only animates the text. `aria-label` on the
 * wrapper with the words hidden keeps screen readers reading one string, not
 * a word per pause.
 *
 * Only accepts a plain string. Rich headings (line breaks, italic spans) use
 * several WordReveals with increasing `delay`, one per run of text.
 */
function WordReveal({ text, delay = 0, className = "" }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <span className={className}>{text}</span>;
  }

  const words = text.split(" ");

  return (
    <motion.span
      className={className}
      role="text"
      aria-label={text}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.05, delayChildren: delay },
        },
      }}
    >
      {/*
        Words repeat within a title, so position is the key. The separating
        space lives between the animated spans, not inside them: a trailing
        space inside an inline-block collapses and the words would fuse.
      */}
      {words.map((word, index) => (
        <span key={index} aria-hidden="true">
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { opacity: 0, y: "0.5em", filter: "blur(10px)" },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.65, ease: EASE },
              },
            }}
          >
            {word}
          </motion.span>
          {index < words.length - 1 ? " " : ""}
        </span>
      ))}
    </motion.span>
  );
}

export default WordReveal;
