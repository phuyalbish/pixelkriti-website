/**
 * Enquiry notifications, via Resend.
 *
 * Two emails per enquiry:
 *   1. the team ("you have a new contact enquiry"), replying to the enquirer
 *   2. the enquirer ("we have got it"), so the form is not a black hole
 *
 * Both are best-effort and neither can fail the submission - see index.js. The
 * enquiry is committed to the database first; email is a courtesy on top of a
 * record that already exists. An outage at Resend must never cost a lead.
 *
 * ---------------------------------------------------------------------------
 * Chosen over the Gmail API deliberately, after building both.
 *
 * Gmail sends as the authenticated mailbox, so client confirmations would have
 * arrived from pixelkriti@gmail.com - a gmail.com address on a site whose
 * argument is that you own what you run. It also needs an OAuth refresh token
 * that Google expires after 7 DAYS unless the consent screen is published,
 * failing silently when it does. Resend needs one API key and a verified
 * domain, and sends as info@pixelkriti.com.
 *
 * RESEND_API_KEY is a Wrangler secret - never in this repo, never in .env,
 * never in the bundle. FROM_EMAIL must be on a domain verified in Resend, or
 * every send is rejected.
 * ---------------------------------------------------------------------------
 */

const ENDPOINT = "https://api.resend.com/emails";

/** Escaped before interpolation: this content is a stranger's free text. */
const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

async function send(env, payload) {
  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: env.FROM_EMAIL, ...payload }),
  });

  if (!response.ok) {
    /* Body, not just status: Resend names the actual cause (domain not
       verified, key revoked) and that message is the whole diagnosis when
       this fails months from now. */
    throw new Error(`Resend ${response.status}: ${await response.text()}`);
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
    reply_to: enquiry.email,
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
    reply_to: env.NOTIFY_TO.split(",")[0].trim(),
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
