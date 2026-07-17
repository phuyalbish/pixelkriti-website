/**
 * The Worker in front of the static assets.
 *
 * Three jobs:
 *   1. collapse the workers.dev alias onto the canonical domain
 *   2. serve /api/* - enquiry intake, and the password-protected dashboard API
 *   3. keep /dashboard out of search indexes
 *
 * Why the dashboard API lives here and not in the React app: the bundle is
 * public. Anything the browser can check, a visitor can read and bypass. So
 * the passwords, the sessions and the enquiries never leave this file's side
 * of the wire - the app gets a cookie and a JSON list, and only after the
 * Worker has agreed to give it one.
 */
import {
  clearCookie,
  clearFailures,
  createSession,
  destroySession,
  isThrottled,
  recordFailure,
  sessionCookie,
  sessionUser,
  verifyLogin,
} from "./auth.js";
import { confirmToEnquirer, notifyTeam } from "./email.js";

/**
 * JSON response, never cached.
 *
 * The no-store is not boilerplate - it is load-bearing, and it was added after
 * the CDN was caught serving a cached /api/enquiries to a logged-OUT request.
 * Cloudflare will happily cache an edge response and then answer a later
 * request from it without consulting this Worker at all; when the body is the
 * contact list, that hands one visitor's authenticated response to whoever
 * asks next. Every /api response says no-store for that reason.
 *
 * `Vary: Cookie` is the belt to that braces: if any layer ever does cache
 * these, it must at least key the entry on the session cookie rather than on
 * the URL alone.
 */
const json = (body, init = {}) =>
  new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store, no-cache, must-revalidate, private",
      "Vary": "Cookie",
      ...init.headers,
    },
  });

const MAX = { name: 120, email: 200, company: 160, service: 120, message: 5000, notes: 5000 };

/**
 * The pipeline, in order. This array IS the contract: the dashboard renders
 * its dropdown from the same list the Worker validates against, so the two
 * can never disagree about what a valid status is.
 *
 * "New" is first because it is the default for every incoming enquiry. It is
 * NOT what the Un Reviewed filter reads - that is the `reviewed` column, which
 * this only nudges (see the PATCH handler).
 */
const STATUSES = ["New", "Contacted", "Quoted", "Deal", "Development", "Delivered", "Lost"];

/** Trim, cap, and reject the obviously-not-real. Storage is not validation. */
function readEnquiry(payload) {
  const clean = (value, limit) =>
    typeof value === "string" ? value.trim().slice(0, limit) : "";

  const enquiry = {
    name: clean(payload.name, MAX.name),
    email: clean(payload.email, MAX.email),
    company: clean(payload.company, MAX.company),
    service: clean(payload.service, MAX.service),
    message: clean(payload.message, MAX.message),
  };

  if (!enquiry.name || !enquiry.email || !enquiry.message) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(enquiry.email)) return null;

  return enquiry;
}

/**
 * Per-enquiry routes: PATCH to edit, DELETE to remove.
 *
 * Split out of the switch below because they carry an id in the path, which a
 * literal string match cannot express. Both require a session - these read and
 * destroy client data.
 */
