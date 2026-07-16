import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiAlertTriangle,
  FiArrowLeft,
  FiChevronDown,
  FiChevronRight,
  FiLock,
  FiLogOut,
  FiMail,
  FiSearch,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import Container from "@/components/Container.jsx";
import usePageMeta from "@/hooks/usePageMeta.js";

/**
 * The enquiry dashboard. /dashboard lists; /dashboard/:id opens one to edit.
 *
 * Unlinked from the site by design - no nav, no footer, no sitemap - and the
 * Worker sends X-Robots-Tag: noindex on /dashboard and everything under it.
 *
 * NOTHING SENSITIVE LIVES IN THIS FILE, and nothing sensitive may ever be
 * added to it. This component ships to every visitor of pixelkriti.com in a
 * readable bundle - so it holds no password, no hash, and no enquiry. It draws
 * a login box, posts what is typed to the Worker, and renders whatever JSON
 * comes back. The Worker decides; the page only asks.
 *
 * That is also why the login state is derived from /api/me on mount rather
 * than kept in localStorage: the session lives in an HttpOnly cookie this code
 * cannot read, which is exactly what stops an XSS bug from stealing it.
 */

const field =
  "w-full border-b border-line bg-transparent py-3 text-paper placeholder:text-paper-faint transition-colors focus:border-paper focus:outline-none";

/**
 * "Unreviewed" is defined as status New - an enquiry nobody has triaged yet -
 * rather than a separate flag.
 *
 * A second "reviewed" boolean alongside the status would let the two disagree:
 * an enquiry marked Reviewed but still New, or Unreviewed but already a Deal.
 * Deriving it means the filter can never contradict the pipeline, and touching
 * the status is the act of reviewing.
 */
const isUnreviewed = (item) => item.status === "New";

const VIEWS = [
  { id: "unreviewed", label: "Un Reviewed", match: isUnreviewed },
  { id: "all", label: "All", match: () => true },
  { id: "reviewed", label: "Reviewed", match: (item) => !isUnreviewed(item) },
];

/**
 * Name and company, as asked - plus email, because the address is how a lead
 * is identified in every other tool (the inbox, the reply thread), and a
 * contact search that cannot find "someone@acme.com" fails the one lookup it
 * will be asked for most.
 *
 * Filtering happens here rather than in SQL because the list is already loaded
 * and capped at 500 rows: a round-trip per keystroke would be slower and no
 * more correct. If this ever outgrows that cap, the search moves server-side.
 */
const SEARCH_FIELDS = ["name", "company", "email"];

const matchesQuery = (item, query) => {
  if (!query) return true;
  const needle = query.trim().toLowerCase();
  return SEARCH_FIELDS.some((key) => (item[key] ?? "").toLowerCase().includes(needle));
};

/* Muted by default; only the ends of the pipeline earn a colour, so a glance
   picks out what is won, lost, or untouched without a rainbow of badges. */
const STATUS_STYLE = {
  New: "border-paper/40 text-paper",
  Deal: "border-brand/50 text-brand",
  Delivered: "border-brand/50 text-brand",
  Lost: "border-red-400/40 text-red-400",
};
const statusStyle = (status) => STATUS_STYLE[status] ?? "border-line-strong text-paper-dim";

const formatDate = (value) =>
  /* The column is UTC from SQLite's datetime('now'); the Z makes the browser
     render it in the reader's zone instead of pretending UTC is local. */
  new Date(`${value.replace(" ", "T")}Z`).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

