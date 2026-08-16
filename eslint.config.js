import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";

export default [
  {
    ignores: ["build/**", "node_modules/**"],
  },
  js.configs.recommended,
  {
    files: ["gulp/**/*.js", "gulpfile.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["source/**/*.js"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  prettier,
];