async function handleEnquiry(request, db, id, user) {
  if (!user) return json({ error: "Unauthorised" }, { status: 401 });
  if (!Number.isInteger(id) || id < 1) return json({ error: "Bad id" }, { status: 400 });

  if (request.method === "PATCH") {
    const body = await request.json().catch(() => ({}));

    /*
     * Each field is only touched when present, so sending {notes} does not
     * silently blank the status. `undefined` means "leave alone"; an empty
     * string for an optional field means "clear it", which is a real intent.
     */
    const sets = [];
    const binds = [];

    if (body.status !== undefined) {
      if (!STATUSES.includes(body.status)) {
        return json({ error: "Unknown status" }, { status: 400 });
      }
      sets.push("status = ?");
      binds.push(body.status);

      /*
       * Moving a lead off New is an act of review, so it stops being
       * unreviewed - otherwise an enquiry marked Deal would sit in the Un
       * Reviewed list forever waiting for a second click nobody remembers.
       *
       * One-way only, and only when `reviewed` was not sent explicitly: this
       * must never UNDO a deliberate toggle, and setting a status back to New
       * does not un-read what you have already read.
       */
      if (body.reviewed === undefined && body.status !== "New") {
        sets.push("reviewed = 1");
      }
    }

    if (body.reviewed !== undefined) {
      sets.push("reviewed = ?");
      binds.push(body.reviewed ? 1 : 0);
    }

    /* Optional by definition on the form, so "" legitimately clears them. */
    for (const key of ["company", "service", "notes"]) {
      if (body[key] === undefined) continue;
      const value = typeof body[key] === "string" ? body[key].trim().slice(0, MAX[key]) : "";
      sets.push(`${key} = ?`);
      binds.push(value || null);
    }

    /*
     * Required on the form, so they stay required here. Blanking the name or
     * the message would leave a row the dashboard renders as an untitled
     * ghost - the edit form must not be able to create something the intake
     * endpoint would have rejected.
     */
    for (const key of ["name", "message"]) {
      if (body[key] === undefined) continue;
      const value = typeof body[key] === "string" ? body[key].trim().slice(0, MAX[key]) : "";
      if (!value) return json({ error: `${key} cannot be empty` }, { status: 400 });
      sets.push(`${key} = ?`);
      binds.push(value);
    }

    if (body.email !== undefined) {
      const email = typeof body.email === "string" ? body.email.trim().slice(0, MAX.email) : "";
      /* Same test as intake: this address is what a reply gets sent to, and a
         typo here is a lead that silently never hears back. */
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        return json({ error: "Invalid email" }, { status: 400 });
      }
      sets.push("email = ?");
      binds.push(email);
    }

    if (!sets.length) return json({ error: "Nothing to update" }, { status: 400 });

    /* Stamped on every write: three people share this list, and "who marked
       this Lost, and when?" needs an answer. */
    sets.push("updated_at = datetime('now')", "updated_by = ?");
    binds.push(user.displayName, id);

    const row = await db
      .prepare(
        `UPDATE enquiries SET ${sets.join(", ")} WHERE id = ?
         RETURNING id, name, email, company, service, message, created_at,
                   notified, status, reviewed, notes, updated_at, updated_by`,
      )
      .bind(...binds)
      .first();

    return row ? json({ enquiry: row }) : json({ error: "Not found" }, { status: 404 });
  }

  if (request.method === "DELETE") {
    const { meta } = await db.prepare(`DELETE FROM enquiries WHERE id = ?`).bind(id).run();
    /* 404 rather than a silent ok: if it was already gone, the dashboard
       showing "deleted" would be reporting something it did not do. */
    return meta.changes ? json({ ok: true }) : json({ error: "Not found" }, { status: 404 });
  }

  return json({ error: "Not found" }, { status: 404 });
}

