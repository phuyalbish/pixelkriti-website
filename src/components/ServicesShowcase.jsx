import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  motionValue,
  useAnimationFrame,
  useReducedMotion,
} from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";
import Container from "@/components/Container.jsx";
import Reveal from "@/components/Reveal.jsx";
import SectionHeading from "@/components/SectionHeading.jsx";
import useTicker from "@/hooks/useTicker.js";
import { pillars } from "@/data/services.js";

/**
 * The three service pillars as a wash hung out to dry: a thread across the
 * section, each card a coloured garment pegged to it, and a breeze that you
 * can SEE - drawn gusts sweep left to right, and the garments woggle when the
 * gust front actually reaches them.
 *
 * The motion is simulated, not keyframed. Each garment is a damped pendulum
 * pivoting at its peg:
 *
 *   th'' = -K (th - rest) - C th' + torque(wind)
 *
 * and the wind is one shared signal: a gust is born, travels across the
 * section at a fixed speed, and each card feels its torque only once the
 * front arrives at that card's x - the same position and envelope that
 * drive the drawn streak's location and opacity. Graphics and physics
 * cannot disagree because they read the same gust.
 *
 * Cloth-ness comes from the skew: fabric lags its peg, so the card skews
 * against the direction it is being swung (proportional to angular
 * velocity, clamped). Under reduced motion none of this runs - the wash
 * hangs still at its resting tilt.
 */

function ChartVisual() {
  const bars = [34, 58, 42, 70, 52, 88, 64];

  return (
    <div
      aria-hidden="true"
      className="flex h-full items-end gap-3 p-8 md:gap-4"
    >
      {bars.map((height, index) => (
        <div
          key={index}
          style={{ height: `${height}%`, animationDelay: `${index * 260}ms` }}
          className={`animate-breathe flex-1 rounded-t-sm transition-colors duration-500 ${
            height === 88
              ? "bg-paper-dim group-hover:bg-brand"
              : "bg-line-strong"
          }`}
        />
      ))}
    </div>
  );
}

const TERMINAL_FEED = [
  "> watch the inbox for new leads",
  "reply drafted - awaiting approval",
  "> chase the unpaid invoices",
  "reminders queued, politely",
  "> refresh the morning dashboard",
  "numbers reconciled",
  "> back up last night's records",
  "done. nothing needs you.",
];
const TERMINAL_VISIBLE = 5;

function TerminalVisual() {
  const tick = useTicker(1700);
  const lines = Array.from({ length: TERMINAL_VISIBLE }, (_, i) => {
    const index = (tick + i) % TERMINAL_FEED.length;
    return TERMINAL_FEED[index];
  });

  return (
    <div
      aria-hidden="true"
      className="flex h-full flex-col justify-end gap-2 p-8 font-mono text-xs leading-relaxed text-paper-faint"
    >
      {lines.map((line, i) => (
        <p
          key={`${tick}-${i}`}
          className={line.startsWith(">") ? "text-paper-dim" : ""}
        >
          {line}
          {i === lines.length - 1 && (
            <span className="ml-1 inline-block animate-pulse transition-colors duration-500 group-hover:text-brand">
              ▍
            </span>
          )}
        </p>
      ))}
    </div>
  );
}

function ShotVisual() {
  return (
    <img
      src="/work/hellotrekkers/site-home-desktop.jpg"
      alt="Hellotrekkers website home page, built by Pixel Kriti"
      loading="lazy"
      className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
    />
  );
}

const VISUALS = {
  websites: ShotVisual,
  analytics: ChartVisual,
  ai: TerminalVisual,
};

/*
 * The clothesline geometry. The desktop stagger and the thread must agree:
 * card tops fall 45px per column while the thread drops linearly across the
 * section, so it passes through every peg. Change one, change the other.
 */
const HANG_MD_TOP = [126, 81, 36];
const HANG_TILT_DEG = [-2.2, 1.8, -1.6];

/* Each card is a garment, so each gets its own cloth colour - brand green,
   sun yellow, sky blue - like a wash hung out to dry. The one deliberate
   exception to green-as-interaction-only: here the green IS the fabric. */
const CLOTH_COLOR = {
  websites: "#31ae49",
  analytics: "#eec23f",
  ai: "#74aede",
};

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
const STREAKS = 3; // drawn-gust slots (also max simultaneous gusts)

/** Smooth blow-past envelope: 0 -> 1 -> 0 with no corners. */
const envelope = (u) => {
  if (u <= 0 || u >= 1) return 0;
  const s = Math.sin(Math.PI * u);
  return s * s;
};

/** One hand-drawn gust: two streamlines and a curl, like a weather doodle. */
function WindGlyph() {
  return (
    <svg
      viewBox="0 0 240 44"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className="h-auto w-full text-ink-faint"
    >
      <path d="M4 24 C 56 16, 118 16, 164 22" />
      <path d="M164 22 c 26 4, 48 2, 54 -8 c 4 -8 -5 -14 -11 -9 c -5 4 -2 11 5 11" />
      <path d="M28 34 C 76 29, 112 29, 142 32" opacity="0.55" />
    </svg>
  );
}

