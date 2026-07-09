/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PLACEHOLDER CONTENT — REPLACE BEFORE LAUNCH.
 *
 * Every entry below is `isPlaceholder: true`. They exist to establish the shape
 * of a case study, not to make claims. Client names are deliberately generic and
 * no outcome carries an invented number: publishing fabricated results would
 * undercut the accountability the brand is positioned on.
 *
 * Each case study is written diagnosis-first — problem, investigation, solution,
 * result — which is the structure the strategy calls for.
 *
 * To publish a real one: fill in the fields, set `isPlaceholder: false`.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const work = [
  {
    slug: "regional-retail-storefront",
    client: "A regional retail chain",
    sector: "Retail",
    tier: "Growth",
    year: "2025",
    isPlaceholder: true,
    summary:
      "Replacing three disconnected systems with one storefront and inventory view.",
    services: ["Custom Software", "UI/UX & Branding", "Website Development"],
    problem:
      "Stock counts lived in a spreadsheet, orders arrived by phone, and the website was a brochure that had not been updated in two years.",
    investigation:
      "Two weeks shadowing store staff showed the real bottleneck was not the website at all — it was the nightly reconciliation between the spreadsheet and the till.",
    solution:
      "A single inventory service feeding both the till and a new storefront, so a sale in either place updates the other immediately.",
    result: [
      "Reconciliation moved from a nightly manual task to a background job",
      "Store staff manage stock from one screen instead of three",
    ],
  },
  {
    slug: "clinic-booking-platform",
    client: "A multi-location clinic",
    sector: "Healthcare",
    tier: "Growth",
    year: "2025",
    isPlaceholder: true,
    summary:
      "A booking flow patients finish, and a schedule the front desk trusts.",
    services: ["Custom Software", "UI/UX & Branding"],
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
  },
  {
    slug: "logistics-analytics",
    client: "A freight operator",
    sector: "Logistics",
    tier: "Enterprise",
    year: "2026",
    isPlaceholder: true,
    summary:
      "Turning six years of dormant delivery data into a next-day demand forecast.",
    services: ["Analytics & BI", "AI & Machine Learning"],
    problem:
      "Fleet allocation was decided each morning from memory and a whiteboard, and the data to do better was already being collected and ignored.",
    investigation:
      "Discovery found the historical data was usable but scattered across systems with no shared definition of a completed delivery.",
    solution:
      "A pipeline that unifies the definition, plus a forecast surfaced in a dashboard the dispatch team opens each morning.",
    result: [
      "Dispatch begins the day with a forecast instead of a whiteboard",
      "One agreed definition of a delivery across every system",
    ],
  },
  {
    slug: "restaurant-first-presence",
    client: "An independent restaurant",
    sector: "Hospitality",
    tier: "Starter",
    year: "2025",
    isPlaceholder: true,
    summary: "A first website, and a reason for it to exist beyond having one.",
    services: ["Website Development", "UI/UX & Branding"],
    problem:
      "The restaurant had no site, and a social profile with an outdated menu and no way to find opening hours.",
    investigation:
      "Most searches were people checking whether the kitchen was open right now, on a phone, standing outside.",
    solution:
      "A single fast page that answers hours, menu, and location before anything else loads.",
    result: [
      "Hours and menu answerable in one glance on a phone",
      "The owner updates the menu without calling anyone",
    ],
  },
];

export const tiersInWork = ["All", "Starter", "Growth", "Enterprise"];

export const getWorkBySlug = (slug) => work.find((item) => item.slug === slug);

/** True once at least one real case study has replaced the placeholders. */
export const hasPublishedWork = work.some((item) => !item.isPlaceholder);
