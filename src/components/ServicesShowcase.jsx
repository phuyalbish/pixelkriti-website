import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import SectionHeading from "@/components/SectionHeading.jsx";
import useTicker from "@/hooks/useTicker.js";
import { pillars } from "@/data/services.js";

/**
 * The three service pillars in brief, on the paper ground: one card each with
 * a dark visual, the pillar title and tagline from services.js, and the group
 * names as chips. Each card links to its pillar's detail page.
 *
 * Visuals are one per pillar: a real client screenshot for websites, and
 * brand-toned illustrations (a bar chart, a terminal) for the other two -
 * decorative mock-ups, so they carry no figures that could read as claims.
 */

function ChartVisual() {
  const bars = [34, 58, 42, 70, 52, 88, 64];

  return (
    <div
      aria-hidden="true"
      className="flex h-full items-end gap-3 p-8 md:gap-4"
    >
      {bars.map((height, index) => (
        <div
          key={index}
          style={{ height: `${height}%`, animationDelay: `${index * 260}ms` }}
          className={`animate-breathe flex-1 rounded-t-sm transition-colors duration-500 ${
            height === 88
              ? "bg-paper-dim group-hover:bg-brand"
              : "bg-line-strong"
          }`}
        />
      ))}
    </div>
  );
}

const TERMINAL_FEED = [
  "> watch the inbox for new leads",
  "reply drafted - awaiting approval",
  "> chase the unpaid invoices",
  "reminders queued, politely",
  "> refresh the morning dashboard",
  "numbers reconciled",
  "> back up last night's records",
  "done. nothing needs you.",
];
const TERMINAL_VISIBLE = 5;

function TerminalVisual() {
  const tick = useTicker(1700);
  const lines = Array.from({ length: TERMINAL_VISIBLE }, (_, i) => {
    const index = (tick + i) % TERMINAL_FEED.length;
    return TERMINAL_FEED[index];
  });

  return (
    <div
      aria-hidden="true"
      className="flex h-full flex-col justify-end gap-2 p-8 font-mono text-xs leading-relaxed text-paper-faint"
    >
      {lines.map((line, i) => (
        <p
          key={`${tick}-${i}`}
          className={line.startsWith(">") ? "text-paper-dim" : ""}
        >
          {line}
          {i === lines.length - 1 && (
            <span className="ml-1 inline-block animate-pulse transition-colors duration-500 group-hover:text-brand">
              ▍
            </span>
          )}
        </p>
      ))}
    </div>
  );
}

function ShotVisual() {
  return (
    <img
      src="/work/hellotrekkers/site-home-desktop.jpg"
      alt="Hellotrekkers website home page, built by Pixel Kriti"
      loading="lazy"
      className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
    />
  );
}

const VISUALS = {
  websites: ShotVisual,
  analytics: ChartVisual,
  ai: TerminalVisual,
};

function ServicesShowcase() {
  return (
    <section
      data-tone="paper"
      className="bg-paper py-14 text-ink md:py-32"
    >
      <Container>
        <SectionHeading title="What we build" />

        {/* Below md this row is a swipeable slider - snap points and the
            peeking next card say so; the scrollbar stays hidden. */}
        <ul className="no-scrollbar -mx-6 mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 md:mx-0 md:mt-16 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0">
          {pillars.map((pillar, index) => {
            const Visual = VISUALS[pillar.id];

            return (
              <Reveal
                as="li"
                key={pillar.id}
                delay={index * 0.08}
                className="w-[82%] shrink-0 snap-start sm:w-[60%] md:w-auto"
              >
                <Link
                  to={`/services/${pillar.id}`}
                  className="group block h-full"
                >
                  <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-ink">
                    {Visual && <Visual />}
                  </div>

                  <div className="mt-7 flex items-start justify-between gap-4">
                    <h3 className="font-display text-title tracking-display">
                      {pillar.title}
                    </h3>
                    <FiArrowUpRight
                      aria-hidden="true"
                      size={20}
                      className="mt-1 shrink-0 text-ink-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand"
                    />
                  </div>

                  <p className="mt-3 text-ink-faint">{pillar.tagline}</p>

                  <ul className="mt-5 flex flex-wrap gap-2">
                    {pillar.groups.map((group) => (
                      <li
                        key={group.title}
                        className="rounded-full border border-line-ink px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-faint"
                      >
                        {group.title}
                      </li>
                    ))}
                  </ul>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}

export default ServicesShowcase;
