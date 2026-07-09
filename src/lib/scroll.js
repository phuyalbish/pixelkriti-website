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
