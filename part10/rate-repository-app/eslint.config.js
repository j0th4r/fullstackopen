const js = require('@eslint/js');
const react = require('eslint-plugin-react');
const reactNative = require('eslint-plugin-react-native');
const babelParser = require('@babel/eslint-parser');

module.exports = [
  {
    files: ['eslint.config.js', 'babel.config.js'],
    languageOptions: {
      globals: {
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
      },
    },
  },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react,
      'react-native': reactNative,
    },
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        __DEV__: 'readonly',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    rules: {
      ...reactNative.configs.all.rules,
      'react-native/no-raw-text': 'off',
      // 'react-native/': ''
    },
  },
];
