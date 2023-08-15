const { createProxyMiddleware } = require('http-proxy-middleware');

const context = [
    "/rolldice",
];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: 'https://localhost:7022',
        secure: false
    });

    app.use(appProxy);
};