import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

const styles = {
  base: "group relative isolate inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-6 py-3 text-sm font-medium transition-[background-color,border-color,color,transform] duration-300 ease-out active:scale-[0.97]",
  primary: "bg-paper text-ink",
  // The primary button inverted, for paper-ground sections where a paper
  // button would vanish. Keeps the same green sweep on hover.
  inverse: "bg-ink text-paper",
  secondary: "border border-line-strong text-paper hover:bg-ink-overlay",
};

/**
 * The brand-green wipe behind a primary button's label: parked fully off the
 * left edge, it slides across on hover. Under the text (-z-10 inside the
 * button's own stacking context) but over the button's background.
 */
const sweep = (
  <span
    aria-hidden="true"
    className="absolute inset-0 -z-10 -translate-x-full bg-brand transition-transform duration-300 ease-out group-hover:translate-x-0"
  />
);

function Button({
  to,
  href,
  variant = "primary",
  withArrow = true,
  className = "",
  children,
  ...rest
}) {
  const classes = `${styles.base} ${styles[variant]} ${className}`;

  const inner = (
    <>
      {(variant === "primary" || variant === "inverse") && sweep}
      {children}
      {withArrow && (
        <FiArrowUpRight
          aria-hidden="true"
          className="transition-transform duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      )}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {inner}
      </Link>
    );
  }

  return (
    <a href={href} className={classes} {...rest}>
      {inner}
    </a>
  );
}

export default Button;
