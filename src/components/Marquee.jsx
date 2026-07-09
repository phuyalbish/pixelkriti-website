/**
 * The track is rendered twice and translated -50%, so the seam never shows.
 * `aria-hidden` on the duplicate keeps screen readers from reading it twice.
 */
function Marquee({ items }) {
  return (
    <div className="flex overflow-hidden border-y border-line py-6">
      {[false, true].map((isDuplicate) => (
        <ul
          key={String(isDuplicate)}
          aria-hidden={isDuplicate || undefined}
          className="flex shrink-0 animate-marquee items-center gap-14 pr-14"
        >
          {items.map((item) => (
            <li
              key={item}
              className="flex shrink-0 items-center gap-14 whitespace-nowrap font-display text-2xl text-paper-dim md:text-3xl"
            >
              {item}
              <span aria-hidden="true" className="text-paper-faint">
                ·
              </span>
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

export default Marquee;
