const { getESLintConfig } = require('@appworks/spec');

// https://www.npmjs.com/package/@appworks/spec
module.exports = getESLintConfig('common-ts', {
  rules: {
    'no-console': 0,
    'no-param-reassign': 0,
    'no-cond-assign': 0,
    '@typescript-eslint/no-unused-vars': 0
  }
});
