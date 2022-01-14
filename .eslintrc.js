const { getESLintConfig } = require('@appworks/spec');

// https://www.npmjs.com/package/@iceworks/spec
module.exports = getESLintConfig('common-ts', {
  parserOptions: {
    project: [],
    createDefaultProgram: false,
  },
});
