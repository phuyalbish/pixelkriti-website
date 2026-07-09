export const services = [
  {
    id: "web",
    title: "Website Development",
    summary:
      "Sites built to earn customers, not just to exist. Fast, accessible, and owned by you.",
    deliverables: [
      "Marketing and brochure sites",
      "E-commerce storefronts",
      "Content and CMS integration",
      "Performance and SEO foundations",
    ],
  },
  {
    id: "design",
    title: "UI/UX & Branding",
    summary:
      "Identity and interface designed together, so the first impression and the tenth both hold up.",
    deliverables: [
      "Brand identity and design systems",
      "Product and app interface design",
      "Prototyping and usability testing",
      "Design-to-development handoff",
    ],
  },
  {
    id: "software",
    title: "Custom Software",
    summary:
      "The systems your business actually runs on — bookings, inventory, internal tools, integrations.",
    deliverables: [
      "Web applications and portals",
      "Booking, inventory, and CRM-style tools",
      "Third-party and API integration",
      "Maintenance and iteration",
    ],
  },
  {
    id: "ai",
    title: "AI & Machine Learning",
    summary:
      "Applied models with a business case attached. We start from the decision you want to improve.",
    deliverables: [
      "Feasibility and opportunity assessment",
      "Model development and evaluation",
      "LLM and automation workflows",
      "Deployment and monitoring",
    ],
  },
  {
    id: "data",
    title: "Analytics & BI",
    summary:
      "Turn the data you already collect into the numbers you can act on this quarter.",
    deliverables: [
      "Data pipelines and warehousing",
      "Dashboards and reporting",
      "Metric definition and instrumentation",
      "Forecasting and analysis",
    ],
  },
];

/**
 * Engagement tiers. Pricing is transparent and scope-based by design — most
 * competitors hide it, so publishing ranges is itself a differentiator.
 */
export const tiers = [
  {
    id: "starter",
    name: "Starter",
    forWhom: "Local and small businesses establishing a credible presence.",
    model: "Fixed project fee, published ranges",
    points: [
      "A site that works, and someone accountable when it doesn't",
      "Clear scope agreed before a line of code is written",
      "Hand-holding through launch, not a handoff and goodbye",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    forWhom:
      "Scaling companies needing custom software, better UX, or integrated systems.",
    model: "Scoped project fee, with an optional monthly retainer",
    points: [
      "Multi-service teams across design, software, and data",
      "A retainer option for continuous iteration",
      "One partner who understands the whole picture",
    ],
    featured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    forWhom:
      "Funded or larger organisations pursuing AI/ML, analytics, or full consultancy engagements.",
    model: "Custom engagement, priced after discovery",
    points: [
      "Rigorous discovery before any commitment",
      "Direct access to the founding team",
      "Milestone-based or consultancy day-rate terms",
    ],
  },
];
