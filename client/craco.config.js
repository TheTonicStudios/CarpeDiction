/**
 * CRACO config: use webpack-dev-server 5 API (setupMiddlewares, server) so we can
 * run patched webpack-dev-server@5.2.1 and fix moderate security advisories.
 * React-scripts passes deprecated top-level `https`; convert it to the `server` option.
 */
module.exports = {
  devServer: (devServerConfig) => {
    const onBefore = devServerConfig.onBeforeSetupMiddleware;
    const onAfter = devServerConfig.onAfterSetupMiddleware;
    delete devServerConfig.onBeforeSetupMiddleware;
    delete devServerConfig.onAfterSetupMiddleware;
    devServerConfig.setupMiddlewares = (middlewares, devServer) => {
      if (typeof onBefore === 'function') onBefore(devServer);
      if (typeof onAfter === 'function') onAfter(devServer);
      return middlewares;
    };
    // webpack-dev-server 5: top-level "https" is invalid; use "server" instead
    const https = devServerConfig.https;
    delete devServerConfig.https;
    if (https) {
      devServerConfig.server =
        typeof https === 'object' && (https.key || https.cert)
          ? { type: 'https', options: https }
          : 'https';
    }
    return devServerConfig;
  },
};
