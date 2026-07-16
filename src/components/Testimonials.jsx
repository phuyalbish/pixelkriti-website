import { useReducedMotion } from "framer-motion";
import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import SectionHeading from "@/components/SectionHeading.jsx";
import LottieCard from "@/components/LottieCard.jsx";
import VoiceNote from "@/components/VoiceNote.jsx";
import { testimonials } from "@/data/testimonials.js";

/**
 * The quotes as a list, and a globe turning beside them.
 *
 * A list rather than the carousel this used to be: there are three of these and
 * a carousel hid two of them behind an arrow nobody presses. Read down the
 * page, they read as a body of evidence - which is the only job this section
 * has. It also matches the Selected Work list above it, so the page has one way
 * of showing a set of things rather than two.
 *
 * The rows are ruled, not boxed. A bordered card on a dark ground draws a box
 * around every quote and makes three of them look like three ads; a hairline
 * between them is enough to say where one ends.
 */

/* Module scope, NOT inline: LottieCard refetches whenever this identity
   changes, and an arrow written in the body is a new function every render. */
const loadGlobe = () => import("@/data/lottie/Globe.json");

function Testimonials() {
  const reduce = useReducedMotion();

  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading title="Testimonials" />

        <div className="mt-12 grid gap-12 md:mt-16 md:grid-cols-12 md:gap-10">
          <ul className="border-t border-line md:col-span-7">
            {testimonials.map((item, index) => (
              <Reveal as="li" key={item.id} delay={index * 0.06}>
                <blockquote className="border-b border-line py-8 md:py-10">
                  <p className="text-pretty font-display text-xl leading-snug tracking-display md:text-2xl">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <footer className="mt-4 font-mono text-xs text-paper-faint">
                    {item.role ? (
                      <>
                        {item.role}
                        <span aria-hidden="true"> · </span>
                      </>
                    ) : null}
                    {item.name}
                    <span aria-hidden="true"> · </span>
                    {/* Linked only when there is a real company to link to.
                        A placeholder sector is not a website. */}
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-line-strong underline-offset-4 transition-colors hover:text-paper"
                      >
                        {item.company}
                      </a>
                    ) : (
                      item.company
                    )}
                  </footer>

                  {/* Renders only where a real recording exists. */}
                  <VoiceNote
                    src={item.audio}
                    label={`${item.name}, ${item.company}`}
                  />
                </blockquote>
              </Reveal>
            ))}
          </ul>

          {/*
            The globe, beside the quotes. Decorative - it says "these came from
            somewhere", nothing a screen reader needs read to it.

            Cropped to its middle: the artwork is a 16:9 frame with the globe
            small in the centre and a lot of empty either side, so a plain 16:9
            box in this column would draw a postage stamp with margins. The
            inner box is 1920/1080 = 178% of the square's width, which puts the
            document's full HEIGHT across the square and trims only the empty
            sides. The orbit rings are the widest thing in it and still clear.
          */}
          <div className="md:col-span-5 md:self-center">
            <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden md:max-w-none">
              <div className="absolute left-1/2 top-1/2 aspect-[1920/1080] w-[178%] -translate-x-1/2 -translate-y-1/2">
                <LottieCard load={loadGlobe} still={reduce} />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default Testimonials;
