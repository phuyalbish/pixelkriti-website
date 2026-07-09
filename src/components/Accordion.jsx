import { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FiPlus } from "react-icons/fi";

/**
 * A disclosure. `defaultOpen` opens it on first render; state is uncontrolled
 * after that. The panel stays mounted so its content is findable by in-page
 * search and by crawlers; closed means height 0 + `visibility: hidden` (which
 * also drops it from the tab order), never unmounted.
 */
function Accordion({ title, count, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  const reduceMotion = useReducedMotion();
  const panelId = useId();
  const buttonId = useId();

  return (
    <div className="border-b border-line">
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((value) => !value)}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-paper-dim"
        >
          <span className="flex items-baseline gap-4">
            <span className="font-display text-2xl tracking-display">
              {title}
            </span>
            {count != null && (
              <span className="font-mono text-xs text-paper-faint">
                {String(count).padStart(2, "0")}
              </span>
            )}
          </span>

          <FiPlus
            aria-hidden="true"
            size={20}
            className={`shrink-0 text-paper-faint transition-transform duration-300 ease-out ${
              open ? "rotate-45" : ""
            }`}
          />
        </button>
      </h3>

      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        initial={false}
        animate={
          open
            ? { height: "auto", opacity: 1, visibility: "visible" }
            : { height: 0, opacity: 0, visibility: "hidden" }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
        }
        className="overflow-hidden"
      >
        <div className="pb-8">{children}</div>
      </motion.div>
    </div>
  );
}

export default Accordion;
