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
- Confirm `email` and `linkedin` in `src/data/site.js`.
- The contact form has no backend: it opens the visitor's mail client with the
  enquiry prefilled. Point it at a form endpoint when one exists.

## Deployment

Deployed to Cloudflare Workers as an assets-only (static) Worker.

```bash
pnpm cf:login    # once per machine — opens a browser to authorise Wrangler
pnpm cf:deploy   # builds, then uploads dist/ to Cloudflare
```

`pnpm cf:deploy` is the one command. It is deliberately not named `deploy`:
pnpm has a built-in `deploy` command for workspaces that would shadow the
script and never run it.

Run `pnpm cf:preview` to serve the built site through the real Workers runtime
locally before shipping.

Configuration lives in `wrangler.jsonc`. The important line is
`not_found_handling: "single-page-application"`: routing is client-side, so
every unmatched path must fall back to `index.html` or deep links such as
`/work/logistics-analytics` would 404 on a hard refresh.

The old `.github/workflows/deploy-dev.yaml` still rsyncs `dist/` to a VPS. It is
manual-dispatch only and now redundant — delete it once Cloudflare is live.
