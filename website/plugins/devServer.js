module.exports = function (context, options) {
  return {
    name: 'dev-server-docusaurus-plugin',
    configureWebpack(config, isServer, utils) {
      return {
        devServer: {
          allowedHosts: 'all',
          host: '0.0.0.0',
        },
      };
    },
  };
};
