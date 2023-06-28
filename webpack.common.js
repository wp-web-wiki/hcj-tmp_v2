const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ProvidePlugin } = require('webpack');

module.exports = ({ outputFile }) => ({
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: `js/${outputFile}.bundle.js`,
        clean: true,
        //chunkFilename: `js/${outputFile}.js`,
    },
    module: {
        rules: [
            {
                test: /\.(sass|scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(jpe?g|gif|png|svg|woff2?|tff|eot)$/,
                type: 'asset/resource', // webpack4(file-loader)
                generator: {
                    filename: `images/${outputFile}.[ext]`,
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                    {
                        loader: 'eslint-loader',
                        options: {
                            fix: true, // --fixオプションの自動保管がされない
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    'html-loader', // HTML内で記述された画像も検知 -> 検知した画像を上の画像で検知しimagesディレクトリに出力
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: `css/${outputFile}.css`
        }),
        new ProvidePlugin({
            $: 'jquery'
        }),
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 0,
            cacheGroups: {
                defaultVendors: {
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    reuseExistingChunk: true,
                },
            },
        },
    },
    resolve: {
        alias: {
            '@scss': path.resolve(__dirname, 'src/scss'),
            '@image': path.resolve(__dirname, 'src/images'),
        }
    }
})