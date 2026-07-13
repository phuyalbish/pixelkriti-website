/*
 * Renders each case-study source in assets-src/case-studies/ to a branded
 * PDF in public/downloads/. Sources share brand-pdf.css (brand guide v1.3:
 * Instrument Serif / Manrope / JetBrains Mono, Ink/Paper palette, green on
 * links only). Run on demand when a case study changes:
 *
 *   node scripts/case-study-pdf.mjs           # all case studies
 *   node scripts/case-study-pdf.mjs tailg     # only sources matching "tailg"
 */
import { chromium } from "playwright";
import { mkdir, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcDir = path.join(root, "assets-src", "case-studies");
const outDir = path.join(root, "public", "downloads");
await mkdir(outDir, { recursive: true });

const filter = process.argv[2];
const sources = (await readdir(srcDir)).filter(
  (f) => f.endsWith(".html") && (!filter || f.includes(filter)),
);

const browser = await chromium.launch();
const page = await browser.newPage();

for (const source of sources) {
  const name = source.replace(/\.html$/, "");
  await page.goto(`file://${path.join(srcDir, source)}`, {
    waitUntil: "networkidle",
  });
  // Web fonts arrive after networkidle sometimes; wait for them explicitly.
  await page.evaluate(() => document.fonts.ready);

  const title = await page.title();
  await page.pdf({
    path: path.join(outDir, `${name}-case-study.pdf`),
    format: "A4",
    printBackground: true,
    margin: { top: "18mm", bottom: "18mm", left: "16mm", right: "16mm" },
    displayHeaderFooter: true,
    headerTemplate: "<span></span>",
    footerTemplate: `<div style="width:100%;font-family:'JetBrains Mono',monospace;font-size:7px;letter-spacing:0.12em;color:#8b8b93;padding:0 16mm;display:flex;justify-content:space-between;"><span>${title.replace(/—.*$/, "· Pixel Kriti")}</span><span class="pageNumber"></span></div>`,
  });
  console.log(`✓ ${name}-case-study.pdf`);
}

await browser.close();
