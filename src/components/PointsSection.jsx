import Container from "@/components/Container.jsx";
import LogoOutline from "@/components/LogoOutline.jsx";
import Reveal from "@/components/Reveal.jsx";
import SectionHeading from "@/components/SectionHeading.jsx";

/**
 * A heading beside a numbered list of points - the layout the site already
 * uses for principles, applied to the consolidation and sub-agents pitches.
 * `raised` alternates the ink surface so adjacent sections read as separate
 * thoughts; `paper` flips the section to a light ground with ink type.
 * `children` renders under the heading column (e.g. a CTA link).
 */
function PointsSection({
  data,
  raised = false,
  paper = false,
  watermark = false,
  children,
}) {
  const surface = paper ? "bg-paper text-ink" : raised ? "bg-ink-raised" : "";
  const line = paper ? "border-line-ink" : "border-line";
  // Paper sections run together seamlessly; only ink sections keep the
  // hairline separator between them.
  const sectionBorder = paper ? "" : "border-t border-line";

  return (
    <section
      data-tone={paper ? "paper" : undefined}
      className={`relative overflow-hidden ${sectionBorder} py-24 md:py-32 ${surface}`}
    >
      {/* Watermark, bleeding off the left edge behind the heading. */}
      {watermark && (
        <LogoOutline
          interactive
          lineClass={paper ? "text-line-ink" : "text-line"}
          className="absolute -left-24 top-[57%] hidden h-[30rem] w-[30rem] -translate-y-1/2 -rotate-12 md:block"
        />
      )}

      {/*
        With a watermark behind it, the content wrapper must be
        `pointer-events-none` so hovers reach the petals underneath - safe only
        because these sections hold nothing to click.
      */}
      <Container
        className={`grid gap-16 md:grid-cols-12 ${watermark ? "pointer-events-none relative" : ""}`}
      >
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
              className={`border-t ${line} py-8 first:border-t-0 first:pt-0`}
            >
              <div className="flex items-baseline gap-4">
                <span
                  className={`font-mono text-xs ${paper ? "text-ink-faint" : "text-paper-faint"}`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg font-medium">{point.title}</h3>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default PointsSection;
