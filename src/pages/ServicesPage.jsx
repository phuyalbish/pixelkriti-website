import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import WordReveal from "@/components/WordReveal.jsx";
import LottieCard from "@/components/LottieCard.jsx";
import CallToAction from "@/components/CallToAction.jsx";
import usePageMeta from "@/hooks/usePageMeta.js";
import {
  SERVICE_ART,
  SERVICE_ART_SHAPE,
  needsWhiteGround,
} from "@/lib/serviceArt.js";
import { pillars } from "@/data/services.js";
import { process } from "@/data/process.js";
import SectionHeading from "@/components/SectionHeading.jsx";

function ServicesPage() {
  const reduce = useReducedMotion();

  usePageMeta(
    "Services",
    "Web & Software Development, Artificial Intelligence, and Business Intelligence - solutions designed to solve your specific business problems. One accountable team.",
    {
      title: "Our Services - Web, AI & BI Solutions",
      description:
        "Web & Software Development, Artificial Intelligence, and Business Intelligence. Solutions designed to solve real business problems.",
    },
  );

  return (
    <>
      {/*
        The page's heading, for readers who cannot see it is a services page.
        The visible hero was removed, and with it the only h1 - which would have
        left the document opening at h2 and no title to jump to. This is the
        standard fix: present to the outline, absent to the eye.
      */}
      <h1 className="sr-only">Services</h1>

      {pillars.map((pillar, pillarIndex) => (
        <section
          key={pillar.id}
          id={pillar.id}
          className={[
            "pb-20 md:pb-28",
            /* The first pillar now opens the page, so it carries the top
               space the hero used to and drops the rule that would otherwise
               be the first thing under the header. */
            pillarIndex === 0
              ? "pt-24 md:pt-32"
              : "border-t border-line pt-20 md:pt-28",
            pillarIndex % 2 === 1 ? "bg-ink-raised" : "",
          ].join(" ")}
        >
          <Container>
            <div className="grid gap-12 md:grid-cols-12">
              <div className="md:col-span-5">
                {/* The artwork leads: it says which pillar this is before the
                    title has to. Transparent unless the document brings its own
                    ground - see needsWhiteGround. */}
                <Reveal>
                  <div
                    className={`${SERVICE_ART_SHAPE} rounded-2xl ${
                      needsWhiteGround(pillar.id) ? "bg-white" : ""
                    }`}
                  >
                    <LottieCard
                      load={SERVICE_ART[pillar.id]}
                      still={reduce}
                    />
                  </div>
                </Reveal>

                <h2 className="mt-8 text-balance font-display text-headline tracking-display">
                  <WordReveal text={pillar.title} delay={0.06} />
                </h2>
                <Reveal delay={0.18}>
                  <Link
                    to={`/services/${pillar.id}`}
                    className="group mt-8 inline-flex items-center gap-2 text-sm transition-colors hover:text-paper-dim"
                  >
                    Explore {pillar.title}
                    <FiArrowUpRight
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </Reveal>
              </div>

              {/*
                The groups, named and counted - no expanding, no item lists.
                They used to open into every sub-service, which put ten near
                identical lines under a heading that had already said the thing.
                The count carries the depth; the pillar's own page is where
                someone who wants the detail is going anyway.
              */}
              <div className="md:col-span-6 md:col-start-7">
                <Reveal>
                  <ul className="border-t border-line">
                    {pillar.groups.map((group) => (
                      <li
                        key={group.title}
                        className="flex items-baseline justify-between gap-6 border-b border-line py-5"
                      >
                        <h3 className="text-balance font-display text-2xl tracking-display">
                          {group.title}
                        </h3>
                        <span
                          aria-hidden="true"
                          className="shrink-0 font-mono text-xs text-paper-faint"
                        >
                          {String(group.items.length).padStart(2, "0")}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
            </div>
          </Container>
        </section>
      ))}

      <section className="border-t border-line py-24 md:py-32">
        <Container>
          <SectionHeading
            eyebrow="The process"
            title="The five step process"
          />

          <ol className="mt-16 border-t border-line">
            {process.map((phase, index) => (
              <Reveal
                as="li"
                key={phase.step}
                delay={index * 0.04}
                className="grid gap-4 border-b border-line py-10 md:grid-cols-12 md:gap-8"
              >
                <p className="font-mono text-xs text-paper-faint md:col-span-1 md:pt-2">
                  {phase.step}
                </p>
                <h3 className="font-display text-2xl tracking-display md:col-span-4">
                  {phase.title}
                </h3>
                <p className="text-pretty leading-relaxed text-paper-dim md:col-span-6">
                  {phase.body}
                </p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <CallToAction />
    </>
  );
}

export default ServicesPage;
