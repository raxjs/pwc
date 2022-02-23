// .commitlintrc.js
const { getCommitlintConfig } = require('@appworks/spec');

// getCommitlintConfig(rule: 'rax'|'react', customConfig?);
module.exports = getCommitlintConfig('common');