function LoginForm({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error ?? "Could not sign in");
      onSuccess(data.user);
    } catch (problem) {
      setError(problem.message);
      setPassword("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-sm">
        <FiLock aria-hidden="true" className="text-paper-faint" size={20} />
        <h1 className="mt-4 font-display text-title tracking-display">Dashboard</h1>
        <p className="mt-2 text-sm text-paper-dim">Sign in to view enquiries.</p>

        <div className="mt-10 space-y-6">
          <div>
            <label htmlFor="username" className="eyebrow">
              Username
            </label>
            <input
              id="username"
              type="text"
              required
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className={field}
            />
          </div>
          <div>
            <label htmlFor="password" className="eyebrow">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={field}
            />
          </div>
        </div>

        {error && (
          /* role=alert so it is announced, not just shown. */
          <p role="alert" className="mt-6 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-10 w-full rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink transition-colors duration-300 hover:bg-paper-dim disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

function StatusSelect({ item, statuses, disabled, onChange }) {
  return (
    <div className="relative">
      <label htmlFor={`status-${item.id}`} className="sr-only">
        Status for {item.name}
      </label>
      <select
        id={`status-${item.id}`}
        value={item.status}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className={`cursor-pointer appearance-none rounded-full border bg-transparent py-1.5 pl-4 pr-9 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors focus:outline-none focus:ring-1 focus:ring-paper disabled:opacity-50 ${statusStyle(
          item.status,
        )}`}
      >
        {statuses.map((status) => (
          <option key={status} value={status} className="bg-ink text-paper">
            {status}
          </option>
        ))}
      </select>
      <FiChevronDown
        aria-hidden="true"
        size={13}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-paper-faint"
      />
    </div>
  );
}

/**
 * Icon-only delete, still two-step.
 *
 * One click removes a real lead permanently - no undo, no archive table behind
 * it - so the destructive click is never the one made by accident. The icon
 * arms it; a worded button confirms it, because "Confirm" next to a bin should
 * say what it is confirming.
 */
function DeleteButton({ item, busy, onDelete }) {
  const [armed, setArmed] = useState(false);

  if (!armed) {
    return (
      <button
        type="button"
        onClick={() => setArmed(true)}
        aria-label={`Delete enquiry from ${item.name}`}
        className="rounded-full border border-line-strong p-2 text-paper-faint transition-colors hover:border-red-400/50 hover:text-red-400"
      >
        <FiTrash2 aria-hidden="true" size={13} />
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={onDelete}
        className="rounded-full border border-red-400/50 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-red-400 transition-colors hover:bg-red-400/10 disabled:opacity-50"
      >
        {busy ? "Deleting…" : "Delete for good"}
      </button>
      <button
        type="button"
        onClick={() => setArmed(false)}
        aria-label="Cancel delete"
        className="text-paper-faint transition-colors hover:text-paper"
      >
        <FiX aria-hidden="true" size={14} />
      </button>
    </span>
  );
}

/** One line per enquiry. The name opens it; nothing else lives out here. */
function Row({ item, statuses, onPatch, onDelete }) {
  const [busy, setBusy] = useState(false);

  const run = async (work) => {
    setBusy(true);
    try {
      await work();
    } finally {
      setBusy(false);
    }
  };

  return (
    <li className="border-t border-line py-5">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <div className="min-w-0 flex-1">
          <Link
            to={`/dashboard/${item.id}`}
            className="group inline-flex items-center gap-2 font-display text-xl tracking-display transition-colors hover:text-paper-dim"
          >
            <span className="truncate">
              {item.name}
              {item.company && <span className="text-paper-faint"> · {item.company}</span>}
            </span>
            <FiChevronRight
              aria-hidden="true"
              size={15}
              className="shrink-0 text-paper-faint transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </Link>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="inline-flex items-center gap-1.5 text-sm text-paper-dim">
              <FiMail aria-hidden="true" size={13} />
              {item.email}
            </span>
            {item.service && (
              <span className="rounded-full border border-line px-3 py-0.5 font-mono text-[11px] text-paper-faint">
                {item.service}
              </span>
            )}
            {/* The enquiry saves before the email is attempted, so this flags
                the ones where the notification failed and nobody was told. */}
            {!item.notified && (
              <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-amber-400">
                <FiAlertTriangle aria-hidden="true" size={12} />
                Notification email failed
              </span>
            )}
          </div>
        </div>

        <p className="font-mono text-xs text-paper-faint">{formatDate(item.created_at)}</p>

        <StatusSelect
          item={item}
          statuses={statuses}
          disabled={busy}
          onChange={(status) => run(() => onPatch(item.id, { status }))}
        />
        <DeleteButton item={item} busy={busy} onDelete={() => run(() => onDelete(item.id))} />
      </div>
    </li>
  );
}

const EDITABLE = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "company", label: "Company", type: "text" },
  { key: "service", label: "Service interested in", type: "text" },
];

/** The whole enquiry, editable. */
function Detail({ item, statuses, onPatch, onDelete, onBack }) {
  const [draft, setDraft] = useState(item);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  /* Re-sync when the server hands back a fresh row (or a different enquiry is
     opened), so the form never shows a value the database disagrees with. */
  useEffect(() => {
    setDraft(item);
  }, [item]);

  const set = (key) => (event) =>
    setDraft((current) => ({ ...current, [key]: event.target.value }));

  /* Only what actually changed is sent - a PATCH of untouched fields would
     stamp updated_by on a save that changed nothing. */
  const changed = useMemo(() => {
    const diff = {};
    for (const key of ["name", "email", "company", "service", "message", "notes"]) {
      const now = (draft[key] ?? "").trim();
      const was = (item[key] ?? "").trim();
      if (now !== was) diff[key] = now;
    }
    return diff;
  }, [draft, item]);

  const dirty = Object.keys(changed).length > 0;

  const save = async () => {
    setBusy(true);
    setError(null);
    try {
      await onPatch(item.id, changed);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (problem) {
      setError(problem.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="pb-24 pt-20 md:pt-28">
      <Container>
        <button
          type="button"
          onClick={onBack}
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-paper-faint transition-colors hover:text-paper"
        >
          <FiArrowLeft
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          All enquiries
        </button>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-display tracking-display">{item.name}</h1>
          <div className="flex items-center gap-3">
            <StatusSelect
              item={item}
              statuses={statuses}
              disabled={busy}
              onChange={(status) => onPatch(item.id, { status })}
            />
            <DeleteButton item={item} busy={busy} onDelete={() => onDelete(item.id)} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line pb-8 font-mono text-[11px] text-paper-faint">
          <span>Received {formatDate(item.created_at)}</span>
          {item.updated_by && item.updated_at && (
            <span>
              · Last edited by {item.updated_by}, {formatDate(item.updated_at)}
            </span>
          )}
          {!item.notified && (
            <span className="inline-flex items-center gap-1.5 text-amber-400">
              <FiAlertTriangle aria-hidden="true" size={12} />
              Notification email failed
            </span>
          )}
        </div>

        <div className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {EDITABLE.map((entry) => (
            <div key={entry.key}>
              <label htmlFor={entry.key} className="eyebrow">
                {entry.label}
              </label>
              <input
                id={entry.key}
                type={entry.type}
                required={entry.required}
                value={draft[entry.key] ?? ""}
                onChange={set(entry.key)}
                className={field}
              />
            </div>
          ))}
        </div>

        <div className="mt-8">
          <label htmlFor="message" className="eyebrow">
            What is not working
          </label>
          {/* Editable because everything here is - but this is the only field
              holding the client's own words, and there is no copy of the
              original once it is overwritten. Corrections belong in Notes
              where they can be read alongside what was actually said. */}
          <textarea
            id="message"
            rows={5}
            value={draft.message ?? ""}
            onChange={set("message")}
            className={`${field} resize-y`}
          />
        </div>

        <div className="mt-8">
          <label htmlFor="notes" className="eyebrow">
            Notes
          </label>
          <textarea
            id="notes"
            rows={4}
            value={draft.notes ?? ""}
            onChange={set("notes")}
            placeholder="Anything worth knowing next time this is opened."
            className={`${field} resize-y`}
          />
        </div>

        {error && (
          <p role="alert" className="mt-6 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button
            type="button"
            disabled={!dirty || busy}
            onClick={save}
            className="rounded-full bg-paper px-6 py-3 text-sm font-medium text-ink transition-colors duration-300 hover:bg-paper-dim disabled:opacity-40"
          >
            {busy ? "Saving…" : "Save changes"}
          </button>
          {dirty && (
            <button
              type="button"
              onClick={() => setDraft(item)}
              className="font-mono text-xs uppercase tracking-[0.12em] text-paper-faint transition-colors hover:text-paper"
            >
              Discard
            </button>
          )}
          <p aria-live="polite" className="font-mono text-[11px] text-paper-faint">
            {saved ? <span className="text-brand">Saved</span> : dirty ? "Unsaved changes" : ""}
          </p>
        </div>
      </Container>
    </section>
  );
}

function DashboardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  usePageMeta("Dashboard", null, { noindex: true });

  const [user, setUser] = useState(null);
  const [enquiries, setEnquiries] = useState(null);
  const [statuses, setStatuses] = useState([]);
  const [view, setView] = useState("all");
  const [query, setQuery] = useState("");
  const [checking, setChecking] = useState(true);

  const load = useCallback(async () => {
    const response = await fetch("/api/enquiries");
    if (response.ok) {
      const data = await response.json();
      setEnquiries(data.enquiries);
      setStatuses(data.statuses);
    } else if (response.status === 401) {
      /* The cookie expired while the tab sat open - drop back to the login
         box rather than showing an empty list that looks like "no enquiries". */
      setUser(null);
    }
  }, []);

  useEffect(() => {
    fetch("/api/me")
      .then((response) => (response.ok ? response.json() : { user: null }))
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (user) load();
  }, [user, load]);

  /* Both of these replace the row from the server's response rather than
     patching local state optimistically: the server stamps updated_at and
     updated_by, and guessing them here would show a timestamp that is not
     the one in the database. */
  const patch = async (enquiryId, changes) => {
    const response = await fetch(`/api/enquiries/${enquiryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Could not save");
    setEnquiries((current) =>
      current.map((item) => (item.id === enquiryId ? data.enquiry : item)),
    );
  };

  const remove = async (enquiryId) => {
    const response = await fetch(`/api/enquiries/${enquiryId}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error ?? "Could not delete");
    }
    setEnquiries((current) => current.filter((item) => item.id !== enquiryId));
    navigate("/dashboard");
  };

  const logout = async () => {
    await fetch("/api/logout", { method: "POST" });
    setUser(null);
    setEnquiries(null);
  };

  /* Counts respect the search, so the tabs describe what you are actually
     looking at. Tabs that keep reporting 40 while the list shows 2 are
     reporting on a list nobody is reading. */
  const found = useMemo(
    () => (enquiries ?? []).filter((item) => matchesQuery(item, query)),
    [enquiries, query],
  );

  const counts = useMemo(
    () => Object.fromEntries(VIEWS.map((entry) => [entry.id, found.filter(entry.match).length])),
    [found],
  );

  const visible = useMemo(
    () => found.filter(VIEWS.find((entry) => entry.id === view).match),
    [found, view],
  );

  if (checking) return null;
  if (!user) return <LoginForm onSuccess={setUser} />;

  /* Deep-linked to /dashboard/:id: wait for the list before deciding the id is
     unknown, or a refresh on a valid enquiry would bounce to the list. */
  if (id) {
    if (enquiries === null) return null;
    const item = enquiries.find((entry) => String(entry.id) === id);
    if (!item) {
      return (
        <section className="pb-24 pt-20 md:pt-28">
          <Container>
            <p className="text-paper-dim">That enquiry no longer exists.</p>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-paper-faint transition-colors hover:text-paper"
            >
              <FiArrowLeft aria-hidden="true" />
              All enquiries
            </button>
          </Container>
        </section>
      );
    }
    return (
      <Detail
        item={item}
        statuses={statuses}
        onPatch={patch}
        onDelete={remove}
        onBack={() => navigate("/dashboard")}
      />
    );
  }

  return (
    <section className="pb-24 pt-20 md:pt-28">
      <Container>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <p className="eyebrow">Signed in as {user}</p>
            <h1 className="mt-3 font-display text-display tracking-display">Enquiries</h1>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2 font-mono text-xs uppercase tracking-[0.12em] text-paper-dim transition-colors hover:border-paper hover:text-paper"
          >
            <FiLogOut aria-hidden="true" size={14} />
            Sign out
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-8">
          <div className="flex flex-wrap gap-2">
            {VIEWS.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setView(entry.id)}
                aria-pressed={view === entry.id}
                className={`rounded-full border px-5 py-2 font-mono text-xs uppercase tracking-[0.12em] transition-colors duration-300 ${
                  view === entry.id
                    ? "border-paper bg-paper text-ink"
                    : "border-line-strong text-paper-dim hover:text-paper"
                }`}
              >
                {entry.label}
                <span className={view === entry.id ? "text-ink/50" : "text-paper-faint"}>
                  {" "}
                  {counts[entry.id] ?? 0}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <label htmlFor="search" className="sr-only">
              Search enquiries by name, company or email
            </label>
            <FiSearch
              aria-hidden="true"
              size={14}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-paper-faint"
            />
            <input
              id="search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, company, email"
              className="w-full rounded-full border border-line-strong bg-transparent py-2 pl-10 pr-10 text-sm text-paper placeholder:text-paper-faint transition-colors focus:border-paper focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-paper-faint transition-colors hover:text-paper"
              >
                <FiX aria-hidden="true" size={14} />
              </button>
            )}
          </div>
        </div>

        {enquiries === null ? (
          <p className="py-24 text-paper-dim">Loading…</p>
        ) : visible.length === 0 ? (
          /* Three different nothings, and conflating them sends someone
             hunting for a lead that was never there - or missing one that is
             sitting behind a search box they forgot they typed in. */
          <p className="py-24 text-paper-dim">
            {enquiries.length === 0
              ? "No enquiries yet. They will appear here the moment someone sends one."
              : query
                ? `Nothing matches “${query}” in this view.`
                : "Nothing in this view."}
          </p>
        ) : (
          <ul className="mt-4">
            {visible.map((item) => (
              <Row
                key={item.id}
                item={item}
                statuses={statuses}
                onPatch={patch}
                onDelete={remove}
              />
            ))}
          </ul>
        )}
      </Container>
    </section>
  );
}

export default DashboardPage;
