var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        app: ['babel-polyfill','./app/index.js']
    },
    output: {
        path: path.resolve(__dirname, ""),
        publicPath: "",
        filename: "../dist/js/bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader', {publicPath: '../../'})
            },
            {test: /\.(png|jpg|gif)$/, loader: 'file-loader?name=../dist/img/[name].[ext]'},
            {test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/, loader: 'file-loader'}
        ]
    },
    plugins:[
        new ExtractTextPlugin("../dist/css/main.css"),
        new webpack.DefinePlugin({
            PRODUCTION:JSON.stringify(true),
            ASSETS:JSON.stringify('../assest/'),
            "process.env":{
                NODE_ENV:JSON.stringify("production")
            }
        })
    ]
};
