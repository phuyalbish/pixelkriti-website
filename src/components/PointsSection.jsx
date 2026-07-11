import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import SectionHeading from "@/components/SectionHeading.jsx";

/**
 * A heading beside a numbered list of points - the layout the site already
 * uses for principles, applied to the consolidation and sub-agents pitches.
 * `raised` alternates the surface so adjacent sections read as separate
 * thoughts. `children` renders under the heading column (e.g. a CTA link).
 */
function PointsSection({ data, raised = false, children }) {
  return (
    <section
      className={`border-t border-line py-24 md:py-32 ${raised ? "bg-ink-raised" : ""}`}
    >
      <Container className="grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <SectionHeading
            eyebrow={data.eyebrow}
            title={data.title}
            lead={data.lead}
          />
          {children}
        </div>

        <ul className="md:col-span-6 md:col-start-7">
          {data.points.map((point, index) => (
            <Reveal
              as="li"
              key={point.title}
              delay={index * 0.06}
              className="border-t border-line py-8 first:border-t-0 first:pt-0"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-xs text-paper-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-lg font-medium">{point.title}</h3>
                  <p className="mt-2 max-w-lg text-pretty text-sm leading-relaxed text-paper-dim">
                    {point.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default PointsSection;