async function handleApi(request, env, ctx, url) {
  const db = env.DB;
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const route = `${request.method} ${url.pathname}`;

  const perEnquiry = url.pathname.match(/^\/api\/enquiries\/(\d+)$/);
  if (perEnquiry) {
    return handleEnquiry(request, db, Number(perEnquiry[1]), await sessionUser(db, request));
  }

  switch (route) {
    /* ------------------------------------------------ public: form intake */
    case "POST /api/enquiries": {
      const enquiry = readEnquiry(await request.json().catch(() => ({})));
      if (!enquiry) return json({ error: "Invalid enquiry" }, { status: 400 });

      /*
       * Written BEFORE either email is attempted. If Resend is down, the
       * enquiry is still on record and shows up in the dashboard - the team
       * loses a notification, never a lead.
       */
      const { meta } = await db
        .prepare(
          `INSERT INTO enquiries (name, email, company, service, message, source_ip)
           VALUES (?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          enquiry.name,
          enquiry.email,
          enquiry.company || null,
          enquiry.service || null,
          enquiry.message,
          ip,
        )
        .run();

      /*
       * waitUntil, so the visitor's "sent" is not held hostage to two SMTP
       * round-trips. `notified` is only flagged once both actually resolve,
       * which is what makes the dashboard's warning badge mean something.
       */
      ctx.waitUntil(
        Promise.all([notifyTeam(env, enquiry), confirmToEnquirer(env, enquiry)])
          .then(() =>
            db.prepare(`UPDATE enquiries SET notified = 1 WHERE id = ?`).bind(meta.last_row_id).run(),
          )
          .catch((error) => console.error("enquiry email failed", meta.last_row_id, error)),
      );

      return json({ ok: true });
    }

    /* ------------------------------------------------------- dashboard auth */
    case "POST /api/login": {
      if (await isThrottled(db, ip)) {
        return json({ error: "Too many attempts. Try again shortly." }, { status: 429 });
      }

      const { username, password } = await request.json().catch(() => ({}));
      if (typeof username !== "string" || typeof password !== "string") {
        return json({ error: "Invalid credentials" }, { status: 400 });
      }

      const account = await verifyLogin(db, username.trim().toLowerCase(), password);
      if (!account) {
        await recordFailure(db, ip);
        /* One message for both cases: naming which half was wrong confirms a
           valid username, and there are only three to guess. */
        return json({ error: "Invalid credentials" }, { status: 401 });
      }

      await clearFailures(db, ip);
      const { raw, maxAge } = await createSession(db, account.username);

      return json(
        { ok: true, user: account.displayName },
        { headers: { "Set-Cookie": sessionCookie(raw, maxAge) } },
      );
    }

    case "POST /api/logout": {
      await destroySession(db, request);
      return json({ ok: true }, { headers: { "Set-Cookie": clearCookie() } });
    }

    case "GET /api/me": {
      const user = await sessionUser(db, request);
      return user ? json({ user: user.displayName }) : json({ user: null }, { status: 401 });
    }

    /* -------------------------------------------- dashboard: the contacts */
    case "GET /api/enquiries": {
      const user = await sessionUser(db, request);
      if (!user) return json({ error: "Unauthorised" }, { status: 401 });

      /* source_ip is deliberately not selected - it exists to investigate
         abuse, not to be browsed. */
      const { results } = await db
        .prepare(
          `SELECT id, name, email, company, service, message, created_at,
                  notified, status, reviewed, notes, updated_at, updated_by
           FROM enquiries ORDER BY created_at DESC LIMIT 500`,
        )
        .all();

      /* STATUSES travels with the payload so the dropdown is built from the
         server's list rather than a copy in the bundle that drifts from it. */
      return json({ enquiries: results, statuses: STATUSES });
    }

    default:
      return json({ error: "Not found" }, { status: 404 });
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.hostname.endsWith(".workers.dev")) {
      url.hostname = "pixelkriti.com";
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname.startsWith("/api/")) {
      try {
        return await handleApi(request, env, ctx, url);
      } catch (error) {
        /* Logged for us; never returned. A stack trace on a 500 is a map of
           the schema for anyone poking at the endpoints. */
        console.error("api error", url.pathname, error);
        return json({ error: "Something went wrong" }, { status: 500 });
      }
    }

    const response = await env.ASSETS.fetch(request);

    /*
     * The dashboard is unlinked, but unlinked is not unindexed: a crawler
     * finds URLs through referrers, toolbars and pasted links. robots.txt
     * would only advertise the path to anyone who reads it, so the noindex
     * rides on the response instead.
     */
    if (url.pathname === "/dashboard" || url.pathname.startsWith("/dashboard/")) {
      const headers = new Headers(response.headers);
      headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
      return new Response(response.body, { ...response, headers });
    }

    return response;
  },
};
