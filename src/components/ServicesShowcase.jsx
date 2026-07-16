import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import {
  AnimatePresence,
  motion,
  motionValue,
  useAnimationFrame,
  useReducedMotion,
} from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import SectionHeading from "@/components/SectionHeading.jsx";
import LottiePlayer from "@/components/LottiePlayer.jsx";
import LottieCard from "@/components/LottieCard.jsx";
import birds from "@/data/lottie/Birds.json";
import windGust from "@/data/lottie/WeatherWind.json";
import { SERVICE_ART, SERVICE_ART_SHAPE } from "@/lib/serviceArt.js";
import { pillars } from "@/data/services.js";

/**
 * The three service pillars as a wash hung out to dry: a thread dangling across
 * the screen, each card a garment pegged to it, and a breeze that moves them.
 *
 * The motion is simulated, not keyframed. Each garment is a damped pendulum
 * pivoting at its peg:
 *
 *   th'' = -K (th - rest) - C th' + torque(wind)
 *
 * and the wind is one shared signal: a gust is born, travels across the section
 * at a fixed speed, and each card feels its torque only once the front arrives
 * at that card's x. The wind used to draw itself as streaks sweeping past; it
 * is now shown by the plant standing in it, which reads as weather rather than
 * as annotation. The signal itself is unchanged.
 *
 * Cloth-ness comes from the skew: fabric lags its peg, so the card skews
 * against the direction it is being swung (proportional to angular velocity,
 * clamped). Under reduced motion none of this runs - the wash hangs still at
 * its resting tilt and the scenery does not mount.
 */


/*
 * The clothesline geometry.
 *
 * The thread runs the full width of the SCREEN and dangles: a line under its
 * own weight sags, and a taut straight one reads as a rule someone drew rather
 * than as something a garment could hang from. It is a quadratic through the
 * two edges with the control point dropped below the chord, which is a close
 * enough catenary at this span and costs nothing to evaluate.
 *
 * The card tops are NOT constants any more, and cannot be: the thread is
 * measured against the viewport while the cards sit on the shell grid, so where
 * a peg meets the curve moves with every breakpoint. They are measured at
 * runtime instead - see the layout effect. The old fixed tops agreed with the
 * old straight line at exactly one width.
 */
const THREAD_H = 170; // px - the box the thread is drawn in
const THREAD_EDGE = { left: 152, right: 12 }; // where it is pinned, screen edges
const THREAD_SAG = 46; // px the middle hangs below the straight chord
const THREAD_WEIGHT = 3; // px - the thread's own thickness

/* A quadratic's midpoint sits halfway between the chord and the control point,
   so the control has to go twice the sag below the chord to land the sag. */
const THREAD_CTRL =
  (THREAD_EDGE.left + THREAD_EDGE.right) / 2 + 2 * THREAD_SAG;

/** The thread's height at `t`, a fraction of the screen's width. */
const threadY = (t) =>
  (1 - t) ** 2 * THREAD_EDGE.left +
  2 * (1 - t) * t * THREAD_CTRL +
  t ** 2 * THREAD_EDGE.right;

/* The peg straddles its card's top edge (-top-4, h-6), so its throat - where
   the thread actually crosses - sits 4px above the card. */
const PEG_THROAT = 4;

const HANG_MD_TOP = [126, 81, 36]; // the first paint, before the measure lands
const HANG_TILT_DEG = [-2.2, 1.8, -1.6];

/** One cloth, for all three. */
const CLOTH_COLOR = "#dededc";

/* ---- The breeze ---------------------------------------------------------
 * All tunables in one place. Angles in radians, times in seconds, x in
 * fractions of the hanging area's width.
 */
const K = 22; // pendulum stiffness: how urgently a garment seeks rest
const C = 2.0; // damping: underdamped, so a gust rings a few times
const TORQUE = 0.2; // how hard the wind pushes a garment, per unit of gust
const SKEW_LAG = 0.18; // deg of skew per deg/s of angular velocity
const SKEW_MAX = 5; // fabric shears only so far
const BILLOW = 2.0; // deg of out-of-plane bow per unit of wind pressure
const BILLOW_MAX = 12; // the cloth bellies only so deep
const BILLOW_EASE = 7; // 1/s - how fast the belly follows the pressure
const GUST_EVERY = [2.4, 4.6]; // seconds between gusts, min..max
const GUST_STRENGTH = [3.2, 6.0]; // dimensionless gust amplitude, min..max
const GUST_DURATION = 1.5; // how long the front blows past one point
const GUST_SPEED = 0.55; // widths per second the front travels
const MAX_GUSTS = 3; // how many gusts may be blowing past at once

