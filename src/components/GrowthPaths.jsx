import { FiCheck } from "react-icons/fi";
import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import SectionHeading from "@/components/SectionHeading.jsx";
import ArrowLink from "@/components/ArrowLink.jsx";
import { paths } from "@/data/content.js";

/**
 * The self-sort, on the paper ground.
 *
 * Two columns, never three: the visitor decides which one is theirs inside a
 * screen, which is what makes the call that follows a scoping conversation
 * rather than a discovery one. The qualifiers are written as sentences the
 * reader recognises about themselves, not as feature lists.
 *
 * The `meta` line (weeks / months) is the only commitment on the card. There
 * is deliberately no price: the path qualifies, the conversation prices.
 */
function GrowthPaths() {
  return (
    <section
      data-tone="paper"
      id="paths"
      className="relative overflow-hidden bg-paper py-24 text-ink md:py-32"
    >
      <Container>
        <SectionHeading
          className="max-w-3xl"
          eyebrow={paths.eyebrow}
          title={paths.title}
          lead={paths.lead}
          ghost="Two ways"
        />

        <div className="mt-16 grid gap-px overflow-hidden rounded-sm bg-line-ink md:mt-24 md:grid-cols-2">
          {paths.options.map((option, index) => (
            <Reveal
              key={option.id}
              delay={index * 0.1}
              className="group flex flex-col bg-paper p-8 transition-colors duration-500 hover:bg-paper-faint/10 md:p-12"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/55">
                {option.kicker}
              </p>

              <h3 className="mt-6 font-display text-title tracking-display">
                {option.title}
              </h3>

              <p className="mt-5 max-w-prose text-pretty leading-relaxed text-ink/70">
                {option.body}
              </p>

              <ul className="mt-8 space-y-3 border-t border-line-ink pt-8">
                {option.qualifiers.map((qualifier) => (
                  <li key={qualifier} className="flex gap-3 text-sm leading-relaxed">
                    <FiCheck
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-brand"
                      size={15}
                    />
                    <span className="text-pretty text-ink/70">{qualifier}</span>
                  </li>
                ))}
              </ul>

              {/* Pushed to the bottom so both cards align regardless of copy length. */}
              <div className="mt-10 flex items-baseline justify-between gap-6 pt-2">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink/55">
                  {option.meta}
                </span>
                <ArrowLink to="/contact" tone="ink">
                  Talk it through
                </ArrowLink>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default GrowthPaths;
