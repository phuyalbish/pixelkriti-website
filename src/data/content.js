/**
 * Copy for the client-outcome sections of the homepage: consolidation,
 * sub-agents, the numbers strip, and the FAQ.
 *
 * Grill-tested (research -> drafts -> 9-critic grill -> 96/96/96), then cut
 * hard for brevity: headlines carry the argument, body text stays under a
 * few lines. HARD RULE: statistics carry a real, named source - never
 * publish a bare or unverifiable figure.
 */

export const consolidation = {
  eyebrow: "The consolidation case",
  title: "One system instead of thirty",
  lead: "One tool for invoicing, another for scheduling, a third for follow-up - ten, twenty, sometimes thirty in all. Each one is another login, another fee, another place a customer falls through. Often it is cheaper to build one system that fits.",
  points: [
    {
      title: "Count your subscriptions",
      body: "Two tools doing the same job, seats nobody uses, workflows that exist only because tool A cannot talk to tool B.",
    },
    {
      title: "Glue tools patch, they do not fix",
      body: "n8n and Zapier connect what you have - often that is enough, and we will say so. But when your logic gets specific, you are paying four subscriptions plus the duct tape.",
    },
    {
      title: "Software your team will actually use",
      body: "Projects fail when teams quietly go back to spreadsheets. We map how work actually flows before writing a line of code.",
    },
    {
      title: "You own it, we stand behind it",
      body: "No per-seat fees, no vendor roadmap - the code and data are yours. We stay on for hosting, fixes, and new features, on your terms.",
    },
  ],
};

export const subAgents = {
  eyebrow: "AI sub-agents, in plain English",
  title: "Small AIs with real jobs",
  lead: "A chatbot answers questions. An agent completes tasks. Ours are small and specific - one job each - working through your own systems and reporting back when done, or when a human is needed.",
  points: [
    {
      title: "The 9pm lead that still gets booked",
      body: "A lead arrives at 9pm. A sub-agent replies in minutes, answers the questions, checks the calendar, books the estimate. Responding within 5 minutes makes a lead 21x more likely to qualify (MIT / InsideSales.com, 2007 - human callers; the agent makes that window automatic).",
    },
    {
      title: "Your people stay in the loop",
      body: "Each agent has clear boundaries: what it handles, what it drafts for approval, when it escalates. Judgment goes to a person - we do not build systems so you can fire employees.",
    },
    {
      title: "Inside your system, not bolted on",
      body: "A generic widget knows your office hours. A sub-agent built into your platform knows your calendar, price book, and job history - so it finishes the work.",
    },
  ],
};

export const numbers = {
  eyebrow: "Tangible numbers",
  title: "What the friction actually costs",
  lead: "Named, published research - none of it ours. We would rather show you your own numbers in the first conversation.",
  stats: [
    {
      figure: "1,200",
      label: "daily app switches for the average digital worker - about four hours a week lost",
      source: "Harvard Business Review, 2022",
    },
    {
      figure: "52.7%",
      label: "of paid software licenses sit idle",
      source: "Zylo, 2025 SaaS Management Index",
    },
    {
      figure: "28%",
      label: "of a sales rep's week is spent actually selling",
      source: "Salesforce, State of Sales, 2022",
    },
  ],
};

export const faq = [
  {
    q: "What is a CRM, actually?",
    a: "One place that remembers every customer and lead - what they asked, what you quoted, what happens next. We build custom CRMs because a system shaped to your workflow beats one your team bends around.",
  },
  {
    q: "Do you just build websites?",
    a: "No. Websites are the front door. Most of our work is the building behind it: CRM platforms, operating systems, scheduling tools, dashboards, and SaaS products (software sold as a subscription).",
  },
  {
    q: "What are AI sub-agents?",
    a: "Small, specialized AIs - one answers new leads, another chases invoices, another keeps records tidy. They run inside your system, on your real data, with a human approving anything that matters.",
  },
  {
    q: "How much will it cost, and what do I get back?",
    a: "We publish the method, not a menu: total your subscription stack, add the hours lost to juggling tools, and price the build against that. You see the break-even point before you sign. Focused builds ship in weeks; platforms in phased months.",
  },
  {
    q: "Why you, and not another AI automation company?",
    a: "Incentives. Most AI agencies resell platforms and earn while you stay subscribed. We are paid to finish - a system you own, with support on your terms. That changes the advice you get.",
  },
  {
    q: "Will this replace my employees?",
    a: "No. The repetitive work goes to the software; the judgment, relationships, and craft stay with your people - who get their hours back to do that work well.",
  },
];

export const cta = {
  eyebrow: "Start with a conversation",
  title: "Bring us your stack, we will bring the math",
  body: "Walk us through how your business runs - every tool, every login. You leave with an honest diagnosis and your break-even math, even if the answer is that you do not need us yet.",
};
