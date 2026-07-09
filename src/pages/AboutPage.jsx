import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import SectionHeading from "@/components/SectionHeading.jsx";
import CallToAction from "@/components/CallToAction.jsx";
import TeamCard from "@/components/TeamCard.jsx";
import usePageMeta from "@/hooks/usePageMeta.js";
import { site } from "@/data/site.js";
import { principles } from "@/data/process.js";
import { founders, team } from "@/data/team.js";

const comparisons = [
  {
    them: "AI website builders",
    they: "Fast, cheap, and will build exactly what you ask for.",
    us: "We tell you when what you asked for is the wrong thing, and we are accountable when it breaks.",
  },
  {
    them: "Freelance marketplaces",
    they: "The lowest price you will find anywhere.",
    us: "One team across websites, analytics, and AI - and someone still there in month six.",
  },
  {
    them: "Large agencies",
    they: "Established reputation and a thick portfolio.",
    us: "More agile, more personal, consultancy-first, and priced for businesses your size.",
  },
  {
    them: "Global consultancies",
    they: "Brand recognition and very large teams.",
    us: "Direct founder access, faster turnaround, and a fraction of the engagement cost.",
  },
];

function AboutPage() {
  usePageMeta(
    "About",
    "Pixel Kriti is a small, hands-on team that works inside your business, not just for it.",
  );

  return (
    <>
      <section className="pb-16 pt-20 md:pb-24 md:pt-28">
        <Container>
          <Reveal>
            <p className="eyebrow">About</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-6 max-w-4xl text-balance font-display text-display tracking-display">
              The tools got cheap.
              <br />
              <span className="italic text-paper-dim">Judgement</span> did not.
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="mt-10 grid gap-6 md:grid-cols-12">
              <div className="space-y-6 md:col-span-6">
                <p className="text-pretty text-lg leading-relaxed text-paper-dim">
                  Producing a basic website no longer requires skill or money.
                  That is a genuinely good thing, and it has quietly made most
                  agencies redundant.
                </p>
                <p className="text-pretty leading-relaxed text-paper-dim">
                  What has not been automated is the part that comes before the
                  building: working out what the business actually needs, being
                  answerable for whether it works, and still being there when
                  the company outgrows its first solution. That is the whole of
                  what {site.name} sells.
                </p>
                <p className="text-pretty leading-relaxed text-paper-dim">
                  We are not a faceless outsourcing shop. We embed with the
                  businesses we work with, learn how they actually operate, and
                  treat their growth as the measure of our work. That is what we
                  mean by growing with you rather than delivering to you.
                </p>
              </div>
            </div>
          </Reveal>
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

      <section className="border-t border-line bg-ink-raised py-24 md:py-32">
        <Container>
          <SectionHeading
            eyebrow="The alternatives"
            title="Be honest about who else you could hire."
            lead="Every one of these is a reasonable choice for some businesses. Here is where each of them beats us, and where we think we earn the difference."
          />

          <ul className="mt-16 border-t border-line">
            {comparisons.map((row, index) => (
              <Reveal
                as="li"
                key={row.them}
                delay={index * 0.05}
                className="grid gap-6 border-b border-line py-10 md:grid-cols-12 md:gap-8"
              >
                <h3 className="font-display text-2xl tracking-display md:col-span-3">
                  {row.them}
                </h3>
                <p className="text-pretty text-sm leading-relaxed text-paper-faint md:col-span-4">
                  {row.they}
                </p>
                <p className="text-pretty leading-relaxed md:col-span-5">
                  {row.us}
                </p>
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
                <p className="mt-2 text-pretty leading-relaxed text-paper-dim">
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
