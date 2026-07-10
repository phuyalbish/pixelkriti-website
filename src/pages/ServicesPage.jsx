import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import WordReveal from "@/components/WordReveal.jsx";
import Accordion from "@/components/Accordion.jsx";
import CallToAction from "@/components/CallToAction.jsx";
import usePageMeta from "@/hooks/usePageMeta.js";
import { pillars } from "@/data/services.js";
import { process } from "@/data/process.js";
import SectionHeading from "@/components/SectionHeading.jsx";

function ServicesPage() {
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
      <section className="pb-16 pt-20 md:pb-24 md:pt-28">
        <Container>
          <Reveal>
            <p className="eyebrow">Services</p>
          </Reveal>
          <h1 className="mt-6 max-w-4xl text-balance font-display text-display tracking-display">
            <WordReveal text="You don't need a website. You need customers." delay={0.06} />
          </h1>
          <Reveal delay={0.12}>
            <p className="mt-8 max-w-prose text-pretty text-lg leading-relaxed text-paper-dim">
              A website is a means. So is a dashboard, a model, or an internal
              tool. We work backwards from the outcome you are actually paying
              for, and recommend the smallest thing that gets you there.
            </p>
          </Reveal>
        </Container>
      </section>

      {pillars.map((pillar, pillarIndex) => (
        <section
          key={pillar.id}
          id={pillar.id}
          className={`border-t border-line py-20 md:py-28 ${
            pillarIndex % 2 === 1 ? "bg-ink-raised" : ""
          }`}
        >
          <Container>
            <div className="grid gap-12 md:grid-cols-12">
              <div className="md:col-span-5">
                <Reveal>
                  <p className="eyebrow">
                    Pillar {String(pillarIndex + 1).padStart(2, "0")}
                  </p>
                </Reveal>
                <h2 className="mt-5 text-balance font-display text-headline tracking-display">
                  <WordReveal text={pillar.title} delay={0.06} />
                </h2>
                <Reveal delay={0.12}>
                  <p className="mt-6 max-w-prose text-pretty leading-relaxed text-paper-dim">
                    {pillar.outcome}
                  </p>
                </Reveal>
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

              <div className="md:col-span-6 md:col-start-7">
                <Reveal>
                  <div className="border-t border-line">
                    {pillar.groups.map((group, groupIndex) => (
                      <Accordion
                        key={group.title}
                        title={group.title}
                        count={group.items.length}
                        defaultOpen={groupIndex === 0}
                      >
                        <ul className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
                          {group.items.map((item) => (
                            <li
                              key={item}
                              className="flex gap-3 text-sm text-paper-dim"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-2.5 h-px w-3 shrink-0 bg-line-strong"
                              />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </Accordion>
                    ))}
                  </div>
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
            title="Five steps, and the first one is free."
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
