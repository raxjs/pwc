import { transform, availablePlugins } from '@babel/standalone';
// import babelPluginProposalDecorators from '@babel/plugin-proposal-decorators';
// import babelPluginProposalClassProperties from '@babel/plugin-proposal-class-properties';
// import babelPluginProposalClassStaticBlock from '@babel/plugin-proposal-class-static-block';
// import babalPluginProposalPrivateMethods from '@babel/plugin-proposal-private-methods';

const _require = (moduleName) => {
  const modeules = {
    react: require('react'),
    pwc: require('pwc'),
    'react-dom': require('react-dom'),
  };
  if (modeules[moduleName]) {
    return modeules[moduleName];
  }
  throw new Error(
    `找不到'${moduleName}模块'，可选模块有：${Object.keys(modeules).join(', ')}`,
  );
};

export const evalCode = (code) => {
  const output = transform(code, {
    presets: ['env'],
    plugins: [
      [
        availablePlugins['proposal-decorators'],
        { version: '2021-12', decoratorsBeforeExport: true },
      ],
      availablePlugins['proposal-class-properties'],
      availablePlugins['proposal-class-static-block'],
      availablePlugins['proposal-private-methods'],
    ],
  }).code;
  console.log('🚀 ~ file: evalCode.ts ~ line 18 ~ output', output);
  const fn = new Function(
    `var require = arguments[0], exports = arguments[1];\n ${output}`,
  );
  const exports = {};
  fn.call(null, _require, exports);
  // return exports.default;
};
