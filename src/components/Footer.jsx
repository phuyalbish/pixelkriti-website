import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import Container from "@/components/Container.jsx";
import Logo from "@/components/Logo.jsx";
import SocialLinks from "@/components/SocialLinks.jsx";
import LogoOutline from "@/components/LogoOutline.jsx";
import { nav, site } from "@/data/site.js";

function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line">
      {/* Watermark, cropped by the bottom-right corner. */}
      <LogoOutline className="absolute -bottom-32 -right-24 hidden h-[26rem] w-[26rem] rotate-6 sm:block" />

      <Container className="relative py-16 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo size="large" />
            {/* `flex w-fit`, not `inline-flex`: the Logo above is itself an
                inline-flex link, so two inline boxes in a row sit on the SAME
                line and collide. A block-level flex starts its own line; w-fit
                keeps the target the width of the address rather than the whole
                column. (The positioning line that used to separate them was
                doing this job by accident.) */}
            <a
              href={`mailto:${site.email}`}
              className="mt-8 flex w-fit items-center gap-2 font-display text-2xl transition-colors hover:text-paper-dim md:text-3xl"
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
          <p className="max-w-md text-pretty text-sm leading-relaxed text-paper-dim">
            {site.footerTagline}
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
