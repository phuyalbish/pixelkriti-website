import { useReducedMotion } from "framer-motion";
import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import WordReveal from "@/components/WordReveal.jsx";
import ArrowLink from "@/components/ArrowLink.jsx";
import LottieCard from "@/components/LottieCard.jsx";
import { withPixelKritiMark } from "@/lib/onePlatform.js";
import { promise } from "@/data/content.js";

/**
 * The claim the whole page then spends itself proving, at the largest type on
 * the site. The footer closes on the same sentence - opening and closing on
 * one line is what makes a page read as an argument rather than a list of
 * sections, and it is the single thing the competition does best.
 *
 * Two lines, hard-broken on the newline in `promise.line`: the break IS the
 * argument ("you own" against "you rent"), so it must not be left to reflow.
 *
 * Behind the claim, the thing the claim describes: many dashed paths converging
 * into one platform, with our mark at the centre. It is scenery - it draws the
 * sentence rather than adding to it - so it is hidden from screen readers and
 * skipped entirely under reduced motion.
 */

/* Module scope, NOT inline: LottieCard refetches whenever this identity
   changes, and an arrow written in the body is a new function every render.
   withPixelKritiMark returns null if the artwork's logo layer ever goes
   missing, and LottieCard draws nothing rather than showing a stranger's mark
   on our own biggest claim. */
const loadPlatform = () =>
  import("@/data/lottie/OnePlatform.json").then((m) =>
    withPixelKritiMark(m.default ?? m),
  );

function PromiseSection() {
  const reduce = useReducedMotion();
  const [owned, rented] = promise.line.split("\n");

  return (
    <section
      aria-label="What we do"
      data-tone="paper"
      /*
       * overflow-hidden: the artwork is clipped here rather than widening the
       * document.
       *
       * The bottom padding is the room the artwork stands in, so it is DERIVED
       * from the artwork rather than guessed per breakpoint: the platform sits
       * at the very top of the document, so the whole 900x242 has to clear the
       * link, and its height is whatever 242/900 of its width comes to. Every
       * hard-coded number here would be wrong at the next viewport - and this
       * is a full-bleed section, so there are a lot of next viewports.
       */
      className="relative overflow-hidden bg-paper pt-24 text-ink md:pt-36 pb-[calc(min(100vw,56rem)*242/900+3rem)]"
    >
      {/*
        The convergence, along the foot of the section: the paths fan in from
        both edges and rise into the platform, so the claim sits directly above
        the one thing everything else runs into.

        Anchored to the BOTTOM and left to run past both edges, because the
        lines are meant to arrive from somewhere off the page. Held to a
        whisper: it sits behind the largest type on the site, and the type wins.
      */}
      {
        /*
         * The box carries the artwork's OWN 900:242, because the player fits
         * the document inside whatever box it is given: at any other ratio the
         * lines letterbox into a strip up the middle.
         *
         * Capped at the artwork's native 900px. It is a raster - dashed lines
         * and a soft ellipse baked at 900 wide - and stretching it across a
         * 1440 shell puts a visibly soft picture behind the sharpest type on
         * the site. Our mark is the one vector in it and stays crisp either
         * way, which is exactly what makes the mismatch show.
         */
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-0 mx-auto aspect-[900/242] w-full max-w-4xl opacity-60"
        >
          {/* Always mounted: the bottom padding above is the room this stands
              in, so dropping it under reduced motion would leave a reader who
              asked for less motion staring at the empty space where it was. */}
          <LottieCard load={loadPlatform} still={reduce} />
        </div>
      }

      <Container className="relative z-10 flex flex-col items-center text-center">
        <h2 className="max-w-5xl font-display text-mega tracking-display">
          <WordReveal text={owned} delay={0.04} />
          <span className="block text-ink-faint">
            <WordReveal text={rented} delay={0.16} />
          </span>
        </h2>

        <Reveal
          delay={0.2}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-8 gap-y-4"
        >
          <ArrowLink to="/work" tone="ink">
            See what we have built
          </ArrowLink>
        </Reveal>
      </Container>
    </section>
  );
}

export default PromiseSection;
