import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import SectionHeading from "@/components/SectionHeading.jsx";
import CallToAction from "@/components/CallToAction.jsx";
import Button from "@/components/Button.jsx";
import usePageMeta from "@/hooks/usePageMeta.js";
import { services, tiers } from "@/data/services.js";
import { process } from "@/data/process.js";

function ServicesPage() {
  usePageMeta(
    "Services",
    "Websites, UI/UX and branding, custom software, AI/ML, and analytics — with transparent, scope-based pricing across three engagement tiers.",
  );

  return (
    <>
      <section className="pb-16 pt-20 md:pb-24 md:pt-28">
        <Container>
          <Reveal>
            <p className="eyebrow">Services</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-6 max-w-4xl text-balance font-display text-display tracking-display">
              You don&apos;t need a website. You need customers.
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-8 max-w-prose text-pretty text-lg leading-relaxed text-paper-dim">
              A website is a means. So is a model, a dashboard, or an internal
              tool. We work backwards from the outcome you are actually paying
              for, and recommend the smallest thing that gets you there.
            </p>
          </Reveal>
        </Container>
      </section>

      <section className="pb-24 md:pb-32">
        <Container>
          <ul className="border-t border-line">
            {services.map((service, index) => (
              <Reveal
                as="li"
                key={service.id}
                delay={index * 0.04}
                className="grid gap-6 border-b border-line py-12 md:grid-cols-12 md:gap-8"
              >
                <p className="font-mono text-xs text-paper-faint md:col-span-1 md:pt-3">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <div className="md:col-span-5">
                  <h2 className="font-display text-title tracking-display">
                    {service.title}
                  </h2>
                  <p className="mt-4 max-w-md text-pretty leading-relaxed text-paper-dim">
                    {service.summary}
                  </p>
                </div>

                <ul className="space-y-3 md:col-span-5 md:col-start-8 md:pt-2">
                  {service.deliverables.map((deliverable) => (
                    <li
                      key={deliverable}
                      className="flex gap-4 text-sm text-paper-dim"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-px w-4 shrink-0 bg-line-strong"
                      />
                      {deliverable}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-line bg-ink-raised py-24 md:py-32">
        <Container>
          <SectionHeading
            eyebrow="Engagement tiers"
            title="Priced in the open, scoped before we start."
            lead="Most agencies hide their pricing until you are already on a call. We publish how we charge, because a client who cannot see the road from here to Enterprise will never take it."
          />

          <ul className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line lg:grid-cols-3">
            {tiers.map((tier, index) => (
              <Reveal
                as="li"
                key={tier.id}
                delay={index * 0.08}
                className={`flex flex-col p-10 ${
                  tier.featured ? "bg-ink-overlay" : "bg-ink-raised"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-display text-3xl tracking-display">
                    {tier.name}
                  </h3>
                  {tier.featured && (
                    <span className="rounded-full border border-line-strong px-3 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-paper-dim">
                      Most common
                    </span>
                  )}
                </div>

                <p className="mt-4 text-pretty text-sm leading-relaxed text-paper-dim">
                  {tier.forWhom}
                </p>

                <p className="mt-8 border-t border-line pt-6 font-mono text-xs text-paper-faint">
                  {tier.model}
                </p>

                <ul className="mt-8 flex-1 space-y-4">
                  {tier.points.map((point) => (
                    <li key={point} className="flex gap-4 text-sm">
                      <span
                        aria-hidden="true"
                        className="mt-2.5 h-px w-4 shrink-0 bg-line-strong"
                      />
                      {point}
                    </li>
                  ))}
                </ul>

                <Button
                  to="/contact"
                  variant={tier.featured ? "primary" : "secondary"}
                  className="mt-10 w-full"
                >
                  Discuss {tier.name}
                </Button>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-t border-line py-24 md:py-32">
        <Container>
          <SectionHeading
            eyebrow="The process"
            title="Five steps, and the first one is free."
          />

          <ol className="mt-16 border-t border-line">
            {process.map((phase, index) => (
              <Reveal
                as="li"
                key={phase.step}
                delay={index * 0.04}
                className="grid gap-4 border-b border-line py-10 md:grid-cols-12 md:gap-8"
              >
                <p className="font-mono text-xs text-paper-faint md:col-span-1 md:pt-2">
                  {phase.step}
                </p>
                <h3 className="font-display text-2xl tracking-display md:col-span-4">
                  {phase.title}
                </h3>
                <p className="text-pretty leading-relaxed text-paper-dim md:col-span-6">
                  {phase.body}
                </p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <CallToAction />
    </>
  );
}

export default ServicesPage;
