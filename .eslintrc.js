const { getESLintConfig } = require('@applint/spec');

// https://www.npmjs.com/package/@applint/spec
module.exports = getESLintConfig('common-ts', {
  rules: {
    'no-console': 0,
    'no-param-reassign': 0,
    'no-cond-assign': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    '@typescript-eslint/prefer-ts-expect-error': 0
  },
});
