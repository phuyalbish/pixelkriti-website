import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import WordReveal from "@/components/WordReveal.jsx";
import Button from "@/components/Button.jsx";
import ArrowLink from "@/components/ArrowLink.jsx";
import { promise } from "@/data/content.js";

/**
 * The claim the whole page then spends itself proving, at the largest type on
 * the site. The footer closes on the same sentence - opening and closing on
 * one line is what makes a page read as an argument rather than a list of
 * sections, and it is the single thing the competition does best.
 *
 * Two lines, hard-broken on the newline in `promise.line`: the break IS the
 * argument ("you own" against "you rent"), so it must not be left to reflow.
 */
function PromiseSection() {
  const [owned, rented] = promise.line.split("\n");

  return (
    <section
      aria-label="What we do"
      data-tone="paper"
      className="bg-paper py-24 text-ink md:py-36"
    >
      <Container className="flex flex-col items-center text-center">
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
          <Button to="/contact" variant="inverse">
            Book a Free Consultation
          </Button>
          <ArrowLink to="/work" tone="ink">
            See what we have built
          </ArrowLink>
        </Reveal>
      </Container>
    </section>
  );
}

export default PromiseSection;
