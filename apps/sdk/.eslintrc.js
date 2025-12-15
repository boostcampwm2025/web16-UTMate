require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: ['@rushstack/eslint-config/profile/web-app', '@org/eslint-config'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    // 브라우저 SDK 특화 규칙
  },
  root: true,
};
