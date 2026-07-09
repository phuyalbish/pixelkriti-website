# Pixel Kriti — Agency Portfolio

The marketing and portfolio site for Pixel Kriti. A static single-page app built
with React, Vite, Tailwind, and React Router. There is no backend.

## Running it

```bash
npm install
npm run dev      # http://localhost:5171
npm run build    # emits dist/
npm run preview  # serve the production build locally
npm run lint
```

## Structure

```
src/
  assets/      PixelLogo.png — the only asset carried over from the old site
  components/  Layout, header, footer, and the shared primitives
  data/        All site copy lives here, not in JSX
  hooks/       usePageMeta — per-route <title> and description
  pages/       One file per route
  router/      Route table
```

Copy is deliberately kept in `src/data/` so it can be edited without touching
components.

## Before launch

- `src/data/work.js` contains **placeholder case studies**. Every entry is
  flagged `isPlaceholder: true`, uses a generic client descriptor, and carries
  no invented metrics. Replace them with real work and set the flag to `false`.
- `src/data/testimonials.js` contains **placeholder testimonials**, attributed
  to roles rather than invented people. Replace before launch.
- `src/data/team.js` has real names and founder roles. Photos, taglines,
  LinkedIn URLs, and the extended team's roles are all `null` — each renders a
  monogram or is omitted rather than showing a stock photo or invented quote.
- `public/showreel.mp4` is a **generated placeholder** (an 8s gradient loop with
  no audio track, so the unmute button is silent). Replace it with the real
  portfolio video, keeping the filename. It autoplays on every visit, so keep it
  short and well compressed; consider a `poster` frame in `site.showreel`.
  Setting `showreel.src` to `null` hides the section entirely.
- Confirm `email` and the `socials` URLs in `src/data/site.js`. Set
  `bookingUrl` to a Calendly link to reveal the booking CTA on Contact.
- The contact form has no backend: it opens the visitor's mail client with the
  enquiry prefilled. Point it at a form endpoint when one exists.

## Deployment

Deployed to Cloudflare Workers as an assets-only (static) Worker.

Authenticate once, either with credentials in a `.env` file (preferred — works
in CI, survives between sessions) or with an interactive browser login:

```bash
cp .env.example .env   # then paste your account ID and API token
# ...or, instead:
pnpm cf:login          # opens a browser; no .env needed
```

Wrangler reads `.env` from the project root automatically, so no flags are
needed. Then, to ship:

```bash
pnpm run preview:worker   # serve the built site in the real Workers runtime
pnpm run deploy:worker    # build, then upload dist/ to Cloudflare
```

Use `pnpm run deploy:worker`, not `pnpm deploy:worker` — and note neither
script is named plain `deploy`, because pnpm has a built-in `deploy` command
for workspaces that would shadow the script and silently never run it.

Configuration lives in `wrangler.jsonc`. The important line is
`not_found_handling: "single-page-application"`: routing is client-side, so
every unmatched path must fall back to `index.html` or deep links such as
`/work/logistics-analytics` would 404 on a hard refresh.

This is an **assets-only Worker** using [Workers Static Assets][wsa] — there is
no `main`, no Worker script, and no `@cloudflare/kv-asset-handler`. The older
Workers Sites approach (`site.bucket` plus a hand-written `getAssetFromKV`
handler) is [deprecated in Wrangler v4][wsa-dep] and should not be used for new
projects; `not_found_handling` replaces that handler's SPA `try/catch` entirely.

[wsa]: https://developers.cloudflare.com/workers/static-assets/
[wsa-dep]: https://developers.cloudflare.com/workers/wrangler/configuration/#workers-sites

The old `.github/workflows/deploy-dev.yaml` still rsyncs `dist/` to a VPS. It is
manual-dispatch only and now redundant — delete it once Cloudflare is live.
