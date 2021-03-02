const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy requests to the desktop api.
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

  // Proxy requests to the login api.
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

  // Proxy requests to the landing page.
  app.use(
    [
      '/data/',
      '/styles/branding.css',
    ],
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: false,
      logLevel: 'debug',
    })
  );
};
