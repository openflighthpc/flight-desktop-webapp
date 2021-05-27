const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  if (process.env.REACT_APP_PROXY_API === "true") {
    // Proxy requests to the desktop api.
    const rewriteFrom = process.env.REACT_APP_PROXY_API_PATH_REWRITE_FROM ||
      '^/dev/desktop/api';
    const rewriteTo = process.env.REACT_APP_PROXY_API_PATH_REWRITE_TO ||
      '/';

    app.use(
      process.env.REACT_APP_PROXY_API_PATH || '/desktop/api/v2',
      createProxyMiddleware({
        target: process.env.REACT_APP_PROXY_API_URL || 'http://localhost:6305',
        changeOrigin: false,
        pathRewrite: {
          [rewriteFrom]: rewriteTo,
        },
        logLevel: 'debug',
      })
    );
  }

  if (process.env.REACT_APP_PROXY_LOGIN_API === "true") {
    // Proxy requests to the login api.
    const rewriteFrom = process.env.REACT_APP_PROXY_LOGIN_API_PATH_REWRITE_FROM ||
      '^/dev/login/api';
    const rewriteTo = process.env.REACT_APP_PROXY_LOGIN_API_PATH_REWRITE_TO ||
      '/';

    app.use(
      process.env.REACT_APP_PROXY_LOGIN_API_PATH || '/login/api/v0',
      createProxyMiddleware({
        target: process.env.REACT_APP_PROXY_LOGIN_API_URL || 'http://localhost:6311',
        changeOrigin: false,
        pathRewrite: {
          [rewriteFrom]: rewriteTo,
        },
        logLevel: 'debug',
      })
    );
  }

  // Proxy requests to the landing page.
  // app.use(
  //   [
  //     '/data/',
  //     '/styles/branding.css',
  //   ],
  //   createProxyMiddleware({
  //     target: 'http://localhost:3001',
  //     changeOrigin: false,
  //     logLevel: 'debug',
  //   })
  // );
};
