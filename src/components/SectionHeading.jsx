import Reveal from "@/components/Reveal.jsx";
import WordReveal from "@/components/WordReveal.jsx";

function SectionHeading({ eyebrow, title, lead, className = "" }) {
  return (
    <div className={className}>
      {eyebrow && (
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
        </Reveal>
      )}
      <h2 className="mt-5 max-w-3xl text-balance font-display text-headline tracking-display">
        {/* Titles are strings throughout; anything richer falls back to Reveal. */}
        {typeof title === "string" ? (
          <WordReveal text={title} delay={0.05} />
        ) : (
          <Reveal as="span" delay={0.05} className="block">
            {title}
          </Reveal>
        )}
      </h2>
      {lead && (
        <Reveal delay={0.18}>
          <p className="mt-6 max-w-prose text-pretty leading-relaxed text-paper-dim">
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
}

export default SectionHeading;