/* The angular kick a card takes when the pointer brushes past it. Small on
   purpose: this is a hand passing a hanging sheet, not a shove. The garment is
   underdamped, so whatever goes in here rings for a while - which is exactly
   why a big number reads as the card being thrown rather than touched. */
const BRUSH = 0.35;

/*
 * The gust that blows over a tile: the puff is DRAWN first and the garment
 * moves after, because that is the order the two things happen in - you see the
 * wind arrive, then the cloth answers it. GUST_LEAD is that gap.
 *
 * WeatherWind is 160 frames at 60fps, so it has blown itself out by ~2.7s;
 * GUST_SHOWN clears it a beat after that rather than cutting it off mid-puff.
 */
const GUST_LEAD = 260; // ms between the puff appearing and the tile feeling it
const GUST_SHOWN = 2900; // ms the puff stays mounted
const GUST_STAGGER = 420; // ms between tiles on the opening breeze

/* Where the puff is drawn when nothing points at a place: above the tile,
   centred. A sentinel rather than a coordinate, because "above the card" is a
   position in the layout, not a number - the card's height is not ours to
   know here. */
const GUST_CENTRE = "centre";

/*
 * The three skies.
 *
 * Every other one is MIRRORED, which is what closes the seams: a copy's left
 * edge then shows the same edge of the document its neighbour's right edge
 * does, so a bird leaving one sky is met by one arriving in the next instead of
 * being cut in half at the join.
 *
 * The mirror is why the speeds are what they are. Mirrored tiles only line up
 * exactly when they are on the same frame, and three synchronised copies of one
 * flock read as a kaleidoscope - the reflection becomes the thing you notice.
 * Held slightly out of step, the mirror stops being readable as a mirror and
 * only its edge-matching survives, which is the half worth having. So: all
 * slow, all different, no two speeds sharing a factor that would let them fall
 * back into step.
 */
const BIRD_SKIES = [
  { startAt: 0, speed: 0.45, flip: false },
  { startAt: 0.4, speed: 0.6, flip: true },
];

/** Smooth blow-past envelope: 0 -> 1 -> 0 with no corners. */
const envelope = (u) => {
  if (u <= 0 || u >= 1) return 0;
  const s = Math.sin(Math.PI * u);
  return s * s;
};


