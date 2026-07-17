import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiAlertTriangle,
  FiArrowLeft,
  FiAward,
  FiCheck,
  FiChevronDown,
  FiChevronRight,
  FiFileText,
  FiInbox,
  FiLock,
  FiLogOut,
  FiPhoneCall,
  FiSearch,
  FiTool,
  FiTrash2,
  FiTruck,
  FiX,
  FiXCircle,
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
 *
 * ---------------------------------------------------------------------------
 * ON THE COLOURS
 *
 * This page runs cream while the rest of the site runs ink, and that is not an
 * inconsistency - it is the point. The marketing pages are read once by
 * someone deciding whether to call, and atmosphere is worth something there.
 * This is a tool three people open every day, and the near-black chrome was
 * reported unreadable in daily use even though it passed a contrast checker.
 *
 * Warm rather than white: a trace of yellow keeps it off the clinical glare of
 * #fff. Surfaces are cream (page) and cream-raised (the table) so rows have
 * edges; text is ink (18.7:1), ink-dim (7.94:1) and ink-muted (4.77:1) -
 * measured in the browser, alpha composited, all clearing AA. Tokens live in
 * index.css; the body attribute that switches the background, scrollbar and
 * selection colours is set in DashboardPage below.
 * ---------------------------------------------------------------------------
 */

const field =
  "w-full rounded-lg border border-line-ink bg-cream-raised px-4 py-3 text-ink placeholder:text-ink-muted transition-colors focus:border-ink focus:outline-none";

/** The site's .eyebrow is paper-faint - invisible on cream. This is its twin. */
const label = "font-mono text-[11px] uppercase tracking-[0.14em] text-ink-dim";

const iconButton =
  "shrink-0 rounded-full border border-line-ink p-2 text-ink-dim transition-colors hover:border-red-600/50 hover:text-red-700";

/**
 * Reviewed is an explicit flag, not a reading of `status`.
 *
 * They are different facts: an enquiry can be read and understood while still
 * sitting at New, and one can be dragged to Quoted by someone who never read
 * it. The Worker marks reviewed when the status moves off New - that is an act
 * of review - but only the toggle clears it again.
 */
const isReviewed = (item) => Boolean(item.reviewed);

