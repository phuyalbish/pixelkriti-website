import { Link } from "react-router-dom";
import logo from "@/assets/PixelLogo.png";
import { site } from "@/data/site.js";

function Logo({ className = "" }) {
  return (
    <Link
      to="/"
      aria-label={`${site.name} - home`}
      className={`group inline-flex items-center gap-3 ${className}`}
    >
      <img
        src={logo}
        alt=""
        width={36}
        height={36}
        className="h-9 w-9 rounded-full"
      />
      <span className="text-[15px] font-medium tracking-tight">
        {site.name}
      </span>
    </Link>
  );
}

export default Logo;
