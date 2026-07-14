import Reveal from "@/components/Reveal.jsx";
import WordReveal from "@/components/WordReveal.jsx";

/**
 * `ghost` prints an oversized, very low-contrast word behind the heading -
 * depth from type alone, with no image to load and nothing to go stale. It is
 * decorative and always `aria-hidden`; it must repeat a word the heading or
 * eyebrow already says, never introduce a new one, or screen-reader users lose
 * something sighted ones get.
 *
 * It is absolutely positioned and bleeds upward, so the section it sits in
 * needs `relative overflow-hidden`. Keep it to one or two words: at this size
 * a third wraps and reads as a mistake.
 *
 * `lead` picks up ink tones inside a `data-tone="paper"` section, the same way
 * `.eyebrow` already does.
 */
function SectionHeading({ eyebrow, title, lead, ghost, className = "" }) {
  return (
    <div className={`${ghost ? "relative" : ""} ${className}`}>
      {/*
        No negative z-index here: a paper-toned section paints its own
        background, and `-z-10` would drop the ghost behind it and out of
        sight. Paint order does the job instead - the ghost is positioned and
        comes first, the content below is positioned and comes second, so the
        content wins without either needing a z-index at all.
      */}
      {ghost && (
        <span
          aria-hidden="true"
          /* Ink at 6% on a paper ground is invisible; paper at 6% on ink is
             just right. The paper-toned sections take the heavier value. */
          className="pointer-events-none absolute -top-8 left-0 select-none whitespace-nowrap font-display text-ghost uppercase leading-none tracking-display opacity-[0.06] [[data-tone='paper']_&]:opacity-[0.09] md:-top-12"
        >
          {ghost}
        </span>
      )}

      <div className="relative">
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
            <p className="mt-6 max-w-prose text-pretty leading-relaxed text-paper-dim [[data-tone='paper']_&]:text-ink-faint">
              {lead}
            </p>
          </Reveal>
        )}
      </div>
    </div>
  );
}

export default SectionHeading;
