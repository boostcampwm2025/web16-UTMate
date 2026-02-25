import { builtinModules } from 'node:module';

import reactQuery from '@tanstack/eslint-plugin-query';
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  ...reactQuery.configs['flat/recommended'],
  // 공통 규칙 추가
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // Console
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],

      // Import 정렬
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Node.js builtins
            [`^(node:)?(${builtinModules.join('|')})(/.*|$)`],
            // External packages
            ['^@?\\w'],
            // Internal packages & aliases
            ['^(@repo|@|~)(/.*|$)'],
            // Side effect imports
            ['^\\u0000'],
            // Parent imports
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Relative imports
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Style imports
            ['^.+\\.s?css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      // Next.js 규칙
      '@next/next/no-html-link-for-pages': 'off', // App Router 사용 (Pages Router 규칙 비활성화)
    },
  },

  // Ignore patterns
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', '**/*.d.ts']),

  // Next.js 설정
  {
    settings: {
      next: {
        rootDir: 'apps/client/',
      },
    },
  },
]);

export default eslintConfig;
