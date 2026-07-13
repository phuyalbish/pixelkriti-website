import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiSend, FiX } from "react-icons/fi";
import LogoMark from "@/components/LogoMark.jsx";
import { nav, site } from "@/data/site.js";

/*
 * The checkerboard hero: four alternating Ink/Paper quadrants meeting behind
 * the mark. The wordmark sits exactly on the crossing and inverts itself per
 * quadrant via mix-blend-difference, so no half of it ever vanishes into a
 * matching background. Quadrants use Ink and Paper, not black and white -
 * the brand palette forbids the pure values.
 *
 * The hero carries its own stacked nav (the global header stands down on
 * this route), and the bottom-right quadrant holds a project brief box that
 * opens a prefilled email - the same delivery mechanism as the contact form.
 * The bottom-left quadrant hides an ops-log terminal that only appears on
 * hover - a wink at what the sub-agents are doing overnight.
 */

/* One fictional night of a client's system running itself. */
const FEED = [
  { t: "02:47:11", a: "voice-agent", hi: "answered +1 (…) 82", rest: "· intent=quote · qualified ✓" },
  { t: "02:47:58", a: "calendar", hi: "booked crew-2 · thu 09:00", rest: "· confirmation sent" },
  { t: "03:02:36", a: "openclaw", hi: "webhook crm.contact.created", rest: "· signature ✓ · 47ms" },
  { t: "03:14:02", a: "backups", hi: "nightly snapshot ✓", rest: "· 1.2 GB · verified restore" },
  { t: "03:28:19", a: "pipeline", hi: "web lead replied to in 41s", rest: "· marked hot" },
  { t: "03:30:00", a: "cert-rotate", hi: "tls renewed · 90 days", rest: "· zero downtime" },
  { t: "04:06:19", a: "rag-agent", hi: "answered 'do you service area 04?'", rest: "from faq.md ✓" },
  { t: "04:41:55", a: "audit-log", hi: "3 role changes recorded", rest: "· anomalies: none" },
  { t: "05:12:40", a: "invoice-bot", hi: "5 invoices generated", rest: "· 2 reminders queued" },
  { t: "05:58:03", a: "monitor", hi: "all 14 services green", rest: "· p95 112ms" },
  { t: "06:00:00", a: "digest", hi: "morning summary → owner@", rest: "· 9 leads, 4 booked" },
  { t: "06:00:01", a: "system", hi: "nobody was woken up tonight.", rest: "" },
];
const FEED_VISIBLE = 11;

/*
 * Invisible until the bottom-left quadrant is hovered, then a ticking ops
 * feed fades in: the window advances one line at a time, newest at the
 * bottom. Highlights are brand green - the terminal only exists while being
 * interacted with, which is exactly what the green is reserved for.
 */
