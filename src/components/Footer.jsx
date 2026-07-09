import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import Container from "@/components/Container.jsx";
import Logo from "@/components/Logo.jsx";
import { nav, regions, site } from "@/data/site.js";

function Footer() {
  return (
    <footer className="border-t border-line">
      <Container className="py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-6 max-w-xs text-pretty text-sm leading-relaxed text-paper-dim">
              {site.positioning}
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-8 inline-flex items-center gap-2 font-display text-2xl transition-colors hover:text-paper-dim md:text-3xl"
            >
              {site.email}
              <FiArrowUpRight aria-hidden="true" className="text-paper-faint" />
            </a>
          </div>

          <div className="md:col-span-3 md:col-start-8">
            <h2 className="eyebrow">Navigate</h2>
            <ul className="mt-6 space-y-3">
              {nav.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-sm text-paper-dim transition-colors hover:text-paper"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h2 className="eyebrow">Where we are</h2>
            <ul className="mt-6 space-y-3">
              {regions.map((region) => (
                <li key={region.country} className="text-sm text-paper-dim">
                  {region.country}
                  <span className="ml-2 text-paper-faint">{region.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-xs text-paper-faint">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-xs text-paper-faint transition-colors hover:text-paper"
          >
            LinkedIn
          </a>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
