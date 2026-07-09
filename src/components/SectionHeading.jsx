import Reveal from "@/components/Reveal.jsx";

function SectionHeading({ eyebrow, title, lead, className = "" }) {
  return (
    <div className={className}>
      {eyebrow && (
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <h2 className="mt-5 max-w-3xl text-balance font-display text-headline tracking-display">
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-prose text-pretty leading-relaxed text-paper-dim">
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
}

export default SectionHeading;