function OpsFeed({ reduceMotion }) {
  const [tick, setTick] = useState(0);
  const [spot, setSpot] = useState(null);

  useEffect(() => {
    if (reduceMotion) return undefined;
    const timer = setInterval(
      () => setTick((count) => count + 1),
      1700,
    );
    return () => clearInterval(timer);
  }, [reduceMotion]);

  const lines = Array.from({ length: FEED_VISIBLE }, (_, i) => ({
    ...FEED[(tick + i) % FEED.length],
    key: tick + i,
  }));

  /*
   * Flashlight reveal: the feed fills the quadrant but is fully masked out;
   * a soft radial window follows the cursor, so only the area under the
   * pointer reads. Leaving the quadrant re-hides everything.
   */
  const mask = spot
    ? `radial-gradient(circle 11rem at ${spot.x}px ${spot.y}px, black 35%, transparent 100%)`
    : "radial-gradient(circle 0 at 0 0, black, transparent)";

  return (
    <div
      aria-hidden="true"
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setSpot({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }}
      onMouseLeave={() => setSpot(null)}
      className="absolute bottom-0 left-0 hidden h-1/2 w-1/2 md:block"
    >
      <div
        className="flex h-full w-full flex-col justify-end overflow-hidden p-10 font-mono text-xs leading-loose md:p-14"
        style={{
          WebkitMaskImage: mask,
          maskImage: mask,
          transition: "opacity 0.3s",
          opacity: spot ? 1 : 0,
        }}
      >
        {lines.map((line, index) => (
          <motion.div
            key={line.key}
            initial={
              reduceMotion || index < FEED_VISIBLE - 1
                ? false
                : { opacity: 0, y: 8 }
            }
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex gap-5 whitespace-nowrap"
          >
            <span className="shrink-0 text-paper-faint/60">{line.t}</span>
            <span className="w-28 shrink-0 text-paper-dim">{line.a}</span>
            <span className="truncate">
              <span className="text-brand">{line.hi}</span>{" "}
              <span className="text-paper-faint">{line.rest}</span>
              {index === FEED_VISIBLE - 1 && (
                <span className="animate-pulse text-brand"> ▍</span>
              )}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
function HomeHero() {
  const reduceMotion = useReducedMotion();
  const [brief, setBrief] = useState("");
  const [handoff, setHandoff] = useState(false);
  const [copied, setCopied] = useState(false);

  /*
   * The motto types itself out on load. Under reduced motion (which is also
   * how the prerender snapshots capture the page, so crawlers index the full
   * sentence) it appears complete immediately.
   */
  const [typedCount, setTypedCount] = useState(
    reduceMotion ? site.motto.length : 0,
  );
  const typingDone = typedCount >= site.motto.length;

  useEffect(() => {
    if (reduceMotion) {
      setTypedCount(site.motto.length);
      return undefined;
    }
    const timer = setInterval(() => {
      setTypedCount((count) => {
        if (count >= site.motto.length) {
          clearInterval(timer);
          return count;
        }
        return count + 1;
      });
    }, 45);
    return () => clearInterval(timer);
  }, [reduceMotion]);

  /*
   * Submitting does not fire the mailto directly - the OS would interrupt
   * with its own "Open <mail app>?" dialog unprompted. Instead a custom
   * popup offers the handoff, with a copy fallback for visitors who have
   * no mail client configured.
   */
  const sendBrief = (event) => {
    event.preventDefault();
    if (!brief.trim()) return;
    setCopied(false);
    setHandoff(true);
  };

  const mailtoHref = `mailto:${site.email}?subject=${encodeURIComponent(
    "New project enquiry",
  )}&body=${encodeURIComponent(brief)}`;

  const copyBrief = async () => {
    await navigator.clipboard.writeText(`${site.email}\n\n${brief}`);
    setCopied(true);
  };

  const rise = (delay) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
        };

  return (
    <section
      aria-label={`${site.name} - introduction`}
      className="relative min-h-[100svh] overflow-hidden bg-paper"
    >
      {/*
        The board itself. The top-right quadrant carries an inward scoop at
        its bottom-left: a small paper square whose top-right corner is fully
        rounded, so the curve bends INTO the ink, hugging the petal's arc.
      */}
      <div aria-hidden="true" className="absolute inset-0 grid grid-cols-2 grid-rows-2">
        <div className="bg-paper" />
        <div className="relative bg-ink">
          {/* Slightly larger than the petal (half the mark), so the curve
              shows around it instead of hiding behind it - kept tight so
              the paper gap stays a sliver. */}
          <div className="absolute bottom-0 left-0 h-[3.25rem] w-[3.25rem] rounded-tr-[50%] bg-paper md:h-20 md:w-20" />
        </div>
        <div className="bg-ink" />
        <div className="bg-paper" />
      </div>

      {/*
        The motto, bold on the top-left quadrant. Paper-colored text under a
        `difference` blend reads as ink on the paper quadrant and flips light
        wherever a line crosses onto the ink one (narrow screens) - same
        trick as the wordmark, and again: no z-index, or the blend goes blind.
      */}
      <motion.p
        {...rise(0.05)}
        aria-label={site.motto}
        className="absolute left-6 top-6 max-w-[17rem] text-4xl font-light leading-tight text-paper sm:max-w-xl md:left-12 md:top-10 md:max-w-3xl md:text-6xl lg:text-7xl"
        style={{
          mixBlendMode: "difference",
          fontFamily: "'Montserrat', 'Manrope', system-ui, sans-serif",
        }}
      >
        {/*
          Screen readers get the whole sentence from aria-label above; the
          keystroke-by-keystroke render below is hidden from them so it does
          not announce 60 times. The invisible full-length copy underneath
          reserves the final footprint, so lines do not reflow as they fill.
        */}
        <span aria-hidden="true" className="relative block">
          <span className="invisible">{site.motto}</span>
          <span className="absolute inset-0">
            {site.motto.slice(0, typedCount)}
            {!typingDone && (
              <span className="animate-pulse font-thin">|</span>
            )}
          </span>
        </span>
      </motion.p>

      {/* The hidden ops terminal, bottom-left ink quadrant. */}
      <OpsFeed reduceMotion={reduceMotion} />

      {/* Corner mark + stacked nav, on the ink quadrant. */}
      <motion.nav
        {...rise(0.1)}
        aria-label="Primary"
        className="absolute right-6 top-6 z-10 flex flex-col items-end gap-1 text-right md:right-12 md:top-10"
      >
        <Link
          to="/"
          aria-label={`${site.name} - home`}
          className="mb-4 text-paper transition-colors duration-200 hover:text-brand"
        >
          <LogoMark className="h-7 w-7 md:h-8 md:w-8" />
        </Link>
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="py-1 text-lg text-paper transition-colors duration-200 hover:text-brand md:text-2xl"
          >
            {item.label}
          </Link>
        ))}
      </motion.nav>

      {/*
        The lockup, pinned to the crossing. Centered with flex, NOT a
        translate transform: a transformed ancestor isolates the stacking
        context and mix-blend-difference would stop seeing the board. For
        the same reason this subtree stays out of the entrance animation.
      */}
      {/* No z-index here: it would isolate the stacking context and break the
          blend. DOM order alone paints the lockup above the board. */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {/* The MARK's centre sits exactly on the crossing; the wordmark
            hangs below it without shifting the mark off-centre. */}
        <div className="relative">
          <motion.div {...rise(0)}>
            <LogoMark className="h-24 w-24 text-brand sm:h-32 sm:w-32 md:h-36 md:w-36" />
          </motion.div>
          {/*
            h1 of the page. `difference` against Paper-colored text flips it
            dark on the paper quadrants and light on the ink ones.
          */}
          <h1
            className="absolute left-1/2 top-full mt-4 w-max -translate-x-1/2 text-4xl font-semibold tracking-tight text-paper sm:text-5xl md:text-6xl"
            style={{ mixBlendMode: "difference" }}
          >
            {site.name}
          </h1>
        </div>
      </div>

      {/* The project brief box, on the paper quadrant. */}
      <motion.form
        {...rise(0.2)}
        onSubmit={sendBrief}
        className="absolute bottom-6 left-6 right-6 z-10 rounded-2xl bg-paper p-5 text-ink sm:left-auto sm:w-[24rem] md:bottom-12 md:right-12 md:w-[28rem] md:p-6"
      >
        <label
          htmlFor="hero-brief"
          className="block text-right font-mono text-sm uppercase tracking-[0.18em] text-ink/60 md:text-base"
        >
          Tell us about your project
        </label>
        <textarea
          id="hero-brief"
          value={brief}
          onChange={(event) => setBrief(event.target.value)}
          rows={4}
          placeholder="What is not working, in your own words."
          className="mt-3 w-full resize-none bg-transparent text-right text-lg leading-relaxed text-ink placeholder:text-ink/40 focus:outline-none md:text-xl"
        />
        <button
          type="submit"
          className="group relative isolate ml-auto mt-4 flex items-center gap-2.5 overflow-hidden rounded-full bg-ink px-7 py-3.5 text-base font-medium text-paper transition-transform duration-300 active:scale-[0.97]"
        >
          {/* Same green wipe as the primary Button, kept in step with it. */}
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-10 -translate-x-full bg-brand transition-transform duration-300 ease-out group-hover:translate-x-0"
          />
          Send it to us
          <FiSend aria-hidden="true" />
        </button>
      </motion.form>

      {/* The handoff popup, replacing the OS's own mail-app dialog. */}
      <AnimatePresence>
        {handoff && (
          <motion.aside
            role="status"
            initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 right-6 z-50 w-[min(22rem,calc(100vw-3rem))] rounded-2xl border border-line bg-ink p-6 text-paper shadow-[0_8px_30px_rgba(11,11,12,0.45)]"
          >
            <div className="flex items-start justify-between gap-4">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-paper-faint">
                Your message is ready
              </p>
              <button
                type="button"
                onClick={() => setHandoff(false)}
                aria-label="Close"
                className="-mr-1 -mt-1 p-1 text-paper-faint transition-colors hover:text-paper"
              >
                <FiX size={16} />
              </button>
            </div>

            <p className="mt-3 text-pretty text-sm leading-relaxed text-paper-dim">
              Send it to {site.email} with your email app, or copy it and use
              whatever you like.
            </p>

            <div className="mt-5 flex flex-col gap-2">
              <a
                href={mailtoHref}
                className="group relative isolate inline-flex items-center justify-center overflow-hidden rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink"
              >
                {/* Same green wipe as the primary Button, kept in step with it. */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 -translate-x-full bg-brand transition-transform duration-300 ease-out group-hover:translate-x-0"
                />
                Open email app
              </a>
              <button
                type="button"
                onClick={copyBrief}
                className="inline-flex items-center justify-center rounded-full border border-line-strong px-5 py-2.5 text-sm text-paper-dim transition-colors hover:border-paper hover:text-paper"
              >
                {copied ? "Copied - paste it anywhere" : "Copy message instead"}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </section>
  );
}

export default HomeHero;
