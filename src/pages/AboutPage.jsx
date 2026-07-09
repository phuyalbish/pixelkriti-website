import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import SectionHeading from "@/components/SectionHeading.jsx";
import CallToAction from "@/components/CallToAction.jsx";
import usePageMeta from "@/hooks/usePageMeta.js";
import { regions, site } from "@/data/site.js";
import { principles } from "@/data/process.js";

const comparisons = [
  {
    them: "AI website builders",
    they: "Fast, cheap, and will build exactly what you ask for.",
    us: "We tell you when what you asked for is the wrong thing, and we are accountable when it breaks.",
  },
  {
    them: "Freelance marketplaces",
    they: "The lowest price you will find anywhere.",
    us: "One team across design, software, and data — and someone still there in month six.",
  },
  {
    them: "Large regional agencies",
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
    "Pixel Kriti is a consultancy-first technology partner founded across India, Nepal, and Pakistan.",
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
                  We were founded by a team spanning three South Asian markets,
                  which means we serve clients across them without being foreign
                  to any. We are not learning your market from a research deck.
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-line py-24 md:py-32">
        <Container>
          <SectionHeading
            eyebrow="Where we are"
            title="Three countries. One team."
          />
          <ul className="mt-16 grid gap-px overflow-hidden border-y border-line bg-line sm:grid-cols-3">
            {regions.map((region, index) => (
              <Reveal
                as="li"
                key={region.country}
                delay={index * 0.08}
                className="bg-ink p-10"
              >
                <h3 className="font-display text-4xl tracking-display">
                  {region.country}
                </h3>
                <p className="mt-2 font-mono text-xs text-paper-faint">
                  {region.note}
                </p>
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
