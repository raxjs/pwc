// .commitlintrc.js
const { getCommitlintConfig } = require('@applint/spec');

// getCommitlintConfig(rule: 'rax'|'react', customConfig?);
module.exports = getCommitlintConfig('common');
