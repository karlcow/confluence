// Copyright 2017 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
'use strict';

const path = require('path');

const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const C = require('./webpack.constants.js');

module.exports = {
  entry: {
    // Copied in each webpack.<configuration>.js, when FOAM_FLAGS are finalized.
    foam: [path.resolve(C.ROOT_DIR, '.local/foam-bin')],
    app: [path.resolve(C.ROOT_DIR, 'main/app.es6')],
  },
  output: {
    filename: '[name].bundle.js',
    path: C.BUNDLE_DIR,
  },
  module: {
    rules: [
      {
        test: /worker\.(es6\.)?js$/,
        loader: 'worker-loader',
        options: {name: '[name].bundle.js'},
      },
      {
        test: /\.es6\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015'],
        },
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
        loader: 'file-loader?name=fonts/[name].[ext]',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin([C.BUNDLE_PROJECT_DIR], {root: C.ROOT_DIR}),
    new webpack.ProvidePlugin({
        'window.$': 'jquery',
        'window.jQuery': 'jquery',
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      minChunks: function(module) {
        return module.context && module.context.indexOf('node_modules') !== -1;
      },
    }),
  ],
  resolve: {
    extensions: ['.js'],
  },
  node: {
    fs: 'empty',
    dns: 'empty',
  },
};
