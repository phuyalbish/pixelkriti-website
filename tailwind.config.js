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
        },
        paper: {
          DEFAULT: "var(--paper)",
          dim: "var(--paper-dim)",
          faint: "var(--paper-faint)",
        },
        line: {
          DEFAULT: "var(--line)",
          strong: "var(--line-strong)",
        },
      },
      fontFamily: {
        display: "var(--font-display)",
        sans: "var(--font-sans)",
        mono: "var(--font-mono)",
      },
      fontSize: {
        display: ["clamp(2.75rem, 7vw, 6.25rem)", { lineHeight: "0.96" }],
        headline: ["clamp(2rem, 4.5vw, 3.5rem)", { lineHeight: "1.04" }],
        title: ["clamp(1.5rem, 2.4vw, 2.125rem)", { lineHeight: "1.15" }],
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
