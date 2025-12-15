require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  extends: [
    "@rushstack/eslint-config/profile/web-app",
    "@org/eslint-config",
    "next/core-web-vitals",
    "next/typescript",
  ],
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  root: true,
};
