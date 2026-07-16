import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  /*
   * Not ours to lint:
   * - dist: build output.
   * - .wrangler: generated scratch workers.
   * - any "skills" directory: vendored third-party agent tooling (bundled UMD,
   *   minified builds), installed into .github, .claude AND .agents alike.
   *   It was contributing 213 errors - every one of them in code we did not
   *   write and will never edit - which is enough noise to make `pnpm run lint`
   *   fail by default, and a lint gate that always fails tells you nothing
   *   about your own source.
   */
  { ignores: ["dist", ".wrangler", "**/skills/**"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: { react: { version: "19.0" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react/jsx-no-target-blank": "off",
      "react/prop-types": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
];
