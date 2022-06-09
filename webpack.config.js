const { resolve } = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config();
// const PreloadWebpackPlugin = require('preload-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const htmlWebpackPlugin = new HtmlWebPackPlugin({
  template: './index.html',
  filename: './index.html',
  favicon: './assets/images/favicon.ico',
});

const copyWebpackPlugin = new CopyWebpackPlugin([
  { from: './index.css', to: './index.css' },
  { from: './slick.css', to: './slick.css' },
  { from: './close.html', to: './close.html' },
  // { from: './slick.theme.css', to: './slick.theme.css' }
]);

// const preloadWebpackPlugin = new PreloadWebpackPlugin({
//     rel: 'preload',
//     as: 'font'
// });

// const bundleAnalyzerPlugin = new BundleAnalyzerPlugin();

module.exports = (env) => {
  return {
    devtool: env.NODE_ENV === 'development' ? 'eval-source-map' : '',
    entry: ['./index.js', './styles/base/base.scss'],
    output: {
      // path: resolve(__dirname, '../../apache-tomcat-8.5.30/webapps/ROOT'),
      path: resolve(__dirname, 'dist'),
      filename: process.env.production
        ? `js/bundle.[name].[chunkhash:8].js`
        : `js/bundle.[name].[hash:8].js`,
      chunkFilename: process.env.production
        ? `js/bundle.[id].[chunkhash:8].js`
        : `js/bundle.[id].[hash:8].js`,
      publicPath: '/',
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
    context: resolve(__dirname, 'src'),
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(png|jpg|gif|ico)$/,
          use: [{ loader: 'file-loader?name=images/[name].[ext]' }],
        },
        {
          test: /\.mp3|pdf$/,
          use: [{ loader: 'url-loader?limit=15000&name=media/[hash].[ext]' }],
        },
        {
          test: /\.mp4$/,
          use: [{ loader: 'url-loader?limit=15000&name=videos/[name].[ext]' }],
        },
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
          use: [{ loader: 'url-loader?limit=15000&name=fonts/[hash].[ext]' }],
        },
      ],
    },
    devServer: {
      historyApiFallback: true,
    },
    plugins: [
      htmlWebpackPlugin,
      // preloadWebpackPlugin,
      copyWebpackPlugin,
      new webpack.DefinePlugin({
        'process.env.API_NAME': JSON.stringify(`${env.API_NAME}`),
      }),
      new webpack.DefinePlugin({
        'process.env.API_URL': JSON.stringify(`${env.API_URL}`),
      }),
      new webpack.DefinePlugin({
        'process.env.AUTH': JSON.stringify(`${env.AUTH}`),
      }),
      new webpack.DefinePlugin({
        'process.env.USER_ID': JSON.stringify(`${env.USER_ID}`),
      }),
      new webpack.DefinePlugin({
        'process.env.ENABLE_ACCOUNT_RESEARCH': JSON.stringify(
          `${env.ENABLE_ACCOUNT_RESEARCH}`
        ),
      }),
      new webpack.DefinePlugin({
        'process.env.PLAYBOOK_ANALYTICS': JSON.stringify(
          `${env.PLAYBOOK_ANALYTICS}`
        ),
      }),
      new webpack.EnvironmentPlugin(['TR_PRKEY', 'CLIENT_CONFIG', 'WK_APIKEY']),
      // bundleAnalyzerPlugin
    ],
  };
};
