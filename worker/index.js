/**
 * Thin shell in front of the static assets. Its only job: collapse the
 * workers.dev alias onto the canonical domain so crawlers never index two
 * copies of the site. Everything else falls through to the asset handler.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname.endsWith(".workers.dev")) {
      url.hostname = "pixelkriti.com";
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
