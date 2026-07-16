import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiMenu, FiX } from "react-icons/fi";
import Container from "@/components/Container.jsx";
import Logo from "@/components/Logo.jsx";
import { nav } from "@/data/site.js";

/**
 * Sticky header that steps aside while you read: scrolling down slides it away,
 * any upward scroll brings it straight back. The 160px grace zone keeps it
 * pinned near the top, and an open drawer pins it unconditionally - hiding the
 * bar would orphan the close button.
 */
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 12);
      setHidden(y > 160 && y > lastY.current);
      lastY.current = y;
    };
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

  /*
   * The underline lives on ::after and grows from the left on hover; on the
   * active link it stays fully drawn. Colour and transform both transition.
   */
  /* Both states are drawn at full paper: the underline carries "where you are",
     so the colour does not have to, and dimming the rest cost legibility for a
     distinction the underline already makes. */
  const linkClass = ({ isActive }) =>
    `relative text-sm text-paper transition-colors duration-300 ` +
    `after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full ` +
    `after:origin-left after:bg-paper after:transition-transform after:duration-300 after:ease-out ` +
    `${isActive ? "after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"}`;

  return (
    <header
      /*
       * The blur must drop while the drawer is open: backdrop-filter makes the
       * header the containing block for fixed descendants, which would pin the
       * drawer's `top-20 bottom-0` to the header's own 80px box - a 1px-tall
       * background with the menu links spilling over the transparent page.
       */
      /*
       * NOT `bg-ink/85`. The colour tokens are `var(--ink)`, and Tailwind
       * cannot compute an alpha over a var() - it emits no rule at all for the
       * opacity modifier, so that class was silently nothing and the bar
       * painted transparent over every section it crossed. color-mix does the
       * blend the modifier could not, and keeps the token.
       */
      className={`sticky top-0 z-50 transition-[background-color,border-color,transform] duration-500 ease-out ${
        menuOpen
          ? "border-b border-line bg-ink"
          : scrolled
            ? "border-b border-line bg-[color-mix(in_srgb,var(--ink)_85%,transparent)] backdrop-blur-md"
            : ""
      } ${hidden && !menuOpen && !reduceMotion ? "-translate-y-full" : ""}`}
    >
      <Container className="flex h-20 items-center justify-between">
        <Logo size="small" />

        <nav className="hidden items-center gap-10 md:flex">
          {nav.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
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

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed inset-x-0 top-20 bottom-0 z-40 border-t border-line bg-ink md:hidden"
          >
            <Container className="flex flex-col gap-2 py-8">
              {nav.map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.05 + index * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <NavLink
                    to={item.to}
                    className={({ isActive }) =>
                      `block border-b border-line py-5 font-display text-3xl transition-colors ${
                        isActive ? "text-paper" : "text-paper-dim"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: 0.05 + nav.length * 0.06,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Link
                  to="/contact"
                  className="group relative isolate mt-6 block overflow-hidden rounded-full bg-paper px-6 py-4 text-center text-sm font-medium text-ink"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 -z-10 -translate-x-full bg-brand transition-transform duration-300 ease-out group-hover:translate-x-0"
                  />
                  Book a Free Consultation
                </Link>
              </motion.div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Header;
