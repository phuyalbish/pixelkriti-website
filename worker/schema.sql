-- Schema for pixelkriti-enquiries (D1).
--
-- Apply with:
--   wrangler d1 execute pixelkriti-enquiries --remote --file worker/schema.sql
--
-- This database holds other people's personal data: their name, their email,
-- and a written description of what is broken in their business. That is the
-- reason for every "why is this not simpler" decision below.

-- ---------------------------------------------------------------------------
-- Enquiries: what the contact form writes, and what the dashboard reads.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS enquiries (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  company     TEXT,
  service     TEXT,
  message     TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),

  -- Whether the notification email actually went out. The enquiry is stored
  -- BEFORE any email is attempted, so a provider outage loses the email but
  -- never the lead - it just shows up in the dashboard unflagged.
  notified    INTEGER NOT NULL DEFAULT 0,

  -- Kept only to investigate abuse. Not shown in the dashboard.
  source_ip   TEXT,

  -- Where the lead is in the pipeline: New | Contacted | Quoted | Deal |
  -- Development | Delivered | Lost.
  --
  -- Deliberately NOT a CHECK constraint. This column reached production via
  -- ALTER TABLE, and SQLite cannot add a CHECK to an existing table without
  -- rebuilding it - so a CHECK here would make this file describe a stricter
  -- table than the one actually running, which is worse than no CHECK at all.
  -- The single source of truth is STATUSES in worker/index.js, which rejects
  -- anything else on the way in. If this table is ever rebuilt for another
  -- reason, add the constraint then and delete this note.
  status      TEXT NOT NULL DEFAULT 'New',

  -- Free-text working notes added from the dashboard.
  notes       TEXT,

  -- Who last touched it, and when. Three people share this list; without
  -- this, "why is this marked Lost?" has no answer.
  updated_at  TEXT,
  updated_by  TEXT
);

CREATE INDEX IF NOT EXISTS idx_enquiries_created ON enquiries (created_at DESC);

-- ---------------------------------------------------------------------------
-- Accounts: exactly three, created by scripts/seed-accounts.mjs.
--
-- `password_hash` is PBKDF2-SHA256 over a per-account random salt. Plaintext
-- passwords are never stored, never logged, and never committed - if one is
-- lost, it is reset, not recovered.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS accounts (
  username      TEXT PRIMARY KEY,
  display_name  TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  salt          TEXT NOT NULL,
  iterations    INTEGER NOT NULL,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  last_login_at TEXT
);

-- ---------------------------------------------------------------------------
-- Sessions: server-side, so a logout is a real logout and a stolen cookie can
-- be revoked. Only the SHA-256 of the token is stored - the raw token exists
-- solely in the user's cookie, so a dump of this table cannot be replayed.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  username   TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  FOREIGN KEY (username) REFERENCES accounts (username) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions (expires_at);

-- ---------------------------------------------------------------------------
-- Login throttle. Three known usernames on a public URL is a guessable target,
-- so failed attempts are counted per IP and refused past a threshold. Without
-- this, the only thing between an attacker and the contact list is how fast
-- they can send requests.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS login_attempts (
  ip           TEXT PRIMARY KEY,
  failures     INTEGER NOT NULL DEFAULT 0,
  window_start TEXT NOT NULL DEFAULT (datetime('now'))
);
