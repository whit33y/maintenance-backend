// eslint.config.js
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // Apply base recommended configs for JS and TS
  ...tseslint.configs.recommended,

  // Configuration for all JavaScript and TypeScript files
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    languageOptions: {
      globals: {
        ...globals.node, // Use Node.js globals ONLY
      },
    },
    rules: {
      // Your custom rules go here
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "prefer-const": "error",

      // Rules for import sorting
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },

  // Ignore specific files or directories
  {
    ignores: [
      "node_modules/",
      "dist/",
      "src/generated/**",
      "src/generated/prisma/**",
    ],
  }
);
