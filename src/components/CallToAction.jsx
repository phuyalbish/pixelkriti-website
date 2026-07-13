import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import Button from "@/components/Button.jsx";
import LogoOutline from "@/components/LogoOutline.jsx";
import WordReveal from "@/components/WordReveal.jsx";
import { cta } from "@/data/content.js";

function CallToAction() {
  return (
    <section className="relative overflow-hidden border-t border-line py-24 md:py-32">
      {/* Watermark, centred behind the closing pitch. */}
      <LogoOutline className="absolute left-1/2 top-1/2 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2" />

      <Container className="relative text-center">
        <Reveal>
          <p className="eyebrow">{cta.eyebrow}</p>
        </Reveal>
        <h2 className="mx-auto mt-6 max-w-4xl text-balance font-display text-headline tracking-display">
          <WordReveal text={cta.title} delay={0.06} />
        </h2>
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
