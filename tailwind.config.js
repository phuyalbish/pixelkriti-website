/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "var(--ink)",
          raised: "var(--ink-raised)",
          overlay: "var(--ink-overlay)",
          faint: "var(--ink-faint)",
        },
        paper: {
          DEFAULT: "var(--paper)",
          dim: "var(--paper-dim)",
          faint: "var(--paper-faint)",
        },
        line: {
          DEFAULT: "var(--line)",
          strong: "var(--line-strong)",
          ink: "var(--line-ink)",
        },
        brand: {
          DEFAULT: "var(--brand)",
          soft: "var(--brand-soft)",
        },
      },
      fontFamily: {
        display: "var(--font-display)",
        sans: "var(--font-sans)",
        mono: "var(--font-mono)",
      },
      fontSize: {
        /*
         * Display type is the whole difference between a confident page and a
         * timid one. `mega` is reserved for the promise and its echo in the
         * footer - the two moments the page is allowed to shout.
         */
        mega: ["clamp(3rem, 11vw, 9.5rem)", { lineHeight: "0.92" }],
        display: ["clamp(2.75rem, 7vw, 6.25rem)", { lineHeight: "0.96" }],
        headline: ["clamp(2rem, 4.5vw, 3.5rem)", { lineHeight: "1.04" }],
        title: ["clamp(1.5rem, 2.4vw, 2.125rem)", { lineHeight: "1.15" }],
        /*
         * The watermark word behind a section heading. Never read, only felt -
         * and sized to stay inside its own column, since it is set `nowrap` and
         * would otherwise run out across whatever sits beside it.
         */
        ghost: ["clamp(3.25rem, 7vw, 6.5rem)", { lineHeight: "1" }],
      },
      maxWidth: {
        shell: "84rem",
        prose: "38rem",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
