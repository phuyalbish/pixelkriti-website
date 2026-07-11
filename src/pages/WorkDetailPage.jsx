import { Link, Navigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiDownload } from "react-icons/fi";
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

function CaseImage({ image, className = "" }) {
  return (
    <figure className={className}>
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        className={`w-full rounded-2xl border border-line ${
          // `contain` is for transparent product renders, which crop badly.
          image.contain
            ? "bg-ink-raised object-contain p-6"
            : "object-cover"
        }`}
      />
      {image.caption && (
        <figcaption className="mt-3 font-mono text-xs leading-relaxed text-paper-faint">
          {image.caption}
        </figcaption>
      )}
    </figure>
  );
}

/*
 * The long-form layout for case studies that carry a `story`: numbered
 * chapters with the prose and its image side by side, alternating sides so
 * the page reads as a narrative rather than a spec sheet.
 */
function StoryChapter({ chapter, index }) {
  const imageFirst = index % 2 === 1;

  return (
    <Reveal className="grid gap-8 border-t border-line py-14 md:grid-cols-12 md:gap-12 md:py-20">
      <div
        className={`md:col-span-6 ${imageFirst ? "md:order-2 md:col-start-7" : ""}`}
      >
        <p className="font-mono text-xs text-paper-faint">
          {String(index + 1).padStart(2, "0")}
          <span aria-hidden="true"> · </span>
          <span className="uppercase tracking-[0.12em]">{chapter.label}</span>
        </p>
        <h2 className="mt-4 text-balance font-display text-title tracking-display">
          {chapter.title}
        </h2>
        {chapter.body.map((paragraph) => (
          <p
            key={paragraph.slice(0, 32)}
            className="mt-5 text-pretty leading-relaxed text-paper-dim"
          >
            {paragraph}
          </p>
        ))}
      </div>
      {chapter.image && (
        <CaseImage
          image={chapter.image}
          className={`self-center md:col-span-6 ${imageFirst ? "md:order-1" : ""}`}
        />
      )}
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
                  <dt className="eyebrow">Discipline</dt>
                  <dd className="mt-2">{item.category}</dd>
                </div>
                <div>
                  <dt className="eyebrow">Year</dt>
                  <dd className="mt-2">{item.year}</dd>
                </div>
              </dl>
            </Reveal>
          </Container>
        </section>

        {item.heroImage && (
          <section className="pb-8">
            <Container>
              <Reveal>
                <img
                  src={item.heroImage.src}
                  alt={item.heroImage.alt}
                  className="max-h-[32rem] w-full rounded-2xl border border-line object-cover"
                />
              </Reveal>
            </Container>
          </section>
        )}

        {item.stats && (
          <section className="pb-8 pt-8">
            <Container>
              <Reveal>
                <dl className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
                  {item.stats.map((stat) => (
                    <div key={stat.label} className="bg-ink-raised p-8">
                      <dt className="order-last mt-2 text-pretty text-sm leading-relaxed text-paper-dim">
                        {stat.label}
                      </dt>
                      <dd className="font-display text-headline tracking-display">
                        {stat.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </Container>
          </section>
        )}

        {item.story && (
          <section className="pt-8">
            <Container>
              {item.story.map((chapter, index) => (
                <StoryChapter
                  key={chapter.label}
                  chapter={chapter}
                  index={index}
                />
              ))}
            </Container>
          </section>
        )}

        {item.gallery && (
          <section className="pb-8 pt-4">
            <Container>
              <Reveal>
                <p className="eyebrow border-t border-line pt-10">
                  {item.galleryLabel ?? "Gallery"}
                </p>
              </Reveal>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {item.gallery.map((image, index) => (
                  <Reveal as="li" key={image.src} delay={(index % 3) * 0.06}>
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading="lazy"
                      className={`aspect-[4/3] w-full rounded-2xl border border-line ${
                        image.contain
                          ? "bg-ink-raised object-contain p-6"
                          : "object-cover"
                      }`}
                    />
                  </Reveal>
                ))}
              </ul>
            </Container>
          </section>
        )}

        {item.download && (
          <section className="pb-8 pt-8">
            <Container>
              <Reveal>
                <a
                  href={item.download.href}
                  download
                  className="group flex flex-col gap-6 rounded-2xl border border-line bg-ink-raised p-8 transition-colors duration-300 hover:bg-ink-overlay sm:flex-row sm:items-center sm:justify-between md:p-10"
                >
                  <span>
                    <span className="flex items-center gap-3 text-lg font-medium">
                      <FiDownload
                        aria-hidden="true"
                        className="text-paper-dim transition-colors group-hover:text-brand"
                      />
                      {item.download.label}
                    </span>
                    {item.download.note && (
                      <span className="mt-2 block max-w-xl text-pretty text-sm leading-relaxed text-paper-dim">
                        {item.download.note}
                      </span>
                    )}
                  </span>
                  <span className="shrink-0 rounded-full border border-line-strong px-5 py-2 font-mono text-xs uppercase tracking-[0.12em] text-paper-dim transition-colors group-hover:border-paper group-hover:text-paper">
                    Download
                  </span>
                </a>
              </Reveal>
            </Container>
          </section>
        )}

        <section className="pb-24 md:pb-32">
          <Container>
            {!item.story && (
              <>
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
              </>
            )}

            {item.clientQuote && (
              <Chapter label="Client">
                <blockquote>
                  <p className="text-pretty font-display text-2xl leading-snug tracking-display md:text-3xl">
                    &ldquo;{item.clientQuote.quote}&rdquo;
                  </p>
                  <footer className="mt-4 font-mono text-xs text-paper-faint">
                    {item.clientQuote.attribution}
                    <span aria-hidden="true"> · </span>
                    {item.client}
                  </footer>
                </blockquote>
              </Chapter>
            )}

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
