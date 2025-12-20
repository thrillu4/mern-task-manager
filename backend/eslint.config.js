import js from "@eslint/js"
import importPlugin from "eslint-plugin-import"
import globals from "globals"

export default [
  {
    ignores: ["node_modules", ".env"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,

      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": "off",
      "import/no-unresolved": "off",
    },
  },
]
