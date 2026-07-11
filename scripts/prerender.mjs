/**
 * Post-build prerender: capture rendered HTML for every sitemap route so
 * crawlers that do not execute JavaScript (social unfurlers, Bing in many
 * modes, LLM crawlers) see real content, per-route titles, and canonicals
 * instead of an empty <div id="root">.
 *
 * Safe because src/main.jsx uses createRoot, not hydrateRoot: real browsers
 * throw the snapshot away and re-render, so the snapshot only faces bots.
 *
 * Routes come from public/sitemap.xml — the sitemap stays the single list of
 * indexable pages. Output is dist/<path>.html (root stays index.html), which
 * Cloudflare's auto-trailing-slash asset handling serves at the extensionless
 * URL without a redirect.
 */
import { spawn } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const PORT = 4174;
const BASE = `http://localhost:${PORT}`;
const DIST = path.resolve("dist");

const sitemap = await readFile("public/sitemap.xml", "utf8");
const routes = [...sitemap.matchAll(/<loc>https:\/\/pixelkriti\.com(\/[^<]*)<\/loc>/g)]
  .map((m) => m[1].replace(/\/$/, "") || "/");

const preview = spawn("pnpm", ["exec", "vite", "preview", "--port", String(PORT), "--strictPort"], {
  stdio: "ignore",
});

try {
  // Wait for the preview server to accept connections.
  for (let i = 0; ; i++) {
    try {
      await fetch(BASE);
      break;
    } catch {
      if (i > 50) throw new Error("vite preview never came up");
      await new Promise((r) => setTimeout(r, 200));
    }
  }

  const browser = await chromium.launch();
  // Reduced motion collapses the whileInView/stagger animations, so below-fold
  // text is captured visible instead of at opacity 0.
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();

  for (const route of routes) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(400);

    const html = await page.evaluate(() => {
      // The lazy YouTube embed mounts during capture; a static copy in the
      // snapshot would start downloading before React replaces it. Bots do
      // not need it.
      document
        .querySelectorAll('iframe[src*="youtube"]')
        .forEach((el) => el.remove());

      // The async font trick flips media to "all" at runtime; restore the
      // non-blocking form so the snapshot keeps fonts off the critical path.
      const fontLink = document.querySelector(
        'link[rel="stylesheet"][href*="fonts.googleapis.com"]',
      );
      if (fontLink) fontLink.media = "print";

      return document.documentElement.outerHTML;
    });

    const file =
      route === "/" ? "index.html" : `${route.replace(/^\//, "")}.html`;
    const outPath = path.join(DIST, file);
    await mkdir(path.dirname(outPath), { recursive: true });
    await writeFile(outPath, `<!DOCTYPE html>\n${html}`);
    console.log(`prerendered ${route} -> ${path.relative(DIST, outPath)}`);
  }

  await browser.close();
} finally {
  preview.kill();
}
