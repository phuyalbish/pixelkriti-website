import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

const styles = {
  base: "group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors duration-300 ease-out",
  primary: "bg-paper text-ink hover:bg-white",
  secondary: "border border-line-strong text-paper hover:bg-ink-overlay",
};

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
