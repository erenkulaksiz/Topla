module.exports = {
  env: {
    browser: true,
    es2021: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'eslint:recommended',
  ],
  parserOptions: {
    parser: "babel-eslint",
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react', 'react-hooks'
  ],
  rules: {
    "linebreak-style": 0,
    "indent": ["error", 4],
    "quotes": 0,
    "eol-last": 0,
    "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 0 }],
    "no-unexpected-multiline": "warn"
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
