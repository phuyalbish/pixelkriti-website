import { Link } from "react-router-dom";
import LogoMark from "@/components/LogoMark.jsx";
import { site } from "@/data/site.js";

/**
 * Mark plus name. Both turn brand green together on hover, driven by
 * `currentColor` on the link - the link is a single target, so lighting up only
 * half of it would read as a bug.
 *
 * `small` is for the header, where the mark sits beside the nav and should not
 * out-weigh it. The footer keeps the larger mark, having room to breathe.
 */
const sizes = {
  default: { gap: "gap-3", mark: "h-8 w-8", name: "text-[15px]" },
  small: { gap: "gap-2.5", mark: "h-6 w-6", name: "text-sm" },
};

function Logo({ size = "default", className = "" }) {
  const { gap, mark, name } = sizes[size] ?? sizes.default;

  return (
    <Link
      to="/"
      aria-label={`${site.name} - home`}
      className={`inline-flex items-center transition-colors duration-200 ease-out hover:text-brand ${gap} ${className}`}
    >
      <LogoMark className={`shrink-0 ${mark}`} />
      <span className={`font-medium tracking-tight ${name}`}>{site.name}</span>
    </Link>
  );
}

export default Logo;
