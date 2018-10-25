const env = process.env.NODE_ENV
const path = require('path');

const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: ['./src/index.tsx', './src/style.scss'],
    output: {
        path: path.resolve(__dirname, "../priv/static"),
        filename: "js/app.js"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".jsx"],
        modules: ["deps", "node_modules"]
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader",
                        options: {
                            minimize: true,
                            sourceMap: env === 'production',
                        }
                    }, {
                        loader: "sass-loader",
                        options: {
                            includePaths: [path.resolve('node_modules')],
                        }
                    }],
                    fallback: "style-loader"
                })
            },
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    'loader': 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    },
                }
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: "css/app.css"
        })
    ]
};
