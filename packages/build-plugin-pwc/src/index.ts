import pwc from './plugin.js';

const BuildPluginPWC = (api) => {
  const { context, onGetConfig } = api;

  onGetConfig(config => {
    return {
      ...config,
      rollupPlugins: [
        pwc({ include: /\.pwc$/ }),
      ],
    };
  });
};

export default BuildPluginPWC;
