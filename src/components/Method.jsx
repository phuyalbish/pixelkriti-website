import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import SectionHeading from "@/components/SectionHeading.jsx";
import ConsolidationDiagram from "@/components/ConsolidationDiagram.jsx";
import { spine } from "@/data/content.js";

/**
 * The four steps, on a dotted spine.
 *
 * The order is fixed and the same four appear wherever we describe how we
 * work - a method that changes shape between pages is a vibe, not a method.
 * Step titles are the only place besides the primary button where the green
 * runs at full strength, which is what keeps it worth something.
 *
 * The heading column sticks while the steps scroll past it on desktop, so the
 * reader never loses the frame the steps belong to.
 */
function Method() {
  return (
    <section className="relative overflow-hidden border-t border-line py-24 md:py-32">
      <Container className="grid gap-16 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-28">
            <SectionHeading
              eyebrow={spine.eyebrow}
              title={spine.title}
              lead={spine.lead}
              ghost="Method"
            />

            {/* The consolidation case, drawn - thirty rented tools into one owned system. */}
            <Reveal delay={0.2}>
              <ConsolidationDiagram className="mt-12 hidden max-w-sm md:block" />
            </Reveal>
          </div>
        </div>

        {/*
          The spine itself: a dotted rule running the height of the list, with
          each step's marker sitting on it. Drawn with a border rather than an
          SVG so it stretches to whatever the copy needs.
        */}
        <ol className="relative md:col-span-7 md:col-start-6">
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-[7px] top-2 border-l border-dashed border-line-strong"
          />

          {spine.steps.map((step, index) => (
            <Reveal
              as="li"
              key={step.id}
              delay={index * 0.08}
              className="relative pb-14 pl-10 last:pb-0"
            >
              {/* The marker on the spine. Filled green: this is a step, not a bullet. */}
              <span
                aria-hidden="true"
                className="absolute left-0 top-1.5 block h-[15px] w-[15px] rounded-full border-2 border-brand bg-ink"
              />

              <p className="font-mono text-xs text-paper-faint">
                {String(index + 1).padStart(2, "0")}
              </p>

              <h3 className="mt-3 font-display text-title tracking-display text-brand">
                {step.title}
              </h3>

              <p className="mt-4 max-w-prose text-pretty leading-relaxed text-paper-dim">
                {step.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

export default Method;
