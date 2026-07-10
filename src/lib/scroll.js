/**
 * The live Lenis instance, if any. A module singleton rather than context:
 * only two callers exist (SmoothScroll sets it, ScrollToTop jumps), and it
 * must live outside component files or fast refresh complains.
 */
let lenis = null;

export function setLenis(instance) {
  lenis = instance;
}

/** Jump to a position instantly, whichever scroller is in charge. */
export function scrollToInstant(top) {
  if (lenis) lenis.scrollTo(top, { immediate: true });
  else window.scrollTo({ top, behavior: "instant" });
}

/**
 * Scroll a hash target into view, offset so it lands below the sticky header
 * (Lenis ignores CSS scroll-padding-top, so the offset is passed explicitly).
 */
export function scrollToElement(element) {
  const offset = -96;
  if (lenis) lenis.scrollTo(element, { offset, immediate: true });
  else {
    const top = element.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: "instant" });
  }
}
