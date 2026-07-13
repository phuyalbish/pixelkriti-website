import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import SectionHeading from "@/components/SectionHeading.jsx";
import useTicker from "@/hooks/useTicker.js";

/**
 * The four shapes an AI agent takes here - sub-agent, voice, conversational,
 * chatbot - as cards on the paper ground, visually in step with the services
 * showcase above. Each visual is a brand-toned mock-up: decorative, so it
 * carries no figures or claims. Green appears only on hover, per the brand
 * guide.
 */

const SUB_AGENT_FEED = [
  "> tidy the pipeline records",
  "duplicates merged",
  "> file the day's receipts",
  "filed",
  "> draft the follow-ups",
  "queued for approval",
  "> reconcile the invoices",
  "nothing needs you.",
];
const SUB_AGENT_VISIBLE = 4;

function SubAgentVisual() {
  const tick = useTicker(1800);
  const lines = Array.from({ length: SUB_AGENT_VISIBLE }, (_, i) => {
    const index = (tick + i) % SUB_AGENT_FEED.length;
    return SUB_AGENT_FEED[index];
  });

  return (
    <div className="flex h-full flex-col justify-end gap-1.5 p-6 font-mono text-[11px] leading-relaxed text-paper-faint">
      {lines.map((line, i) => (
        <p
          key={`${tick}-${i}`}
          className={line.startsWith(">") ? "text-paper-dim" : ""}
        >
          {line}
          {i === lines.length - 1 && (
            <span className="ml-1 inline-block animate-pulse transition-colors duration-500 group-hover:text-brand">
              ▍
            </span>
          )}
        </p>
      ))}
    </div>
  );
}

const WAVE = [16, 34, 22, 52, 78, 44, 88, 58, 30, 46, 20, 36, 14];

function VoiceVisual() {
  return (
    <div className="flex h-full items-center justify-center gap-1.5 p-6">
      {WAVE.map((height, index) => (
        <span
          key={index}
          style={{ height: `${height}%`, animationDelay: `${index * 110}ms` }}
          className={`animate-wave w-1.5 rounded-full transition-colors duration-500 ${
            height === 88
              ? "bg-paper-dim group-hover:bg-brand"
              : "bg-line-strong"
          }`}
        />
      ))}
    </div>
  );
}

const EXCHANGES = [
  {
    q: "Can you move my booking to Friday?",
    a: "Done - Friday, same time. Anything else?",
  },
  {
    q: "Did my quote go out yet?",
    a: "Sent this morning - I'll nudge them Thursday.",
  },
  {
    q: "What time do you open tomorrow?",
    a: "Nine sharp. Want me to hold you a slot?",
  },
];

function ConversationalVisual() {
  const tick = useTicker(3600);
  const exchange = EXCHANGES[tick % EXCHANGES.length];

  return (
    <div className="flex h-full flex-col justify-end gap-2.5 p-6 text-xs">
      <p
        key={`q-${tick}`}
        className="max-w-[80%] animate-[fade-up_0.5s_ease-out] self-start rounded-2xl rounded-bl-sm bg-ink-overlay px-4 py-2.5 text-paper-dim"
      >
        {exchange.q}
      </p>
      <p
        key={`a-${tick}`}
        className="max-w-[80%] animate-[fade-up_0.5s_ease-out] self-end rounded-2xl rounded-br-sm bg-paper px-4 py-2.5 text-ink"
      >
        {exchange.a}
      </p>
    </div>
  );
}

const CHATBOT_QUESTION = "When are you open?";

function ChatbotVisual() {
  // Retypes the question character by character, pausing when it lands.
  const tick = useTicker(140);
  const cycle = CHATBOT_QUESTION.length + 8;
  const typed = CHATBOT_QUESTION.slice(
    0,
    Math.min(tick % cycle, CHATBOT_QUESTION.length),
  );

  return (
    <div className="flex h-full flex-col justify-end p-6">
      <div className="rounded-xl border border-line bg-ink-raised p-3">
        <p className="text-xs text-paper-dim">
          Hi! Ask me anything about our services.
        </p>
        <div className="mt-3 flex items-center justify-between gap-2 rounded-full border border-line px-3 py-1.5">
          <span className="truncate font-mono text-[11px] text-paper-faint">
            {typed || "Type a message"}
            <span className="ml-0.5 inline-block animate-pulse">▍</span>
          </span>
          <span className="text-paper-faint transition-colors duration-500 group-hover:text-brand">
            ↑
          </span>
        </div>
      </div>
    </div>
  );
}

const AGENTS = [
  {
    name: "Sub-agents",
    body: "Small specialists inside your system - one job each, a human approving anything that matters.",
    Visual: SubAgentVisual,
  },
  {
    name: "Voice",
    body: "Answers the phone, books the appointment, hands off to your team when it matters.",
    Visual: VoiceVisual,
  },
  {
    name: "Conversational",
    body: "Natural back-and-forth over chat or email, grounded in your real data.",
    Visual: ConversationalVisual,
  },
  {
    name: "Chatbot",
    body: "On your website around the clock, answering from your own knowledge base.",
    Visual: ChatbotVisual,
  },
];

function AgentShowcase() {
  return (
    <section
      data-tone="paper"
      className="bg-paper py-14 text-ink md:py-32"
    >
      <Container>
        <SectionHeading title="AI agents" />

        {/* Below md this row is a swipeable slider - snap points and the
            peeking next card say so; the scrollbar stays hidden. */}
        <ul className="no-scrollbar -mx-6 mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 md:mx-0 md:mt-16 md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 lg:grid-cols-4">
          {AGENTS.map((agent, index) => (
            <Reveal
              as="li"
              key={agent.name}
              delay={index * 0.08}
              className="w-[75%] shrink-0 snap-start sm:w-[48%] md:w-auto"
            >
              <div className="group h-full">
                <div className="aspect-square overflow-hidden rounded-2xl bg-ink">
                  <agent.Visual />
                </div>
                <h3 className="mt-6 font-display text-title tracking-display">
                  {agent.name}
                </h3>
                <p className="mt-2 text-pretty text-ink-faint">{agent.body}</p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

export default AgentShowcase;
