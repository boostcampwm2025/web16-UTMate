require("@rushstack/eslint-patch/modern-module-resolution");
const { builtinModules } = require("node:module");

module.exports = {
  extends: [
    "prettier", // Prettier와 충돌하는 ESLint 규칙 비활성화
  ],

  plugins: ["simple-import-sort"],

  ignorePatterns: [
    // Build outputs
    "**/dist",
    "**/build",
    "**/.next",
    "**/out",

    // Dependencies
    "**/node_modules",

    // Config files
    "**/*.config.js",
    "**/*.config.ts",
    "**/*.config.mjs",
    "**/.eslintrc.js",

    // Generated files
    "**/*.d.ts",
  ],

  rules: {
    // TypeScript 규칙
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],

    // Console 사용 규칙 (warn, error, info는 허용)
    "no-console": ["warn", { allow: ["warn", "error", "info"] }],

    // Import 정렬
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          // Node.js builtins
          [`^(node:)?(${builtinModules.join("|")})(/.*|$)`],
          // External packages
          ["^@?\\w"],
          // Internal packages & aliases
          ["^(@repo|@|~)(/.*|$)"],
          // Side effect imports
          ["^\\u0000"],
          // Parent imports
          ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
          // Relative imports
          ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
          // Style imports
          ["^.+\\.s?css$"],
        ],
      },
    ],
    "simple-import-sort/exports": "error",

    // Rushstack의 엄격한 규칙들 완화
    "@typescript-eslint/explicit-member-accessibility": "off", // public/private 강제 해제
    "@typescript-eslint/typedef": "off", // 타입 명시 강제 해제
    "@typescript-eslint/explicit-function-return-type": "off", // 함수 반환 타입 강제 해제
    "@rushstack/typedef-var": "off", // 변수 타입 명시 강제 해제
  },
};
