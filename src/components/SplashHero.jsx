import { useCallback, useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import LogoMark from "@/components/LogoMark.jsx";
import { site } from "@/data/site.js";

/*
 * The billboard splash. A full-screen video of a blank billboard on a brick
 * wall; scrolling zooms the camera into the billboard until you are entirely
 * inside it. A paper panel - clipped to the billboard's on-screen rectangle
 * with `clip-path`, so it grows with the zoom - carries the introduction and
 * fades in over the final stretch, wiping away the video's shadow play.
 * Only after the zoom completes does the rest of the page scroll in.
 *
 * The section is SPLASH_LENGTH viewports tall with a sticky, screen-high
 * stage: the pin is what makes the zoom scroll-driven rather than timed.
 */

/** Where the billboard's white face sits in the 1920x1080 video frame. */
const BILLBOARD = {
  left: 335 / 1920,
  right: 1650 / 1920,
  top: 185 / 1080,
  bottom: 950 / 1080,
};
/** Total scroll distance of the splash, in viewport-heights. */
const SPLASH_LENGTH = 3.5;

/** Scroll-progress keyframes. */
const ZOOM_START = 0.05;
const ZOOM_END = 0.8; // fully inside the billboard from here on
const PANEL_FADE = [0.45, 0.78]; // paper wipes the shadows over this stretch

/**
 * The billboard's rectangle in screen pixels at rest, given the viewport and
 * an object-cover video fill.
 */
function billboardRect(vw, vh) {
  const k = Math.max(vw / 1920, vh / 1080);
  const w = 1920 * k;
  const h = 1080 * k;
  const ox = (vw - w) / 2;
  const oy = (vh - h) / 2;

  const left = ox + BILLBOARD.left * w;
  const right = ox + BILLBOARD.right * w;
  const top = oy + BILLBOARD.top * h;
  const bottom = oy + BILLBOARD.bottom * h;

  return {
    left,
    right,
    top,
    bottom,
    cx: (left + right) / 2,
    cy: (top + bottom) / 2,
    width: right - left,
    height: bottom - top,
  };
}

function SplashHero() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const reduceMotion = useReducedMotion();

  /*
   * Everything derives from the STAGE's box, not window.innerHeight: the
   * stage is 100vh, which mobile browsers keep stable while the URL bar
   * shows and hides, so the billboard geometry cannot drift out from under
   * the video mid-scroll (innerHeight would). Recomputed on real resizes.
   */
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    const measure = () => {
      if (!stageRef.current) return;
      const vw = stageRef.current.clientWidth;
      const vh = stageRef.current.clientHeight;
      const rect = billboardRect(vw, vh);
      const endScale =
        Math.max(vw / rect.width, vh / rect.height) * 1.03;
      /*
       * The artwork is sized for the END of the zoom - the state a visitor
       * actually reads - and then divided back out by endScale, because the
       * layer is magnified by exactly that much on the way in. Sizing it for
       * the resting frame instead would look right on the distant board and
       * then overflow the screen once you were inside it (the board is wider
       * than a phone, so the video crops it).
       */
      const type = Math.min(vw * 0.1, vh * 0.12) / endScale;
      setMetrics({
        vw,
        vh,
        rect,
        endScale,
        type,
        readable: (vw * 0.84) / endScale,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /*
   * The zoom is a scale about the viewport centre plus a drift that carries
   * the billboard's centre into the viewport centre. Both land together at
   * ZOOM_END, after which the values hold - the last stretch of scroll is
   * the arrival, not more motion.
   */
  const zoom = useCallback(
    (p) => {
      if (!metrics) return { s: 1, tx: 0, ty: 0 };
      const raw = (p - ZOOM_START) / (ZOOM_END - ZOOM_START);
      const t = Math.min(1, Math.max(0, raw));
      // easeInOut keeps the take-off and the landing gentle.
      const e = t * t * (3 - 2 * t);
      const s = 1 + (metrics.endScale - 1) * e;
      const cx = metrics.vw / 2;
      const cy = metrics.vh / 2;
      return {
        s,
        tx: -e * s * (metrics.rect.cx - cx),
        ty: -e * s * (metrics.rect.cy - cy),
      };
    },
    [metrics],
  );

  const scale = useTransform(scrollYProgress, (p) => zoom(p).s);
  const x = useTransform(scrollYProgress, (p) => zoom(p).tx);
  const y = useTransform(scrollYProgress, (p) => zoom(p).ty);

  /* All transforms use the explicit function form: mixing framer's
     range form onto the same source proved unreliable at the extremes. */
  const ramp = (p, from, to) =>
    Math.min(1, Math.max(0, (p - from) / (to - from)));

  const panelOpacity = useTransform(scrollYProgress, (p) =>
    ramp(p, PANEL_FADE[0], PANEL_FADE[1]),
  );

  /* The opening caption and scroll cue bow out as the zoom takes over. */
  const cueOpacity = useTransform(
    scrollYProgress,
    (p) => 1 - ramp(p, 0, 0.18),
  );

  /*
   * Reduced motion (which is also how the prerender snapshots the page for
   * crawlers): no pin, no zoom - the billboard panel is simply there, intro
   * readable, one viewport tall.
   *
   * The height must be settled at FIRST paint and never change: useScroll
   * measures the section once, and a height that flips when metrics arrive
   * leaves the scroll progress pinned to a stale measurement.
   */
  const still = reduceMotion;

  return (
    <section
      ref={sectionRef}
      data-splash=""
      aria-label={`${site.name} - introduction`}
      className="relative -mt-20 bg-ink"
      style={{ height: still ? "100svh" : `${SPLASH_LENGTH * 100}vh` }}
    >
      {/* The stage's height must match the unit the section uses, or the
          reduced-motion panel would overhang the section on mobile. */}
      <div
        ref={stageRef}
        className="sticky top-0 overflow-hidden"
        style={{ height: still ? "100svh" : "100vh" }}
      >
        {/*
          Reduced motion (and so the prerender, which crawlers and the very
          first paint see): no video, no pinning, no measured pixels. Just the
          lockup on paper, centred by flow. It must NOT depend on `metrics`:
          those are absolute pixels measured against whatever viewport did the
          prerendering, and baking a 1280px lockup into the HTML would flash
          on every phone before React took over.
        */}
        {still ? (
          <div className="flex h-full flex-col items-center justify-center gap-6 bg-paper px-6 text-center text-ink">
            <LogoMark className="h-24 w-24 text-brand md:h-28 md:w-28" />
            <h1 className="font-display text-display tracking-display">
              {site.name}
            </h1>
            <p
              className="max-w-2xl text-balance text-xl font-light leading-snug md:text-3xl"
              style={{
                fontFamily: "'Montserrat', 'Manrope', system-ui, sans-serif",
              }}
            >
              {site.motto}
            </p>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-faint">
              {site.positioning}
            </p>
          </div>
        ) : (
          /*
            ONE transformed group holds the whole billboard: the video, the
            paper face, and the artwork printed on it. That is not a stylistic
            choice - `mix-blend-mode` only blends within its own stacking
            context, and a transform creates one. Split across two transformed
            wrappers, the artwork would blend against nothing (i.e. render as
            `normal`) the instant the scale left 1, and the shadows would pop
            off it mid-zoom. Inside a single group it blends against its
            siblings below: the video's shadowed white face at rest, the paper
            panel once that has faded in.

            Because all three layers ride the same transform, the paper face
            and the artwork are simply positioned at the billboard's RESTING
            rectangle - the zoom carries them, so they stay pasted to the board
            with no per-frame geometry of their own.
          */
          <motion.div style={{ scale, x, y }} className="absolute inset-0">
            <video
              src="/splashvideo.mp4"
              poster="/splash-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              tabIndex={-1}
              className="h-full w-full object-cover"
            />

            {metrics && (
              <>
                {/* The board's paper face: transparent at rest (you see the
                    video's own white face and its shadow play), opaque by the
                    time the zoom lands - which is what wipes the shadows. */}
                <motion.div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: metrics.rect.left,
                    top: metrics.rect.top,
                    width: metrics.rect.width,
                    height: metrics.rect.height,
                    opacity: panelOpacity,
                  }}
                  className="bg-paper"
                />

                <div
                  style={{
                    position: "absolute",
                    left: metrics.rect.left,
                    top: metrics.rect.top,
                    width: metrics.rect.width,
                    height: metrics.rect.height,
                    mixBlendMode: "multiply",
                  }}
                  className="flex flex-col items-center justify-center px-[4%] text-center text-ink"
                >
                  <LogoMark
                    className="text-brand"
                    style={{
                      width: metrics.type * 1.15,
                      height: metrics.type * 1.15,
                    }}
                  />
                  <h1
                    className="font-display tracking-display"
                    style={{
                      marginTop: metrics.type * 0.35,
                      fontSize: metrics.type,
                      lineHeight: 1,
                    }}
                  >
                    {site.name}
                  </h1>
                  <p
                    className="font-light leading-snug"
                    style={{
                      marginTop: metrics.type * 0.4,
                      maxWidth: metrics.readable,
                      fontSize: metrics.type * 0.33,
                      fontFamily:
                        "'Montserrat', 'Manrope', system-ui, sans-serif",
                    }}
                  >
                    {site.motto}
                  </p>
                  <p
                    className="font-mono uppercase text-ink-faint"
                    style={{
                      marginTop: metrics.type * 0.35,
                      maxWidth: metrics.readable,
                      fontSize: metrics.type * 0.13,
                      letterSpacing: "0.18em",
                    }}
                  >
                    {site.positioning}
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Opening caption + scroll cue, gone once the zoom begins. */}
        {!still && (
          <motion.div
            style={{ opacity: cueOpacity }}
            className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-3"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper">
              Scroll
            </p>
            <span
              aria-hidden="true"
              className="h-10 w-px animate-pulse bg-paper"
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default SplashHero;
