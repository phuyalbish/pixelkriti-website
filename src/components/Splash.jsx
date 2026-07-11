import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Container from "@/components/Container.jsx";
import Button from "@/components/Button.jsx";
import SocialLinks from "@/components/SocialLinks.jsx";
import SplashMark from "@/components/SplashMark.jsx";
import Wordmark from "@/components/Wordmark.jsx";
import WordReveal from "@/components/WordReveal.jsx";
import { site } from "@/data/site.js";

/**
 * The opening screen: the name, the motto, and where to find us. Everything
 * else is below the fold, reached by scrolling.
 *
 * Scrolling away pulls the splash content along at a fraction of scroll speed
 * and fades it - the classic hero parallax, kept shallow. The two columns run
 * at slightly different rates, which is what makes it read as depth rather
 * than as the whole block merely lagging.
 *
 * Height uses `svh` (small viewport height) rather than `vh` so mobile browsers
 * do not crop the content behind a collapsing URL bar.
 */
function Splash() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const markY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

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
      ref={sectionRef}
      aria-label={`${site.name} - introduction`}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-24"
    >
      <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
        <motion.div
          className="lg:col-span-7"
          style={reduceMotion ? undefined : { y: textY, opacity: fade }}
        >
          {/*
            The wordmark, not a heading of the page's content - but it is the
            page's h1, and the most accurate description of what this site is.
          */}
          <motion.div {...rise(0)}>
            <Wordmark
              className="font-display leading-[0.9] tracking-display"
              style={{ fontSize: "clamp(3.25rem, 9vw, 8.5rem)" }}
            />
          </motion.div>

          <p className="mt-8 max-w-xl text-balance font-display text-title italic text-paper-dim">
            <WordReveal text={site.motto} delay={0.2} />
          </p>

          <motion.p
            {...rise(0.34)}
            className="mt-6 max-w-md text-pretty text-sm leading-relaxed text-paper-dim"
          >
            {site.subheadline}
          </motion.p>

          <motion.div
            {...rise(0.26)}
            className="mt-12 flex flex-wrap items-center gap-3"
          >
            <Button to="/contact">Book a Free Consultation</Button>
            <Button to="/work" variant="secondary" withArrow={false}>
              See Our Work
            </Button>
          </motion.div>

          <motion.div {...rise(0.38)} className="mt-14">
            <SocialLinks size="large" />
          </motion.div>
        </motion.div>

        {/*
          Decorative. Below lg the columns collapse, so the mark moves above the
          wordmark at a stamp size - small enough that the construction lines
          stay an accent, large enough to carry the assembly animation.
        */}
        <motion.div
          className="order-first lg:order-none lg:col-span-5"
          style={reduceMotion ? undefined : { y: markY, opacity: fade }}
        >
          <SplashMark className="w-40 sm:w-52 lg:mx-auto lg:w-full lg:max-w-[26rem]" />
        </motion.div>
      </Container>
    </section>
  );
}

export default Splash;
