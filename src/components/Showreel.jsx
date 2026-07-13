import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { showreel } from "@/data/site.js";

/**
 * The video section after the hero: a half-width clip on a paper ground.
 * Two sources, one look: a YouTube
 * embed when `showreel.youtubeId` is set, a self-hosted file otherwise. Either
 * way it behaves as a background - autoplaying, muted, looped, no player
 * chrome - with our own unmute button as the only control.
 */

/** YouTube's iframe answers play-control commands sent via postMessage. */
function commandYouTube(iframe, func) {
  iframe?.contentWindow?.postMessage(
    JSON.stringify({ event: "command", func, args: [] }),
    "*",
  );
}

function Showreel() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const iframeRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const [muted, setMuted] = useState(true);
  const isYouTube = Boolean(showreel.youtubeId);

  /*
   * The embed pulls well over a megabyte of player and video. Mounting it only
   * as the section approaches keeps all of that off the critical path - the
   * aspect-ratio box below holds the layout either way, so nothing shifts.
   */
  const nearViewport = useInView(sectionRef, {
    once: true,
    margin: "0px 0px 600px 0px",
  });

  /**
   * React does not serialise the `muted` attribute, so a `muted` prop alone can
   * leave the element unmuted on first paint - which makes the browser refuse to
   * autoplay. Setting the DOM property directly is the reliable way.
   */
  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
    if (isYouTube) commandYouTube(iframeRef.current, muted ? "mute" : "unMute");
  }, [muted, isYouTube]);

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
  // The container itself grows from its half-width footprint to full width
  // as you scroll; the height follows through the aspect ratio. Real width,
  // not a scale transform, so the video is never stretched or cropped.
  const width = useTransform(progress, [0, 1], ["55%", "100%"]);
  const y = useTransform(progress, [0, 1], [40, 0]);
  const opacity = useTransform(progress, [0, 0.6], [0.55, 1]);

  /*
   * The width animation only applies on desktop, where the resting footprint
   * is half the row; on mobile the video is already full width.
   */
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const update = () => setDesktop(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const motionStyle = reduceMotion
    ? undefined
    : desktop
      ? { rotateX, y, opacity, width }
      : { rotateX, y, opacity };

  if (!showreel.youtubeId && !showreel.src) return null;

  /*
   * loop only works with `playlist` set to the same video; enablejsapi is what
   * lets the unmute button talk to the player. Everything else strips chrome.
   */
  const youtubeSrc =
    `https://www.youtube-nocookie.com/embed/${showreel.youtubeId}` +
    `?autoplay=1&mute=1&loop=1&playlist=${showreel.youtubeId}` +
    `&controls=0&playsinline=1&rel=0&iv_load_policy=3&disablekb=1&enablejsapi=1`;

  return (
    <section
      ref={sectionRef}
      aria-label="Portfolio showreel"
      className="relative bg-paper py-10 md:py-32"
    >
      {/*
        A paper interlude between ink sections: the video sits contained at
        half width, not full-bleed. `overflow-hidden` stays so the tilt cannot
        push the video's corners past the viewport and introduce a horizontal
        scrollbar.
      */}
      <div style={{ perspective: "1200px" }} className="overflow-hidden px-6">
        <motion.div
          style={motionStyle}
          className="relative mx-auto w-full origin-center bg-ink-raised will-change-transform md:w-[55%]"
        >
          {isYouTube ? (
            <div className="relative aspect-video w-full">
              {/*
                pointer-events-none makes it scenery: YouTube's own hover UI
                can never appear, and clicks fall through to the page. The
                mute button below is the whole control surface.
              */}
              {nearViewport && (
                <iframe
                  ref={iframeRef}
                  src={youtubeSrc}
                  title="Portfolio showreel"
                  allow="autoplay; encrypted-media"
                  loading="lazy"
                  tabIndex={-1}
                  className="pointer-events-none absolute inset-0 h-full w-full"
                />
              )}
            </div>
          ) : (
            <video
              ref={videoRef}
              className="block aspect-video w-full object-cover"
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
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 px-5 pb-5">
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
