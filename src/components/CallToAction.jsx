import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import Button from "@/components/Button.jsx";
import LogoOutline from "@/components/LogoOutline.jsx";

function CallToAction() {
  return (
    <section className="relative overflow-hidden border-t border-line py-24 md:py-32">
      {/* Watermark, centred behind the closing pitch. */}
      <LogoOutline className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2" />

      <Container className="relative text-center">
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
          <div className="mt-10 flex justify-center">
            <Button to="/contact">Book a Free Consultation</Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export default CallToAction;
