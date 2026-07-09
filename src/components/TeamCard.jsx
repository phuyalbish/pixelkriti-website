import { FaLinkedinIn } from "react-icons/fa6";
import { initial } from "@/data/team.js";

/**
 * Renders a monogram when `photo` is null, rather than a stock headshot of a
 * stranger. Role, tagline, and LinkedIn are each omitted when absent instead of
 * rendering an empty slot.
 */
function TeamCard({ person, size = "default" }) {
  const isLarge = size === "large";

  return (
    <article
      className={`flex flex-col rounded-2xl border border-line bg-ink-raised transition-colors duration-300 hover:border-line-strong ${
        isLarge ? "p-8 md:p-10" : "p-6"
      }`}
    >
      {person.photo ? (
        <img
          src={person.photo}
          alt={person.name}
          className={`rounded-full object-cover ${
            isLarge ? "h-24 w-24" : "h-16 w-16"
          }`}
        />
      ) : (
        <div
          aria-hidden="true"
          className={`flex items-center justify-center rounded-full border border-line-strong bg-ink font-display text-paper-dim ${
            isLarge ? "h-24 w-24 text-4xl" : "h-16 w-16 text-2xl"
          }`}
        >
          {initial(person.name)}
        </div>
      )}

      <h3
        className={`mt-6 font-display tracking-display ${
          isLarge ? "text-3xl" : "text-2xl"
        }`}
      >
        {person.name}
      </h3>

      {person.role && (
        <p className="mt-2 font-mono text-xs text-paper-faint">{person.role}</p>
      )}

      {person.tagline && (
        <p className="mt-4 text-pretty text-sm leading-relaxed text-paper-dim">
          {person.tagline}
        </p>
      )}

      {person.linkedin && (
        <a
          href={person.linkedin}
          target="_blank"
          rel="noreferrer"
          aria-label={`${person.name} on LinkedIn`}
          className="mt-6 flex h-10 w-10 items-center justify-center rounded-full border border-line text-paper-dim transition-colors hover:border-line-strong hover:text-paper"
        >
          <FaLinkedinIn aria-hidden="true" size={15} />
        </a>
      )}
    </article>
  );
}

export default TeamCard;
