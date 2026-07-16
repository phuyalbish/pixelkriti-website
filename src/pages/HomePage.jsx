import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import ArrowLink from "@/components/ArrowLink.jsx";
import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import SectionHeading from "@/components/SectionHeading.jsx";
import CallToAction from "@/components/CallToAction.jsx";
import SplashHero from "@/components/SplashHero.jsx";
import PromiseSection from "@/components/PromiseSection.jsx";
import GrowthPaths from "@/components/GrowthPaths.jsx";
import Method from "@/components/Method.jsx";
import ServicesShowcase from "@/components/ServicesShowcase.jsx";
import AgentShowcase from "@/components/AgentShowcase.jsx";
import Testimonials from "@/components/Testimonials.jsx";
import usePageMeta from "@/hooks/usePageMeta.js";
import { work } from "@/data/work.js";

function FeaturedWork() {
  const featured = work.slice(0, 3);

  return (
    /* No top border: the section above ends in a curved horizon, and a rule
       across it would draw the straight line the curve exists to avoid. */
    <section className="py-24 md:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading title="Selected Work" />
          <Reveal delay={0.1}>
            <ArrowLink to="/work">All case studies</ArrowLink>
          </Reveal>
        </div>

        <ul className="mt-16 border-t border-line">
          {featured.map((item, index) => (
            <Reveal as="li" key={item.slug} delay={index * 0.06}>
              <Link
                to={`/work/${item.slug}`}
                className="group grid gap-4 border-b border-line py-10 transition-colors duration-300 hover:bg-ink-raised md:grid-cols-12 md:items-baseline md:gap-8 md:px-4"
              >
                <span className="font-mono text-xs text-paper-faint transition-colors duration-300 group-hover:text-brand md:col-span-1">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="transition-transform duration-300 ease-out group-hover:translate-x-1 md:col-span-5">
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

function HomePage() {
  usePageMeta(
    null,
    "Pixel Kriti builds custom software for businesses - CRM platforms, business operating systems, dashboards, and AI sub-agents. One system you own that turns leads into customers.",
    {
      title: "Pixel Kriti - Custom Software, CRM & AI Sub-Agents",
      description:
        "One system you own instead of thirty subscriptions you rent. Custom CRM platforms, business operating systems, and AI agents that turn leads into customers.",
    },
  );

  /*
   * The page is an argument, and the order is the argument:
   *
   *   claim -> proof -> self-sort -> method -> what we build -> the dull work
   *   -> results -> voices -> objections -> close (and the footer repeats the
   *   claim, so the page shuts the loop it opened).
   *
   * Showreel is deliberately absent. It currently points at a stock clip
   * standing in for a reel we have not shot, and a stock video on a page whose
   * whole argument is "we do not resell other people's work" is the one thing
   * that would give the game away. It comes back the day there is real footage
   * - the component and its config in data/site.js are untouched.
   */
  return (
    <>
      <SplashHero />

      {/*
        The paper run, on a paper backdrop.

        These four sections are all paper-toned, but the PAGE is ink - so every
        join between them sat over a dark backdrop, and because sections land on
        fractional pixel boundaries (4025.90625, not 4026), each seam leaked a
        sub-pixel sliver of that ink and drew a hairline one shade darker than
        the paper either side of it. No border, no margin and no colour change
        was ever involved - which is exactly why it could not be found by
        looking for one.

        Backing the run in the same paper the sections are painted in means a
        sliver of the backdrop is indistinguishable from the sections. Do not
        replace this with a border, a margin, or a nudge on one of the sections.
      */}
      <div className="bg-paper">
        <PromiseSection />
        <GrowthPaths />
        <Method />
        <ServicesShowcase />
      </div>

      <AgentShowcase />
      <FeaturedWork />
      <Testimonials />
      <CallToAction />
    </>
  );
}

export default HomePage;
