import { useState } from "react";
import { FiArrowUpRight, FiChevronDown } from "react-icons/fi";
import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import usePageMeta from "@/hooks/usePageMeta.js";
import { regions, site } from "@/data/site.js";
import { tiers } from "@/data/services.js";

const fieldClass =
  "w-full border-b border-line bg-transparent py-4 text-paper placeholder:text-paper-faint transition-colors focus:border-paper focus:outline-none";

const emptyForm = {
  name: "",
  email: "",
  company: "",
  tier: "",
  message: "",
};

function ContactPage() {
  usePageMeta(
    "Contact",
    "Tell us the problem. A first conversation with Pixel Kriti costs nothing and ends with a straight answer.",
  );

  const [form, setForm] = useState(emptyForm);

  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  /**
   * The site is a static build with no backend, so submission hands off to the
   * visitor's mail client with the enquiry prefilled. Swap this for a POST to a
   * form endpoint (Formspree, Netlify Forms, or similar) when one exists.
   */
  const handleSubmit = (event) => {
    event.preventDefault();

    const subject = `New enquiry — ${form.name}${
      form.company ? ` (${form.company})` : ""
    }`;

    const body = [
      `Name: ${form.name}`,
      `Email: ${form.email}`,
      form.company && `Company: ${form.company}`,
      form.tier && `Engagement: ${form.tier}`,
      "",
      form.message,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section className="pb-24 pt-20 md:pb-32 md:pt-28">
      <Container className="grid gap-16 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <Reveal>
            <p className="eyebrow">Contact</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="mt-6 text-balance font-display text-display tracking-display">
              Start with the problem.
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-8 max-w-prose text-pretty leading-relaxed text-paper-dim">
              Not the solution you have in mind, and not the budget. Tell us
              what is not working, and we will tell you what we would build —
              even when the answer is nothing at all.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-12 border-t border-line pt-8">
              <p className="eyebrow">Email</p>
              <a
                href={`mailto:${site.email}`}
                className="mt-3 inline-flex items-center gap-2 font-display text-2xl transition-colors hover:text-paper-dim"
              >
                {site.email}
                <FiArrowUpRight
                  aria-hidden="true"
                  className="text-paper-faint"
                />
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-8 border-t border-line pt-8">
              <p className="eyebrow">Where we are</p>
              <ul className="mt-3 space-y-2">
                {regions.map((region) => (
                  <li key={region.country} className="text-sm text-paper-dim">
                    {region.country}
                    <span className="ml-2 text-paper-faint">{region.note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="md:col-span-6 md:col-start-7">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="name" className="eyebrow">
                Your name
              </label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={update("name")}
                placeholder="Jane Doe"
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="email" className="eyebrow">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={update("email")}
                placeholder="jane@company.com"
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="company" className="eyebrow">
                Company <span className="normal-case">(optional)</span>
              </label>
              <input
                id="company"
                type="text"
                autoComplete="organization"
                value={form.company}
                onChange={update("company")}
                placeholder="Company name"
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="tier" className="eyebrow">
                Engagement <span className="normal-case">(optional)</span>
              </label>
              <div className="relative">
                <select
                  id="tier"
                  value={form.tier}
                  onChange={update("tier")}
                  className={`${fieldClass} cursor-pointer appearance-none pr-8`}
                >
                  <option value="" className="bg-ink">
                    Not sure yet
                  </option>
                  {tiers.map((tier) => (
                    <option key={tier.id} value={tier.name} className="bg-ink">
                      {tier.name}
                    </option>
                  ))}
                </select>
                <FiChevronDown
                  aria-hidden="true"
                  className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-paper-faint"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="eyebrow">
                What is not working?
              </label>
              <textarea
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={update("message")}
                placeholder="Describe the problem in your own words."
                className={`${fieldClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-paper px-6 py-4 text-sm font-medium text-ink transition-colors duration-300 hover:bg-white sm:w-auto"
            >
              Send enquiry
              <FiArrowUpRight
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>

            <p className="font-mono text-[11px] leading-relaxed text-paper-faint">
              This opens your email client with the enquiry prefilled. Prefer to
              write directly? {site.email}
            </p>
          </form>
        </Reveal>
      </Container>
    </section>
  );
}

export default ContactPage;
