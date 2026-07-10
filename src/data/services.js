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
    tagline: "Sites and systems that earn customers, not just exist.",
    outcome:
      "A website is a means, not an end. We build the site - and the software behind it - that moves your business forward, then keep it fast, secure, and current long after launch.",
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
    tagline: "The numbers you can act on this quarter.",
    outcome:
      "Most businesses already collect the data they need and cannot see it. We turn what you have into dashboards your team opens every morning, and metrics everyone defines the same way.",
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
    ],
    useCase: {
      title: "Six years of data nobody could read",
      body: "A freight operator allocated its fleet each morning from memory and a whiteboard, while six years of delivery data sat unused across three systems that disagreed on what 'delivered' meant. Agreeing the definition was most of the work. The dashboard was the easy part.",
    },
  },
  {
    id: "ai",
    title: "AI & Machine Learning",
    tagline: "Applied models with a business case attached.",
    outcome:
      "We start from the decision you want to improve, not the model we want to build. If a rule beats a model, we will tell you - and save you the maintenance.",
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
