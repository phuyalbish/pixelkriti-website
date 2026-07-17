import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiAlertTriangle,
  FiArrowLeft,
  FiAward,
  FiCheck,
  FiCheckCircle,
  FiChevronDown,
  FiClock,
  FiChevronRight,
  FiFileText,
  FiInbox,
  FiList,
  FiLock,
  FiLogOut,
  FiPhoneCall,
  FiPrinter,
  FiSearch,
  FiTool,
  FiTrash2,
  FiTruck,
  FiUpload,
  FiUserPlus,
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

/* A failed notification is only a failure if one was due. Manual entries were
   typed in by us from a call or an email - nobody is waiting on a receipt. */
const needsNotice = (item) => item.source !== "manual" && !item.notified;

/* All first: it is the default, and the one that always has everything in it.
   "Pending" rather than "Un Reviewed" - it names the state of the lead, not
   the absence of an action, and it is the word for a thing still owed.

   The icons are shared with the toggle in the detail view, so the mark for
   "reviewed" is the same glyph wherever the idea appears. */
const VIEWS = [
  { id: "all", label: "All", icon: FiList, match: () => true },
  { id: "pending", label: "Pending", icon: FiClock, match: (item) => !isReviewed(item) },
  { id: "reviewed", label: "Reviewed", icon: FiCheckCircle, match: isReviewed },
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

/* Everything, not just what the table shows: an export is for reading
   elsewhere, so the columns the list omits for scanning are the whole point. */
const CSV_COLUMNS = [
  ["Name", (row) => row.name],
  ["Email", (row) => row.email],
  ["Company", (row) => row.company],
  ["Service", (row) => row.service],
  ["Status", (row) => row.status],
  ["Reviewed", (row) => (row.reviewed ? "Yes" : "No")],
  ["Received", (row) => formatFull(row.created_at)],
  ["Source", (row) => (row.source === "manual" ? "Added by hand" : "Contact form")],
  ["Last edited by", (row) => row.updated_by],
  ["Message", (row) => row.message],
  ["Notes", (row) => row.notes],
];

/**
 * One CSV cell.
 *
 * The leading-quote guard is not paranoia. A cell beginning =, +, - or @ is
 * executed as a formula when the file is opened in Excel or Sheets, and every
 * enquiry here contains free text a stranger typed into a public form. Someone
 * pasting `=HYPERLINK(...)` into the message box should produce a row that
 * reads oddly, not one that runs when a colleague opens the export.
 */
const csvCell = (value) => {
  const text = value == null ? "" : String(value);
  const guarded = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text;
  return `"${guarded.replace(/"/g, '""')}"`;
};

const toCsv = (rows) =>
  [
    CSV_COLUMNS.map(([heading]) => csvCell(heading)).join(","),
    ...rows.map((row) => CSV_COLUMNS.map(([, read]) => csvCell(read(row))).join(",")),
  ].join("\r\n");

const download = (text, filename, type) => {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  /* Revoked, or the blob is held in memory for the life of the tab. */
  URL.revokeObjectURL(url);
};

/* Dated, so two exports a week apart do not both land as "enquiries.csv". */
const stamp = () => new Date().toISOString().slice(0, 10);

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
const MENU_WIDTH = 176;
const MENU_ROW = 34;

/**
 * Anchors a portalled menu to its trigger, in viewport coordinates.
 *
 * Every dropdown on this page has to be portalled into <body>, because both of
 * them live inside a container that clips: the status menu sits in the table,
 * and the export menu sits in the bulk bar, which needs `overflow-hidden` for
 * its height animation. An absolutely-positioned child cannot escape either -
 * it just gets sliced off. Portalling is the only fix, and it costs a manual
 * position, which is what this returns.
 *
 * Shared rather than written twice: the first version of this lived in
 * StatusMenu only, so ExportMenu shipped with exactly the bug StatusMenu had
 * already fixed.
 */
function useAnchoredMenu({ open, onClose, triggerRef, menuRef, width, height }) {
  const [coords, setCoords] = useState(null);

  const place = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    /* Flip above when there is no room below, so a trigger near the bottom of
       the window opens upward instead of off-screen. */
    const flip = window.innerHeight - rect.bottom < height + 12 && rect.top > height;
    setCoords({
      /* Right-aligned to the trigger, clamped inside the viewport. */
      left: Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8)),
      top: flip ? rect.top - height - 6 : rect.bottom + 6,
    });
  }, [triggerRef, width, height]);

  useEffect(() => {
    if (!open) return undefined;
    place();

    const onDown = (event) => {
      /* Both subtrees: the menu is no longer a descendant of the trigger. */
      if (triggerRef.current?.contains(event.target) || menuRef.current?.contains(event.target)) {
        return;
      }
      onClose();
    };
    /* Fixed coordinates go stale the moment anything scrolls. `true` catches
       scrolls on any ancestor, not just the window. */
    document.addEventListener("mousedown", onDown);
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, place, onClose, triggerRef, menuRef]);

  return coords;
}

