import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import SectionHeading from "@/components/SectionHeading.jsx";
import CallToAction from "@/components/CallToAction.jsx";
import Splash from "@/components/Splash.jsx";
import Showreel from "@/components/Showreel.jsx";
import Testimonials from "@/components/Testimonials.jsx";
import TeamCard from "@/components/TeamCard.jsx";
import usePageMeta from "@/hooks/usePageMeta.js";
import { site } from "@/data/site.js";
import { pillars } from "@/data/services.js";
import { principles } from "@/data/process.js";
import { work } from "@/data/work.js";
import { founders } from "@/data/team.js";

function ServicesOverview() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <SectionHeading
          eyebrow="What we do"
          title="Three pillars, one accountable team."
          lead="Most agencies hand you off between specialists, or send you elsewhere the moment the work leaves their lane. The team that builds your website can build the dashboards and the models that come after it."
        />

        <ul className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {pillars.map((pillar, index) => (
            <Reveal
              as="li"
              key={pillar.id}
              delay={index * 0.06}
              className="bg-ink-raised"
            >
              <Link
                to={`/services/${pillar.id}`}
                className="group flex h-full flex-col p-8 transition-colors duration-300 hover:bg-ink-overlay md:p-10"
              >
                <p className="font-mono text-xs text-paper-faint">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <h3 className="mt-6 font-display text-title tracking-display">
                  {pillar.title}
                </h3>

                <p className="mt-3 text-pretty leading-relaxed text-paper-dim">
                  {pillar.tagline}
                </p>

                <span className="mt-10 inline-flex items-center gap-2 text-sm text-paper-dim transition-colors group-hover:text-paper">
                  Learn more
                  <FiArrowUpRight
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function WhyUs() {
  return (
    <section className="border-t border-line py-24 md:py-32">
      <Container className="grid gap-16 md:grid-cols-12">
        <SectionHeading
          className="md:col-span-5"
          eyebrow="Why us"
          title="What software alone cannot give you."
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
  );
}

function FeaturedWork() {
  const featured = work.slice(0, 3);

  return (
    <section className="border-t border-line py-24 md:py-32">
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
                    {item.sector} · {item.category} · {item.year}
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

function TeamTeaser() {
  return (
    <section className="border-t border-line py-24 md:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            eyebrow="Who you work with"
            title="A small team you can actually talk to."
            lead="No account managers relaying messages. You work directly with the people building the thing."
          />
          <Reveal delay={0.1}>
            <Link
              to="/about"
              className="group inline-flex items-center gap-2 text-sm text-paper-dim transition-colors hover:text-paper"
            >
              Meet the team
              <FiArrowUpRight
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </Reveal>
        </div>

        <ul className="mt-16 grid gap-6 sm:grid-cols-3">
          {founders.map((person, index) => (
            <Reveal as="li" key={person.name} delay={index * 0.06}>
              <TeamCard person={person} />
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function HomePage() {
  usePageMeta(null, site.subheadline);

  return (
    <>
      <Splash />
      <Showreel />
      <ServicesOverview />
      <WhyUs />
      <FeaturedWork />
      <Testimonials />
      <TeamTeaser />
      <CallToAction />
    </>
  );
}

export default HomePage;
