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
    mode: env === 'production' ? 'production' : 'development',
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    use: [{
                        loader: "css-loader",
                        options: {
                            minimize: true,
                            sourceMap: env === 'production',
                        }
                    }],
                    fallback: "style-loader"
                })
            },
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
            },
            {
                test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
                // put fonts in assets/static/fonts/
                loader: 'file-loader?name=/fonts/[name].[ext]'
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin({
            filename: "css/app.css"
        })
    ]
};
