module.exports = {
  env: { browser: true, es2021: true, jest: true, node: true },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaFeatures: { jsx: true }, ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react', '@typescript-eslint', 'react-hooks'],
  settings: { react: { version: 'detect' } },
  rules: {
    'react/prop-types': 'off',
    // enforce double quotes
    quotes: ['error', 'double', { avoidEscape: true, allowTemplateLiterals: true }],
    // require semicolons
    semi: ['error', 'always'],
    // disallow explicit `any` in TypeScript
    '@typescript-eslint/no-explicit-any': 'error'
  }
}
