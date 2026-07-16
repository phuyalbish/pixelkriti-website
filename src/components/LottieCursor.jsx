import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A Lottie animation that stands in for the pointer inside one section.
 *
 * Give it a ref to the section: it hides the native cursor there, follows the
 * pointer, and hands the real cursor back over anything marked
 * `data-cursor-default` (the links and buttons - a control the visitor cannot
 * see themselves aiming at is a control they will not click).
 *
 * `fill` may be a colour or a function of the pointer's position within the
 * section, which is how the figure can hold its own against a ground that
 * changes colour under it. The artwork is a single flat colour, so this is done
 * in CSS: a `fill` rule beats the inline presentation attribute Lottie writes,
 * which means recolouring costs nothing and can happen mid-move. Reloading the
 * document to repaint it would restart the animation on every crossing.
 *
 * The player is imported lazily on first entry, so a visitor who never hovers
 * the section never pays for the library, and the prerender - which has no
 * pointer and no DOM to draw into - never loads it at all. Position is written
 * straight to the transform: routing mousemove through React state would put a
 * render between the pointer and the drawing.
 */
function LottieCursor({ animationData, targetRef, size = 88, fill }) {
  const dotRef = useRef(null);
  const hostRef = useRef(null);
  const animRef = useRef(null);
  const [inside, setInside] = useState(false);
  const [colour, setColour] = useState(() =>
    typeof fill === "function" ? undefined : fill,
  );

  const fillAt = useCallback(
    (x, y, rect) => (typeof fill === "function" ? fill(x, y, rect) : fill),
    [fill],
  );

  /* Pointer plumbing. Bound to the section, not the window: outside it this
     component is inert and the native cursor is untouched. */
  useEffect(() => {
    const target = targetRef.current;
    if (!target) return undefined;

    /* Coarse pointers have no hover state to speak of, and a cursor that
       teleports on tap reads as a glitch. Leave touch alone entirely. */
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) return undefined;

    const isControl = (node) =>
      node instanceof Element && Boolean(node.closest("[data-cursor-default]"));

    const onMove = (event) => {
      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate3d(${event.clientX - size / 2}px, ${
          event.clientY - size / 2
        }px, 0)`;
      }
      const rect = target.getBoundingClientRect();
      /* React bails out when the value is unchanged, so this is a render per
         crossing, not a render per mousemove. */
      setColour(fillAt(event.clientX - rect.left, event.clientY - rect.top, rect));
      setInside(!isControl(event.target));
    };

    const onLeave = () => setInside(false);

    target.addEventListener("mousemove", onMove);
    target.addEventListener("mouseleave", onLeave);

    return () => {
      target.removeEventListener("mousemove", onMove);
      target.removeEventListener("mouseleave", onLeave);
    };
  }, [targetRef, size, fillAt]);

  /* Load the player once, on the first entry. */
  useEffect(() => {
    if (!inside || animRef.current) return undefined;

    let cancelled = false;
    import("lottie-web/build/player/lottie_light.min.js").then((mod) => {
      if (cancelled || !hostRef.current || animRef.current) return;
      const lottie = mod.default ?? mod;
      animRef.current = lottie.loadAnimation({
        container: hostRef.current,
        renderer: "svg",
        loop: true,
        autoplay: true,
        animationData,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [inside, animationData]);

  useEffect(
    () => () => {
      animRef.current?.destroy();
      animRef.current = null;
    },
    [],
  );

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-50 will-change-transform [&_path]:fill-current"
      style={{
        width: size,
        height: size,
        color: colour,
        /* Parked off-screen until the first mousemove writes a real position,
           so it never flashes in the corner on load. */
        transform: "translate3d(-200px, -200px, 0)",
        opacity: inside ? 1 : 0,
        transition: "opacity 120ms linear",
      }}
    >
      {/* The artwork is drawn facing left; the mark faces the way the reader
          reads. Flipped here on the ARTWORK rather than on the box above,
          whose transform is rewritten on every mousemove to track the
          pointer - a flip there would be overwritten on the next frame. */}
      <div ref={hostRef} className="h-full w-full -scale-x-100" />
    </div>
  );
}

export default LottieCursor;
