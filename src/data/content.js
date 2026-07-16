/**
 * Copy for the client-outcome sections of the homepage.
 *
 * The page is an argument, and it runs in this order:
 *   promise -> commitments -> paths (self-sort) -> spine (method) ->
 *   consolidation -> sub-agents -> work -> testimonials -> objections -> close
 * The footer repeats `promise.line` so the page closes the loop it opened.
 *
 * Cut to headlines at the owner's request - point titles carry the argument
 * with no body text. HARD RULE: statistics carry a real, named source -
 * never publish a bare or unverifiable figure. See data/proof.js.
 */

/**
 * The one sentence the company owns. It is the page's opening claim and its
 * closing sign-off, and it should appear nowhere else - repetition is what
 * makes it land, over-use is what makes it wallpaper.
 */
export const promise = {
  line: "One system you own.\nNot thirty you rent.",
  /* The plain-language expansion, for the hero and for meta descriptions. */
  lead: "We build the software your business actually runs on - the CRM, the operating system, the dashboards, the sub-agents that handle the work nobody should be doing by hand. You own it when we are done.",
};

/**
 * The self-sort. A visitor should know which column is theirs within one
 * screen, without a call and without a price list - the tier qualifies, the
 * conversation closes. Keep it to two: three columns is a menu, not a fork.
 */
export const paths = {
  eyebrow: "Two ways in",
  title: "Fix one thing, or replace the stack.",
  lead: "Most people arrive knowing which of these they are. If you do not, the first call is the one that tells you - we would rather scope you down than sell you up.",
  options: [
    {
      id: "focused",
      kicker: "Start here if one thing is broken",
      title: "A focused build",
      body: "One process, rebuilt properly and handed over. The quoting that lives in a spreadsheet, the scheduling that lives in someone's head, the invoice chase that never happens. Small enough to finish, real enough to feel.",
      meta: "Ships in weeks",
      qualifiers: [
        "You can name the one process that keeps breaking.",
        "Your team is working around the software, not with it.",
        "You want proof we can deliver before you commit to more.",
      ],
    },
    {
      id: "platform",
      kicker: "Start here if the stack is the problem",
      title: "The whole system",
      body: "The subscriptions come out and one system goes in - CRM, operations, dashboards, and sub-agents on the same data, shaped to how you already work. Phased, so you are never mid-migration with nothing running.",
      meta: "Phased over months",
      qualifiers: [
        "You are paying for tools that half-overlap and do not talk.",
        "Nobody can tell you the same number twice.",
        "You want to own the thing your business depends on.",
      ],
    },
  ],
};

/**
 * The fixed spine. Same four, same order, on every page that describes how we
 * work - a method is only a method if it does not change shape between pages.
 */
export const spine = {
  eyebrow: "How we work",
  title: "Four Simple Steps",
  lead: "No discovery theatre, no sixty-page deck. The point of the method is that you can check us against it.",
  /*
   * Each step lists what happens inside it, rather than describing it in a
   * paragraph.
   *
   * Every item below is a claim the old paragraphs already made - the budget
   * test, the source code, the human sign-off, paid to finish. Breaking prose
   * into a list is a layout change; it was NOT licence to add a capability we
   * had not already promised in writing. Nothing here is new.
   *
   * `id` per item because the icons are mapped by id in Method.jsx: keyed by
   * position instead, an icon would silently follow the slot rather than the
   * meaning the first time one of these is reordered.
   */
  steps: [
    {
      id: "count",
      title: "We study your Business",
      items: [
        { id: "spend", text: "What you pay every month, totalled" },
        { id: "hours", text: "The hours lost moving data between tools by hand" },
        { id: "budget", text: "That number becomes the budget" },
        { id: "honest", text: "If the build cannot beat it, we tell you so" },
      ],
    },
    {
      id: "build",
      title: "Build the system",
      items: [
        { id: "shaped", text: "One system, shaped to your workflow" },
        { id: "written", text: "Written for you, not configured for you" },
        { id: "weeks", text: "Working software in weeks, not at the end" },
        { id: "source", text: "You hold the source code the whole way through" },
      ],
    },
    {
      id: "agents",
      title: "Deliver the best system",
      items: [
        { id: "leads", text: "Answers the lead that arrives at 9pm" },
        { id: "invoices", text: "Chases the unpaid invoice" },
        { id: "records", text: "Keeps the records tidy" },
        { id: "signoff", text: "A human signs off on anything that matters" },
      ],
    },
    {
      id: "stand-behind",
      title: "We stay Partner",
      items: [
        { id: "finish", text: "Paid to finish, not to keep you subscribed" },
        { id: "yours", text: "When it is done, it is yours" },
        { id: "support", text: "Support is a choice you make afterwards" },
        { id: "person", text: "You reach the person who wrote the code" },
      ],
    },
  ],
};

