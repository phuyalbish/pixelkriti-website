import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

/**
 * The consultation offer, kept within reach. Appears once the splash-height
 * CTA has scrolled away, so it never doubles the button already on screen,
 * and stays out of the contact page - it would link to where you already are.
 *
 * z-30 keeps it under the header (z-50) and the mobile drawer (z-40).
 */
function StickyCta() {
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const visible = pastHero && pathname !== "/contact";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: 24, scale: 0.9 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 right-5 z-30 md:bottom-8 md:right-8"
        >
          <Link
            to="/contact"
            aria-label="Book a Free Consultation"
            className="group relative isolate flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-paper text-ink shadow-[0_8px_30px_rgba(0,0,0,0.45)] transition-transform duration-300 active:scale-[0.97]"
          >
            {/* Same green wipe as the primary Button, kept in step with it. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 -translate-x-full bg-brand transition-transform duration-300 ease-out group-hover:translate-x-0"
            />
            <FiArrowUpRight
              aria-hidden="true"
              size={22}
              className="transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default StickyCta;
