/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Entries marked `isPlaceholder: false` are real systems, described only by
 * what they do - no metrics or quotes until a client signs them off.
 *
 * Entries marked `isPlaceholder: true` REMAIN TO BE REPLACED BEFORE LAUNCH.
 * They exist to establish the shape of a case study, not to make claims.
 * Client names there are deliberately generic and no outcome carries an
 * invented number: publishing fabricated results would undercut the
 * accountability the brand is positioned on. The same goes for `clientQuote` -
 * attributed to a role, never to an invented person.
 *
 * Each case study is written diagnosis-first: problem, investigation, solution,
 * result. `category` drives the filter on the Work page and must be one of
 * `workCategories`.
 *
 * To publish a real one: fill in the fields, set `isPlaceholder: false`.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const work = [
  /*
   * The first two entries are real systems, described strictly by what they
   * do. No metrics, no quotes: none have been supplied, and inventing either
   * is forbidden. Add measured outcomes only when the client signs them off.
   */
  {
    slug: "keystone-roofing-crm",
    client: "Keystone",
    sector: "Roofing",
    category: "Websites",
    year: "In production",
    isPlaceholder: false,
    summary:
      "A custom CRM platform that runs a roofing company's pipeline from first call to finished job.",
    services: [
      "Custom CRM Development",
      "Booking & Scheduling Systems",
      "Sales Automation & Workflows",
    ],
    problem:
      "Roofing sales run on speed and follow-through: leads arrive by phone, web form, and referral, then pass through estimates, crews, and invoicing - each step traditionally living in a different tool with a different login.",
    investigation:
      "Rather than gluing the existing tools together with workflow patches, we mapped the pipeline end to end - who touches a lead, where jobs are handed over, what the office retypes twice - and found the handoffs, not the tools, were the problem.",
    solution:
      "Keystone: one platform - in the mould of GoHighLevel, but built for this business - where a lead becomes an estimate, an estimate becomes a scheduled job, and a finished job becomes an invoice, without leaving the system.",
    result: [
      "The whole pipeline - first call to finished job - lives in one system",
      "Estimates, scheduling, and invoicing share one customer record, so nothing is retyped between stages",
      "The company owns the platform outright - no per-seat licenses, no vendor roadmap",
    ],
  },
  {
    slug: "lawn-care-operating-system",
    client: "A lawn-care operating system",
    sector: "Field Services",
    category: "Websites",
    year: "In production",
    isPlaceholder: false,
    summary:
      "The operating system behind a lawn-care business's whole day-to-day: scheduling, crews, and invoicing in one place.",
    services: [
      "Custom Software",
      "Booking & Scheduling Systems",
      "Internal & Admin Tools",
    ],
    problem:
      "A lawn-care business lives and dies by its schedule: recurring routes, weather reshuffles, crews in the field, and invoices that have to follow the work the same day.",
    investigation:
      "The day-to-day ran across separate tools for scheduling, crew coordination, and billing - the same jobs entered more than once, and the office spent its mornings reconciling them.",
    solution:
      "One operating system for the whole day: routes and recurring jobs scheduled in one calendar, crews dispatched from it, and invoicing generated from the same records the moment work is done.",
    result: [
      "Scheduling, crews, and invoicing run from a single system of record",
      "A job is entered once and carries through to dispatch and billing",
      "The business owns its operating system instead of renting three subscriptions",
    ],
  },
  {
    slug: "clinic-booking-platform",
    client: "A multi-location clinic",
    sector: "Healthcare",
    category: "Websites",
    year: "2025",
    isPlaceholder: true,
    summary:
      "A booking flow patients finish, and a schedule the front desk trusts.",
    services: ["Conversion Optimization", "UX Improvement", "PWA"],
    problem:
      "Patients abandoned the online booking form partway through, so the front desk absorbed the calls instead.",
    investigation:
      "Session recordings showed drop-off at a required field most patients could not answer without their paperwork in hand.",
    solution:
      "The form was restructured to ask only what is needed to hold a slot, and to collect the rest at check-in.",
    result: [
      "Booking completes in a single sitting on a phone",
      "Front-desk time shifted from phone triage to patient care",
    ],
    clientQuote: {
      quote:
        "We asked for a booking form. They fixed the reason people were abandoning it.",
      attribution: "Practice Manager",
    },
  },
  {
    slug: "logistics-analytics",
    client: "A freight operator",
    sector: "Logistics",
    category: "Analytics",
    year: "2026",
    isPlaceholder: true,
    summary:
      "Turning six years of dormant delivery data into a dashboard dispatch opens daily.",
    services: ["Power BI Dashboards", "KPI Dashboards", "Executive Dashboards"],
    problem:
      "Fleet allocation was decided each morning from memory and a whiteboard, and the data to do better was already being collected and ignored.",
    investigation:
      "Discovery found the historical data was usable but scattered across systems with no shared definition of a completed delivery.",
    solution:
      "A pipeline that unifies the definition, plus dashboards the dispatch team opens each morning.",
    result: [
      "Dispatch begins the day with data instead of a whiteboard",
      "One agreed definition of a delivery across every system",
    ],
    clientQuote: {
      quote:
        "Getting three systems to agree on what a delivery is changed how we run mornings.",
      attribution: "Head of Dispatch",
    },
  },
  {
    slug: "demand-forecasting",
    client: "A regional distributor",
    sector: "Logistics",
    category: "AI & ML",
    year: "2026",
    isPlaceholder: true,
    summary:
      "A next-day demand forecast with a clear owner and a clear way to know it works.",
    services: ["Demand Forecasting", "Predictive Analytics", "Custom ML Models"],
    problem:
      "Dispatch needed to know how many vehicles to send tomorrow, and was guessing - expensively in both directions.",
    investigation:
      "We checked whether a model was warranted at all. A simple seasonal rule got most of the way; the remaining error was worth modelling, and measurable.",
    solution:
      "A forecasting model deployed behind the existing dashboard, with monitoring that flags when its accuracy drifts.",
    result: [
      "Tomorrow's allocation is proposed before the morning meeting",
      "Model accuracy is monitored, so nobody trusts a stale forecast",
    ],
    clientQuote: {
      quote:
        "They told us where a spreadsheet would have been enough. Then built the part that wasn't.",
      attribution: "Supply Chain Director",
    },
  },
];

/** Drives the Work page filter. "All" is prepended in the UI. */
export const workCategories = ["Websites", "Analytics", "AI & ML"];

export const getWorkBySlug = (slug) => work.find((item) => item.slug === slug);
