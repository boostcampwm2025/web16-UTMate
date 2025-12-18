// Rushstack ESLint patch를 먼저 로드
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  extends: ['@rushstack/eslint-config/profile/node', '@org/eslint-config'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    // NestJS 특화 규칙
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-floating-promises': 'off', // async 처리 강제 해제
    '@typescript-eslint/parameter-properties': 'off', // constructor 파라미터 프로퍼티 허용
    '@typescript-eslint/naming-convention': 'off', // 네이밍 규칙 완화 (NestJS 스타일 허용)
  },
  root: true,
};
