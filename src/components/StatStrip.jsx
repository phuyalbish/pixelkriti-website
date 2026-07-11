import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import SectionHeading from "@/components/SectionHeading.jsx";
import { numbers } from "@/data/content.js";

/**
 * The tangible-numbers strip: industry figures a visitor can check, each with
 * its source printed. The thin green rule is the one accent - the figures
 * stay paper so the section reads as evidence, not decoration.
 */
function StatStrip() {
  return (
    <section className="border-t border-line py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow={numbers.eyebrow}
          title={numbers.title}
          lead={numbers.lead}
        />

        <dl className="mt-16 grid gap-10 sm:grid-cols-3">
          {numbers.stats.map((stat, index) => (
            <Reveal as="div" key={stat.label} delay={index * 0.08}>
              <span aria-hidden="true" className="block h-px w-10 bg-brand" />
              <dd className="mt-6 font-display text-6xl tracking-display md:text-7xl">
                {stat.figure}
              </dd>
              <dt className="mt-3 max-w-[15rem] text-pretty text-sm leading-relaxed text-paper-dim">
                {stat.label}
              </dt>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-paper-faint">
                {stat.source}
              </p>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}

export default StatStrip;
