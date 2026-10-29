// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier');

module.exports = defineConfig([
  expoConfig,
  prettierConfig,
  {
    rules: {
      'no-console': 'error',
      'no-warning-comments': ['warn', { terms: ['todo', 'fixme'] }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/ban-ts-comment': [
        'error',
        { 'ts-ignore': true, 'ts-expect-error': 'allow-with-description' },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'react/no-array-index-key': 'error',
      'import/no-default-export': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/theme/*'],
              message:
                "Import tokens from '@/theme'. Components use semantic tokens, never the core palette.",
            },
          ],
        },
      ],
    },
  },
  {
    // expo-router requires default exports for routes; config files use them too.
    files: ['src/app/**/*.tsx', '*.config.js', '*.config.ts'],
    rules: { 'import/no-default-export': 'off' },
  },
  {
    files: ['**/__tests__/**', 'jest.setup.ts'],
    rules: { '@typescript-eslint/no-non-null-assertion': 'off' },
  },
  {
    ignores: ['dist/*', 'ios/*', 'android/*', '.expo/*', 'coverage/*'],
  },
]);
