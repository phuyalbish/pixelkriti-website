/**
 * Enquiry notifications, via the Gmail API.
 *
 * Two emails per enquiry:
 *   1. the team ("you have a new contact enquiry"), replying to the enquirer
 *   2. the enquirer ("we have got it"), so the form is not a black hole
 *
 * Both are best-effort and neither can fail the submission - see index.js. The
 * enquiry is committed to the database first; email is a courtesy on top of a
 * record that already exists. A Google outage must never cost a lead.
 *
 * ---------------------------------------------------------------------------
 * WHY GMAIL AND NOT RESEND
 *
 * Resend would send as info@pixelkriti.com, which is the better address to
 * reach a client from - but it needs that domain verified by DNS, which is not
 * done. Gmail sends today, from the mailbox that already exists. That is the
 * whole trade: a working notification from a gmail.com address beats a
 * perfect one that does not send.
 *
 * To move back later: verify pixelkriti.com in Resend, then restore the
 * Resend version of this file (git history) and swap the vars in
 * wrangler.jsonc. Nothing else in the Worker cares which sender is used.
 * ---------------------------------------------------------------------------
 * CREDENTIALS
 *
 * Sending needs THREE things, not two. GOOGLE_CLIENT_ID and
 * GOOGLE_CLIENT_SECRET identify this application; they authorise nothing on
 * their own. GOOGLE_REFRESH_TOKEN is what actually grants access to the
 * mailbox, and it only exists once a human has signed in and consented -
 * see scripts/gmail-auth.mjs.
 *
 * THE 7-DAY TRAP: while the OAuth consent screen is in "Testing", Google
 * expires refresh tokens after 7 days. Everything works, then silently stops,
 * and the only symptom is `notified = 0` on new rows in the dashboard. The
 * consent screen must be set to "In production" for the token to last.
 * ---------------------------------------------------------------------------
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SEND_URL = "https://gmail.googleapis.com/gmail/v1/users/me/messages/send";

/** Escaped before interpolation: this content is a stranger's free text. */
const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * base64url, UTF-8 safe.
 *
 * btoa() throws on any code point above 0xFF, so the string is encoded to
 * UTF-8 bytes first. Without this, one accented character in a client's name
 * would throw rather than send.
 */
function base64url(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Standard base64, for RFC 2047 header words (which are not url-safe). */
function base64(value) {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

/**
 * RFC 2047 encoding for headers.
 *
 * Subject lines carry client names, and a raw non-ASCII byte in a header is
 * not merely mangled - it is invalid, and gets the whole message rejected.
 */
const encodeHeader = (value) =>
  // eslint-disable-next-line no-control-regex
  /^[\x00-\x7F]*$/.test(value) ? value : `=?UTF-8?B?${base64(value)}?=`;

/** Refresh tokens are long-lived; access tokens last an hour. Trade one for
 *  the other on each send - two round-trips, no state to keep or invalidate. */
async function accessToken(env) {
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      refresh_token: env.GOOGLE_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    /*
     * `invalid_grant` here almost always means the refresh token was revoked
     * or expired - which, on a Testing-status consent screen, happens exactly
     * 7 days after it was minted. Re-run scripts/gmail-auth.mjs, and publish
     * the consent screen so it does not recur.
     */
    throw new Error(`Google token refresh failed ${response.status}: ${await response.text()}`);
  }

  return (await response.json()).access_token;
}

async function send(env, { to, subject, html, replyTo }) {
  const token = await accessToken(env);

  const headers = [
    `From: ${env.GMAIL_SENDER}`,
    `To: ${to.join(", ")}`,
    replyTo && `Reply-To: ${replyTo}`,
    `Subject: ${encodeHeader(subject)}`,
    "MIME-Version: 1.0",
    'Content-Type: text/html; charset="UTF-8"',
  ].filter(Boolean);

  /* CRLF, not LF: RFC 5322 line endings. Gmail tolerates LF; other agents in
     the chain do not, and the failure is a mangled body rather than an error. */
  const raw = base64url(`${headers.join("\r\n")}\r\n\r\n${html}`);

  const response = await fetch(SEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw }),
  });

  if (!response.ok) {
    throw new Error(`Gmail send failed ${response.status}: ${await response.text()}`);
  }

  return response.json();
}

/** "You have the new contact enquiry" - to the team. */
export function notifyTeam(env, enquiry) {
  const to = env.NOTIFY_TO.split(",").map((address) => address.trim()).filter(Boolean);

  const rows = [
    ["Name", enquiry.name],
    ["Email", enquiry.email],
    ["Company", enquiry.company],
    ["Service", enquiry.service],
  ]
    .filter(([, value]) => value)
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 16px 4px 0;color:#666;">${label}</td><td style="padding:4px 0;"><strong>${escapeHtml(value)}</strong></td></tr>`,
    )
    .join("");

  return send(env, {
    to,
    /* Replying to the notification reaches the client, not the void. */
    replyTo: enquiry.email,
    subject: `New enquiry - ${enquiry.name}${enquiry.company ? ` (${enquiry.company})` : ""}`,
    html: `<div style="font-family:system-ui,sans-serif;max-width:560px;">
      <p style="margin:0 0 16px;">You have a new contact enquiry.</p>
      <table style="border-collapse:collapse;font-size:14px;">${rows}</table>
      <p style="margin:24px 0 4px;color:#666;font-size:14px;">What is not working:</p>
      <p style="white-space:pre-wrap;margin:0;padding:16px;background:#f6f6f4;border-radius:8px;">${escapeHtml(enquiry.message)}</p>
      <p style="margin:24px 0 0;font-size:13px;color:#888;">Reply to this email to answer ${escapeHtml(enquiry.name)} directly. All enquiries: https://pixelkriti.com/dashboard</p>
    </div>`,
  });
}

/** Receipt for the person who filled the form. */
export function confirmToEnquirer(env, enquiry) {
  return send(env, {
    to: [enquiry.email],
    replyTo: env.NOTIFY_TO.split(",")[0].trim(),
    subject: "We have got your enquiry - Pixel Kriti",
    /*
     * No promised response time. We cannot keep a promise the site has not
     * been told to make, and "within 24 hours" in an automated email is the
     * easiest lie on any website to accidentally tell.
     */
    html: `<div style="font-family:system-ui,sans-serif;max-width:560px;">
      <p>Hi ${escapeHtml(enquiry.name.split(" ")[0])},</p>
      <p>Thanks for getting in touch - your enquiry has reached us and one of us will read it and reply personally.</p>
      <p style="margin:24px 0 4px;color:#666;font-size:14px;">What you sent:</p>
      <p style="white-space:pre-wrap;margin:0;padding:16px;background:#f6f6f4;border-radius:8px;">${escapeHtml(enquiry.message)}</p>
      <p style="margin:24px 0 0;">- Pixel Kriti</p>
    </div>`,
  });
}
