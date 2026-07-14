import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

/*
 * The quiet text link with the nudging arrow, used wherever a section offers
 * a side exit ("All case studies", "Meet the team"). Renders a router Link
 * for internal `to` targets and a plain anchor for external `href` ones.
 *
 * `tone="ink"` is the counterpart for paper-ground sections, where the default
 * paper-toned text would sit invisible on the light surface.
 */
const TONES = {
  paper: "text-paper-dim hover:text-paper",
  ink: "text-ink/60 hover:text-ink",
};

function ArrowLink({ to, href, children, tone = "paper", className = "", ...rest }) {
  const Tag = to ? Link : "a";

  return (
    <Tag
      to={to}
      href={href}
      className={`group inline-flex items-center gap-2 text-sm transition-colors ${TONES[tone]} ${className}`}
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
