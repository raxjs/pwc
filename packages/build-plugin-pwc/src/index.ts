import transformPlugin from './transformPlugin.js';
import bundlePlugin from './bundlePlugin.js';

const BuildPluginPWC = (api) => {
  const { context, onGetConfig } = api;
  const { rootDir } = context;

  function modifyTransformConfig(config) {
    return {
      ...config,
      rollupPlugins: [
        transformPlugin({ include: /\.pwc$/, rootDir }),
      ],
    };
  }

  function modifyBundleConfig(config) {
    return {
      ...config,
      entry: './src/index.pwc', // TODO: maybe can be configured by user
      rollupPlugins: [
        bundlePlugin({ include: /\.pwc$/, rootDir }),
      ],
    };
  }

  onGetConfig('transform-esm', modifyTransformConfig);
  onGetConfig('transform-es2017', modifyTransformConfig);
  onGetConfig('bundle-es5', modifyBundleConfig);
  onGetConfig('bundle-es2017', modifyBundleConfig);
};

export default BuildPluginPWC;
