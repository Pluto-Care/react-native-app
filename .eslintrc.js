module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'dot-notation': 'off',
    curly: 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
      },
    ],
  },
};
