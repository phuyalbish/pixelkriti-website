import { useEffect } from "react";
import Lenis from "lenis";
import { useReducedMotion } from "framer-motion";
import { setLenis } from "@/lib/scroll.js";

/**
 * Lenis inertia scrolling for the whole document.
 *
 * Skipped entirely under reduced motion - native scrolling IS the
 * reduced-motion behaviour, so there is nothing to substitute.
 */
function SmoothScroll() {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return undefined;

    const lenis = new Lenis({ autoRaf: true, duration: 1.05 });
    setLenis(lenis);
    return () => {
      lenis.destroy();
      setLenis(null);
    };
  }, [reduceMotion]);

  return null;
}

export default SmoothScroll;
