import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { showreel } from "@/data/site.js";

function Showreel() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [muted, setMuted] = useState(true);

  /**
   * React does not serialise the `muted` attribute, so a `muted` prop alone can
   * leave the element unmuted on first paint - which makes the browser refuse to
   * autoplay. Setting the DOM property directly is the reliable way.
   */
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  // Tracks the section from entering the viewport until it is centred.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  // Smooths the raw scroll value so the tilt eases rather than tracks 1:1.
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  const rotateX = useTransform(progress, [0, 1], [7, 0]);
  const scale = useTransform(progress, [0, 1], [0.94, 1]);
  const y = useTransform(progress, [0, 1], [40, 0]);
  const opacity = useTransform(progress, [0, 0.6], [0.55, 1]);

  const motionStyle = reduceMotion ? undefined : { rotateX, scale, y, opacity };

  if (!showreel.src) return null;

  return (
    <section
      ref={sectionRef}
      aria-label="Portfolio showreel"
      className="relative"
    >
      {/*
        Full-bleed: no Container, no border, no radius. `overflow-hidden` stays
        so the tilt cannot push the video's corners past the viewport and
        introduce a horizontal scrollbar.
      */}
      <div style={{ perspective: "1200px" }} className="overflow-hidden">
        <motion.div
          style={motionStyle}
          className="relative origin-center bg-ink-raised will-change-transform"
        >
          <video
            ref={videoRef}
            className="block aspect-video max-h-[85vh] w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={showreel.poster ?? undefined}
            // Not a control surface: the unmute button below is the affordance.
            tabIndex={-1}
          >
            <source src={showreel.src} type="video/mp4" />
          </video>

          {/*
            Blends the video into the page: the page colour at the top edge, and
            back to it at the bottom edge, so a full-bleed clip has no hard seam.
            Non-interactive so it never eats a click.
          */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink to-transparent md:h-32"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink to-transparent md:h-32"
          />

          {/* Gutters match Container, so the caption lines up with page copy. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-6 pb-6 sm:px-10 md:px-16 md:pb-8 lg:px-24">
            {showreel.caption && (
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper-dim">
                {showreel.caption}
              </p>
            )}

            <button
              type="button"
              onClick={() => setMuted((value) => !value)}
              aria-pressed={!muted}
              aria-label={muted ? "Unmute showreel" : "Mute showreel"}
              className="pointer-events-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-strong bg-ink/70 text-paper backdrop-blur-sm transition-colors duration-300 hover:bg-ink"
            >
              {muted ? (
                <FiVolumeX aria-hidden="true" size={17} />
              ) : (
                <FiVolume2 aria-hidden="true" size={17} />
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Showreel;
