module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      ecmaFeatures: {
        jsx: true,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: ['@typescript-eslint', 'react', 'import', 'unused-imports', 'tailwindcss'],
    extends: [
      'plugin:react/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:react-hooks/recommended',
      'plugin:prettier/recommended',
      'plugin:tailwindcss/recommended',
    ],
    ignorePatterns: ['*.js'], // ignore files outside src
    rules: {
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      'react/prop-types': 'off',
      'no-console': ['warn', { allow: ['error'] }],
      'react/no-unescaped-entities': ['error', { forbid: ['>', '"', '}'] }],
      '@typescript-eslint/no-empty-interface': 'warn',
      "@typescript-eslint/no-non-null-assertion": "off",
      '@typescript-eslint/no-shadow': 'error',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-curly-brace-presence': ['error', 'never'],
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-fragments': ['error', 'syntax'],
      'react/jsx-no-useless-fragment': 'error',
      'import/no-cycle': 'error',
      // Sort imports
      'import/order': [
        'warn',
        {
          pathGroups: [{ pattern: '@/**', group: 'internal' }],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'never',
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        },
      ],
      'sort-imports': ['warn', { ignoreCase: true, ignoreDeclarationSort: true }],
      // Format imports
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'import/no-duplicates': 'warn',
      'import/no-useless-path-segments': 'warn',
      // Rules regarding minimize code complexity
      'no-param-reassign': ['error'],
      'max-lines': ['warn', { max: 200, skipBlankLines: true }],
      'max-nested-callbacks': ['warn', { max: 2 }],
      'max-depth': ['warn', { max: 3 }],
    },
    overrides: [
      {
        files: ['**/*.test.{ts,tsx}'],
        rules: {
          complexity: 'off',
          'max-nested-callbacks': 'off',
          'max-depth': 'off',
          'max-params': 'off',
          'max-lines': 'off',
          'max-lines-per-function': 'off',
        },
      },
      {
        files: ['use*.ts'],
        rules: {
          '@typescript-eslint/explicit-module-boundary-types': 'off',
        },
      },
    ],
  };
  