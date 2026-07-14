import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import { commitments, sourcedFigures } from "@/data/proof.js";

/**
 * Proof, immediately after the promise and before any explanation - the one
 * structural trick worth taking wholesale from the competition.
 *
 * What sits here is commitments, not statistics: things that are true because
 * of how we are paid, and that a client could hold us to. Real figures render
 * alongside them the moment `proof.js` has any that carry a source, and never
 * before.
 */
function ProofBar() {
  const items = [
    ...sourcedFigures.map((figure) => ({
      label: figure.label,
      value: figure.value,
      note: figure.note,
      source: figure.source,
    })),
    ...commitments,
  ];

  return (
    <section
      aria-label="What we commit to"
      className="border-t border-line bg-ink-raised py-16 md:py-20"
    >
      <Container>
        <ul className="grid gap-y-12 sm:grid-cols-2 md:grid-cols-4 md:gap-x-8">
          {items.map((item, index) => (
            <Reveal
              as="li"
              key={item.label}
              delay={index * 0.07}
              className="md:border-l md:border-line md:pl-6 md:first:border-l-0 md:first:pl-0"
            >
              <p className="eyebrow">{item.label}</p>
              {/*
                Display scale, not body scale. The competitor's numbers work
                because they are enormous; ours have to earn the same weight
                without a digit to lean on.
              */}
              <p className="mt-3 font-display text-5xl tracking-display md:text-6xl">
                {item.value}
              </p>
              <p className="mt-3 max-w-[20rem] text-pretty text-sm leading-relaxed text-paper-dim">
                {item.note}
              </p>
              {/* Only ever present on a real figure - see proof.js. */}
              {item.source && (
                <p className="mt-2 font-mono text-[11px] text-paper-faint">
                  {item.source}
                </p>
              )}
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default ProofBar;