function StatusMenu({ item, statuses, disabled, onChange }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => statuses.indexOf(item.status));
  const root = useRef(null);
  const button = useRef(null);
  const menu = useRef(null);

  const meta = statusMeta(item.status);
  const Icon = meta.icon;

  const close = useCallback(() => setOpen(false), []);
  const coords = useAnchoredMenu({
    open,
    onClose: close,
    triggerRef: root,
    menuRef: menu,
    width: MENU_WIDTH,
    height: statuses.length * MENU_ROW + 8,
  });

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
        {/* Label drops on a phone: the name is what you scan for, and a 144px
            pill was crushing it to "Ami...". The icon carries the status, and
            the button's aria-label spells it out for anyone who cannot see it. */}
        <span className="hidden flex-1 text-left sm:block">{item.status}</span>
        <FiChevronDown aria-hidden="true" size={12} className="shrink-0 opacity-60" />
      </button>

      {createPortal(
        <AnimatePresence>
          {open && coords && (
            <motion.ul
              ref={menu}
              role="listbox"
              aria-label="Status"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.14 }}
              onKeyDown={onKeyDown}
              style={{ left: coords.left, top: coords.top, width: MENU_WIDTH }}
              className="fixed z-50 overflow-hidden rounded-xl border border-line-ink bg-cream-raised p-1 shadow-lg shadow-ink/10"
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
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}

/** One table row per enquiry. The name opens it; nothing else lives out here. */
function Row({ item, statuses, onPatch, onRequestDelete, checked, onCheck }) {
  const [busy, setBusy] = useState(false);

  return (
    <tr
      className={`border-b border-line-ink transition-colors last:border-0 ${
        checked ? "bg-ink/[0.04]" : "hover:bg-ink/[0.03]"
      }`}
    >
      <td className="w-8 py-3" data-print-hide>
        <Tick checked={checked} onChange={onCheck} label={`Select enquiry from ${item.name}`} />
      </td>
      <td className="py-3 pr-4">
        {/*
          flex + min-w-0 + truncate, and the table is table-fixed above.
          All four are load-bearing: an auto-layout cell sizes to its widest
          nowrap content, so `truncate` never fires and one long company name
          drags the table clean off the side of its own card.
        */}
        <Link
          to={`/dashboard/${item.id}`}
          className="group flex items-center gap-2 text-[15px] text-ink transition-colors hover:text-brand-deep"
        >
          <span className="min-w-0 truncate">
            <span className="font-medium">{item.name}</span>
            {item.company && <span className="text-ink-dim"> · {item.company}</span>}
          </span>
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
        {/* Only for enquiries that were actually owed an email. A hand-typed
            one sends no confirmation and never will, so flagging it as a
            failed notification would report a problem that does not exist. */}
        {needsNotice(item) && (
          <span
            title="Notification email failed to send"
            className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-amber-600/20 text-amber-800"
          >
            <FiAlertTriangle aria-hidden="true" size={11} />
            <span className="sr-only">Notification email failed to send</span>
          </span>
        )}
      </td>

      <td className="hidden w-20 whitespace-nowrap py-3 font-mono text-xs text-ink-muted sm:table-cell">
        {/* Full stamp on hover; the row shows day and month only. */}
        <time dateTime={asDate(item.created_at).toISOString()} title={formatFull(item.created_at)}>
          {formatShort(item.created_at)}
        </time>
      </td>

      <td className="w-16 py-3 pl-3 sm:w-36 sm:pl-4">
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

      <td className="w-12 py-3 pl-3 text-right" data-print-hide>
        <button
          type="button"
          onClick={() => onRequestDelete([item])}
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
  /* The same glyphs the filter tabs use: whichever state this shows, the mark
     matches the tab the enquiry will be filed under. */
  const Icon = on ? FiCheckCircle : FiClock;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={busy}
      onClick={() => onToggle(!on)}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors disabled:opacity-50 ${
        on
          ? "border-brand-deep/40 bg-brand/12 text-brand-deep"
          : "border-line-ink text-ink-dim hover:border-ink hover:text-ink"
      }`}
    >
      <Icon aria-hidden="true" size={13} className="shrink-0" />
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
              onClick={() => onRequestDelete([item])}
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
          {needsNotice(item) && (
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
function DeleteConfirm({ targets, busy, error, onCancel, onConfirm }) {
  const many = targets && targets.length > 1;

  /* Escape cancels - the reflex when a confirmation you did not mean appears. */
  useEffect(() => {
    if (!targets) return undefined;
    const onKey = (event) => event.key === "Escape" && !busy && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [targets, busy, onCancel]);

  return (
    <AnimatePresence>
      {targets && (
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
            {many ? `Delete ${targets.length} enquiries?` : "Delete this enquiry?"}
          </p>
          <div className="mt-2 text-[13px] leading-relaxed text-ink-dim">
            {/*
              Names, not just a count. "Delete 12 enquiries?" is a number you
              agree to; a list is something you can actually check before
              agreeing. Capped at four so the panel cannot grow past the corner
              it lives in.
            */}
            <ul className="max-h-24 space-y-0.5 overflow-hidden">
              {targets.slice(0, 4).map((entry) => (
                <li key={entry.id} className="truncate">
                  <span className="text-ink">{entry.name}</span>
                  {entry.company && ` · ${entry.company}`}
                </li>
              ))}
            </ul>
            {targets.length > 4 && (
              <p className="mt-1">and {targets.length - 4} more</p>
            )}
            <p className="mt-2">This cannot be undone.</p>
          </div>

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
              {busy ? "Deleting…" : many ? `Delete ${targets.length}` : "Delete"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** A tick that matches the rest of the page rather than the OS. */
function Tick({ checked, indeterminate, onChange, label }) {
  const box = useRef(null);

  /* `indeterminate` has no HTML attribute - it is a DOM property only, so it
     has to be written after render or the half-state never shows. */
  useEffect(() => {
    if (box.current) box.current.indeterminate = Boolean(indeterminate && !checked);
  }, [indeterminate, checked]);

  return (
    <span className="relative flex h-4 w-4 items-center justify-center">
      <input
        ref={box}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-label={label}
        className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-ink-muted bg-cream-raised transition-colors checked:border-ink checked:bg-ink indeterminate:border-ink indeterminate:bg-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
      />
      <FiCheck
        aria-hidden="true"
        size={10}
        strokeWidth={3}
        className="pointer-events-none absolute hidden text-cream peer-checked:block"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute hidden h-0.5 w-2 rounded bg-cream peer-indeterminate:block"
      />
    </span>
  );
}

/** Add a lead that arrived by phone or email rather than through the form. */
function NewEnquiry({ onCreate, onBack }) {
  const [draft, setDraft] = useState({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const set = (key) => (event) =>
    setDraft((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await onCreate(draft);
    } catch (problem) {
      setError(problem.message);
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

        <h1 className="mt-8 font-display text-headline tracking-display text-ink">Add an enquiry</h1>
        <p className="mt-3 max-w-prose text-sm leading-relaxed text-ink-dim">
          For a lead that came by phone, email or in person. Nothing is sent to
          them - this only records what you already know.
        </p>

        <form onSubmit={submit} className="mt-10 border-t border-line-ink pt-10">
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {EDITABLE.map((entry) => (
              <div key={entry.key}>
                <label htmlFor={`new-${entry.key}`} className={label}>
                  {entry.label}
                  {!entry.required && <span className="normal-case"> (optional)</span>}
                </label>
                <input
                  id={`new-${entry.key}`}
                  type={entry.type}
                  required={entry.required}
                  value={draft[entry.key]}
                  onChange={set(entry.key)}
                  className={`${field} mt-2`}
                />
              </div>
            ))}
          </div>

          <div className="mt-8">
            <label htmlFor="new-message" className={label}>
              What is not working
            </label>
            <textarea
              id="new-message"
              required
              rows={5}
              value={draft.message}
              onChange={set("message")}
              placeholder="What they told you, in their words where you have them."
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
              type="submit"
              disabled={busy}
              className="rounded-full bg-ink px-6 py-3 text-sm font-medium text-cream transition-colors duration-300 hover:bg-ink-overlay disabled:opacity-40"
            >
              {busy ? "Adding…" : "Add enquiry"}
            </button>
            <button
              type="button"
              onClick={onBack}
              className="font-mono text-xs uppercase tracking-[0.12em] text-ink-dim transition-colors hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </form>
      </Container>
    </section>
  );
}

const EXPORT_MENU_WIDTH = 224;
const EXPORT_MENU_HEIGHT = 104;

/** CSV downloads; PDF goes through the browser's print dialog - see index.css. */
function ExportMenu({ rows, disabled }) {
  const [open, setOpen] = useState(false);
  const root = useRef(null);
  const menu = useRef(null);

  const close = useCallback(() => setOpen(false), []);
  /* Portalled for the same reason the status menu is: this renders inside the
     bulk bar, which is overflow-hidden so it can animate its height, and an
     absolutely-positioned menu in there gets sliced in half. */
  const coords = useAnchoredMenu({
    open,
    onClose: close,
    triggerRef: root,
    menuRef: menu,
    width: EXPORT_MENU_WIDTH,
    height: EXPORT_MENU_HEIGHT,
  });

  return (
    <div ref={root} className="relative">
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((was) => !was)}
        className="inline-flex items-center gap-2 rounded-full border border-line-ink px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-ink-dim transition-colors hover:border-ink hover:text-ink disabled:opacity-40"
      >
        <FiUpload aria-hidden="true" size={13} />
        Export
        <FiChevronDown aria-hidden="true" size={12} className="opacity-60" />
      </button>

      {createPortal(
        <AnimatePresence>
          {open && coords && (
            <motion.div
              ref={menu}
              role="menu"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.14 }}
              style={{ left: coords.left, top: coords.top, width: EXPORT_MENU_WIDTH }}
              className="fixed z-50 overflow-hidden rounded-xl border border-line-ink bg-cream-raised p-1 shadow-lg shadow-ink/10"
            >
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                download(toCsv(rows), `pixelkriti-enquiries-${stamp()}.csv`, "text/csv;charset=utf-8");
                setOpen(false);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] text-ink transition-colors hover:bg-ink/[0.06]"
            >
              <FiFileText aria-hidden="true" size={13} className="shrink-0 text-ink-dim" />
              <span>
                CSV
                <span className="block text-[11px] text-ink-dim">
                  {rows.length} row{rows.length === 1 ? "" : "s"}, every field
                </span>
              </span>
            </button>
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                /* The dialog blocks the thread, so let the menu close first. */
                setTimeout(() => window.print(), 50);
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] text-ink transition-colors hover:bg-ink/[0.06]"
            >
              <FiPrinter aria-hidden="true" size={13} className="shrink-0 text-ink-dim" />
              <span>
                PDF
                <span className="block text-[11px] text-ink-dim">
                  Choose “Save as PDF” when printing
                </span>
              </span>
            </button>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  );
}

function DashboardPage() {
  const { id } = useParams();
  const location = useLocation();
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
  /* Ids, not rows: a row object goes stale the moment its status is patched,
     and a stale selection would delete against an old copy of the list. */
  const [selected, setSelected] = useState(() => new Set());

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
    const ids = pendingDelete.map((entry) => entry.id);
    try {
      /* One request for many, so a half-finished bulk delete cannot leave the
         list disagreeing with the database. */
      const response =
        ids.length === 1
          ? await fetch(`/api/enquiries/${ids[0]}`, { method: "DELETE" })
          : await fetch("/api/enquiries/bulk-delete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ids }),
            });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Could not delete");
      }
      const gone = new Set(ids);
      setEnquiries((current) => current.filter((item) => !gone.has(item.id)));
      setSelected((current) => new Set([...current].filter((entry) => !gone.has(entry))));
      setPendingDelete(null);
      /* Deleting the enquiry you are reading leaves nothing to read. */
      if (id) navigate("/dashboard");
    } catch (problem) {
      setDeleteError(problem.message);
    } finally {
      setDeleting(false);
    }
  };

  const create = async (draft) => {
    const response = await fetch("/api/enquiries/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? "Could not add");
    setEnquiries((current) => [data.enquiry, ...(current ?? [])]);
    navigate(`/dashboard/${data.enquiry.id}`);
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

  /* Only what is on screen can be ticked, so a selection made under one filter
     cannot quietly delete rows the current view is hiding. */
  const chosen = useMemo(() => visible.filter((item) => selected.has(item.id)), [visible, selected]);
  const allShown = visible.length > 0 && chosen.length === visible.length;

  const toggleOne = (itemId, on) =>
    setSelected((current) => {
      const next = new Set(current);
      if (on) next.add(itemId);
      else next.delete(itemId);
      return next;
    });

  const toggleAll = (on) =>
    setSelected(() => (on ? new Set(visible.map((item) => item.id)) : new Set()));

  if (checking) return null;
  if (!user) return <LoginForm onSuccess={setUser} />;

  if (location.pathname === "/dashboard/new") {
    return (
      <>
        <NewEnquiry onCreate={create} onBack={() => navigate("/dashboard")} />
      </>
    );
  }

  const deleteDialog = (
    <DeleteConfirm
      targets={pendingDelete}
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
            <p className={label} data-print-hide>
              Signed in as {user}
            </p>
            <h1 className="mt-3 font-display text-display tracking-display text-ink">Enquiries</h1>
          </div>
          <button
            type="button"
            onClick={logout}
            data-print-hide
            className="inline-flex items-center gap-2 rounded-full border border-line-ink px-5 py-2 font-mono text-xs uppercase tracking-[0.12em] text-ink-dim transition-colors hover:border-ink hover:text-ink"
          >
            <FiLogOut aria-hidden="true" size={14} />
            Sign out
          </button>
        </div>

        <div
          data-print-hide
          className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-line-ink pb-8"
        >
          <div className="flex flex-wrap gap-2">
            {VIEWS.map((entry) => {
              const ViewIcon = entry.icon;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setView(entry.id)}
                  aria-pressed={view === entry.id}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] transition-colors duration-300 ${
                    view === entry.id
                      ? "border-ink bg-ink text-cream"
                      : "border-line-ink text-ink-dim hover:border-ink hover:text-ink"
                  }`}
                >
                  <ViewIcon aria-hidden="true" size={13} className="shrink-0" />
                  {entry.label}
                  <span className={view === entry.id ? "text-cream/60" : "text-ink-muted"}>
                    {counts[entry.id] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex w-full items-center gap-3 sm:w-auto">
            <div className="relative flex-1 sm:w-64 sm:flex-none">
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

            {/* Exports what the filters and the search have left on screen -
                what you are looking at is what you get, rather than a silent
                dump of all 500 rows. */}
            <ExportMenu rows={visible} disabled={visible.length === 0} />

            <button
              type="button"
              onClick={() => navigate("/dashboard/new")}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-cream transition-colors hover:bg-ink-overlay"
            >
              <FiUserPlus aria-hidden="true" size={13} />
              Add
            </button>
          </div>
        </div>

        {/*
          Only while something is ticked. A permanently visible bar of disabled
          buttons is furniture; this appears because there is now something to
          do with it, and says exactly how many rows it means.
        */}
        <AnimatePresence>
          {chosen.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.18 }}
              data-print-hide
              className="overflow-hidden"
            >
              <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-line-ink bg-ink/[0.04] px-4 py-3">
                <p aria-live="polite" className="text-[13px] text-ink">
                  {chosen.length} selected
                </p>
                <button
                  type="button"
                  onClick={() => setSelected(new Set())}
                  className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-dim transition-colors hover:text-ink"
                >
                  Clear
                </button>
                <div className="ml-auto flex items-center gap-2">
                  <ExportMenu rows={chosen} />
                  <button
                    type="button"
                    onClick={() => setPendingDelete(chosen)}
                    className="inline-flex items-center gap-2 rounded-full border border-red-700/40 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-red-700 transition-colors hover:bg-red-700/10"
                  >
                    <FiTrash2 aria-hidden="true" size={12} />
                    Delete {chosen.length}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Print-only: the screen gets this context from the filter pills and
            the search box, neither of which survive onto paper. */}
        <div data-print-only className="hidden">
          <p className="mt-6 text-sm">
            Pixel Kriti - Enquiries ({VIEWS.find((entry) => entry.id === view).label}
            {query ? `, matching "${query}"` : ""}) - {visible.length} row
            {visible.length === 1 ? "" : "s"} - printed {formatFull(new Date().toISOString().slice(0, 19).replace("T", " "))}
          </p>
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
          /*
           * No overflow of its own, deliberately.
           *
           * An overflow container gets a second scrollbar inside the page, and
           * - worse - becomes a clipping context that crops the status menu
           * open on the last row. The menu is portalled out now, but the inner
           * scrollbar was unwanted regardless: on a narrow screen the page
           * scrolls, not the table.
           */
          <div className="mt-8 rounded-2xl border border-line-ink bg-cream-raised px-5">
            <table className="w-full table-fixed border-collapse text-left">
              <thead>
                <tr className="border-b border-line-ink">
                  <th scope="col" className="w-8 py-3" data-print-hide>
                    <Tick
                      checked={allShown}
                      indeterminate={chosen.length > 0}
                      onChange={toggleAll}
                      label="Select every enquiry shown"
                    />
                  </th>
                  <th scope="col" className={`${label} py-3 pr-4 font-normal`}>
                    Name
                  </th>
                  {/* The column is a single warning glyph; a visible heading
                      over it would be wider than everything under it. */}
                  <th scope="col" className="w-8">
                    <span className="sr-only">Notification status</span>
                  </th>
                  {/* Dropped on a phone: the name is what you are looking for,
                      and the date is in the detail. */}
                  <th scope="col" className={`${label} hidden w-20 py-3 font-normal sm:table-cell`}>
                    Received
                  </th>
                  <th scope="col" className={`${label} w-16 py-3 pl-3 font-normal sm:w-36 sm:pl-4`}>
                    Status
                  </th>
                  <th scope="col" className="w-12" data-print-hide>
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
                    checked={selected.has(item.id)}
                    onCheck={(on) => toggleOne(item.id, on)}
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
