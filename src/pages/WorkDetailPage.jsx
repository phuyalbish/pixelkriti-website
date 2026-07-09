import { Link, Navigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import CallToAction from "@/components/CallToAction.jsx";
import usePageMeta from "@/hooks/usePageMeta.js";
import { getWorkBySlug, work } from "@/data/work.js";

function Chapter({ label, children }) {
  return (
    <Reveal className="grid gap-4 border-t border-line py-10 md:grid-cols-12 md:gap-8">
      <h2 className="eyebrow md:col-span-3 md:pt-2">{label}</h2>
      <div className="md:col-span-8">{children}</div>
    </Reveal>
  );
}

function WorkDetailPage() {
  const { slug } = useParams();
  const item = getWorkBySlug(slug);

  usePageMeta(item?.client ?? "Work", item?.summary);

  if (!item) return <Navigate to="/work" replace />;

  const next = work[(work.indexOf(item) + 1) % work.length];

  return (
    <>
      <article>
        <section className="pb-16 pt-20 md:pb-20 md:pt-28">
          <Container>
            <Reveal>
              <Link
                to="/work"
                className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-paper-faint transition-colors hover:text-paper"
              >
                <FiArrowLeft
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-x-0.5"
                />
                All work
              </Link>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-10 max-w-4xl text-balance font-display text-display tracking-display">
                {item.client}
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-8 max-w-prose text-pretty text-lg leading-relaxed text-paper-dim">
                {item.summary}
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <dl className="mt-16 grid gap-8 border-t border-line pt-8 sm:grid-cols-3">
                <div>
                  <dt className="eyebrow">Sector</dt>
                  <dd className="mt-2">{item.sector}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Engagement</dt>
                  <dd className="mt-2">{item.tier}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Year</dt>
                  <dd className="mt-2">{item.year}</dd>
                </div>
              </dl>
            </Reveal>
          </Container>
        </section>

        <section className="pb-24 md:pb-32">
          <Container>
            <Chapter label="The problem">
              <p className="text-pretty text-xl leading-relaxed">
                {item.problem}
              </p>
            </Chapter>

            <Chapter label="The investigation">
              <p className="text-pretty leading-relaxed text-paper-dim">
                {item.investigation}
              </p>
            </Chapter>

            <Chapter label="The solution">
              <p className="text-pretty leading-relaxed text-paper-dim">
                {item.solution}
              </p>
            </Chapter>

            <Chapter label="The result">
              <ul className="space-y-4">
                {item.result.map((point) => (
                  <li
                    key={point}
                    className="flex gap-4 text-pretty leading-relaxed"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-3 h-px w-6 shrink-0 bg-line-strong"
                    />
                    {point}
                  </li>
                ))}
              </ul>
            </Chapter>

            <Chapter label="Services">
              <ul className="flex flex-wrap gap-2">
                {item.services.map((service) => (
                  <li
                    key={service}
                    className="rounded-full border border-line px-4 py-1.5 font-mono text-xs text-paper-dim"
                  >
                    {service}
                  </li>
                ))}
              </ul>
            </Chapter>
          </Container>
        </section>

        <section className="border-t border-line">
          <Container>
            <Link
              to={`/work/${next.slug}`}
              className="group flex flex-col gap-2 py-16 transition-colors md:py-20"
            >
              <span className="eyebrow">Next case study</span>
              <span className="font-display text-headline tracking-display transition-colors duration-300 group-hover:text-paper-dim">
                {next.client}
              </span>
            </Link>
          </Container>
        </section>
      </article>

      <CallToAction />
    </>
  );
}

export default WorkDetailPage;
