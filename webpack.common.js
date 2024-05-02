const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    app: './js/app.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    filename: 'app.js',
  },
  module: {
    rules: [
      {
        test: /\.ejs/i,
        use: ['html-loader', 'template-ejs-loader'],
      },
      {
        test: /\.css/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.ejs',
    }),
    new MiniCssExtractPlugin(),
  ],
};