function ServicesShowcase() {
  const reduce = useReducedMotion();
  const hangRef = useRef(null);
  const cardRefs = useRef([]);
  const [hangTops, setHangTops] = useState(HANG_MD_TOP);
  /* Per tile: null when still, else where its puff is being drawn. */
  const [gusting, setGusting] = useState([null, null, null]);
  const timers = useRef([]);

  /*
   * Hang each card off the thread instead of guessing where the thread is.
   *
   * The peg's x is whatever the shell grid gives it at this width; the thread's
   * height there is whatever the curve says at that fraction of the SCREEN. So
   * measure the first and evaluate the second - the two cannot drift apart, at
   * any breakpoint, however either one is retuned. Only the vertical offset is
   * being set here, so it cannot feed back into the x it just measured.
   */
  useLayoutEffect(() => {
    const measure = () => {
      if (!hangRef.current || window.innerWidth < 768) return;
      const next = cardRefs.current.map((node, index) => {
        if (!node) return HANG_MD_TOP[index];
        const box = node.getBoundingClientRect();
        const t = (box.left + box.width / 2) / window.innerWidth;
        /* The thread is drawn from the hang box's top, so its y is already in
           this element's own coordinates. */
        return Math.round(threadY(t) + PEG_THROAT);
      });
      setHangTops((prev) =>
        prev.every((v, i) => v === next[i]) ? prev : next,
      );
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  /*
   * Blow a gust over one tile: the puff shows, and a beat later the garment
   * takes the kick. ONE function for both the opening breeze and the hover, so
   * the two cannot drift into behaving differently.
   *
   * `from` is the side the wind comes from, which is the side the cloth is
   * pushed toward - a hover reads as the pointer's own draught, and the opening
   * breeze blows the way the thread rises.
   *
   * `at` is where the puff is drawn, in the card wrapper's own coordinates: the
   * hover passes the pointer, so the wind starts where the hand entered. The
   * opening breeze has no pointer to speak of and passes nothing, which parks
   * the puff above the tile - see GUST_CENTRE.
   */
  const blow = useCallback((index, from, at = GUST_CENTRE) => {
    setGusting((prev) => {
      if (prev[index]) return prev;
      const next = [...prev];
      next[index] = at;
      return next;
    });

    timers.current.push(
      setTimeout(() => {
        const card = sim.current.cards[index];
        if (card) card.w += from === "left" ? BRUSH : -BRUSH;
      }, GUST_LEAD),
      setTimeout(() => {
        setGusting((prev) => {
          const next = [...prev];
          next[index] = null;
          return next;
        });
      }, GUST_SHOWN),
    );
  }, []);

  /* The opening breeze: one puff per tile, left to right, the way the thread
     rises. It is the same gesture the hover fires, so the section demonstrates
     itself once and then waits to be touched. */
  useEffect(() => {
    if (reduce) return undefined;
    HANG_TILT_DEG.forEach((_, index) => {
      timers.current.push(
        setTimeout(() => blow(index, "left"), 700 + index * GUST_STAGGER),
      );
    });
    const pending = timers.current;
    return () => {
      pending.forEach(clearTimeout);
      timers.current = [];
    };
  }, [blow, reduce]);

  /*
   * Motion values, created once: rot/skew/billow per garment. motionValue()
   * (not the hook) because we need arrays.
   */
  const rot = useMemo(
    () => HANG_TILT_DEG.map((deg) => motionValue(deg)),
    [],
  );
  const skew = useMemo(() => HANG_TILT_DEG.map(() => motionValue(0)), []);
  const billow = useMemo(() => HANG_TILT_DEG.map(() => motionValue(0)), []);

  /* The whole simulation lives in one ref: time, pending gusts, pendulums. */
  const sim = useRef({
    t: 0,
    nextGust: 0.8, // the first gust arrives quickly, so the scene reads
    width: 1200,
    gusts: [],
    cards: HANG_TILT_DEG.map((deg) => ({
      th: (deg * Math.PI) / 180,
      w: 0,
      rest: (deg * Math.PI) / 180,
      belly: 0, // out-of-plane bow, deg - eased toward the wind pressure
    })),
  });

  /* The gusts' travel is in fractions of the hanging area, drawn in px. */
  useEffect(() => {
    const measure = () => {
      if (hangRef.current) sim.current.width = hangRef.current.clientWidth;
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useAnimationFrame((_, deltaMs) => {
    if (reduce) return;
    const S = sim.current;
    /* Clamp dt: a background tab can hand us seconds, and explicit Euler
       with K=22 goes unstable past dt ~ 0.4s. 33ms keeps it honest. */
    const dt = Math.min(deltaMs / 1000, 0.033);
    S.t += dt;

    /* Birth a gust. Strength and cadence vary run to run - a breeze,
       not a metronome. */
    if (S.t >= S.nextGust) {
      const [minGap, maxGap] = GUST_EVERY;
      const [minAmp, maxAmp] = GUST_STRENGTH;
      S.gusts.push({
        t0: S.t,
        amp: minAmp + Math.random() * (maxAmp - minAmp),
      });
      S.nextGust = S.t + minGap + Math.random() * (maxGap - minGap);
      if (S.gusts.length > MAX_GUSTS) S.gusts.shift();
    }

    /* Each pendulum feels the shared wind: a whisper of ambient air, plus
       every gust whose front has reached its x and not yet blown past. */
    S.cards.forEach((card, i) => {
      const xFrac = (2 * i + 1) / 6; // column centre, as a width-fraction
      let wind =
        1.1 * Math.sin(0.6 * S.t + i * 2.1) +
        0.5 * Math.sin(1.7 * S.t + i * 0.8);
      for (const g of S.gusts) {
        const u = (S.t - g.t0 - xFrac / GUST_SPEED) / GUST_DURATION;
        wind += g.amp * envelope(u);
      }

      const acc = -K * (card.th - card.rest) - C * card.w + wind * TORQUE;
      card.w += acc * dt;
      card.th += card.w * dt;

      rot[i].set((card.th * 180) / Math.PI);
      const lag = -((card.w * 180) / Math.PI) * SKEW_LAG;
      skew[i].set(Math.max(-SKEW_MAX, Math.min(SKEW_MAX, lag)));

      /* The bend: the cloth bellies out of the plane under the same wind
         pressure, easing toward it rather than snapping - fabric has no
         business moving at the speed of a spreadsheet. */
      const bow = Math.max(
        -BILLOW_MAX,
        Math.min(BILLOW_MAX, wind * BILLOW),
      );
      card.belly += (bow - card.belly) * Math.min(1, BILLOW_EASE * dt);
      billow[i].set(card.belly);
    });

  });

  return (
    <section
      data-tone="paper"
      /* relative + overflow-hidden: the thread and the sky below are pinned to
         the screen's width, and anything that reaches past it must be cut off
         here rather than widening the document. */
      className="relative overflow-hidden bg-paper py-14 text-ink md:py-32"
    >
      {/* The sky this wash is hanging in. Scenery: behind everything, takes no
          pointer, and says nothing a screen reader needs - the section reads
          identically without it. */}
      {/*
        The sky: three copies of one flock across the width, cropped to a strip.

        WIDTH IS WHAT SETS THE BIRDS' SIZE - the player fits the document inside
        its box, so a bird is only ever as big as its box is wide. That is the
        whole of "bigger birds", and it is why the two boxes OVERLAP rather than
        sit side by side: at half the section each they already touched, so the
        only way to grow them while keeping just two copies is to let them run
        over one another and clip the excess.

        The overlap also fills the middle. The bare stretch there was never a
        gap between the two copies - they met exactly - it was each flock being
        thin at its own edges, twice, meeting in the same place. Overlapped, one
        sky's birds cover where the other has none.

        The strip's height is the second half of "bigger": each sky is now over
        700px tall and the band shows only its top, so raising the band lets
        more of the flock down into view. It is still a CROP, and deliberately -
        uncropped, birds fly down across the cards themselves.

        All three run out of step and slow. Copies of one loop started together
        read as a mirror down the page, and a bird that hurries reads as a bug.
      */}
      {!reduce && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 flex h-40 justify-center overflow-hidden opacity-50 sm:h-52 md:h-64"
        >
          {BIRD_SKIES.map((sky, index) => (
            <LottiePlayer
              key={index}
              animationData={birds}
              /* 85% each, overlapping by 70%, so the pair still measures
                 exactly 100% (85 + 85 - 70) - centred, edge to edge, nothing
                 to leave a gap. The margin is layout and the flip is a
                 transform, so they do not fight: the box is placed, then the
                 artwork mirrors inside it. */
              className={`aspect-[1920/1080] w-[85%] shrink-0 ${
                index > 0 ? "-ml-[70%]" : ""
              } ${sky.flip ? "-scale-x-100" : ""}`}
              startAt={sky.startAt}
              speed={sky.speed}
            />
          ))}
        </div>
      )}

      <Container className="relative">
        <SectionHeading title="What we build" />

        <div ref={hangRef} className="relative mt-10 md:mt-16">
          {/* The thread, mobile: level, behind the cards, running clean off
              both edges of the screen. Crosses the pegs 8px below their tops. */}
          <div
            aria-hidden="true"
            style={{ height: THREAD_WEIGHT }}
            className="absolute left-1/2 top-5 w-screen -translate-x-1/2 rounded-full bg-ink-faint md:hidden"
          />

          {/* The thread, desktop: pinned to both edges of the SCREEN, not to
              this box - a clothesline that stops short of the wall is a prop.
              It sags between them, and every peg is hung off the curve rather
              than the curve fitted to the pegs.

              preserveAspectRatio is off so the curve stretches to any width;
              non-scaling-stroke is what keeps the thread an even weight while
              it does, instead of thinning as the box gets wider. */}
          <svg
            aria-hidden="true"
            viewBox={`0 0 100 ${THREAD_H}`}
            preserveAspectRatio="none"
            style={{ height: THREAD_H }}
            className="absolute left-1/2 top-0 hidden w-screen -translate-x-1/2 md:block"
          >
            <path
              d={`M 0 ${THREAD_EDGE.left} Q 50 ${THREAD_CTRL} 100 ${THREAD_EDGE.right}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={THREAD_WEIGHT}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              className="text-ink-faint"
            />
          </svg>

          {/* Below md this row is a swipeable slider - snap points and the
              peeking next card say so; the scrollbar stays hidden. */}
          <ul className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pt-7 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 md:pt-0">
            {pillars.map((pillar, index) => {
              const load = SERVICE_ART[pillar.id];

              return (
                <Reveal
                  as="li"
                  key={pillar.id}
                  delay={index * 0.08}
                  className="w-[82%] shrink-0 snap-start sm:w-[60%] md:w-auto"
                >
                  <div
                    ref={(node) => {
                      cardRefs.current[index] = node;
                    }}
                    className="relative md:mt-[var(--hang-top)]"
                    style={{ "--hang-top": `${hangTops[index]}px` }}
                  >
                    {/*
                      The gust, blowing where it was started: on the pointer for
                      a hover, above the tile for the opening breeze. Mounted
                      only while it blows, so the player is not left looping in
                      the background on three tiles for the life of the page.

                      It FADES rather than appears. Mounted straight, it arrived
                      at full opacity on frame 0 - a puff of wind that exists
                      between one frame and the next, which reads as the page
                      glitching rather than as weather. That pop is the jump you
                      feel on hover; the cloth itself never moved by more than a
                      rounding error.

                      AnimatePresence is what buys the fade OUT: state unmounts
                      this, and without it there is nothing left on screen to
                      fade.

                      Opacity ONLY. The centring is Tailwind's -translate-x/y,
                      which is a transform - animating x or scale here would take
                      that transform over and drop the puff half its own width
                      off the pointer.
                    */}
                    <AnimatePresence>
                      {!reduce && gusting[index] && (
                        /* LottiePlayer draws, it does not place - so the placing
                           is done here, in its own positioned wrapper. */
                        <motion.div
                          key="gust"
                          aria-hidden="true"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.32, ease: "easeOut" }}
                          style={
                            gusting[index] === GUST_CENTRE
                              ? undefined
                              : {
                                  left: gusting[index].x,
                                  top: gusting[index].y,
                                }
                          }
                          className={`pointer-events-none absolute z-10 h-24 w-24 -translate-x-1/2 md:h-28 md:w-28 ${
                            gusting[index] === GUST_CENTRE
                              ? "-top-24 left-1/2 md:-top-28"
                              : "-translate-y-1/2"
                          }`}
                        >
                          <LottiePlayer
                            animationData={windGust}
                            loop={false}
                            className="h-full w-full"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Peg />
                    {/* The garment. Pivots at the peg; skews as it swings.
                        Hovering blows a gust over it: the puff shows, then the
                        cloth takes the kick and rings - plus a slight lift off
                        the line. */}
                    <motion.div
                      style={{
                        rotate: reduce
                          ? HANG_TILT_DEG[index]
                          : rot[index],
                        skewX: reduce ? 0 : skew[index],
                        rotateY: reduce ? 0 : billow[index],
                        transformPerspective: 900,
                        transformOrigin: "top center",
                      }}
                      whileHover={reduce ? undefined : { scale: 1.008 }}
                      transition={{
                        type: "spring",
                        stiffness: 120,
                        damping: 24,
                      }}
                      onMouseEnter={(event) => {
                        if (reduce) return;
                        /* Measured against the WRAPPER, not this element: the
                           garment rotates and skews every frame, so a point
                           taken from its box would be read in a frame that has
                           already swung away from where the hand actually is.
                           The wrapper never moves. */
                        const host = cardRefs.current[index];
                        if (!host) return;
                        const box = host.getBoundingClientRect();
                        // The draught comes from the side you came in on.
                        blow(
                          index,
                          event.clientX < box.x + box.width / 2
                            ? "left"
                            : "right",
                          {
                            x: event.clientX - box.left,
                            y: event.clientY - box.top,
                          },
                        );
                      }}
                    >
                      <Link
                        to={`/services/${pillar.id}`}
                        className="group block h-full rounded-2xl p-5 pb-7"
                        style={{ backgroundColor: CLOTH_COLOR }}
                      >
                        {/* White for ALL three here, unlike the services pages
                            where only AI needs it: these cards sit on light
                            cloth, so AI's baked-in white ground would show as a
                            paler rectangle against it. One ground for all three
                            keeps them a set. Tighter radius than the pages use -
                            this is inset in a card that already has one. */}
                        <div
                          className={`${SERVICE_ART_SHAPE} rounded-xl bg-white`}
                        >
                          {load && <LottieCard load={load} still={reduce} />}
                        </div>

                        <div className="mt-6 flex items-start justify-between gap-4 px-1">
                          <h3 className="font-display text-title tracking-display text-ink">
                            {pillar.title}
                          </h3>
                          <FiArrowUpRight
                            aria-hidden="true"
                            size={20}
                            className="mt-1 shrink-0 text-ink/60 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink"
                          />
                        </div>

                        <p className="mt-2 px-1 text-ink/75">
                          {pillar.tagline}
                        </p>
                      </Link>
                    </motion.div>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </Container>
    </section>
  );
}

function Peg() {
  return (
    <span
      aria-hidden="true"
      className="absolute -top-4 left-1/2 z-10 h-6 w-2.5 -translate-x-1/2 rounded-[3px] bg-ink"
    >
      {/* The peg's spring slot. */}
      <span className="absolute left-1/2 top-1.5 h-2.5 w-px -translate-x-1/2 bg-paper/70" />
    </span>
  );
}

export default ServicesShowcase;
