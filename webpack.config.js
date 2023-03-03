const path = require('path');
const webpack = require('webpack');

require('dotenv').config();

var config = {
    entry: {
        verify: './src/verify.jsx',
        login: './src/login.jsx',
        account: './src/account.jsx',
        internal: './src/internal.jsx',
        'translate-static': './src/translate-static.jsx',
        '404': './src/404.jsx',
        'pages/index': './src/static_pages/index.jsx',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public', 'js'),
    },
    devServer: {
        port: 8001,
        static: path.resolve(__dirname, 'public'),
        historyApiFallback: {
            rewrites: [
                { from: '\/account\/([\/\\\w\-_]+)(?<!\/\/)$', to: '/account/404.html' },
                { from: '\/internal\/([\/\\\w\-_]+)(?<!\/\/)$', to: '/internal/404.html' },
                { from: '/legal', to: '/legal.html' },
                { from: '/login', to: '/login.html' },
            ]
        }
    },
    module: {
        rules: [
            {
                test: /\.(jsx)$/,
                include: path.resolve(__dirname, 'src'),
                use: [
                    'babel-loader'
                ]
            },
        ]
     },
     plugins: [
        new webpack.DefinePlugin({
            "SECRET": JSON.stringify(process.env.SECRET),
            "TURNSTILE_KEY": JSON.stringify(process.env.TURNSTILE_KEY)
        }),
     ],
};

module.exports = (env, argv) => {
    if (argv.mode == 'development') {
        config.devtool = 'source-map';
        config.optimization = {
            minimize: false,
            mangleExports: false,
        };
    }

    return config;
};