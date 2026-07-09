import { motion, useReducedMotion } from "framer-motion";
import { FiArrowDown } from "react-icons/fi";
import Container from "@/components/Container.jsx";
import Button from "@/components/Button.jsx";
import SocialLinks from "@/components/SocialLinks.jsx";
import { site } from "@/data/site.js";

/**
 * The opening screen: the name, the motto, and where to find us. Everything
 * else is below the fold, reached by scrolling.
 *
 * Height uses `svh` (small viewport height) rather than `vh` so mobile browsers
 * do not hide the scroll cue behind a collapsing URL bar.
 */
function Splash() {
  const reduceMotion = useReducedMotion();

  const rise = (delay) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <section
      aria-label={`${site.name} — introduction`}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-28 pt-24"
    >
      <Container>
        <motion.p {...rise(0)} className="eyebrow">
          Est. {site.foundedYear}
        </motion.p>

        {/*
          The wordmark, not a heading of the page's content — but it is the
          page's h1, and the most accurate description of what this site is.
        */}
        <motion.h1
          {...rise(0.1)}
          className="mt-6 font-display leading-[0.9] tracking-display"
          style={{ fontSize: "clamp(3.5rem, 15vw, 13rem)" }}
        >
          {site.name}
        </motion.h1>

        <motion.p
          {...rise(0.24)}
          className="mt-8 max-w-3xl text-balance font-display text-title italic text-paper-dim"
        >
          {site.motto}
        </motion.p>

        <motion.div
          {...rise(0.36)}
          className="mt-12 flex flex-wrap items-center gap-3"
        >
          <Button to="/contact">Book a Free Consultation</Button>
          <Button to="/work" variant="secondary" withArrow={false}>
            See Our Work
          </Button>
        </motion.div>

        <motion.div {...rise(0.48)} className="mt-14">
          <SocialLinks size="large" />
        </motion.div>
      </Container>

      {/* Scroll cue. Decorative: the page scrolls whether or not it is read. */}
      <motion.div
        {...rise(0.6)}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center"
      >
        <motion.span
          animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={
            reduceMotion
              ? undefined
              : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
          }
          className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-paper-faint"
        >
          Scroll
          <FiArrowDown size={14} />
        </motion.span>
      </motion.div>
    </section>
  );
}

export default Splash;
