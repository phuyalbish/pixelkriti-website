import { useEffect, useRef, useState } from "react";
import { motionValue } from "framer-motion";
import LottiePlayer from "@/components/LottiePlayer.jsx";

/**
 * A Lottie that fetches its own artwork, and only once it is worth fetching.
 *
 * `load` is a function returning a dynamic import of the document. Vite splits
 * each one into its own chunk, so nothing is downloaded until this card is
 * near the viewport - which matters here because the documents are large
 * (hundreds of KB of shapes and embedded PNGs) and sit well below the fold. A
 * plain import would put all of them in the bundle that draws the top of the
 * page, where they would delay the thing the visitor is actually looking at.
 *
 * `still` draws the artwork and stops, for readers who asked not to be moved.
 * They get the picture rather than the animation - which is the request - where
 * skipping it entirely would leave them looking at an empty hole where everyone
 * else sees the thing being described.
 *
 * The card holds its shape from the first paint, so the artwork arriving never
 * moves the page: the caller sizes the box, and this only ever fills it.
 *
 * `data-lottie` marks the artwork for removal from the prerender snapshot,
 * which is captured under reduced motion and would otherwise bake every one of
 * these documents into the HTML as base64 - see scripts/prerender.mjs.
 */

/* One frozen position, shared: mid-document, where an animation built to
   arrive at something has generally arrived. A MotionValue that never changes
   is what LottiePlayer reads as "hold this frame". Module scope so it is the
   same value every render, and so every still card shares the one. */
const STILL = motionValue(0.5);

function LottieCard({ load, className = "", still = false }) {
  const boxRef = useRef(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    const node = boxRef.current;
    if (!node) return undefined;

    let cancelled = false;
    const fetchIt = () => {
      load().then((mod) => {
        /* `mod?.` and the trailing null: a loader is allowed to resolve to
           null to mean "there is nothing fit to draw" - see onePlatform, which
           refuses the document rather than render a stranger's logo. */
        if (!cancelled) setData(mod?.default ?? mod ?? null);
      });
    };

    /* No IntersectionObserver (old Safari, and jsdom in tests): fetch now
       rather than never showing the artwork at all. */
    if (typeof IntersectionObserver === "undefined") {
      fetchIt();
      return () => {
        cancelled = true;
      };
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect(); // one fetch, ever
        fetchIt();
      },
      /* A screen's warning, so the animation is running by the time it is
         scrolled to rather than starting once it is already being read. */
      { rootMargin: "600px 0px" },
    );

    io.observe(node);
    return () => {
      cancelled = true;
      io.disconnect();
    };
  }, [load]);

  return (
    <div ref={boxRef} data-lottie className={`h-full w-full ${className}`}>
      {data && (
        <LottiePlayer
          animationData={data}
          className="h-full w-full"
          progress={still ? STILL : undefined}
        />
      )}
    </div>
  );
}

export default LottieCard;
