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
      className="border-t border-line py-24 md:py-36"
    >
      <Container>
        <h2 className="max-w-5xl font-display text-mega tracking-display">
          <WordReveal text={owned} delay={0.04} />
          {/* The second half carries the site's one saturated colour. Nowhere
              else on this page does a headline take the green. */}
          <span className="block text-paper-faint">
            <WordReveal text={rented} delay={0.16} />
          </span>
        </h2>

        <div className="mt-14 grid gap-10 md:grid-cols-12 md:items-end">
          <Reveal delay={0.1} className="md:col-span-6">
            <p className="max-w-prose text-pretty text-lg leading-relaxed text-paper-dim">
              {promise.lead}
            </p>
          </Reveal>

          <Reveal
            delay={0.2}
            className="flex flex-wrap items-center gap-x-8 gap-y-4 md:col-span-5 md:col-start-8 md:justify-end"
          >
            <Button to="/contact">Book a Free Consultation</Button>
            <ArrowLink to="/work">See what we have built</ArrowLink>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export default PromiseSection;