const VIEWS = [
  { id: "unreviewed", label: "Un Reviewed", match: (item) => !isReviewed(item) },
  { id: "all", label: "All", match: () => true },
  { id: "reviewed", label: "Reviewed", match: isReviewed },
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

/*
 * Each status gets a mark and a fill.
 *
 * Tinted fills with dark text: the 400-level colours that read well on ink are
 * far too light on cream, so these are the 700/800 level, which clears AA
 * against a 15% wash of itself. `brand-deep` for the same reason - #31ae49 is
 * 2.6:1 here and unreadable as text.
 *
 * New inverts to solid ink: it is the one status meaning "nobody has touched
 * this", and it should be the loudest thing in the column.
 */
const STATUS_META = {
  New: { icon: FiInbox, fill: "bg-ink text-cream" },
  Contacted: { icon: FiPhoneCall, fill: "bg-sky-600/15 text-sky-800" },
  Quoted: { icon: FiFileText, fill: "bg-violet-600/15 text-violet-800" },
  Deal: { icon: FiAward, fill: "bg-brand/15 text-brand-deep" },
  Development: { icon: FiTool, fill: "bg-amber-600/20 text-amber-800" },
  Delivered: { icon: FiTruck, fill: "bg-brand/15 text-brand-deep" },
  Lost: { icon: FiXCircle, fill: "bg-red-600/12 text-red-800" },
};
const statusMeta = (status) =>
  STATUS_META[status] ?? { icon: FiInbox, fill: "bg-ink/10 text-ink-dim" };

/* The column is UTC from SQLite's datetime('now'); the Z makes the browser
   render it in the reader's zone instead of pretending UTC is local. */
const asDate = (value) => new Date(`${value.replace(" ", "T")}Z`);

/* The list gets day and month only. A column of identical years and to-the-
   minute timestamps is four words of noise on every row for a fact nobody
   scans for - the full stamp is one click away, in the detail. */
const formatShort = (value) =>
  asDate(value).toLocaleString(undefined, { month: "short", day: "numeric" });

const formatFull = (value) =>
  asDate(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

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
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-line-ink bg-cream-raised p-8"
      >
        <FiLock aria-hidden="true" className="text-ink-dim" size={20} />
        <h1 className="mt-4 font-display text-title tracking-display text-ink">Dashboard</h1>
        <p className="mt-2 text-sm text-ink-dim">Sign in to view enquiries.</p>

        <div className="mt-8 space-y-5">
          <div>
            <label htmlFor="username" className={label}>
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
              className={`${field} mt-2`}
            />
          </div>
          <div>
            <label htmlFor="password" className={label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={`${field} mt-2`}
            />
          </div>
        </div>

        {error && (
          /* role=alert so it is announced, not just shown. */
          <p role="alert" className="mt-6 text-sm text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-8 w-full rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition-colors duration-300 hover:bg-ink-overlay disabled:opacity-50"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

/**
 * Status picker.
 *
 * Hand-built rather than a native <select> because each status needs its mark
 * beside it, and an <option> renders text and nothing else - no icon, no
 * colour that survives across browsers. That is the whole reason for the extra
 * code here; a native select would otherwise be the better answer.
 *
 * The keyboard contract a real select gives you for free has to be rebuilt by
 * hand too, so: Enter/Space/ArrowDown opens, arrows move, Enter picks, Escape
 * closes and returns focus, click-away closes.
 */
function StatusMenu({ item, statuses, disabled, onChange }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => statuses.indexOf(item.status));
  const root = useRef(null);
  const button = useRef(null);

  const meta = statusMeta(item.status);
  const Icon = meta.icon;

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (event) => {
      if (!root.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const pick = (status) => {
    setOpen(false);
    button.current?.focus();
    if (status !== item.status) onChange(status);
  };

  const onKeyDown = (event) => {
    if (!open) {
      if (["Enter", " ", "ArrowDown"].includes(event.key)) {
        event.preventDefault();
        setActive(Math.max(0, statuses.indexOf(item.status)));
        setOpen(true);
      }
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      button.current?.focus();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % statuses.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (index - 1 + statuses.length) % statuses.length);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      pick(statuses[active]);
    }
  };

  return (
    <div ref={root} className="relative">
      <button
        ref={button}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Status: ${item.status}. Change status for ${item.name}`}
        onClick={() => {
          setActive(Math.max(0, statuses.indexOf(item.status)));
          setOpen((was) => !was);
        }}
        onKeyDown={onKeyDown}
        className={`inline-flex w-full items-center gap-2 rounded-full py-1.5 pl-3 pr-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.12em] transition-opacity focus:outline-none focus:ring-2 focus:ring-ink/40 disabled:opacity-50 ${meta.fill}`}
      >
        <Icon aria-hidden="true" size={12} className="shrink-0" />
        <span className="flex-1 text-left">{item.status}</span>
        <FiChevronDown aria-hidden="true" size={12} className="shrink-0 opacity-60" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            aria-label="Status"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.14 }}
            onKeyDown={onKeyDown}
            className="absolute right-0 z-30 mt-1.5 w-44 overflow-hidden rounded-xl border border-line-ink bg-cream-raised p-1 shadow-lg shadow-ink/10"
          >
            {statuses.map((status, index) => {
              const option = statusMeta(status);
              const OptionIcon = option.icon;
              const selected = status === item.status;
              return (
                <li key={status}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => pick(status)}
                    className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
                      index === active ? "bg-ink/[0.06]" : ""
                    } ${selected ? "text-ink" : "text-ink-dim"}`}
                  >
                    <OptionIcon aria-hidden="true" size={12} className="shrink-0" />
                    <span className="flex-1">{status}</span>
                    {selected && <FiCheck aria-hidden="true" size={12} className="shrink-0" />}
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

/** One table row per enquiry. The name opens it; nothing else lives out here. */
function Row({ item, statuses, onPatch, onRequestDelete }) {
  const [busy, setBusy] = useState(false);

  return (
    <tr className="border-b border-line-ink transition-colors last:border-0 hover:bg-ink/[0.03]">
      <td className="py-3 pr-4">
        <Link
          to={`/dashboard/${item.id}`}
          className="group inline-flex items-center gap-2 text-[15px] text-ink transition-colors hover:text-brand-deep"
        >
          <span className="truncate font-medium">{item.name}</span>
          {item.company && (
            <span className="truncate text-ink-dim">· {item.company}</span>
          )}
          <FiChevronRight
            aria-hidden="true"
            size={14}
            className="shrink-0 text-ink-muted transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </Link>
      </td>

      {/*
        Just the mark. The enquiry is stored before the email is attempted, so
        this says "saved, but nobody was told" - and it is the exception, not
        something to read on every row. `title` and the label carry the meaning
        the glyph cannot; an unexplained "!" is decoration.
      */}
      <td className="w-8 py-3">
        {!item.notified && (
          <span
            title="Notification email failed to send"
            className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-600/20 text-amber-800"
          >
            <FiAlertTriangle aria-hidden="true" size={11} />
            <span className="sr-only">Notification email failed to send</span>
          </span>
        )}
      </td>

      <td className="w-20 whitespace-nowrap py-3 font-mono text-xs text-ink-muted">
        {/* Full stamp on hover; the row shows day and month only. */}
        <time dateTime={asDate(item.created_at).toISOString()} title={formatFull(item.created_at)}>
          {formatShort(item.created_at)}
        </time>
      </td>

      <td className="w-40 py-3 pl-4">
        <StatusMenu
          item={item}
          statuses={statuses}
          disabled={busy}
          onChange={async (status) => {
            setBusy(true);
            try {
              await onPatch(item.id, { status });
            } finally {
              setBusy(false);
            }
          }}
        />
      </td>

      <td className="w-12 py-3 pl-3 text-right">
        <button
          type="button"
          onClick={() => onRequestDelete(item)}
          aria-label={`Delete enquiry from ${item.name}`}
          className={iconButton}
        >
          <FiTrash2 aria-hidden="true" size={13} />
        </button>
      </td>
    </tr>
  );
}

/**
 * Reviewed toggle. A switch rather than a checkbox because it reports a state
 * that is already true or false, and flipping it takes effect immediately -
 * there is no form to submit.
 */
function ReviewedToggle({ item, busy, onToggle }) {
  const on = isReviewed(item);

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={busy}
      onClick={() => onToggle(!on)}
      className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors disabled:opacity-50 ${
        on
          ? "border-brand-deep/40 bg-brand/12 text-brand-deep"
          : "border-line-ink text-ink-dim hover:border-ink hover:text-ink"
      }`}
    >
      <span
        aria-hidden="true"
        className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
          on ? "border-brand-deep bg-brand-deep text-cream" : "border-ink-muted"
        }`}
      >
        {on && <FiCheck size={10} strokeWidth={3} />}
      </span>
      {on ? "Reviewed" : "Mark reviewed"}
    </button>
  );
}

const EDITABLE = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "email", label: "Email", type: "email", required: true },
  { key: "company", label: "Company", type: "text" },
  { key: "service", label: "Service interested in", type: "text" },
];

/** The whole enquiry, editable. */
function Detail({ item, statuses, onPatch, onRequestDelete, onBack }) {
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

  const run = async (work) => {
    setBusy(true);
    setError(null);
    try {
      await work();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (problem) {
      setError(problem.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="pb-32 pt-20 md:pt-28">
      <Container>
        <button
          type="button"
          onClick={onBack}
          className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-ink-dim transition-colors hover:text-ink"
        >
          <FiArrowLeft
            aria-hidden="true"
            className="transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          All enquiries
        </button>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-headline tracking-display text-ink">{item.name}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <ReviewedToggle
              item={item}
              busy={busy}
              onToggle={(next) => run(() => onPatch(item.id, { reviewed: next }))}
            />
            <StatusMenu
              item={item}
              statuses={statuses}
              disabled={busy}
              onChange={(status) => run(() => onPatch(item.id, { status }))}
            />
            <button
              type="button"
              onClick={() => onRequestDelete(item)}
              aria-label={`Delete enquiry from ${item.name}`}
              className={iconButton}
            >
              <FiTrash2 aria-hidden="true" size={13} />
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line-ink pb-8 font-mono text-[11px] text-ink-dim">
          <span>Received {formatFull(item.created_at)}</span>
          {item.updated_by && item.updated_at && (
            <span>
              · Last edited by {item.updated_by}, {formatFull(item.updated_at)}
            </span>
          )}
          {!item.notified && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-600/15 px-2.5 py-0.5 text-amber-800">
              <FiAlertTriangle aria-hidden="true" size={11} />
              Notification email failed
            </span>
          )}
        </div>

        <div className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {EDITABLE.map((entry) => (
            <div key={entry.key}>
              <label htmlFor={entry.key} className={label}>
                {entry.label}
              </label>
              <input
                id={entry.key}
                type={entry.type}
                required={entry.required}
                value={draft[entry.key] ?? ""}
                onChange={set(entry.key)}
                className={`${field} mt-2`}
              />
            </div>
          ))}
        </div>

        <div className="mt-8">
          <label htmlFor="message" className={label}>
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
            className={`${field} mt-2 resize-y leading-relaxed`}
          />
        </div>

        <div className="mt-8">
          <label htmlFor="notes" className={label}>
            Notes
          </label>
          <textarea
            id="notes"
            rows={4}
            value={draft.notes ?? ""}
            onChange={set("notes")}
            placeholder="Anything worth knowing next time this is opened."
            className={`${field} mt-2 resize-y leading-relaxed`}
          />
        </div>

        {error && (
          <p role="alert" className="mt-6 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <button
            type="button"
            disabled={!dirty || busy}
            onClick={() => run(() => onPatch(item.id, changed))}
            className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition-colors duration-300 hover:bg-ink-overlay disabled:opacity-40"
          >
            {busy ? "Saving…" : "Save changes"}
          </button>
          {dirty && (
            <button
              type="button"
              onClick={() => setDraft(item)}
              className="font-mono text-xs uppercase tracking-[0.12em] text-ink-dim transition-colors hover:text-ink"
            >
              Discard
            </button>
          )}
          <p aria-live="polite" className="font-mono text-[11px] text-ink-dim">
            {saved ? (
              <span className="text-brand-deep">Saved</span>
            ) : dirty ? (
              "Unsaved changes"
            ) : (
              ""
            )}
          </p>
        </div>
      </Container>
    </section>
  );
}

/**
 * Delete confirmation, pinned bottom-right.
 *
 * Out of the flow on purpose: confirming inline used to expand the row and
 * shove the layout sideways, which is how a misclick happens on the thing you
 * least want to misclick. Down here it names who is being deleted, cannot be
 * hit by muscle memory, and leaves the list still readable behind it.
 *
 * alertdialog, not dialog: this interrupts to ask something consequential, and
 * the deletion is permanent - there is no undo and no archive behind it.
 */
function DeleteConfirm({ item, busy, error, onCancel, onConfirm }) {
  /* Escape cancels - the reflex when a confirmation you did not mean appears. */
  useEffect(() => {
    if (!item) return undefined;
    const onKey = (event) => event.key === "Escape" && !busy && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [item, busy, onCancel]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          role="alertdialog"
          aria-modal="false"
          aria-labelledby="delete-title"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-6 z-50 w-[min(22rem,calc(100vw-3rem))] rounded-2xl border border-red-700/25 bg-cream-raised p-5 shadow-xl shadow-ink/10"
        >
          <p id="delete-title" className="text-sm font-medium text-ink">
            Delete this enquiry?
          </p>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-dim">
            <span className="text-ink">{item.name}</span>
            {item.company && ` · ${item.company}`}
            <br />
            This cannot be undone.
          </p>

          {error && (
            <p role="alert" className="mt-3 text-[13px] text-red-700">
              {error}
            </p>
          )}

          <div className="mt-5 flex items-center gap-2">
            <button
              type="button"
              autoFocus
              onClick={onCancel}
              className="flex-1 rounded-full border border-line-ink px-4 py-2 text-[13px] text-ink-dim transition-colors hover:border-ink hover:text-ink"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={onConfirm}
              className="flex-1 rounded-full bg-red-700 px-4 py-2 text-[13px] font-medium text-white transition-colors hover:bg-red-800 disabled:opacity-50"
            >
              {busy ? "Deleting…" : "Delete"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
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
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  /*
   * Flip the whole document to the cream surface while this page is mounted.
   *
   * On <body> rather than a wrapper because the things that need to change are
   * outside the page: the background behind an overscroll bounce, the
   * scrollbar, and the selection colour are all painted from body-level rules
   * (see index.css). Removed on unmount, so navigating back to the site does
   * not leave the marketing pages sitting on cream.
   */
  useEffect(() => {
    document.body.setAttribute("data-surface", "cream");
    return () => document.body.removeAttribute("data-surface");
  }, []);

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

  /* Replaces the row from the server's response rather than patching local
     state optimistically: the server stamps updated_at and updated_by, and
     guessing them here would show a timestamp the database disagrees with. */
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

  const confirmDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      const response = await fetch(`/api/enquiries/${pendingDelete.id}`, { method: "DELETE" });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Could not delete");
      }
      setEnquiries((current) => current.filter((item) => item.id !== pendingDelete.id));
      setPendingDelete(null);
      /* Deleting the enquiry you are reading leaves nothing to read. */
      if (id) navigate("/dashboard");
    } catch (problem) {
      setDeleteError(problem.message);
    } finally {
      setDeleting(false);
    }
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

  const deleteDialog = (
    <DeleteConfirm
      item={pendingDelete}
      busy={deleting}
      error={deleteError}
      onCancel={() => {
        setPendingDelete(null);
        setDeleteError(null);
      }}
      onConfirm={confirmDelete}
    />
  );

  /* Deep-linked to /dashboard/:id: wait for the list before deciding the id is
     unknown, or a refresh on a valid enquiry would bounce to the list. */
  if (id) {
    if (enquiries === null) return null;
    const item = enquiries.find((entry) => String(entry.id) === id);
    if (!item) {
      return (
        <section className="pb-24 pt-20 md:pt-28">
          <Container>
            <p className="text-ink-dim">That enquiry no longer exists.</p>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-ink-dim transition-colors hover:text-ink"
            >
              <FiArrowLeft aria-hidden="true" />
              All enquiries
            </button>
          </Container>
        </section>
      );
    }
    return (
      <>
        <Detail
          item={item}
          statuses={statuses}
          onPatch={patch}
          onRequestDelete={setPendingDelete}
          onBack={() => navigate("/dashboard")}
        />
        {deleteDialog}
      </>
    );
  }

  return (
    <section className="pb-24 pt-20 md:pt-28">
      <Container>
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <p className={label}>Signed in as {user}</p>
            <h1 className="mt-3 font-display text-display tracking-display text-ink">Enquiries</h1>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full border border-line-ink px-5 py-2 font-mono text-xs uppercase tracking-[0.12em] text-ink-dim transition-colors hover:border-ink hover:text-ink"
          >
            <FiLogOut aria-hidden="true" size={14} />
            Sign out
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-line-ink pb-8">
          <div className="flex flex-wrap gap-2">
            {VIEWS.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setView(entry.id)}
                aria-pressed={view === entry.id}
                className={`rounded-full border px-5 py-2 font-mono text-xs uppercase tracking-[0.12em] transition-colors duration-300 ${
                  view === entry.id
                    ? "border-ink bg-ink text-cream"
                    : "border-line-ink text-ink-dim hover:border-ink hover:text-ink"
                }`}
              >
                {entry.label}
                <span className={view === entry.id ? "text-cream/60" : "text-ink-muted"}>
                  {" "}
                  {counts[entry.id] ?? 0}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <label htmlFor="search" className="sr-only">
              Search enquiries by name, company or email
            </label>
            <FiSearch
              aria-hidden="true"
              size={14}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-dim"
            />
            {/*
              The webkit cancel button is hidden because this input already has
              its own clear button. Left on, Safari and Chrome draw a second X
              right beside ours - two controls, same job, different look.

              `hidden` (display:none) rather than `appearance-none`: Tailwind's
              appearance-none emits the STANDARD `appearance` property, which
              this pseudo-element ignores - it only obeys -webkit-appearance.
              The X survived that and was still drawn.
            */}
            <input
              id="search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name, company, email"
              className="w-full rounded-full border border-line-ink bg-cream-raised py-2 pl-10 pr-10 text-sm text-ink placeholder:text-ink-muted transition-colors focus:border-ink focus:outline-none [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-dim transition-colors hover:text-ink"
              >
                <FiX aria-hidden="true" size={14} />
              </button>
            )}
          </div>
        </div>

        {enquiries === null ? (
          <p className="py-24 text-ink-dim">Loading…</p>
        ) : visible.length === 0 ? (
          /* Three different nothings, and conflating them sends someone
             hunting for a lead that was never there - or missing one that is
             sitting behind a search box they forgot they typed in. */
          <p className="py-24 text-ink-dim">
            {enquiries.length === 0
              ? "No enquiries yet. They will appear here the moment someone sends one."
              : query
                ? `Nothing matches “${query}” in this view.`
                : "Nothing in this view."}
          </p>
        ) : (
          /* overflow-x-auto so the table scrolls inside its own box on a phone
             rather than pushing the page sideways. */
          <div className="mt-8 overflow-x-auto rounded-2xl border border-line-ink bg-cream-raised px-5">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <thead>
                <tr className="border-b border-line-ink">
                  <th scope="col" className={`${label} py-3 pr-4 font-normal`}>
                    Name
                  </th>
                  {/* The column is a single warning glyph; a visible heading
                      over it would be wider than everything under it. */}
                  <th scope="col" className="w-8">
                    <span className="sr-only">Notification status</span>
                  </th>
                  <th scope="col" className={`${label} w-20 py-3 font-normal`}>
                    Received
                  </th>
                  <th scope="col" className={`${label} w-40 py-3 pl-4 font-normal`}>
                    Status
                  </th>
                  <th scope="col" className="w-12">
                    <span className="sr-only">Delete</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {visible.map((item) => (
                  <Row
                    key={item.id}
                    item={item}
                    statuses={statuses}
                    onPatch={patch}
                    onRequestDelete={setPendingDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Container>

      {deleteDialog}
    </section>
  );
}

export default DashboardPage;
