/**
 * Real client testimonials, supplied by the client and attributed to the people
 * who gave them.
 *
 * These are no longer placeholders: the words below are theirs. That is what
 * earns the names, the companies and the links - and it is the only thing that
 * does. If a quote ever needs a stand-in again, it goes back to a visible
 * "pending" marker and the name comes off with it. A real name over a written-
 * for-them sentence is a fabricated endorsement of a real person at a real
 * company, and two of these are clients with case studies on this same site.
 *
 * `audio` stays null until that person's own recording exists: a play button
 * under someone's name claims a recording of THEM is behind it, and the
 * recording must be the same words as `quote` - see VoiceNote.
 */
export const testimonials = [
  {
    id: "hellotrekkers",
    quote:
      "Every booking used to live in a different inbox or spreadsheet, and things slipped through the cracks constantly. The system they built brought enquiries, itineraries, guide scheduling and payments into one dashboard. This peak season we handled nearly double the trips without adding a single admin hire - and for the first time the whole team actually trusts the numbers in front of them.",
    /** Job title, shown before the name. */
    role: "Founder",
    name: "Aashish Regmi",
    company: "HelloTrekkers",
    /** The company's site. Linked only when the attribution is real. */
    url: "https://hellotrekkers.com",
    /**
     * Path to this person's recorded testimonial, e.g. "/voice/aashish.m4a".
     * The transcript and the recording must be the SAME words - a quote that
     * does not match the voice under it is two testimonials, one of them false.
     * Null renders no button at all, rather than a control that plays nothing.
     */
    audio: null,
    isPlaceholder: false,
  },
  {
    id: "tailg",
    quote:
      "Running multiple showrooms meant three different versions of the truth on stock and service. Now inventory, test-ride bookings and after-sales follow-ups all sit in one place, and I can see every branch from my phone. Customer response times dropped noticeably, and month-end reconciliation went from two full days to about an hour.",
    role: "Manager",
    name: "Sanjeev Silpakar",
    company: "TAILG Nepal",
    url: "https://tailgnepal.com",
    audio: null,
    isPlaceholder: false,
  },
  {
    id: "sciobyte",
    quote:
      "We didn't want another tool we'd outgrow in six months - we needed something that scaled with us. What they delivered was clean, fast, and genuinely built around how our team actually works. The automation alone saves us a dozen-plus hours a week, and the handover was thorough enough that we were running it confidently from day one.",
    role: "Founder",
    name: "Subhankar",
    company: "Sciobyte",
    url: "https://sciobyte.com",
    audio: null,
    isPlaceholder: false,
  },
];
