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
   * Hellotrekkers is the flagship: a real, launched engagement with
   * client-supplied facts throughout (five months, 15 treks completed).
   * It carries the optional rich-story fields - `heroImage`, `stats`,
   * `story`, `gallery`, `download` - which WorkDetailPage renders instead
   * of the classic four chapters when `story` is present. Every photo in
   * /work/hellotrekkers/ is the client's own trek photography or a
   * screenshot of the site we shipped.
   */
  {
    slug: "hellotrekkers",
    client: "Hellotrekkers",
    sector: "Adventure Travel",
    category: "Websites",
    year: "Live",
    isPlaceholder: false,
    summary:
      "A trekking company asked for a website. What it needed was a way to prove, trek by trek, that a young operator could be trusted in terrain where the rules confuse even veterans.",
    services: [
      "Brand Identity & Strategy",
      "Website Design & Development",
      "Custom CMS",
      "SEO & Analytics",
    ],
    heroImage: {
      src: "/work/hellotrekkers/everest-base-camp.webp",
      alt: "Snow-capped Himalayan peaks on the Everest Base Camp route, from Hellotrekkers' own trek photography",
    },
    stats: [
      { value: "5 months", label: "from brand strategy to launch" },
      { value: "15 treks", label: "completed across Nepal since launch" },
      { value: "0 → 1", label: "from no public presence to a nationwide catalog" },
    ],
    story: [
      {
        label: "The client",
        title: "A trekking company built to fund something bigger.",
        body: [
          "Hellotrekkers is a young trekking company based in Kirtipur, Nepal, guiding travellers on routes from Everest Base Camp, Annapurna, and Manaslu to quieter regional trails. Its founder, Aashish, runs it on an unusual mandate: earn a moderate personal income and direct the rest of the profit toward the social impact and non-profit work he supports.",
          "When he came to us on a friend's recommendation, the request sounded simple: a brand identity and a website. The company had a name, a growing list of treks, and a founder confident in the experience he could offer. What it lacked was anywhere to send people online.",
        ],
        image: {
          src: "/work/hellotrekkers/tsum-valley-manaslu.webp",
          alt: "Trail through the Tsum Valley on the Manaslu circuit",
          caption: "Tsum Valley, on Hellotrekkers' 22-day Manaslu circuit journey.",
        },
      },
      {
        label: "The investigation",
        title: "The real problem was credibility, not visibility.",
        body: [
          "As we asked how each trek actually worked, a pattern surfaced. Every route carried its own mix of conservation-area permits, restricted-area permits, and guide requirements - rules that shift by region and season, and that even experienced operators describe as hard to keep up with.",
          "A one-year-old company asking travellers to trust it with a multi-day trek through remote, high-altitude terrain needed to show, route by route, that it understood those specifics. A templated brochure site would have looked like dozens of competitors and said nothing about whether Hellotrekkers knew the practical difference between a standard route and a restricted-area trek.",
        ],
        image: {
          src: "/work/hellotrekkers/ghorepani-poon-hill.webp",
          alt: "The Poon Hill signpost above Ghorepani against a blue sky",
          caption:
            "Every route, from a five-day Ghorepani classic to a strenuous 22-day circuit, carries its own permits and rules.",
        },
      },
      {
        label: "The decision",
        title: "Build the structure. Borrow the rest.",
        body: [
          "Proprietary permit-tracking infrastructure would have become a second, permanent project sitting on top of the actual business. A quick template site would have left the credibility gap untouched. We chose the path between: a website structured so every trek presents the same block of practical and safety information - permits, guide requirements, difficulty, seasons, logistics - with the regulatory content sourced from established third parties rather than maintained in-house.",
          "The same discipline ran through every tool choice: Cloudinary instead of custom image infrastructure, shared hosting with a CDN instead of dedicated servers, and a free trial before any budget went toward anything. Build only as much as the business, at its current stage, genuinely needs.",
        ],
        image: {
          src: "/work/hellotrekkers/site-trek-detail.jpg",
          alt: "A Hellotrekkers trek detail page showing the consistent information structure",
          caption:
            "Every trek page carries the same information structure, so a first-time visitor can compare routes and trust what they read.",
        },
      },
      {
        label: "The brand",
        title: "Calm competence instead of adrenaline.",
        body: [
          "Adventure travel marketing usually shouts. We went the other way: a grounded, informative identity that matched a founder who had explicitly said the business wasn't built to maximise profit. Clean design that suggests attention to detail, photography over hype, and a tone that reads as informative rather than salesy - because for a company selling judgment about safety in remote terrain, trust is the actual product.",
        ],
        image: {
          src: "/work/hellotrekkers/site-home-desktop.jpg",
          alt: "The Hellotrekkers homepage, with Himalayan photography and the tagline 'Your tale begins now'",
          caption: "hellotrekkers.com - the brand leads with the mountains, not the marketing.",
        },
      },
      {
        label: "The build",
        title: "A custom CMS the founder runs himself.",
        body: [
          "Bishal designed and built the site mobile-first on a Laravel back end, with a custom CMS made specifically for trek package management - so Aashish can add treks, update itineraries and pricing, and publish safety and permit information without developer help. Cloudinary handles the growing photo library; Muzammil wired up Google Analytics, Search Console, and schema markup so route-specific searches find the site without paid advertising.",
        ],
        image: {
          src: "/work/hellotrekkers/site-home-mobile.jpg",
          alt: "The Hellotrekkers homepage on a phone",
          caption: "Built mobile-first: most travellers arrive on a phone, often on a slow connection.",
        },
      },
      {
        label: "The result",
        title: "Fifteen treks and counting.",
        body: [
          "Hellotrekkers went from no public presence to a website covering treks across Nepal, structured to absorb every new route without reinventing its story. Aashish used it to land the company's first clients; since launch, the company has completed 15 treks across the country - growing at the sustainable pace he set out to achieve, with the profits flowing to the non-profit work the business was built to fund.",
        ],
        image: {
          src: "/work/hellotrekkers/mardi-himal.webp",
          alt: "A trekker on the Mardi Himal trail above the clouds",
          caption: "The Mardi Himal Express, one of the routes the site now sells.",
        },
      },
    ],
    galleryLabel: "From the trail",
    gallery: [
      {
        src: "/work/hellotrekkers/annapurna-base-camp.webp",
        alt: "Annapurna Base Camp under snow",
      },
      {
        src: "/work/hellotrekkers/pikey-peak.webp",
        alt: "Sunrise over the Himalaya from Pikey Peak",
      },
      {
        src: "/work/hellotrekkers/chitwan-safari.webp",
        alt: "Jungle safari in Chitwan National Park",
      },
      {
        src: "/work/hellotrekkers/gorkha-palpa-lumbini.webp",
        alt: "Heritage architecture on the Gorkha-Palpa-Lumbini circuit",
      },
      {
        src: "/work/hellotrekkers/pharping-kirtipur.webp",
        alt: "Living heritage on the Pharping to Kirtipur day journey",
      },
      {
        src: "/work/hellotrekkers/tsum-valley-manaslu.webp",
        alt: "The Tsum Valley on the Manaslu circuit",
      },
    ],
    download: {
      href: "/downloads/hellotrekkers-case-study.pdf",
      label: "Download the full case study (PDF)",
      note: "The complete write-up: investigation, options considered, technology choices, and lessons learned.",
    },
  },
  /*
   * TAILG Nepal is the second rich-story engagement: brand identity, a
   * Webflow rebuild the client runs itself, and social alignment for an
   * electric-scooter distributor. Facts (three months, referral-driven
   * sales, UNEP affiliation) are client-supplied; imagery is the client's
   * own product renders and screenshots of the site we shipped.
   */
  {
    slug: "tailg-nepal",
    client: "TAILG Nepal",
    sector: "Electric Mobility",
    category: "Websites",
    year: "Live",
    isPlaceholder: false,
    summary:
      "An electric scooter distributor whose sales all came from referrals asked for a better website. What it needed was a brand that could pass its hard-earned trust to strangers.",
    services: [
      "Brand Identity & Strategy",
      "Website Design & Development",
      "Social Media Alignment",
      "Analytics Setup",
    ],
    heroImage: {
      src: "/work/tailg-nepal/site-home-desktop.jpg",
      alt: "The new tailgnepal.com homepage, opening on a full-bleed close-up of a scooter's LED headlight",
    },
    stats: [
      { value: "3 months", label: "from discovery to launch and handover" },
      { value: "4 models", label: "on a catalog the team updates without a developer" },
      { value: "In-house", label: "the team now runs its digital presence without outside help" },
    ],
    story: [
      {
        label: "The client",
        title: "A business succeeding despite its digital presence.",
        body: [
          "TAILG Nepal sells electric scooters made by TAILG, a Chinese EV manufacturer, through showrooms across Nepal, backed by after-sales service and warranty terms competitors weren't matching. For years, almost every sale traced back to a referral - a good sign, but not a scalable one.",
          "The website ran on a generic WordPress template, social media was inconsistent, and nothing tied the showrooms, the site, and the company's reputation into one identity. As more electric two-wheeler brands entered the Nepali market, that gap became harder to ignore. The ask, when it reached us through a networking connection, was close to \"we need a better website.\"",
        ],
        image: {
          src: "/work/tailg-nepal/rider.webp",
          alt: "A rider on a TAILG electric scooter",
          contain: true,
          caption: "A high-consideration purchase, usually decided in person - at a showroom, on a friend's recommendation.",
        },
      },
      {
        label: "The investigation",
        title: "Years of credibility nobody could see.",
        body: [
          "Every conversation about how recent customers found TAILG Nepal led back to a referral or a showroom visit - rarely the website. What stood out was everything the company had built without ever communicating it: decades of manufacturing history, extended warranties, a growing base of customers happy to refer friends, and a genuine connection to international e-mobility efforts through TAILG's affiliation with the UN Environment Programme.",
          "None of it showed up anywhere in the brand's public face. This wasn't a business short on substance - it was a business whose substance had never been organized into something a stranger could encounter and evaluate. Word of mouth passed trust person to person; nothing in the digital presence did the same job.",
        ],
        image: {
          src: "/work/tailg-nepal/site-un.jpg",
          alt: "The UN Environment Programme partnership page on the new TAILG Nepal site",
          caption:
            "TAILG's UNEP e-mobility affiliation was real - it had simply never been shared with customers. Now it has its own page.",
        },
      },
      {
        label: "The decision",
        title: "Identity before distribution.",
        body: [
          "Paid campaigns would have delivered a fast, visible lift - and sent strangers to a presence that gave them no reason to trust an unfamiliar brand. A straight website redesign was faster and simpler, but treated one touchpoint as the problem when a customer might just as easily meet the brand through a showroom or a social post.",
          "We recommended the slower path: define the brand's visual and verbal identity first, rebuild the website on a platform the team could maintain itself, and bring social media into the same identity. The business didn't need more attention - it already had organic demand. It needed a consistent way to meet that attention once it arrived.",
        ],
        image: {
          src: "/work/tailg-nepal/banner-scooter.webp",
          alt: "A TAILG scooter product render",
          contain: true,
          caption: "Distribution amplifies whatever identity exists. Ads before the brand would have amplified the inconsistency.",
        },
      },
      {
        label: "The brand",
        title: "Manufacturer's authority, neighbour's approachability.",
        body: [
          "The identity had to hold two things at once: the credibility of an established manufacturer with decades of history, and the approachability of a locally run business Nepali customers already trusted enough to recommend. The messaging rests on three ideas - reliability, service, and sustainability - in a tone that stays informative rather than salesy, because that's how EV buyers actually shop: comparing specs, reading about reliability, looking for proof the company will stand behind its product.",
          "The sustainability story wasn't invented for the rebrand. It came from TAILG's existing participation in the UN Environment Programme's e-mobility initiative, worked into the website, social content, and showroom materials.",
        ],
        image: {
          src: "/work/tailg-nepal/headlight.webp",
          alt: "Close-up of a TAILG scooter's LED headlight",
          contain: true,
          caption: "Photography guidelines built around product quality and the in-showroom experience.",
        },
      },
      {
        label: "The build",
        title: "A website built to run without a developer.",
        body: [
          "Bishal rebuilt the site on Webflow, chosen so TAILG Nepal's team could update pricing, add models, and publish news without ongoing developer support. The content answers the questions EV buyers actually ask: models, prices, range and battery life, where to test ride, and what warranty comes with it - plus a showroom locator and the sustainability page.",
          "Muzammil brought Facebook and TikTok in line with the new identity and wired up Google Tag Manager, so the team can see which products draw interest, how visitors arrive, and which channels actually work. Every choice kept ongoing technical overhead low enough that the engagement could truly end.",
        ],
        image: {
          src: "/work/tailg-nepal/site-product.jpg",
          alt: "A product page on the new TAILG Nepal website",
          caption: "The catalog structure makes adding a new scooter model routine, not a project.",
        },
      },
      {
        label: "The result",
        title: "Trust that no longer needs a referral to travel.",
        body: [
          "Sales grew after the relaunch, with the new website and identity contributing to better conversion. Social engagement improved as content became consistent. And the credibility TAILG Nepal had spent years building finally reaches people outside its referral network - carried by the same identity across the website, social channels, and showrooms.",
          "Just as deliberate was what we didn't build: no e-commerce (sales depend on in-person test rides), no paid-ads push before the identity existed, no loyalty platform, no mobile app. The team now runs all of it independently - which was the point.",
        ],
        image: {
          src: "/work/tailg-nepal/site-home-mobile.jpg",
          alt: "The TAILG Nepal homepage on a phone",
          caption: "One identity, every touchpoint - showroom, website, social.",
        },
      },
    ],
    galleryLabel: "The lineup",
    gallery: [
      {
        src: "/work/tailg-nepal/scooter-s2.webp",
        alt: "TAILG S2 electric scooter",
        contain: true,
      },
      {
        src: "/work/tailg-nepal/scooter-tiger.webp",
        alt: "TAILG Tiger electric scooter",
        contain: true,
      },
      {
        src: "/work/tailg-nepal/scooter-zs.webp",
        alt: "TAILG ZS electric scooter",
        contain: true,
      },
      {
        src: "/work/tailg-nepal/scooter-ks.webp",
        alt: "TAILG KS electric scooter",
        contain: true,
      },
      {
        src: "/work/tailg-nepal/un-partnership.webp",
        alt: "TAILG's UN Environment Programme e-mobility affiliation",
        contain: true,
      },
      {
        src: "/work/tailg-nepal/rider.webp",
        alt: "A rider on a TAILG electric scooter",
        contain: true,
      },
    ],
    download: {
      href: "/downloads/tailg-nepal-case-study.pdf",
      label: "Download the full case study (PDF)",
      note: "The complete write-up: investigation, root cause, the three paths considered, and what this project taught us.",
    },
  },
  /*
   * ReadNext and Wafer Fault Detection are in-house AI/ML builds, not client
   * engagements - there was no client, so nothing here says there was one.
   * The `client` field carries the PROJECT name because the Work page needs a
   * title; it is not an assertion that somebody paid for it.
   *
   * ReadNext's facts come from its own README (Rajat6110/ReadNext): the three
   * problems, the datasets, TF-IDF + cosine similarity, popularity ranking,
   * and the documented trade-offs. It carries NO `stats` block because the
   * README reports no accuracy, no dataset size and no baseline - and a
   * recommender case study with invented numbers is the one thing this file
   * exists to prevent. Add stats when there is an evaluation to quote.
   *
   * The repository describes itself as an assignment set by a third party.
   * That company is deliberately unnamed: it was not a client, and listing it
   * on a Work page would say it was.
   */
  {
    slug: "readnext",
    client: "ReadNext",
    sector: "Digital Reading",
    category: "AI & ML",
    year: "2026",
    isPlaceholder: false,
    summary:
      "“Recommend the next thing to read” sounds like one problem. It is three, and they fail in different ways - which is why a single model was the wrong answer.",
    services: [
      "Recommendation Systems",
      "Machine Learning",
      "Data Analysis",
      "Technical Documentation",
    ],
    problem:
      "A reading platform serves chapters, not just books - and a reader mid-way through four titles at once does not want a homepage of bestsellers. It wants the next chapter. But the same product also has to introduce books a reader has never opened, and greet brand-new users it knows nothing about at all. One recommendation surface, three genuinely different questions.",
    investigation:
      "Pulling the interaction data apart made the split obvious. Continuing readers already tell you what they want through chapter sequence - no inference required, just order. Recommending an unread book is a content problem, answerable from tags, genres and authors. A new user with no history gives you nothing to personalise on, so any model that needs signal will fail precisely when a first impression matters most. Treating all three as one ranking problem would have meant a model that was mediocre at each and unexplainable at all of them.",
    solution:
      "Three lightweight strategies behind one hybrid system, each matched to the question it answers. Sequential progression through chapter order handles the reader who is already mid-book. Content-based filtering - TF-IDF over tags, genres and author metadata, compared by cosine similarity - surfaces unread books. Popularity-based ranking covers the cold start, where there is no history to personalise against. Deep sequence models were considered and deliberately declined: they cost more to run, and on this problem they would have traded away the ability to explain any given recommendation for accuracy the product did not need.",
    result: [
      "One hybrid system answers next-chapter, new-book and cold-start recommendation, instead of three disconnected features.",
      "Every recommendation is traceable to a reason - a chapter's position, a shared tag, a popularity rank - so a product team can interrogate the output rather than trust it.",
      "Runs on Pandas and scikit-learn with no GPU and no training infrastructure to maintain.",
      "The trade-offs are written down, not buried: what was simplified, why, and what collaborative filtering would add when the interaction data is dense enough to support it.",
    ],
  },
  /*
   * Wafer Fault Detection: facts, including the 92% accuracy figure, are
   * owner-supplied. That number is the ONLY published statistic here and it
   * came from the person who built the system - if it is ever challenged, it
   * needs the evaluation behind it (test split, baseline, and whether 92% is
   * accuracy on a SMOTE-balanced set or on the real imbalanced distribution,
   * because on imbalanced sensor data those are very different claims).
   */
  {
    slug: "wafer-fault-detection",
    client: "Wafer Fault Detection",
    sector: "Semiconductor Manufacturing",
    category: "AI & ML",
    year: "Live",
    isPlaceholder: false,
    summary:
      "Sensors on a semiconductor line generate far more readings from good wafers than bad ones. That imbalance is not a nuisance in the data - it is the whole problem.",
    services: [
      "Machine Learning",
      "Predictive Maintenance",
      "Dashboard & Monitoring",
      "Power BI",
    ],
    problem:
      "A wafer fabrication line is instrumented with hundreds of sensors, and the faults worth catching are rare by definition. A model that learns to call every wafer good scores well on paper and is worthless on the floor - it never raises the alarm it exists to raise. The job was to find the rare fault, and to do it somewhere an operator could actually see it.",
    investigation:
      "Two things surfaced early. The class imbalance meant headline accuracy was actively misleading as a measure of whether the model worked. And the sensor set was wide - many readings carrying little signal, adding noise and training cost without improving the decision. Both had to be handled before any model result could be believed.",
    solution:
      "A binary classification pipeline built to production standards rather than notebook standards: modular code, documented functions, and iterative testing throughout. SMOTE addressed the class imbalance so the rare fault carried real weight in training; feature selection cut the sensor set to the readings that actually separated good wafers from bad. The model ships behind a Streamlit dashboard for real-time monitoring, with logging and error handling so failures are observable instead of silent, and Power BI for the reporting view. Architecture decisions were made with mentor review, and the whole solution is documented for the team.",
    result: [
      "92% accuracy on semiconductor sensor data, with the class imbalance addressed rather than scored around.",
      "Operators get a real-time Streamlit dashboard, not a model file - the prediction reaches the person who acts on it.",
      "Logging and error handling built in from the start, so the system can be observed in production instead of trusted blindly.",
      "Documented end to end and reviewed with mentors, so the pipeline outlives whoever wrote it.",
    ],
  },
  /*
   * The two dashboards below are in-house Analytics builds, same as the AI/ML
   * pair above: no client, so nothing here says there was one.
   *
   * NEITHER carries a `stats` block or a figure from its dashboard, and this
   * is deliberate. Both were built on demo datasets - the sales dashboard
   * reports $33,007.3B of revenue across 127 orders, which is not a number
   * about anything, and the attrition dashboard's exit table is synthetic.
   * Screenshot figures are what the sample data happened to contain; publish
   * them as outcomes and the site is claiming results that never happened to
   * a business that never existed. Describe the instrument, not the readout.
   *
   * Both are also imageless. A BI dashboard case study wants a screenshot -
   * see `heroImage` on the two Website studies - but it has to be a capture
   * of the real, running report. See the note in the owner's brief before
   * adding one.
   */
  {
    slug: "electronics-sales-dashboard",
    client: "Electronics Sales Dashboard",
    sector: "Electronics Retail",
    category: "Analytics",
    year: "2026",
    isPlaceholder: false,
    summary:
      "Every number a retailer needs already exists somewhere in its sales data. The problem is that answering one question means asking someone to go and build a report.",
    services: [
      "Power BI",
      "Dashboard & Reporting",
      "Data Modelling",
      "Data Analysis",
    ],
    problem:
      "A retail operation generates the same handful of questions every week - what sold, what did not, which category carries the margin, which customers came back, what is sitting in the warehouse going stale. The data holds all of it. But when each answer is a request to whoever owns the spreadsheet, the questions stop being asked, and decisions get made on instinct because instinct is faster than waiting.",
    investigation:
      "Laid out end to end, those questions turn out to be a small number of views over the same model rather than a long list of separate reports. Revenue over time, performance by product and category, customer segment and lifetime value, channel and rep, and stock against sales velocity - all off one set of sales records. The gap was never missing data. It was that nobody could interrogate it without a middleman.",
    solution:
      "One interactive Power BI report covering revenue trend, product and category performance, customer insight, channel breakdown, and inventory - with the headline measures kept on top as cards, and date range, product category, region or store, and sales channel wired as filters across the whole page. The design decision that matters is what earns space: best-sellers sit next to worst-performing and slow-moving inventory, because knowing what is not selling changes a purchasing decision more than confirming what is. Anybody can slice it themselves; no request, no queue.",
    result: [
      "Sales, product, customer, channel and inventory questions answered from a single report rather than five ad-hoc ones.",
      "Dynamic filters let the person with the question answer it directly, instead of raising a ticket for a report.",
      "Slow-moving inventory and worst performers are given equal billing to best-sellers, so the report supports what to stop as well as what to push.",
      "Headline measures - revenue, units, average order value, gross margin, orders - stay visible on every slice.",
    ],
  },
  {
    slug: "employee-attrition-dashboard",
    client: "Employee Attrition Dashboard",
    sector: "People Analytics",
    category: "Analytics",
    year: "2026",
    isPlaceholder: false,
    summary:
      "By the time attrition shows up in an annual report, the people are gone. The useful question is not how many left - it is which teams are losing people, and why.",
    services: [
      "Dashboard & Reporting",
      "Data Analysis",
      "People Analytics",
      "Data Modelling",
    ],
    problem:
      "Attrition usually reaches leadership as a single percentage, once a quarter, long after anything can be done about it. That number cannot distinguish a resignation the company should have prevented from a planned exit, and it cannot tell you where the loss is concentrated. It reports the weather after the storm.",
    investigation:
      "Pulling exits apart showed that the headline rate hides every decision worth making. Voluntary and involuntary exits are different problems with different owners. Regrettable attrition - the people the company wanted to keep - is the figure that should drive action, and it is invisible inside the total. Concentration matters more than volume: the same overall rate means something entirely different when it clusters in one department, one job level, or under one manager. And exit reasons are the only part of the data that says what to actually change.",
    solution:
      "A monitoring dashboard built around those distinctions rather than the headline. Overall, voluntary, involuntary and regrettable rates sit alongside headcount and average tenure at exit, filterable by date range, department, job level, location and manager. Underneath, the views that locate a problem: attrition trend against an industry benchmark, churn by department, reasons for exit, tenure at exit, attrition by job level, a manager risk heatmap, and a recent-exits table carrying tenure, reason, whether the exit was regrettable, and eNPS. The trend is plotted against a benchmark for a reason - a rate means nothing until you know what normal is for the industry.",
    result: [
      "Regrettable attrition is surfaced as its own measure, so the rate that should trigger action is not averaged away inside the total.",
      "Voluntary and involuntary exits are separated, because they are different problems with different fixes.",
      "Department, job level and manager views locate where attrition concentrates - the same overall rate can mean one failing team or a company-wide drift.",
      "Exit reasons and tenure at exit are attached to the trend, so the dashboard points at a cause rather than only reporting a number.",
    ],
  },
  /*
   * NOTE: the Keystone roofing-CRM case study was removed at the owner's
   * request and must NOT be re-added. The lawn-care, clinic-booking,
   * logistics-analytics, and demand-forecasting entries were likewise
   * removed at the owner's request (2026-07) - only real, owner-approved
   * case studies belong here.
   */
];

/** Drives the Work page filter. "All" is prepended in the UI. */
export const workCategories = ["Websites", "Analytics", "AI & ML"];

export const getWorkBySlug = (slug) =>
  work.find((item) => item.slug === slug);
