const path = require('path');
const webpack = require('webpack');

require('dotenv').config();

module.exports = {
    entry: {
        verify: './src/verify.jsx',
        login: './src/login.jsx',
        account: './src/account.jsx'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public', 'js'),
    },
    devServer: {
        port: 8001
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