/**
 * Three pillars, each with grouped sub-services.
 *
 * `outcome` leads with what the client gets, not the technology - the brief is
 * explicit that pillar pages open on the outcome we deliver, not the stack.
 */
export const pillars = [
  {
    id: "websites",
    title: "Websites & Custom Software",
    tagline: "One system built around how you work.",
    outcome:
      "A website is the front door - custom software is the building behind it: CRM platforms (one system that remembers every customer), scheduling, internal tools, and full operating systems like Keystone, which runs a roofing company's pipeline from first call to finished job. Everything built to move a lead from click to customer.",
    groups: [
      {
        title: "Website Development",
        items: [
          "Corporate Websites",
          "Business Websites",
          "Portfolio Websites",
          "Landing Pages",
          "E-commerce Websites",
          "SaaS Websites",
          "Startup Websites",
          "Custom CMS Development",
          "Headless CMS Solutions",
          "Progressive Web Apps (PWAs)",
        ],
      },
      {
        title: "Website Redesign",
        items: [
          "Complete UI Redesign",
          "UX Improvement",
          "Performance Optimization",
          "Mobile Optimization",
          "Accessibility Improvements",
          "Website Modernization",
          "Brand Refresh",
          "Conversion Optimization",
        ],
      },
      {
        title: "Website Management",
        items: [
          "Maintenance",
          "Security Monitoring",
          "Performance Monitoring",
          "Backup & Recovery",
          "Plugin Updates",
          "Content Updates",
          "Technical Support",
          "Uptime Monitoring",
          "CDN & Hosting Management",
        ],
      },
      {
        title: "Custom Software & CRM",
        items: [
          "Custom CRM Development",
          "CRM Integration & Migration",
          "Web Applications & Portals",
          "Booking & Scheduling Systems",
          "Inventory Management Systems",
          "Internal & Admin Tools",
          "Third-party & API Integration",
          "Maintenance & Iteration",
        ],
      },
    ],
    useCase: {
      title: "When the website was never the problem",
      body: "A retail client asked for a redesign. Two weeks of watching their staff work showed the bottleneck was a nightly spreadsheet reconciliation, not the homepage. We rebuilt the storefront around a single inventory service instead - the redesign came second, and mattered more once it had something to sit on.",
    },
  },
  {
    id: "analytics",
    title: "Analytics & Business Intelligence",
    tagline: "Know your numbers before you spend a dollar.",
    outcome:
      "You cannot fix what you cannot see. Dashboards that answer real questions - where leads come from, where they stall, which jobs make money - so decisions become arithmetic, not arguments.",
    groups: [
      {
        title: "Dashboards & Reporting",
        items: [
          "Power BI Dashboards",
          "Tableau Dashboards",
          "Looker Studio",
          "Executive Dashboards",
          "KPI Dashboards",
          "Financial Dashboards",
          "Sales Dashboards",
          "Marketing Dashboards",
          "HR Dashboards",
          "Manufacturing Dashboards",
        ],
      },
      {
        // The unglamorous half of every dashboard project - and usually the
        // half that decides whether anyone trusts the numbers.
        title: "Data Foundations",
        items: [
          "Data Pipelines & Integration",
          "Shared Metric Definitions",
          "Source-of-Truth Reconciliation",
          "Data Cleaning & Migration",
          "Report Automation",
          "Data Quality Monitoring",
        ],
      },
    ],
    useCase: {
      title: "Six years of data nobody could read",
      body: "A freight operator allocated its fleet each morning from memory and a whiteboard, while six years of delivery data sat unused across three systems that disagreed on what 'delivered' meant. Agreeing the definition was most of the work. The dashboard was the easy part.",
    },
  },
  {
    id: "ai",
    title: "AI & Machine Learning",
    tagline: "AI employees working alongside your employees.",
    outcome:
      "Custom AI agents pick up the work nobody has time for - after-hours leads, unpaid invoices, follow-ups drafted for approval - with a human in the loop wherever judgment matters.",
    groups: [
      {
        title: "AI Solutions",
        items: [
          "AI Chatbots",
          "AI Assistants",
          "Voice AI",
          "Customer Support AI",
          "Sales AI",
          "AI Search",
          "AI Knowledge Base",
          "AI Agents",
          "AI Workflow Automation",
          "Sales Automation & Workflows",
        ],
      },
      {
        // Use-cases rather than techniques: each names a problem a client
        // might actually search for, not a model family.
        title: "Machine Learning",
        items: [
          "Predictive Lead Scoring",
          "Demand Forecasting",
          "Anomaly Detection in Manufacturing",
          "Customer Churn Prediction",
          "Intelligent Document Processing",
          "Sentiment Analysis for Customer Feedback",
          "Automated Report Generation",
          "Supply Chain Optimization",
          "Fraud Detection",
          "Personalized Recommendation Engines",
        ],
      },
    ],
    useCase: {
      title: "A forecast, not a science project",
      body: "Dispatch wanted to know how many trucks to send tomorrow. That is a forecasting problem with a clear owner, a clear input, and a clear way to know whether it worked - which is what separates AI worth building from AI worth admiring.",
    },
  },
];

export const getPillarById = (id) => pillars.find((p) => p.id === id);

/**
 * Grouped options for the contact form's "Service interested in" dropdown,
 * rendered as <optgroup>s. Group titles are unique across pillars, so a group
 * title alone is an unambiguous value.
 */
export const serviceGroups = pillars.map((pillar) => ({
  label: pillar.title,
  options: pillar.groups.map((group) => group.title),
}));
