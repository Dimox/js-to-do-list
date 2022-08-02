const path = require('path');

import { PRODUCTION } from './config';

module.exports = {
  entry: './src/js/main.js',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './assets/js'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  mode: PRODUCTION ? 'production' : 'development',
  devtool: PRODUCTION ? false : 'eval',
  optimization: {
    minimize: PRODUCTION,
  },
};
