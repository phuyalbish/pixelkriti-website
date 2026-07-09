/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PLACEHOLDER CONTENT - REPLACE BEFORE LAUNCH.
 *
 * Every entry below is `isPlaceholder: true`. They exist to establish the shape
 * of a case study, not to make claims. Client names are deliberately generic and
 * no outcome carries an invented number: publishing fabricated results would
 * undercut the accountability the brand is positioned on. The same goes for
 * `clientQuote` - attributed to a role, never to an invented person.
 *
 * Each case study is written diagnosis-first: problem, investigation, solution,
 * result. `category` drives the filter on the Work page and must be one of
 * `workCategories`.
 *
 * To publish a real one: fill in the fields, set `isPlaceholder: false`.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const work = [
  {
    slug: "regional-retail-storefront",
    client: "A regional retail chain",
    sector: "Retail",
    category: "Websites",
    year: "2025",
    isPlaceholder: true,
    summary:
      "Replacing three disconnected systems with one storefront and inventory view.",
    services: ["Custom CMS Development", "UI Redesign", "E-commerce"],
    problem:
      "Stock counts lived in a spreadsheet, orders arrived by phone, and the website was a brochure that had not been updated in two years.",
    investigation:
      "Two weeks shadowing store staff showed the real bottleneck was not the website at all - it was the nightly reconciliation between the spreadsheet and the till.",
    solution:
      "A single inventory service feeding both the till and a new storefront, so a sale in either place updates the other immediately.",
    result: [
      "Reconciliation moved from a nightly manual task to a background job",
      "Store staff manage stock from one screen instead of three",
    ],
    clientQuote: {
      quote:
        "They spent two weeks understanding how we actually worked before proposing anything.",
      attribution: "Operations Lead",
    },
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
  {
    slug: "restaurant-first-presence",
    client: "An independent restaurant",
    sector: "Hospitality",
    category: "Websites",
    year: "2025",
    isPlaceholder: true,
    summary: "A first website, and a reason for it to exist beyond having one.",
    services: ["Landing Pages", "Performance Optimization", "Brand Refresh"],
    problem:
      "The restaurant had no site, and a social profile with an outdated menu and no way to find opening hours.",
    investigation:
      "Most searches were people checking whether the kitchen was open right now, on a phone, standing outside.",
    solution:
      "A single fast page that answers hours, menu, and directions before anything else loads.",
    result: [
      "Hours and menu answerable in one glance on a phone",
      "The owner updates the menu without calling anyone",
    ],
    clientQuote: {
      quote: "It answers the only question our customers were actually asking.",
      attribution: "Owner",
    },
  },
];

/** Drives the Work page filter. "All" is prepended in the UI. */
export const workCategories = ["Websites", "Analytics", "AI & ML"];

export const getWorkBySlug = (slug) => work.find((item) => item.slug === slug);