export const consolidation = {
  eyebrow: "The consolidation case",
  title: "One system instead of thirty",
  points: [
    { title: "Count your subscriptions" },
    { title: "Glue tools patch, they do not fix" },
    { title: "Software your team will actually use" },
    { title: "You own it, we stand behind it" },
  ],
};

export const subAgents = {
  eyebrow: "AI sub-agents, in plain English",
  title: "Small AIs with real jobs",
  points: [
    { title: "The 9pm lead that still gets booked" },
    { title: "Your people stay in the loop" },
    { title: "Inside your system, not bolted on" },
  ],
};

/**
 * Objections first, education second. Every question below is a reason
 * somebody talks themselves out of the call - answer those, and the two
 * definitional ones at the end catch the first-time buyer who needs them.
 */
export const faq = [
  {
    q: "We already pay for these tools. Why rebuild what works?",
    a: "If it works, do not rebuild it. The case only exists when the tools half-overlap, disagree on the same number, and need a person to move data between them every morning. Total those subscriptions, add the hours lost to the juggling, and compare it to a build you own outright. If the build does not beat the stack, we will say so.",
  },
  {
    q: "We are too small for custom software, surely.",
    a: "Smaller companies are usually where it pays back fastest, because there is nobody spare to absorb the manual work. The honest limit is not headcount, it is whether one process is costing you real hours or real deals. If it is, a focused build is measured in weeks, not quarters.",
  },
  {
    q: "What happens if you disappear?",
    a: "You hold the source code, the data, and the deployment from day one - not at the end, and not on request. Any competent developer can pick it up, because there is no proprietary runtime of ours to be locked into. That is the difference between owning software and renting it.",
  },
  {
    q: "Isn't this just a few automations wired together?",
    a: "That is what most of the market sells, and it is why so much of it breaks quietly. A workflow that fires webhooks between tools you do not own is a patch with a subscription attached. We build the system the workflows run inside - with your data model, your permissions, your audit trail.",
  },
  {
    q: "How much will it cost, and what do I get back?",
    a: "We publish the method, not a menu: total your subscription stack, add the hours lost to juggling tools, and price the build against that. You see the break-even point before you sign. Focused builds ship in weeks; platforms in phased months.",
  },
  {
    q: "Why you, and not another AI automation company?",
    a: "Incentives. Most AI agencies resell platforms and earn while you stay subscribed. We are paid to finish - a system you own, with support on your terms. That changes the advice you get, including the advice to build less.",
  },
  {
    q: "Will this replace my employees?",
    a: "No. The repetitive work goes to the software; the judgment, relationships, and craft stay with your people - who get their hours back to do that work well.",
  },
  {
    q: "What is a CRM, actually?",
    a: "One place that remembers every customer and lead - what they asked, what you quoted, what happens next. We build custom CRMs because a system shaped to your workflow beats one your team bends around.",
  },
  {
    q: "What are AI sub-agents?",
    a: "Small, specialized AIs - one answers new leads, another chases invoices, another keeps records tidy. They run inside your system, on your real data, with a human approving anything that matters.",
  },
];

export const cta = {
  title: "Let's have a chat",
  /* The one thing we can promise about the call itself. */
  lead: "Bring the thing that is not working. You will leave the call knowing whether we are worth hiring.",
};
