/** @type {import('eslint').Linter.Config} */
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'airbnb', 'plugin:prettier/recommended'],
  overrides: [
    {
      files: '**/+.*(ts|tsx)',
      parser: '@typescript-eslint/parser',
      parserOptions: {
        projects: './tsconfig.json',
      },
      plugins: ['@typescript-eslint/eslint-plugin'],
      extends: ['plugin:@typescript-eslint/recommended', 'plugin:@typescript-eslint/recommended', 'plugin:import/typescript', 'plugin:import/recommended'],
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['jsx-a11y', '@typescript-eslint', 'prettier'],
  rules: {
    'linebreak-style': 'off',
    'import/newline-after-import': 'off',
    'import/first': 'off',
    'import/no-absolute-path': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'import/prefer-default-export': 'off',
    'object-shorthand': ['off', 'always'],
    'jsx-dev-runtime': 'off',
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', ['index', 'parent'], 'sibling', 'object', 'unknown'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
        pathGroups: [
          {
            pattern: '{@tanstack*/**,@**/**,msw*,axios*}',
            group: 'external',
            position: 'after',
          },
          {
            pattern: '*/**.css',
            group: 'index',
          },
          {
            pattern: '{pages*,pages*/**}',
            group: 'index',
          },
          {
            pattern: '{mocks/*,mocks}',
            group: 'unknown',
          },
          {
            pattern: '{utils/*,utils}',
            group: 'unknown',
          },
          {
            pattern: '{components,components/*}',
            group: 'unknown',
          },
        ],
        pathGroupsExcludedImportTypes: ['unknown', 'index'],
        'newlines-between': 'always',
      },
    ],
    'no-underscore-dangle': 'off',
    'spaced-comment': 'off',
    'one-var': 'off',
    'no-undef': 'off',
    'no-var': 'off',
    'no-void': 'off',
    'no-shadow': 'off',
    'no-unused-vars': 'off',
    'prefer-template': 'off',
    'no-useless-concat': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/no-duplicates': 'off',
    'vars-on-top': 'off',
    'no-use-before-define': 'off',
    'import/prefer-defalut-export': 'off',
    'prettier/prettier': [
      'off',
      {
        endOfLine: 'auto',
      },
      {
        usePrettierrc: true,
      },
    ],
  },
};
