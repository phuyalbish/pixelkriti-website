import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

/*
 * The quiet text link with the nudging arrow, used wherever a section offers
 * a side exit ("All case studies", "Meet the team"). Renders a router Link
 * for internal `to` targets and a plain anchor for external `href` ones.
 */
function ArrowLink({ to, href, children, className = "", ...rest }) {
  const Tag = to ? Link : "a";

  return (
    <Tag
      to={to}
      href={href}
      className={`group inline-flex items-center gap-2 text-sm text-paper-dim transition-colors hover:text-paper ${className}`}
      {...rest}
    >
      {children}
      <FiArrowUpRight
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </Tag>
  );
}

export default ArrowLink;
