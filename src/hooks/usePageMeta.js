import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { site } from "@/data/site.js";

/** The production origin - canonicals must not point at preview hosts. */
const ORIGIN = "https://pixelkriti.com";

function setAttr(selector, attribute, value) {
  const tag = document.querySelector(selector);
  if (tag) tag.setAttribute(attribute, value);
}

/**
 * Sets the document title, meta description, canonical URL, and Open Graph
 * tags per route. The site is a static SPA, so this is client-side only -
 * crawlers that execute JS will pick it up.
 *
 * The canonical and og:url always point at the page's own URL. The tags
 * themselves live in index.html; this hook only rewrites their content, so a
 * crawler that skips JS still sees the homepage values rather than nothing.
 *
 * `og` overrides the social-share title/description where the search snippet
 * and the share card should read differently.
 */
function usePageMeta(title, description, og = {}) {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = title ? `${title} - ${site.name}` : site.titleDefault;
  }, [title]);

  useEffect(() => {
    const url = ORIGIN + (pathname === "/" ? "/" : pathname.replace(/\/$/, ""));
    setAttr('link[rel="canonical"]', "href", url);
    setAttr('meta[property="og:url"]', "content", url);
  }, [pathname]);

  useEffect(() => {
    if (description) {
      setAttr('meta[name="description"]', "content", description);
    }
    setAttr(
      'meta[property="og:title"]',
      "content",
      og.title ?? (title ? `${title} - ${site.name}` : site.titleDefault),
    );
    const share = og.description ?? description;
    if (share) setAttr('meta[property="og:description"]', "content", share);
  }, [title, description, og.title, og.description]);
}

export default usePageMeta;
