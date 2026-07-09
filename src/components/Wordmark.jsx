import { site } from "@/data/site.js";

/**
 * The classic feFlood/feTile/feComposite pixelate hack.
 *
 * feFlood paints one small square, feTile repeats it into a grid of dots, and
 * feComposite `in` keeps only the source pixels under each dot. feMorphology
 * then dilates each surviving dot back out into a solid block. The result is a
 * genuine downsample - not a blur, not a mosaic image overlay.
 *
 * `width`/`height` on feComposite set the cell size; radius on feMorphology
 * must be half of it, or the blocks either overlap or leave gaps.
 */
function PixelateFilter() {
  return (
    <svg aria-hidden="true" focusable="false" className="absolute h-0 w-0">
      <defs>
        <filter id="wordmark-pixelate" x="0" y="0">
          <feFlood x="2" y="2" height="1" width="1" />
          <feComposite width="5" height="5" />
          <feTile result="grid" />
          <feComposite in="SourceGraphic" in2="grid" operator="in" />
          <feMorphology operator="dilate" radius="2.5" />
        </filter>
      </defs>
    </svg>
  );
}

/**
 * The site name, split per letter so each one can react to the pointer.
 *
 * Every letter turns brand green on hover. Letters of the first word ("Pixel")
 * additionally pixelate, which is the joke: the word says what the effect does.
 *
 * Splitting text into spans makes some screen readers announce it character by
 * character, so the spans are hidden and the h1 carries an aria-label with the
 * whole name.
 */
function Wordmark({ className = "", style }) {
  const [pixelWord, ...restWords] = site.name.split(" ");
  const rest = restWords.join(" ");

  const letter =
    "inline-block transition-colors duration-200 ease-out hover:text-brand";

  return (
    <>
      <PixelateFilter />

      <h1 aria-label={site.name} className={className} style={style}>
        {/* Letters are inline-block so the filter has a box to act on. */}
        <span aria-hidden="true" className="inline-block whitespace-nowrap">
          {[...pixelWord].map((char, index) => (
            <span key={`${char}-${index}`} className={`${letter} pixel-letter`}>
              {char}
            </span>
          ))}
        </span>

        {/* A real space, outside the nowrap runs, so the name may wrap here. */}
        <span aria-hidden="true"> </span>

        <span aria-hidden="true" className="inline-block whitespace-nowrap">
          {[...rest].map((char, index) => (
            <span key={`${char}-${index}`} className={letter}>
              {char}
            </span>
          ))}
        </span>
      </h1>
    </>
  );
}

export default Wordmark;
