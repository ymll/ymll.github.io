const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const CopyPlugin = require('copy-webpack-plugin');

const path = require('path');
const HtmlWebpackPartialsPlugin = require("html-webpack-partials-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new HtmlWebpackPartialsPlugin({
      path: path.join(__dirname, './partials/analytics.html'),
      location: 'head',
      priority: 'low',
      options: {
        ga_property_id: 'G-XQ255X4GQ2'
      }
    }),
    new CopyPlugin({
      patterns: [
        { from: 'favicon.ico', to: 'favicon.ico' },
        { from: 'robots.txt', to: 'robots.txt' },
        { from: 'icon.png', to: 'icon.png' },
        { from: '404.html', to: '404.html' },
        { from: 'site.webmanifest', to: 'site.webmanifest' },
      ],
    }),
  ],
  optimization: {
    minimizer: [
      `...`,
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
  },
});
