const path = require('path');
const webpack = require('webpack');

require('dotenv').config();

module.exports = {
    entry: {
        verify: './src/verify.jsx',
        login: './src/login.jsx',
        account: './src/account.jsx',
        'translate-static': './src/translate-static.jsx',
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
                { from: '(\/account\/[\\w\\-_]+(?!\/+)+)$', to: '/account/404.html' },
                { from: '/legal', to: '/legal.html' },
                { from: '/login', to: '/login.html' },
            ]
        }
    },
    module: {
        rules: [
            {
                test: /\.(jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
        ]
     },
     plugins: [
        new webpack.DefinePlugin({
            "SECRET": JSON.stringify(process.env.SECRET)
        })
     ],
};