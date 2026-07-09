import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scrollToInstant } from "@/lib/scroll.js";

/** Client-side navigation preserves scroll position; a new page should not. */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToInstant(0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
