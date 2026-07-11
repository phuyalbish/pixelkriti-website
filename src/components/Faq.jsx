import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import Accordion from "@/components/Accordion.jsx";
import SectionHeading from "@/components/SectionHeading.jsx";
import { faq } from "@/data/content.js";

/**
 * The questions a first-time visitor actually arrives with, answered in the
 * order they ask them. Ships FAQPage structured data so the answers are
 * eligible to appear directly in search results.
 */
function Faq() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section className="border-t border-line py-24 md:py-32">
      <script type="application/ld+json">{JSON.stringify(schema)}</script>

      <Container className="grid gap-16 md:grid-cols-12">
        <SectionHeading
          className="md:col-span-4"
          eyebrow="Straight answers"
          title="What you are probably wondering."
        />

        <Reveal className="md:col-span-7 md:col-start-6">
          <div className="border-t border-line">
            {faq.map((item, index) => (
              <Accordion key={item.q} title={item.q} defaultOpen={index === 0}>
                <p className="max-w-prose text-pretty text-sm leading-relaxed text-paper-dim">
                  {item.a}
                </p>
              </Accordion>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export default Faq;
