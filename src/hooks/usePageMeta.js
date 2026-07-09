import { useEffect } from "react";
import { site } from "@/data/site.js";

/**
 * Sets the document title and meta description per route. The site is a static
 * SPA, so this is client-side only — crawlers that execute JS will pick it up.
 */
function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} — ${site.name}` : site.titleDefault;
  }, [title]);

  useEffect(() => {
    if (!description) return;
    const tag = document.querySelector('meta[name="description"]');
    if (!tag) return;

    const previous = tag.getAttribute("content");
    tag.setAttribute("content", description);
    return () => tag.setAttribute("content", previous ?? "");
  }, [description]);
}

export default usePageMeta;
