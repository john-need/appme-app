module.exports = {
  env: { browser: true, es2021: true, jest: true, node: true },
  extends: ["eslint:recommended", "plugin:react/recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: { ecmaFeatures: { jsx: true }, ecmaVersion: "latest", sourceType: "module" },
  plugins: ["react", "@typescript-eslint", "react-hooks"],
  settings: { react: { version: "detect" } },
  rules: {
    "react/prop-types": "off",
    // enforce double quotes
    quotes: ["error", "double", { avoidEscape: true, allowTemplateLiterals: true }],
    // require semicolons
    semi: ["error", "always"],
    // disallow explicit `any` in TypeScript (overridden in tests below)
    "@typescript-eslint/no-explicit-any": "error",
  },
  overrides: [
    {
      files: [
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.spec.ts",
        "**/*.spec.tsx",
        "**/__tests__/**/*.ts",
        "**/__tests__/**/*.tsx",
      ],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
      },
    },
    {
      files: ["**/mocks/**/*.{ts,tsx}"],
      rules: {
        "@typescript-eslint/no-explicit-any": "off",
      },
    },
  ],
};
