import {
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { site, socials } from "@/data/site.js";

/** `icon` keys in src/data/site.js map to these components. */
const icons = {
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  x: FaXTwitter,
  youtube: FaYoutube,
};

const sizes = {
  default: { box: "h-11 w-11", glyph: 17 },
  large: { box: "h-14 w-14", glyph: 20 },
};

function SocialLinks({ size = "default", className = "" }) {
  const { box, glyph } = sizes[size] ?? sizes.default;

  return (
    <ul className={`flex flex-wrap gap-3 ${className}`}>
      {socials.map((social) => {
        const Icon = icons[social.icon];
        return (
          <li key={social.label}>
            <a
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={`${site.name} on ${social.label}`}
              className={`flex items-center justify-center rounded-full border border-line text-paper-dim transition-[border-color,background-color,color,transform] duration-300 ease-out hover:-translate-y-1 hover:border-line-strong hover:bg-ink-overlay hover:text-paper active:scale-95 ${box}`}
            >
              <Icon aria-hidden="true" size={glyph} />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

export default SocialLinks;
