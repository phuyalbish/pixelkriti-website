import { useRef } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import SectionHeading from "@/components/SectionHeading.jsx";
import { testimonials } from "@/data/testimonials.js";

/**
 * A scroll-snap carousel rather than a JS-driven one: the track is a real
 * scrollable list, so it works with touch, trackpad, and keyboard before any
 * script runs. The arrows scroll it by one card.
 */
function Testimonials() {
  const trackRef = useRef(null);

  const scrollByCard = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.firstElementChild;
    // Fall back to a viewport-width nudge if the track is somehow empty.
    const distance = card ? card.offsetWidth + 24 : track.clientWidth;
    track.scrollBy({ left: direction * distance, behavior: "smooth" });
  };

  return (
    <section className="border-t border-line py-24 md:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="In their words"
            title="What it is like to work with us."
          />

          <Reveal delay={0.1}>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => scrollByCard(-1)}
                aria-label="Previous testimonial"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-paper-dim transition-colors hover:border-line-strong hover:text-paper"
              >
                <FiArrowLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollByCard(1)}
                aria-label="Next testimonial"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-paper-dim transition-colors hover:border-line-strong hover:text-paper"
              >
                <FiArrowRight aria-hidden="true" />
              </button>
            </div>
          </Reveal>
        </div>

        <ul
          ref={trackRef}
          className="mt-16 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((item) => (
            <li
              key={item.id}
              className="w-[min(100%,26rem)] shrink-0 snap-start rounded-2xl border border-line bg-ink-raised p-8 md:p-10"
            >
              <blockquote className="flex h-full flex-col">
                <p className="text-pretty font-display text-2xl leading-snug tracking-display">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <footer className="mt-auto pt-8 font-mono text-xs text-paper-faint">
                  {item.name}
                  <span aria-hidden="true"> · </span>
                  {item.company}
                </footer>
              </blockquote>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default Testimonials;
