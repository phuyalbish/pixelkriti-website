import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Client-side navigation preserves scroll position; a new page should not. */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

export default ScrollToTop;
