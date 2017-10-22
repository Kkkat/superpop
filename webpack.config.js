const webpack = require('webpack');
const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OpenWebpackPlugin = require('open-browser-webpack-plugin');

const NODE_ENV = process.env.NODE_ENV || 'production';

const SRC = path.join(__dirname, 'src');
const BUILD = path.join(__dirname, 'build');

const config = {
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        path: BUILD,
        filename: 'js/bundle.[hash].js'
    },
    resolve: {
        extensions: [".js", ".json", ".css", ".pcss"],
        // extensions that are used
    },
    module: {
        rules: [{
            test: /.js$/,
            loader: 'babel-loader',
            include: SRC,
            exclude: /node_modules/
        }, {
            test: /.(p)?css$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1
                    }
                },
                'postcss-loader'
            ]
        }, {
            test: /.(gif|jpg|png)$/,
            loader: 'file-loader?name=img/[name]-[hash].[ext]'
        }, {
            test: /.(woff|woff2|ttf|svg)($|\?)/,
            loader: 'url-loader'
        }]
    },
    plugins: [
        new CleanPlugin(BUILD),
        new ExtractTextPlugin({
            filename: (getPath) => getPath('css/[name].css')
        }),
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            hash: false,
            inject: 'body',
            minify: {
                collapseWhitespace: false
            }
        })
    ]
}

switch (NODE_ENV) {
    case 'development':
        config.devServer = {
            hot: true,
            inline: true,
            stats: 'normal',
            host: '0.0.0.0'
        }
        config.plugins.push(
            new webpack.HotModuleReplacementPlugin(),
            new OpenWebpackPlugin({
                url: 'http://localhost:8080'
            })
        )
        break;
    case 'production':
        break;
    default:
        throw new Error('NODE_ENV not found')
}

module.exports = config;