import pwc from './plugin.js';

const BuildPluginPWC = (api) => {
  const { context, onGetConfig } = api;
  const { rootDir } = context;

  onGetConfig(config => {
    return {
      ...config,
      rollupPlugins: [
        pwc({ include: /\.pwc$/, rootDir }),
      ]
    };
  });
};

export default BuildPluginPWC;
