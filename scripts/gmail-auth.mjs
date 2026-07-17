/**
 * One-time Gmail consent, to mint the refresh token the Worker sends with.
 *
 * Run:
 *   node scripts/gmail-auth.mjs
 *
 * It opens a Google sign-in, takes the consent, exchanges the code for a
 * refresh token, and pipes that token straight into
 * `wrangler secret put GOOGLE_REFRESH_TOKEN`.
 *
 * The token is never printed, never written to a file, and never returned from
 * this process - it goes from Google's response into wrangler's stdin and
 * nowhere else. That is deliberate: it is a long-lived key to a mailbox, and
 * anything that prints it puts it in a scrollback buffer forever.
 *
 * BEFORE RUNNING, in Google Cloud Console (console.cloud.google.com):
 *
 *   1. APIs & Services -> Library -> enable the GMAIL API.
 *      Without this the send call 403s even with a perfect token.
 *
 *   2. APIs & Services -> OAuth consent screen -> PUBLISH APP
 *      ("In production"). While it is in "Testing", Google expires refresh
 *      tokens after 7 DAYS and sending stops dead with no error visible
 *      anywhere except `notified = 0` on new rows in the dashboard.
 *      Publishing an app that only requests gmail.send for its own account
 *      does not require Google's verification review.
 *
 *   3. APIs & Services -> Credentials -> your OAuth client -> add this EXACT
 *      redirect URI:
 *
 *        http://localhost:8976/callback
 *
 *      If the client is of type "Desktop app" this is already allowed. If it
 *      is a "Web application", it must be added by hand or Google refuses the
 *      sign-in with redirect_uri_mismatch.
 */
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";

const PORT = 8976;
const REDIRECT = `http://localhost:${PORT}/callback`;
/* Only the permission to send. Not read, not modify - if this token ever
   leaks, it can send mail as you, which is bad enough; it must not also be
   able to read the mailbox. */
const SCOPE = "https://www.googleapis.com/auth/gmail.send";

/* Read .env directly rather than pull in a dotenv dependency for one script. */
const env = Object.fromEntries(
  (await readFile(new URL("../.env", import.meta.url), "utf8"))
    .split("\n")
    .filter((line) => line.trim() && !line.trim().startsWith("#"))
    .map((line) => {
      const index = line.indexOf("=");
      return [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^["']|["']$/g, "")];
    }),
);

for (const key of ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"]) {
  if (!env[key]) {
    console.error(`Missing ${key} in .env`);
    process.exit(1);
  }
}

const authUrl =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: REDIRECT,
    response_type: "code",
    scope: SCOPE,
    /*
     * access_type=offline is what asks for a refresh token at all, and
     * prompt=consent forces Google to reissue one. Without the prompt, a
     * second run on an already-consented account returns an access token and
     * NO refresh token - the single most common way this flow "succeeds"
     * while producing nothing usable.
     */
    access_type: "offline",
    prompt: "consent",
  });

console.log("\nSign in as pixelkriti@gmail.com - the account the mail sends FROM.\n");
console.log(authUrl, "\n");
spawn("open", [authUrl], { stdio: "ignore" }).unref();

const code = await new Promise((resolve, reject) => {
  const server = createServer((request, response) => {
    const url = new URL(request.url, `http://localhost:${PORT}`);
    if (url.pathname !== "/callback") return response.end();

    const error = url.searchParams.get("error");
    response.writeHead(200, { "Content-Type": "text/html" });
    response.end(
      `<p style="font-family:system-ui;padding:40px">${
        error ? `Denied: ${error}` : "Done. Close this tab and return to the terminal."
      }</p>`,
    );
    server.close();
    error ? reject(new Error(error)) : resolve(url.searchParams.get("code"));
  });
  server.listen(PORT);
});

const response = await fetch("https://oauth2.googleapis.com/token", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({
    code,
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    redirect_uri: REDIRECT,
    grant_type: "authorization_code",
  }),
});

if (!response.ok) {
  console.error("Token exchange failed:", await response.text());
  process.exit(1);
}

const { refresh_token: refreshToken } = await response.json();

if (!refreshToken) {
  console.error(
    "Google returned no refresh token. This happens when the account has already\n" +
      "consented and prompt=consent was not honoured. Revoke access at\n" +
      "https://myaccount.google.com/permissions and run this again.",
  );
  process.exit(1);
}

console.log("Got a refresh token. Handing it to wrangler (it is never printed)...\n");

const wrangler = spawn("npx", ["wrangler", "secret", "put", "GOOGLE_REFRESH_TOKEN"], {
  stdio: ["pipe", "inherit", "inherit"],
  cwd: new URL("..", import.meta.url).pathname,
});
wrangler.stdin.write(refreshToken);
wrangler.stdin.end();

wrangler.on("close", (status) => {
  console.log(
    status === 0
      ? "\nStored. Email should work on the next enquiry - send one through\n" +
          "https://pixelkriti.com/contact and check the dashboard: no amber\n" +
          '"Notification email failed" badge means it sent.\n'
      : "\nwrangler failed - the secret was NOT stored.",
  );
  process.exit(status ?? 1);
});
