require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: ['@rushstack/eslint-config/profile/web-app', '@org/eslint-config'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    // React/Next.js 특화 규칙
    // '@typescript-eslint/naming-convention': [
    //   'error',
    //   {
    //     selector: 'variable',
    //     format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
    //     leadingUnderscore: 'allow',
    //   },
    //   {
    //     selector: 'function',
    //     format: ['camelCase', 'PascalCase'],
    //   },
    //   {
    //     selector: 'typeLike',
    //     format: ['PascalCase'],
    //   },
    // ],
  },
  root: true,
};
