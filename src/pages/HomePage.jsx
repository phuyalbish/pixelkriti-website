import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import Button from "@/components/Button.jsx";
import Marquee from "@/components/Marquee.jsx";
import SectionHeading from "@/components/SectionHeading.jsx";
import CallToAction from "@/components/CallToAction.jsx";
import usePageMeta from "@/hooks/usePageMeta.js";
import { capabilities, regions, site } from "@/data/site.js";
import { services } from "@/data/services.js";
import { process, principles } from "@/data/process.js";
import { work } from "@/data/work.js";

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Container className="pb-24 pt-20 md:pb-32 md:pt-32">
        <Reveal>
          <p className="eyebrow">
            India · Nepal · Pakistan — est. {site.foundedYear}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mt-8 max-w-5xl text-balance font-display text-display tracking-display">
            Not just a vendor.
            <br />
            <span className="italic text-paper-dim">A trusted</span> business
            partner.
          </h1>
        </Reveal>

        <div className="mt-12 grid gap-10 md:grid-cols-12 md:items-end">
          <Reveal delay={0.16} className="md:col-span-6">
            <p className="max-w-prose text-pretty text-lg leading-relaxed text-paper-dim">
              Anyone can generate a website now. Almost nobody will tell you
              whether it is the right thing to build, or answer the phone when
              it breaks. We diagnose first, build second, and stay as you grow
              into software, AI, and analytics.
            </p>
          </Reveal>

          <Reveal
            delay={0.24}
            className="flex flex-wrap gap-3 md:col-span-5 md:col-start-8 md:justify-end"
          >
            <Button to="/contact">Start a conversation</Button>
            <Button to="/work" variant="secondary" withArrow={false}>
              See our work
            </Button>
          </Reveal>
        </div>
      </Container>

      <Marquee items={capabilities} />
    </section>
  );
}

function SelectedWork() {
  const featured = work.slice(0, 3);

  return (
    <section className="py-24 md:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Selected work"
            title="Problem, investigation, solution, result."
          />
          <Reveal delay={0.1}>
            <Link
              to="/work"
              className="group inline-flex items-center gap-2 text-sm text-paper-dim transition-colors hover:text-paper"
            >
              All case studies
              <FiArrowUpRight
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </Reveal>
        </div>

        <ul className="mt-16 border-t border-line">
          {featured.map((item, index) => (
            <Reveal as="li" key={item.slug} delay={index * 0.06}>
              <Link
                to={`/work/${item.slug}`}
                className="group grid gap-4 border-b border-line py-10 transition-colors duration-300 hover:bg-ink-raised md:grid-cols-12 md:items-baseline md:gap-8 md:px-4"
              >
                <span className="font-mono text-xs text-paper-faint md:col-span-1">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="md:col-span-5">
                  <h3 className="font-display text-title tracking-display">
                    {item.client}
                  </h3>
                  <p className="mt-1 font-mono text-xs text-paper-faint">
                    {item.sector} · {item.tier} · {item.year}
                  </p>
                </div>

                <p className="text-pretty text-paper-dim md:col-span-5">
                  {item.summary}
                </p>

                <FiArrowUpRight
                  aria-hidden="true"
                  className="hidden text-paper-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-paper md:col-span-1 md:ml-auto md:block"
                  size={22}
                />
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function Capabilities() {
  return (
    <section className="border-t border-line bg-ink-raised py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="What we do"
          title="Five capabilities, one accountable team."
          lead="Most agencies hand you off between specialists, or send you elsewhere the moment the work leaves their lane. The team that builds your first website can build the software, the models, and the dashboards that come after it."
        />

        <ul className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal
              as="li"
              key={service.id}
              delay={index * 0.05}
              className="bg-ink-raised p-8 transition-colors duration-300 hover:bg-ink-overlay"
            >
              <p className="font-mono text-xs text-paper-faint">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-6 font-display text-2xl tracking-display">
                {service.title}
              </h3>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-paper-dim">
                {service.summary}
              </p>
            </Reveal>
          ))}

          <Reveal
            as="li"
            delay={services.length * 0.05}
            className="flex items-end bg-ink-raised p-8"
          >
            <Link
              to="/services"
              className="group inline-flex items-center gap-2 text-sm transition-colors hover:text-paper-dim"
            >
              Explore services and pricing
              <FiArrowUpRight
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </Reveal>
        </ul>
      </Container>
    </section>
  );
}

function Process() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="How we work"
          title="We diagnose before we build."
          lead="This is a process, not a slogan. Every engagement runs through the same five steps, and the first one is the one most agencies skip."
        />

        <ol className="mt-16 grid gap-px overflow-hidden border-y border-line bg-line md:grid-cols-5">
          {process.map((phase, index) => (
            <Reveal
              as="li"
              key={phase.step}
              delay={index * 0.06}
              className="bg-ink p-8"
            >
              <p className="font-mono text-xs text-paper-faint">{phase.step}</p>
              <h3 className="mt-6 font-display text-2xl tracking-display">
                {phase.title}
              </h3>
              <p className="mt-3 text-pretty text-sm leading-relaxed text-paper-dim">
                {phase.body}
              </p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

function Principles() {
  return (
    <section className="border-t border-line py-24 md:py-32">
      <Container className="grid gap-16 md:grid-cols-12">
        <SectionHeading
          className="md:col-span-5"
          eyebrow="Why us"
          title="What software alone cannot give you."
        />

        <ul className="space-y-px md:col-span-6 md:col-start-7">
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
  );
}

function Regions() {
  return (
    <section className="border-t border-line py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="Where we are"
          title="Founded across three markets, native to all of them."
          lead="Pixel Kriti was built by a team spanning India, Nepal, and Pakistan. We are not an offshore vendor learning your market from a deck — we already live in it."
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
  );
}

function HomePage() {
  usePageMeta(
    null,
    "Pixel Kriti is a technology and consultancy partner across India, Nepal, and Pakistan. We diagnose before we build.",
  );

  return (
    <>
      <Hero />
      <SelectedWork />
      <Capabilities />
      <Process />
      <Principles />
      <Regions />
      <CallToAction />
    </>
  );
}

export default HomePage;
