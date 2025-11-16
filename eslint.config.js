import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginTailwindcss from 'eslint-plugin-tailwindcss';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginReactRefresh from 'eslint-plugin-react-refresh';

export default [
  {
    // Global ignores
    ignores: [
      'dist/',
      'node_modules/',
      '.eslintrc.cjs',
      'playwright-report/',
      'test-results/',
      'backend/dist/**',
      'backend/*.mjs',
      'backend/*.js',
      'backend/check-*.mjs',
      'backend/check-*.js',
      'backend/debug-*.js',
      'backend/fix-*.mjs',
      'backend/fix-*.js',
      'backend/recreate-db.mjs',
      'backend/scripts/**/*.js',
      'backend/scripts/**/*.mjs',
    ],
  },

  // Base config for all files
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,

  // Config for React/TSX source files
  {
    files: ['src/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: { ...globals.browser },
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh,
      tailwindcss: pluginTailwindcss,
      prettier: pluginPrettier,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
    settings: {
      react: { version: 'detect' },
    },
  },

  // Config for Node.js scripts and config files
  {
    files: [
      '*.{js,cjs,mjs}',
      'scripts/**/*.{js,cjs,mjs}',
      'tools/**/*.{js,cjs,mjs}',
      '*.config.js',
      '*.config.ts',
    ],
    languageOptions: {
      globals: {
        console: 'readonly',
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        __filename: 'readonly',
        __dirname: 'readonly',
        fetch: 'readonly', // fetch is available in newer Node.js versions
        ...globals.node, // Keep other Node.js globals
      },
      sourceType: 'commonjs',
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended[0].rules, // Adjust depending on structure
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      'no-console': 'off',
      'no-undef': 'off', // Temporarily disable no-undef for Node.js files to avoid conflicts
      'no-redeclare': 'off', // Allow redeclaring Node.js globals
    },
  },

  // Config for e2e test files
  {
    files: ['e2e/**/*.ts'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.jest }, // Add browser and jest globals
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      'no-undef': 'off', // Temporarily disable no-undef for e2e files
      '@typescript-eslint/no-explicit-any': 'off', // Allow any in e2e tests
      '@typescript-eslint/no-unused-vars': 'off', // Allow unused vars in e2e tests
    },
  },

  // Config for unit/component tests
  {
    files: ['src/**/__tests__/**/*.{ts,tsx}'],
    languageOptions: {
      globals: { ...globals.browser },
      parser: tseslint.parser,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  // Relax rules for dynamic security utilities (typed progressively)
  {
    files: ['src/utils/security/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // Config for JS files in public folder (browser environment)
  {
    files: ['public/js/**/*.js'],
    languageOptions: {
      globals: { ...globals.browser, dataLayer: 'readonly' }, // Add dataLayer global
      sourceType: 'script',
    },
    rules: {
      'no-undef': 'warn',
    },
  },
];
