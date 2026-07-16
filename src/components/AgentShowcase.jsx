import { motion, useReducedMotion } from "framer-motion";
import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import SectionHeading from "@/components/SectionHeading.jsx";
import LottiePlayer from "@/components/LottiePlayer.jsx";
import LottieCard from "@/components/LottieCard.jsx";
import plane from "@/data/lottie/Plane.json";

/**
 * The four shapes an AI agent takes here - sub-agent, voice, conversational,
 * chatbot - as cards on the paper ground, visually in step with the services
 * showcase above. Each visual is a decorative animation, so it carries no
 * figures or claims.
 *
 * The artwork is loaded on demand rather than imported: the four documents come
 * to ~410KB of JSON between them (SubAgent alone is 200KB of embedded PNGs),
 * and importing them would put every byte in the bundle that renders the top of
 * the page. They are fetched when the card is about to be seen - see
 * LottieCard.
 */

const AGENTS = [
  {
    name: "Sub-agents",
    body: "Small specialists inside your system - one job each, a human approving anything that matters.",
    /* Vite turns each of these into its own chunk, fetched on demand. */
    load: () => import("@/data/lottie/SubAgent.json"),
  },
  {
    name: "Voice",
    body: "Answers the phone, books the appointment, hands off to your team when it matters.",
    load: () => import("@/data/lottie/VoiceAI.json"),
  },
  {
    name: "Conversational",
    body: "Natural back-and-forth over chat or email, grounded in your real data.",
    load: () => import("@/data/lottie/ConversationAI.json"),
  },
  {
    name: "Chatbot",
    body: "On your website around the clock, answering from your own knowledge base.",
    load: () => import("@/data/lottie/ChatBot.json"),
  },
];

/* One crossing of the screen, edge to edge. Slow: a plane that hurries reads as
   a logo animation rather than as something in the sky behind the page. */
const PLANE_SECONDS = 26;

/* The pinwheels, standing in the corner of the section. Loaded on demand like
   the card artwork - scenery should never be on the critical path. */
const loadWindCatcher = () => import("@/data/lottie/WindCatcher.json");

/*
 * The horizon: where this paper section gives way to the dark one below it.
 *
 * Drawn as the dark section RISING INTO this one rather than as a border on
 * either. That is the whole point - a border is a line between two things, and
 * this has to read as one ground meeting another. It also means no seam: the
 * fill runs past the bottom edge, so the sub-pixel gap that sections land on at
 * fractional heights has ink on both sides of it instead of a paper sliver.
 *
 * The land is low on the left and rises to a plateau across the right third,
 * which is where the pinwheels stand. The curve reaches y=0 - the top of its
 * own box - exactly where that plateau begins, which is what lets the pinwheels
 * be placed at `bottom-<GROUND>`: the plateau's height IS the box's height, so
 * the two cannot drift apart when the box is retuned.
 */
const HORIZON = "M 0 64 C 30 64, 46 0, 70 0 L 100 0 L 100 101 L 0 101 Z";

function AgentShowcase() {
  const reduce = useReducedMotion();

  return (
    <section
      data-tone="paper"
      /*
       * relative + overflow-hidden: the plane crosses beyond both edges, and
       * must be cut off here rather than widening the document.
       *
       * The bottom padding is deeper than the top on purpose - it is the sky
       * between the last line of text and the horizon below it. It has to clear
       * the HORIZON's own height (h-20/24/32), not just the text: the land's
       * plateau rises to exactly that height, so padding equal to it would put
       * the crest against the words. Padding, never margin - a margin here
       * would open a gap that the page's own ink shows through.
       */
      className="relative overflow-hidden bg-paper pb-44 pt-14 text-ink sm:pb-48 md:pb-52 md:pt-32"
    >
      {/*
        Scenery: behind the content, takes no pointer, says nothing a screen
        reader needs - the section reads identically without it.

        The plane flies the seam between this section and the wash above it, so
        the two read as one sky rather than two panels that happen to touch.
      */}
      {!reduce && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-2 h-32 w-32 md:top-4 md:h-44 md:w-44"
          animate={{ x: ["-15vw", "115vw"] }}
          transition={{
            duration: PLANE_SECONDS,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          <LottiePlayer animationData={plane} className="h-full w-full" />
        </motion.div>
      )}

      {/*
        The pinwheels, standing on the section's floor in the bottom right.

        MIRRORED, which is what turns the wind around: the artwork blows
        right-to-left - the streaks trail off the right of the pinwheels and
        travel out the left edge - and a mirror is the only transform that
        reverses a direction without tipping the sticks off vertical, which any
        real rotation would do. It also carries the pinwheels themselves across
        to the right of their own frame, which is where they are wanted.

        The blades are near enough symmetrical that mirroring them costs
        nothing; the sticks stay upright.
      */}
      {/* The horizon itself. preserveAspectRatio="none" so the curve stretches
          to any width - it is a fill, so there is no stroke to distort. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-20 w-full sm:h-24 md:h-32"
      >
        <path d={HORIZON} fill="var(--ink)" />
      </svg>

      {/* Standing ON the plateau, not on the section's floor: `bottom` here is
          the horizon box's own height, which is exactly where the flat of the
          land sits. Kept small enough to stay in the corner - the pinwheels sit
          in the right half of their own frame, and any larger they wander under
          the last card's paragraph. Scenery loses that argument. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-20 right-0 z-0 aspect-[1500/1080] w-52 -scale-x-100 opacity-70 sm:bottom-24 sm:w-72 md:bottom-32 md:w-96"
      >
        <LottieCard load={loadWindCatcher} still={reduce} />
      </div>

      <Container className="relative">
        <SectionHeading title="AI agents" />

        {/* Below md this row is a swipeable slider - snap points and the
            peeking next card say so; the scrollbar stays hidden. */}
        <ul className="no-scrollbar -mx-6 mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 md:mx-0 md:mt-16 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-4">
          {AGENTS.map((agent, index) => (
            <Reveal
              as="li"
              key={agent.name}
              delay={index * 0.08}
              className="w-[75%] shrink-0 snap-start sm:w-[48%] md:w-auto"
            >
              <div className="group h-full">
                {/* The box keeps its square whether or not the artwork ever
                    arrives, so a slow fetch never reflows the row. Reduced
                    motion still gets the picture, held on one frame. */}
                <div className="aspect-square overflow-hidden rounded-2xl bg-ink">
                  <LottieCard load={agent.load} still={reduce} />
                </div>
                <h3 className="mt-6 font-display text-title tracking-display">
                  {agent.name}
                </h3>
                <p className="mt-2 text-pretty text-ink-faint">{agent.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default AgentShowcase;
