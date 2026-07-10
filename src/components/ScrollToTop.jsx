import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToInstant, scrollToElement } from "@/lib/scroll.js";

/**
 * Client-side navigation preserves scroll position; a new page should not.
 * Links with a hash (e.g. /services#ai) land on that section instead of the
 * top. The retry loop covers targets that mount a frame or two after the
 * route swaps in.
 */
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      scrollToInstant(0);
      return;
    }

    let attempts = 0;
    let frame;
    const seek = () => {
      const target = document.getElementById(hash.slice(1));
      if (target) scrollToElement(target);
      else if (attempts++ < 10) frame = requestAnimationFrame(seek);
    };
    seek();
    return () => cancelAnimationFrame(frame);
  }, [pathname, hash]);

  return null;
}

export default ScrollToTop;
