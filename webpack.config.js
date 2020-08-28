const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    devtool: '#eval-source-map',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js',
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                include: /src/,
                options: {
                    presets: ['modern-browsers'],
                },
            },

            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },

            {
                test: /\.(gif|jpeg|jpg|png|svg|webp)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: './images/[name].[ext]',
                            include: [/images/],
                        },
                    },
                ],
            },
            {
                type: 'javascript/auto',
                test: /\.json$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: './images/[name].[ext]',
                        },
                    },
                ],
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path]/[name].[ext]',
                            include: [/fonts/],
                        },
                    },
                ],
            },
        ], // rules
    }, // module

    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            inject: false,
        }),
    ], // plugins
    devServer: {
        port: 3001, // Specify a port number to listen for requests
    },
}
