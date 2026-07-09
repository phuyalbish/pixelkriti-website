import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import Button from "@/components/Button.jsx";
import { site } from "@/data/site.js";

function CallToAction() {
  return (
    <section className="border-t border-line py-24 md:py-32">
      <Container className="text-center">
        <Reveal>
          <p className="eyebrow">Start here</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mx-auto mt-6 max-w-4xl text-balance font-display text-headline tracking-display">
            Let&apos;s build something that grows.
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mx-auto mt-6 max-w-prose text-pretty leading-relaxed text-paper-dim">
            A first conversation costs nothing and ends with a straight answer -
            even when that answer is that you do not need us.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button to="/contact">Book a Free Consultation</Button>
            <Button href={`mailto:${site.email}`} variant="secondary">
              {site.email}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export default CallToAction;
