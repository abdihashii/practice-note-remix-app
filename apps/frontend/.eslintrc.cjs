/**
 * ESLint configuration for the Remix frontend application (apps/frontend)
 *
 * Key features:
 * - React & TypeScript support
 * - Path alias support (~ -> ./app)
 * - A11y rules enabled
 * - Import rules for better module resolution
 *
 * Note: This config is specific to the frontend app and doesn't affect
 * other apps in the monorepo.
 */

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true, // Prevent ESLint from looking for configs in parent folders
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true, // Enable browser globals
    commonjs: true, // Enable CommonJS globals
    es6: true, // Enable ES6 globals
  },
  // Don't ignore files in .server and .client directories
  ignorePatterns: ["!**/.server", "!**/.client"],

  // Base config - will be extended by overrides
  extends: ["eslint:recommended"],

  overrides: [
    // React-specific rules
    // Applies to both JS and TS files that may contain React code
    {
      files: ["**/*.{js,jsx,ts,tsx}"],
      plugins: ["react", "jsx-a11y"],
      extends: [
        "plugin:react/recommended",
        "plugin:react/jsx-runtime", // For React 17+ new JSX transform
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
      ],
      settings: {
        react: {
          version: "detect", // Auto-detect React version
        },
        // Special handling for Remix form components
        formComponents: ["Form"],
        // Special handling for routing components
        linkComponents: [
          { name: "Link", linkAttribute: "to" },
          { name: "NavLink", linkAttribute: "to" },
        ],
        // Configure import resolver for path aliases
        "import/resolver": {
          typescript: {}, // Use TypeScript's path resolution
          alias: {
            map: [["~", "./app"]], // Map ~ to ./app directory
            extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
          },
        },
      },
    },

    // TypeScript-specific rules
    // Additional rules that only apply to TypeScript files
    {
      files: ["**/*.{ts,tsx}"],
      plugins: ["@typescript-eslint", "import"],
      parser: "@typescript-eslint/parser",
      settings: {
        "import/internal-regex": "^~/", // Treat imports starting with ~ as internal
        "import/resolver": {
          typescript: {
            alwaysTryTypes: true,
            project: "./tsconfig.json", // Point to the TypeScript config
          },
          alias: {
            map: [["~", "./app"]], // Same alias config as above
            extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
          },
        },
      },
      extends: [
        "plugin:@typescript-eslint/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
      ],
    },

    // Node-specific rules
    // Only applies to this ESLint config file itself
    {
      files: [".eslintrc.cjs"],
      env: {
        node: true,
      },
    },
  ],
};
