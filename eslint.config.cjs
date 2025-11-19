/* Minimal flat ESLint config for ESLint v9 (converted from legacy .eslintrc)
   This is a conservative config that keeps core rules and integrates common
   plugins. For a complete migration, consider converting all legacy "extends"
   sets to their equivalent rule lists.
*/
const path = require('path');
module.exports = [
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'reports/**',
      'public/optimized/**',
      'playwright-report/**',
      'test-results/**',
      'tmp/**',
      'temp_trace_extract1/**',
      'tools/githooks/**',
      'node_modules/**',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: require('eslint-plugin-react'),
      'react-hooks': require('eslint-plugin-react-hooks'),
      tailwindcss: require('eslint-plugin-tailwindcss'),
      '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
      prettier: require('eslint-plugin-prettier'),
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'prettier/prettier': 'warn',
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  // Scoped override for TypeScript files: enable type-aware linting only on .ts/.tsx
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: require('@typescript-eslint/parser'),
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: path.resolve(__dirname, './tsconfig.json'),
        tsconfigRootDir: __dirname,
      },
    },
  },
];
// NOTE: FlatCompat approach was removed and this file now provides a
// conservative flat config for ESLint v9. If you prefer to import from
// the legacy `.eslintrc.cjs`, use FlatCompat as part of `@eslint/eslintrc`.
