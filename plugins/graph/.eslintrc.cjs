module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  ignorePatterns: ["dist/**", "node_modules/**"],
  overrides: [
    {
      files: ["src/components/scripts/graph.inline.ts"],
      rules: {
        "@typescript-eslint/ban-ts-comment": "off",
        "no-var": "off",
      },
    },
  ],
};
