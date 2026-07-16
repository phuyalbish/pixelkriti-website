/**
 * Password and session handling for the dashboard.
 *
 * Everything here runs in the Worker and nothing here is importable by the
 * React app. That separation IS the security model: the browser only ever
 * holds an opaque session token, so the bundle can be read by anyone (it is
 * public, by definition) without revealing a password or an enquiry.
 */

const encoder = new TextEncoder();

const toHex = (buffer) =>
  [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");

/**
 * PBKDF2-SHA256, matching scripts/seed-accounts.mjs.
 *
 * The salt is fed in as its hex STRING rather than decoded to bytes - that is
 * not an oversight. Node's pbkdf2Sync(pw, saltString) encodes the string as
 * UTF-8, so decoding it here would derive a different key and every login
 * would fail. The two must agree; they agree on this.
 */
async function derive(password, salt, iterations) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: encoder.encode(salt), iterations, hash: "SHA-256" },
    key,
    256,
  );
  return toHex(bits);
}

/**
 * Constant-time string compare.
 *
 * A plain `===` returns as soon as two characters differ, and that timing
 * difference is measurable across a network - enough, given patience, to
 * recover a hash one byte at a time. This always walks the full length.
 */
function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function sha256Hex(value) {
  return toHex(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
}

/** How long a login lasts before it has to be done again. */
const SESSION_HOURS = 12;

/* Brute-force throttle: N failures from one IP inside the window, then stop. */
const MAX_FAILURES = 8;
const WINDOW_MINUTES = 15;

export async function isThrottled(db, ip) {
  const row = await db
    .prepare(
      `SELECT failures FROM login_attempts
       WHERE ip = ? AND datetime(window_start, '+${WINDOW_MINUTES} minutes') > datetime('now')`,
    )
    .bind(ip)
    .first();
  return (row?.failures ?? 0) >= MAX_FAILURES;
}

export async function recordFailure(db, ip) {
  await db
    .prepare(
      `INSERT INTO login_attempts (ip, failures, window_start)
       VALUES (?, 1, datetime('now'))
       ON CONFLICT(ip) DO UPDATE SET
         failures = CASE
           WHEN datetime(window_start, '+${WINDOW_MINUTES} minutes') > datetime('now')
           THEN failures + 1 ELSE 1 END,
         window_start = CASE
           WHEN datetime(window_start, '+${WINDOW_MINUTES} minutes') > datetime('now')
           THEN window_start ELSE datetime('now') END`,
    )
    .bind(ip)
    .run();
}

export async function clearFailures(db, ip) {
  await db.prepare(`DELETE FROM login_attempts WHERE ip = ?`).bind(ip).run();
}

/**
 * Verify a username/password pair. Returns the account or null.
 *
 * An unknown username still runs a PBKDF2 derivation against a dummy salt
 * before returning null. Skipping it would make "no such user" return in ~1ms
 * and "wrong password" in ~15ms, which tells an attacker exactly which of the
 * three usernames are real - and the whole point is that they are guessable.
 */
export async function verifyLogin(db, username, password) {
  const account = await db
    .prepare(`SELECT username, display_name, password_hash, salt, iterations FROM accounts WHERE username = ?`)
    .bind(username)
    .first();

  if (!account) {
    await derive(password, "decoy-salt-constant-work", 100_000);
    return null;
  }

  const candidate = await derive(password, account.salt, account.iterations);
  if (!timingSafeEqual(candidate, account.password_hash)) return null;

  return { username: account.username, displayName: account.display_name };
}

/** Mint a session. The raw token is returned once, for the cookie only. */
export async function createSession(db, username) {
  const raw = crypto.randomUUID() + crypto.randomUUID();
  const tokenHash = await sha256Hex(raw);

  await db
    .prepare(
      `INSERT INTO sessions (token_hash, username, expires_at)
       VALUES (?, ?, datetime('now', '+${SESSION_HOURS} hours'))`,
    )
    .bind(tokenHash, username)
    .run();

  await db
    .prepare(`UPDATE accounts SET last_login_at = datetime('now') WHERE username = ?`)
    .bind(username)
    .run();

  /* Opportunistic sweep - expired rows are dead weight and dead risk. */
  await db.prepare(`DELETE FROM sessions WHERE expires_at <= datetime('now')`).run();

  return { raw, maxAge: SESSION_HOURS * 3600 };
}

export async function sessionUser(db, request) {
  const raw = readCookie(request, COOKIE);
  if (!raw) return null;

  const row = await db
    .prepare(
      `SELECT s.username, a.display_name FROM sessions s
       JOIN accounts a ON a.username = s.username
       WHERE s.token_hash = ? AND s.expires_at > datetime('now')`,
    )
    .bind(await sha256Hex(raw))
    .first();

  return row ? { username: row.username, displayName: row.display_name } : null;
}

export async function destroySession(db, request) {
  const raw = readCookie(request, COOKIE);
  if (raw) {
    await db.prepare(`DELETE FROM sessions WHERE token_hash = ?`).bind(await sha256Hex(raw)).run();
  }
}

export const COOKIE = "pk_session";

function readCookie(request, name) {
  const header = request.headers.get("Cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === name) return rest.join("=");
  }
  return null;
}

/*
 * HttpOnly: JavaScript cannot read it, so an XSS bug cannot steal the session.
 * Secure: never sent over plain HTTP.
 * SameSite=Strict: the cookie is not attached to cross-site requests, which is
 *   what makes the dashboard's POST endpoints immune to CSRF without a token.
 */
export const sessionCookie = (raw, maxAge) =>
  `${COOKIE}=${raw}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;

export const clearCookie = () =>
  `${COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0`;
