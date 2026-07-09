import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import CallToAction from "@/components/CallToAction.jsx";
import usePageMeta from "@/hooks/usePageMeta.js";
import { work, workCategories } from "@/data/work.js";

const filters = ["All", ...workCategories];

function WorkPage() {
  usePageMeta(
    "Work",
    "Case studies from Pixel Kriti, written diagnosis-first: problem, investigation, solution, result.",
  );

  const [category, setCategory] = useState("All");

  const filtered = useMemo(
    () =>
      category === "All"
        ? work
        : work.filter((item) => item.category === category),
    [category],
  );

  return (
    <>
      <section className="pb-16 pt-20 md:pb-24 md:pt-28">
        <Container>
          <Reveal>
            <p className="eyebrow">Work</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-6 max-w-4xl text-balance font-display text-display tracking-display">
              Every project starts with a wrong assumption.
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-8 max-w-prose text-pretty text-lg leading-relaxed text-paper-dim">
              Usually the client&apos;s. Sometimes ours. These are the ones
              worth writing down - what was asked for, what we found, and what
              we built instead.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="pb-24 md:pb-32">
        <Container>
          <div className="flex flex-wrap gap-2 border-b border-line pb-8">
            {filters.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setCategory(option)}
                aria-pressed={category === option}
                className={`rounded-full border px-5 py-2 font-mono text-xs uppercase tracking-[0.12em] transition-colors duration-300 ${
                  category === option
                    ? "border-paper bg-paper text-ink"
                    : "border-line-strong text-paper-dim hover:text-paper"
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="py-24 text-center text-paper-dim">
              No case studies in this category yet.
            </p>
          ) : (
            <ul className="grid gap-px overflow-hidden bg-line md:grid-cols-2">
              {filtered.map((item, index) => (
                <Reveal as="li" key={item.slug} delay={(index % 2) * 0.06}>
                  <Link
                    to={`/work/${item.slug}`}
                    className="group flex h-full flex-col bg-ink p-8 transition-colors duration-300 hover:bg-ink-raised md:p-12"
                  >
                    <p className="font-mono text-xs text-paper-faint">
                      {item.sector} · {item.category} · {item.year}
                    </p>

                    <h2 className="mt-8 font-display text-title tracking-display">
                      {item.client}
                    </h2>

                    <p className="mt-3 max-w-md text-pretty leading-relaxed text-paper-dim">
                      {item.summary}
                    </p>

                    <div className="mt-10 flex flex-1 items-end justify-between gap-6">
                      <ul className="flex flex-wrap gap-2">
                        {item.services.map((service) => (
                          <li
                            key={service}
                            className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-paper-faint"
                          >
                            {service}
                          </li>
                        ))}
                      </ul>
                      <FiArrowUpRight
                        aria-hidden="true"
                        size={22}
                        className="shrink-0 text-paper-faint transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-paper"
                      />
                    </div>
                  </Link>
                </Reveal>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <CallToAction />
    </>
  );
}

export default WorkPage;