function ServicesShowcase() {
  const reduce = useReducedMotion();
  const hangRef = useRef(null);

  /*
   * Motion values, created once. rot/skew per garment; x/opacity/top per
   * streak slot. motionValue() (not the hook) because we need arrays.
   */
  const rot = useMemo(
    () => HANG_TILT_DEG.map((deg) => motionValue(deg)),
    [],
  );
  const skew = useMemo(() => HANG_TILT_DEG.map(() => motionValue(0)), []);
  const billow = useMemo(() => HANG_TILT_DEG.map(() => motionValue(0)), []);
  const streakX = useMemo(
    () => Array.from({ length: STREAKS }, () => motionValue(-500)),
    [],
  );
  const streakOpacity = useMemo(
    () => Array.from({ length: STREAKS }, () => motionValue(0)),
    [],
  );
  const streakTop = useMemo(
    () => Array.from({ length: STREAKS }, () => motionValue("10%")),
    [],
  );

  /* The whole simulation lives in one ref: time, pending gusts, pendulums. */
  const sim = useRef({
    t: 0,
    nextGust: 0.8, // the first gust arrives quickly, so the scene reads
    born: 0,
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
        slot: S.born % STREAKS,
        y: 6 + Math.random() * 64, // % down the hanging area
      });
      S.born += 1;
      S.nextGust = S.t + minGap + Math.random() * (maxGap - minGap);
      if (S.gusts.length > STREAKS) S.gusts.shift();
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

    /* Draw each gust exactly where the physics says its front is. The
       streak leads the front slightly, the way blown leaves lead a gust. */
    S.gusts.forEach((g) => {
      const p = (S.t - g.t0) / (1 / GUST_SPEED + GUST_DURATION);
      /* Clamp the drawn travel: past p=1 the gust is invisible (envelope 0),
         but an un-clamped translateX would keep growing and stretch the
         document's width even while unseen. Parked just off the right edge. */
      const pp = Math.min(p, 1.1);
      streakX[g.slot].set((pp * 1.35 - 0.25) * S.width);
      streakOpacity[g.slot].set(envelope(p));
      streakTop[g.slot].set(`${g.y}%`);
    });
  });

  return (
    <section
      data-tone="paper"
      className="bg-paper py-14 text-ink md:py-32"
    >
      <Container>
        <SectionHeading title="What we build" />

        <div ref={hangRef} className="relative mt-10 md:mt-16">
          {/* The thread, mobile: level, behind the cards, full-bleed so the
              cards slide along it. Crosses the pegs 8px below their tops. */}
          <div
            aria-hidden="true"
            className="absolute -inset-x-6 top-5 h-px bg-ink-faint md:hidden"
          />

          {/* The thread, desktop: a rising diagonal through all three pegs.
              preserveAspectRatio is off so the same line fits any width. */}
          <svg
            aria-hidden="true"
            viewBox="0 0 100 150"
            preserveAspectRatio="none"
            className="absolute -inset-x-6 top-0 hidden h-[150px] w-[calc(100%+3rem)] md:block"
          >
            <line
              x1="0"
              y1="143"
              x2="100"
              y2="3"
              stroke="currentColor"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              className="text-ink-faint"
            />
          </svg>

          {/* The gusts, drawn. Same envelope, same position as the torque
              the garments feel. Clipped to this box: a translateX carrying a
              streak off-stage must never stretch the document's width. */}
          {!reduce && (
            <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
              {Array.from({ length: STREAKS }, (_, i) => (
                <motion.div
                  key={i}
                  aria-hidden="true"
                  className="absolute w-40 md:w-56"
                  style={{
                    x: streakX[i],
                    opacity: streakOpacity[i],
                    top: streakTop[i],
                    left: 0,
                  }}
                >
                  <WindGlyph />
                </motion.div>
              ))}
            </div>
          )}

          {/* Below md this row is a swipeable slider - snap points and the
              peeking next card say so; the scrollbar stays hidden. */}
          <ul className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-6 overflow-x-auto px-6 pt-7 md:mx-0 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 md:pt-0">
            {pillars.map((pillar, index) => {
              const Visual = VISUALS[pillar.id];

              return (
                <Reveal
                  as="li"
                  key={pillar.id}
                  delay={index * 0.08}
                  className="w-[82%] shrink-0 snap-start sm:w-[60%] md:w-auto"
                >
                  <div
                    className="relative md:mt-[var(--hang-top)]"
                    style={{ "--hang-top": `${HANG_MD_TOP[index]}px` }}
                  >
                    <Peg />
                    {/* The garment. Pivots at the peg; skews as it swings.
                        Hovering brushes it: an angular impulse in the
                        direction the cursor entered from, so the cloth
                        flicks and rings - plus a slight lift off the line. */}
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
                      whileHover={reduce ? undefined : { scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 18,
                      }}
                      onMouseEnter={(event) => {
                        if (reduce) return;
                        const box =
                          event.currentTarget.getBoundingClientRect();
                        const fromLeft =
                          event.clientX < box.x + box.width / 2;
                        // A hand brushing past: push the way it travels.
                        sim.current.cards[index].w += fromLeft ? 1.5 : -1.5;
                      }}
                    >
                      <Link
                        to={`/services/${pillar.id}`}
                        className="group block h-full rounded-2xl p-5 pb-7"
                        style={{ backgroundColor: CLOTH_COLOR[pillar.id] }}
                      >
                        <div className="aspect-[4/3] overflow-hidden rounded-xl bg-ink">
                          {Visual && <Visual />}
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
