const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy requests to the api.
  app.use(
    '/desktop/api/v2',
    createProxyMiddleware({
      target: 'http://localhost:6305',
      changeOrigin: false,
      pathRewrite: {
        '^/desktop/api/': '/', // Remove base path.
      },
      logLevel: 'debug',
    })
  );

  app.use(
    '/login/api/v0',
    createProxyMiddleware({
      target: 'http://localhost:6311',
      changeOrigin: false,
      pathRewrite: {
        '^/login/api/': '/', // Remove base path.
      },
      logLevel: 'debug',
    })
  );
};
