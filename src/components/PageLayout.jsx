import { Outlet, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Header from "@/components/Header.jsx";
import Footer from "@/components/Footer.jsx";
import ScrollToTop from "@/components/ScrollToTop.jsx";
import SmoothScroll from "@/components/SmoothScroll.jsx";
import StickyCta from "@/components/StickyCta.jsx";

function PageLayout() {
  const { pathname } = useLocation();
  const reduceMotion = useReducedMotion();

  return (
    <div className="flex min-h-screen flex-col">
      <SmoothScroll />
      <ScrollToTop />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-6 focus:z-50 focus:rounded-full focus:bg-paper focus:px-5 focus:py-2 focus:text-sm focus:text-ink"
      >
        Skip to content
      </a>
      {/* The home hero carries its own nav; the global header stands down there. */}
      {pathname !== "/" && <Header />}
      {/*
        Keyed by pathname so each navigation remounts the wrapper and replays
        the entrance. Enter-only on purpose: exit animations with a router mean
        keeping the old page's tree alive mid-transition, real complexity for
        ~200ms of polish.
      */}
      <motion.main
        key={pathname}
        id="main"
        className="flex-1"
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <Outlet />
      </motion.main>
      <Footer />
      <StickyCta />
    </div>
  );
}

export default PageLayout;
