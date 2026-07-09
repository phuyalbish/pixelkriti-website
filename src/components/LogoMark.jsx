import { LOGO_PATH, LOGO_SIZE } from "@/lib/logoPath.js";

/**
 * The solid mark, drawn in `currentColor` so it can inherit hover states.
 *
 * This replaces the PNG that used to sit in the header: a raster cannot be
 * recoloured on hover without filter hacks that only approximate the target
 * colour. Same geometry as the splash mark and the outline watermark - all
 * three read from one path.
 */
function LogoMark({ className = "" }) {
  return (
    <svg
      viewBox={`0 0 ${LOGO_SIZE} ${LOGO_SIZE}`}
      role="presentation"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d={LOGO_PATH} fill="currentColor" />
    </svg>
  );
}

export default LogoMark;
