module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', // ✅ Use TypeScript parser
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'prettier', 'simple-import-sort', 'unused-imports'],
  rules: {
    // ✅ Ensure Prettier formatting
    'prettier/prettier': 'error',

    // ✅ TypeScript rules
    '@typescript-eslint/no-unused-vars': ['warn'],

    // ✅ Auto-sort imports
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // React and React Native first
          ['^react', '^react-native'],

          // Expo packages
          ['^expo', '^@expo'],

          // Third-party libraries (anything from node_modules)
          ['<THIRD_PARTY_MODULES>'],

          // Absolute imports from the project (e.g., "@/components", "@/utils")
          ['^@/components', '^@/hooks', '^@/utils'],

          // Relative imports (starting with ./ or ../)
          ['^\\./', '^\\.\\./'],
        ],
      },
    ],
    'simple-import-sort/exports': 'error',

    // ✅ Auto-remove unused imports
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
    ],
  },
};
