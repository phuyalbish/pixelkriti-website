import { useId, useState } from "react";
import { FiPlus } from "react-icons/fi";

/**
 * A disclosure. `defaultOpen` opens it on first render; state is uncontrolled
 * after that. The panel stays mounted so its content is findable by in-page
 * search and by crawlers, and is hidden with `hidden` rather than unmounted.
 */
function Accordion({ title, count, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
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

      <div id={panelId} role="region" aria-labelledby={buttonId} hidden={!open}>
        <div className="pb-8">{children}</div>
      </div>
    </div>
  );
}

export default Accordion;
