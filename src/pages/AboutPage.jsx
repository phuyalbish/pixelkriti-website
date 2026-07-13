import Container from "@/components/Container.jsx";
import LogoOutline from "@/components/LogoOutline.jsx";
import Reveal from "@/components/Reveal.jsx";
import WordReveal from "@/components/WordReveal.jsx";
import SectionHeading from "@/components/SectionHeading.jsx";
import CallToAction from "@/components/CallToAction.jsx";
import TeamCard from "@/components/TeamCard.jsx";
import usePageMeta from "@/hooks/usePageMeta.js";
import { principles } from "@/data/process.js";
import { founders, team } from "@/data/team.js";

function AboutPage() {
  usePageMeta(
    "About",
    "Pixel Kriti is a technology partner that delivers solutions you can trust. Meet the team behind Web Development, AI, and BI.",
    {
      title: "About Pixel Kriti - The Team Behind the Solutions",
      description:
        "Pixel Kriti delivers technology people trust. Meet the team that solves business problems through Web, AI, and BI.",
    },
  );

  return (
    <>
      <section className="relative overflow-hidden pb-16 pt-20 md:pb-24 md:pt-28">
        {/* Watermark, bleeding off the right edge beside the heading. */}
        <LogoOutline className="absolute -right-28 top-1/2 hidden h-[32rem] w-[32rem] -translate-y-1/2 rotate-12 md:block" />

        <Container className="relative">
          <Reveal>
            <p className="eyebrow">About</p>
          </Reveal>
          <h1 className="mt-6 max-w-4xl text-balance font-display text-display tracking-display">
            <WordReveal text="About us" delay={0.06} />
          </h1>
        </Container>
      </section>

      <section className="border-t border-line py-24 md:py-32">
        <Container>
          <SectionHeading
            eyebrow="Founders"
            title="The people you will actually be talking to."
          />
          <ul className="mt-16 grid gap-6 md:grid-cols-3">
            {founders.map((person, index) => (
              <Reveal as="li" key={person.name} delay={index * 0.08}>
                <TeamCard person={person} size="large" />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-line py-24 md:py-32">
        <Container>
          <SectionHeading eyebrow="The team" title="One team, no handoffs." />
          <ul className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((person, index) => (
              <Reveal as="li" key={person.name} delay={index * 0.06}>
                <TeamCard person={person} />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-line py-24 md:py-32">
        <Container className="grid gap-16 md:grid-cols-12">
          <SectionHeading
            className="md:col-span-5"
            eyebrow="What we hold to"
            title="Four things we will not trade away."
          />
          <ul className="md:col-span-6 md:col-start-7">
            {principles.map((principle, index) => (
              <Reveal
                as="li"
                key={principle.title}
                delay={index * 0.06}
                className="border-t border-line py-8 first:border-t-0 first:pt-0"
              >
                <h3 className="text-lg font-medium">{principle.title}</h3>
                <p className="mt-2 max-w-lg text-pretty text-sm leading-relaxed text-paper-dim">
                  {principle.body}
                </p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <CallToAction />
    </>
  );
}

export default AboutPage;
