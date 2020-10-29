const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const paths = {
    src: path.resolve(__dirname, './src'),
    build: path.resolve(__dirname, './build'),
    static: path.resolve(__dirname, './public'),
};

module.exports = {
    mode: 'development'
    devtool: 'inline-source-map',
    entry: [paths.src + '/index.js'],
    output: {
        path: paths.build
        filename: '[name].bundle.js',
        publicPath: '/',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({patterns: [
            { from: paths.static, to: paths.build },
            ],
        }),
        new HtmlWebpackPlugin({
            template: paths.static + '/index.html',
            filename: 'index.html',
        }),
    ],
    module:
        {rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
        ]
    }
};