/**
 * The proof bar, directly under the promise.
 *
 * The competitor this section answers puts four big numbers here - 97%, 1750,
 * $1.5M* - and the asterisk leads nowhere. We cannot match that and should not
 * want to: an unsourced figure is worth nothing the moment a buyer checks it,
 * and checking is exactly what our buyer does.
 *
 * So the bar carries COMMITMENTS, which are true by the shape of the business
 * and can be held against us, rather than STATISTICS, which would have to be
 * invented. Numbers get their own array, and it stays empty until each entry
 * has a real, named source - see the hard rule in data/content.js.
 */

export const commitments = [
  {
    label: "Source code",
    value: "Yours",
    note: "From day one, not on delivery.",
  },
  {
    label: "Per-seat licences",
    value: "None",
    note: "Growing your team does not grow the bill.",
  },
  {
    label: "We are paid to",
    value: "Finish",
    note: "Not to keep you subscribed.",
  },
  {
    label: "First call",
    value: "Free",
    note: "Including when the answer is do not build it.",
  },
];

/**
 * Real figures only. Each entry MUST carry `source` - a named, checkable
 * origin ("Client X, invoice audit, Mar 2026"), not "internal data". The bar
 * filters out anything unsourced rather than trusting us to remember, and
 * renders nothing at all while this array is empty.
 *
 * TODO(owner): add figures here as real engagements close. Three true numbers
 * beat ten impressive ones.
 */
export const figures = [];

/** Guard, not decoration: an unsourced figure never reaches the DOM. */
export const sourcedFigures = figures.filter(
  (figure) => typeof figure.source === "string" && figure.source.trim() !== "",
);
