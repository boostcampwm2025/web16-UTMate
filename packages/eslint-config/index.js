require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  extends: [
    "prettier", // Prettier와 충돌하는 ESLint 규칙 비활성화
  ],

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

    // Rushstack의 엄격한 규칙들 완화
    "@typescript-eslint/explicit-member-accessibility": "off", // public/private 강제 해제
    "@typescript-eslint/typedef": "off", // 타입 명시 강제 해제
    "@typescript-eslint/explicit-function-return-type": "off", // 함수 반환 타입 강제 해제
  },
};
