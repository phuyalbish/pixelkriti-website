import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import Container from "@/components/Container.jsx";
import Logo from "@/components/Logo.jsx";
import { nav } from "@/data/site.js";

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A route change while the drawer is open would otherwise leave it stuck.
  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const linkClass = ({ isActive }) =>
    `text-sm transition-colors duration-300 hover:text-paper ${
      isActive ? "text-paper" : "text-paper-dim"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-500 ease-out ${
        scrolled ? "border-b border-line bg-ink/85 backdrop-blur-md" : ""
      }`}
    >
      <Container className="flex h-20 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-10 md:flex">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
          <Link
            to="/contact"
            className="rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-300 hover:bg-white"
          >
            Book a Free Consultation
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="-mr-2 p-2 text-paper md:hidden"
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </Container>

      {menuOpen && (
        <div className="fixed inset-x-0 top-20 bottom-0 z-40 border-t border-line bg-ink md:hidden">
          <Container className="flex flex-col gap-2 py-8">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `border-b border-line py-5 font-display text-3xl transition-colors ${
                    isActive ? "text-paper" : "text-paper-dim"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              className="mt-6 rounded-full bg-paper px-6 py-4 text-center text-sm font-medium text-ink"
            >
              Book a Free Consultation
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}

export default Header;
