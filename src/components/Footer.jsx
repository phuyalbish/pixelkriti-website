import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import Container from "@/components/Container.jsx";
import Logo from "@/components/Logo.jsx";
import SocialLinks from "@/components/SocialLinks.jsx";
import LogoOutline from "@/components/LogoOutline.jsx";
import { nav, site } from "@/data/site.js";
import { promise } from "@/data/content.js";

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      {/* Watermark, cropped by the bottom-right corner. */}
      <LogoOutline className="absolute -bottom-32 -right-24 hidden h-[26rem] w-[26rem] rotate-6 sm:block" />

      {/*
        The page opened on this sentence and it closes on it. Outlined rather
        than filled, so it signs off without competing with the promise section
        that stated it - the same word, quieter, at the end of the argument.
      */}
      <Container className="relative pt-20 md:pt-28">
        <p
          aria-hidden="true"
          className="select-none whitespace-pre-line font-display text-mega tracking-display text-transparent [-webkit-text-stroke:1px_var(--line-strong)]"
        >
          {promise.line}
        </p>
      </Container>

      <Container className="relative py-16 md:py-20">
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

          <div className="md:col-span-3 md:col-start-7">
            <h2 className="eyebrow">Follow</h2>
            <SocialLinks className="mt-6" />
          </div>

          <div className="md:col-span-3 md:col-start-10">
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
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-line pt-8 md:flex-row md:items-baseline md:justify-between">
          {/* Locked boilerplate (brand guide 2.5). */}
          <p className="max-w-md text-pretty text-sm leading-relaxed text-paper-dim">
            {site.boilerplate}
          </p>
          <p className="font-mono text-xs text-paper-faint">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
