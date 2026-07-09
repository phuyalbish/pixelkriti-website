import Container from "@/components/Container.jsx";
import Button from "@/components/Button.jsx";
import Reveal from "@/components/Reveal.jsx";
import usePageMeta from "@/hooks/usePageMeta.js";

function NotFoundPage() {
  usePageMeta("Page not found");

  return (
    <section className="flex min-h-[70vh] items-center py-24">
      <Container>
        <Reveal>
          <p className="eyebrow">404</p>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="mt-6 max-w-3xl text-balance font-display text-display tracking-display">
            This page was not the right thing to build.
          </h1>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mt-8 max-w-prose text-pretty leading-relaxed text-paper-dim">
            So it no longer exists. Let us point you at something that does.
          </p>
        </Reveal>
        <Reveal delay={0.18}>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button to="/">Back to home</Button>
            <Button to="/work" variant="secondary" withArrow={false}>
              See our work
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export default NotFoundPage;
