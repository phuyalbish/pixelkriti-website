import { Link, Navigate, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiBarChart2,
  FiCpu,
  FiDatabase,
  FiGlobe,
  FiLayers,
  FiMessageSquare,
  FiRefreshCw,
  FiTool,
} from "react-icons/fi";
import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import CallToAction from "@/components/CallToAction.jsx";
import usePageMeta from "@/hooks/usePageMeta.js";
import { getPillarById, pillars } from "@/data/services.js";
import { work } from "@/data/work.js";

/** Maps a pillar to the case-study category that demonstrates it. */
const categoryForPillar = {
  websites: "Websites",
  analytics: "Analytics",
  ai: "AI & ML",
};

/** One icon per service group - the groups present themselves at a glance
    instead of expanding into their full item lists. */
const groupIcons = {
  "Website Development": FiGlobe,
  "Website Redesign": FiRefreshCw,
  "Website Management": FiTool,
  "Custom Software & CRM": FiDatabase,
  "Dashboards & Reporting": FiBarChart2,
  "Data Foundations": FiLayers,
  "AI Solutions": FiMessageSquare,
  "Machine Learning": FiCpu,
};

function ServiceDetailPage() {
  const { slug } = useParams();
  const pillar = getPillarById(slug);

  usePageMeta(pillar?.title ?? "Services", pillar?.outcome);

  if (!pillar) return <Navigate to="/services" replace />;

  const next = pillars[(pillars.indexOf(pillar) + 1) % pillars.length];
  const related = work.filter(
    (item) => item.category === categoryForPillar[pillar.id],
  );

  return (
    <>
      <article>
        <section className="pb-16 pt-20 md:pb-20 md:pt-28">
          <Container>
            <Reveal>
              <Link
                to="/services"
                className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-paper-faint transition-colors hover:text-paper"
              >
                <FiArrowLeft
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-x-0.5"
                />
                All services
              </Link>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-10 max-w-4xl text-balance font-display text-display tracking-display">
                {pillar.title}
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-8 max-w-prose text-pretty text-lg leading-relaxed text-paper-dim">
                {pillar.outcome}
              </p>
            </Reveal>
          </Container>
        </section>

        <section className="border-t border-line py-16 md:py-24">
          <Container>
            <Reveal>
              <h2 className="eyebrow">What we build</h2>
            </Reveal>

            <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {pillar.groups.map((group, index) => {
                const Icon = groupIcons[group.title];

                return (
                  <Reveal as="li" key={group.title} delay={index * 0.06}>
                    <div className="flex h-full flex-col gap-5 rounded-2xl border border-line p-6 transition-colors duration-300 hover:border-line-strong md:p-7">
                      {Icon && (
                        <Icon
                          aria-hidden="true"
                          size={24}
                          className="text-paper-dim"
                        />
                      )}
                      <h3 className="font-display text-2xl tracking-display">
                        {group.title}
                      </h3>
                    </div>
                  </Reveal>
                );
              })}
            </ul>
          </Container>
        </section>

        <section className="border-t border-line bg-ink-raised py-16 md:py-24">
          <Container>
            <div className="grid gap-8 md:grid-cols-12">
              <h2 className="eyebrow md:col-span-3 md:pt-2">In practice</h2>
              <div className="md:col-span-8">
                <Reveal>
                  <h3 className="text-balance font-display text-headline tracking-display">
                    {pillar.useCase.title}
                  </h3>
                </Reveal>
                <Reveal delay={0.08}>
                  <p className="mt-6 max-w-prose text-pretty text-lg leading-relaxed text-paper-dim">
                    {pillar.useCase.body}
                  </p>
                </Reveal>
              </div>
            </div>
          </Container>
        </section>

        {related.length > 0 && (
          <section className="border-t border-line py-16 md:py-24">
            <Container>
              <Reveal>
                <h2 className="eyebrow">Related work</h2>
              </Reveal>
              <ul className="mt-10 border-t border-line">
                {related.map((item, index) => (
                  <Reveal as="li" key={item.slug} delay={index * 0.05}>
                    <Link
                      to={`/work/${item.slug}`}
                      className="group flex flex-wrap items-baseline justify-between gap-4 border-b border-line py-8 transition-colors hover:bg-ink-raised md:px-4"
                    >
                      <span className="font-display text-2xl tracking-display">
                        {item.client}
                      </span>
                      <span className="text-sm text-paper-dim transition-colors group-hover:text-paper">
                        {item.summary}
                      </span>
                    </Link>
                  </Reveal>
                ))}
              </ul>
            </Container>
          </section>
        )}

        <section className="border-t border-line">
          <Container>
            <Link
              to={`/services/${next.id}`}
              className="group flex flex-col gap-2 py-16 md:py-20"
            >
              <span className="eyebrow">Next service</span>
              <span className="font-display text-headline tracking-display transition-colors duration-300 group-hover:text-paper-dim">
                {next.title}
              </span>
            </Link>
          </Container>
        </section>
      </article>

      <CallToAction />
    </>
  );
}

export default ServiceDetailPage;
