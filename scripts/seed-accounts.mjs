/**
 * Generates the three dashboard accounts and prints the SQL to create them.
 *
 * Run:
 *   node scripts/seed-accounts.mjs
 *
 * It prints two things: the SQL (safe to paste anywhere) and the plaintext
 * passwords (safe to paste NOWHERE). The passwords are shown once, by design -
 * only their PBKDF2 hash goes to the database, so nobody, including us, can
 * read them back out later. A lost password is reset by re-running this for
 * that one account; it is never recovered.
 *
 * Node's pbkdf2 and the Worker's Web Crypto PBKDF2 are the same algorithm with
 * the same parameters, which is what lets this script write a hash the Worker
 * can verify. Change ITERATIONS here and you must change it there - or rather,
 * you must not: the value is stored per-account in the `iterations` column
 * precisely so it can be raised for new accounts without locking out old ones.
 */
import { pbkdf2Sync, randomBytes, randomInt } from "node:crypto";

/**
 * 100k rounds of SHA-256. High enough to make offline cracking of a stolen
 * hash expensive, low enough to stay well inside a Worker's CPU budget on
 * every login (~15ms).
 */
const ITERATIONS = 100_000;
const KEY_LENGTH = 32;

/*
 * Deliberately excludes look-alikes (0/O, 1/l/I) - these get read off a screen
 * and typed by hand at least once, and a password you cannot transcribe gets
 * replaced by a worse one you can.
 */
const ALPHABET = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const LENGTH = 20;

/** ~114 bits of entropy. Not memorable, not meant to be - use a manager. */
const password = () =>
  Array.from({ length: LENGTH }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");

const hash = (plain, salt) =>
  pbkdf2Sync(plain, salt, ITERATIONS, KEY_LENGTH, "sha256").toString("hex");

/*
 * Spelling note: "Bishal", per src/data/team.js and the Hellotrekkers case
 * study. The request said "Vishal" - assumed to be voice transcription.
 */
const PEOPLE = [
  { username: "amitesh", display: "Amitesh" },
  { username: "bishal", display: "Bishal" },
  { username: "muzammil", display: "Muzammil" },
];

const rows = PEOPLE.map((person) => {
  const plain = password();
  const salt = randomBytes(16).toString("hex");
  return { ...person, plain, salt, hash: hash(plain, salt) };
});

const sql = rows
  .map(
    (r) =>
      `INSERT INTO accounts (username, display_name, password_hash, salt, iterations) VALUES ('${r.username}', '${r.display}', '${r.hash}', '${r.salt}', ${ITERATIONS}) ON CONFLICT(username) DO UPDATE SET password_hash=excluded.password_hash, salt=excluded.salt, iterations=excluded.iterations;`,
  )
  .join("\n");

console.log("--- SQL ---");
console.log(sql);
console.log("\n--- PASSWORDS (shown once; store in a password manager) ---");
for (const r of rows) console.log(`${r.display.padEnd(10)} ${r.username.padEnd(10)} ${r.plain}`);
