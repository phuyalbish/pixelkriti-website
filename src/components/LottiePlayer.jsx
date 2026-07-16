import { useEffect, useRef } from "react";

/**
 * Plays a Lottie document into whatever box it is given.
 *
 * With `progress` (a MotionValue in 0..1) the document does not play on a clock
 * at all - its frame is driven straight off that value, `cycles` times over the
 * full range. That is what ties a walk cycle to travel rather than to time: the
 * legs move because you scrolled, and the figure freezes mid-stride the moment
 * you stop, instead of jogging on the spot. Without `progress` it loops.
 *
 * The player is imported lazily, so it never lands in the initial bundle and
 * never runs during the prerender, which has no DOM to draw into. Callers that
 * position on scroll should mount this inside their own positioned wrapper -
 * this component only draws, it does not place.
 */
function LottiePlayer({
  animationData,
  className = "",
  loop = true,
  progress,
  cycles = 1,
  startAt = 0,
  speed = 1,
}) {
  const hostRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe;

    import("lottie-web/build/player/lottie_light.min.js").then((mod) => {
      if (cancelled || !hostRef.current || animRef.current) return;
      const lottie = mod.default ?? mod;
      const anim = lottie.loadAnimation({
        container: hostRef.current,
        renderer: "svg",
        loop: progress ? false : loop,
        autoplay: !progress,
        animationData,
        rendererSettings: { preserveAspectRatio: "xMidYMid meet" },
      });
      animRef.current = anim;

      if (!progress) {
        /* `startAt` and `speed` let two copies of one document run out of step,
           which is the only thing stopping a pair of them from reading as a
           mirror. Seeking must wait for DOMLoaded - before that totalFrames is
           0 and the seek lands on frame 0, which is where it started. */
        if (speed !== 1) anim.setSpeed(speed);
        if (startAt > 0) {
          const seek = () => anim.goToAndPlay(startAt * anim.totalFrames, true);
          anim.addEventListener("DOMLoaded", seek);
          if (anim.totalFrames) seek();
        }
        return;
      }

      const draw = (value) => {
        const total = anim.totalFrames;
        if (!total) return;
        /* Wrap rather than clamp: the cycle repeats along the journey, and a
           modulo keeps the stride continuous across each repeat. */
        const frame = (((value * cycles) % 1) + 1) % 1;
        anim.goToAndStop(frame * total, true);
      };

      anim.addEventListener("DOMLoaded", () => draw(progress.get()));
      draw(progress.get());
      unsubscribe = progress.on("change", draw);
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
      animRef.current?.destroy();
      animRef.current = null;
    };
  }, [animationData, loop, progress, cycles, startAt, speed]);

  return <div ref={hostRef} aria-hidden="true" className={className} />;
}

export default LottiePlayer;
