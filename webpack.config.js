const path = require('path');
// const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: {
    main: path.resolve(__dirname, './src/', 'main.js'),
    DataCollector: path.resolve(__dirname, './src/', 'DataCollector.js'),
  },
  output: {
    path: path.resolve(__dirname, './'),
    filename: '[name].js',
    // clean: {
    //   keep: /public\//, // Keep these assets under 'ignored/dir'.
    // },
  },
  target: 'node',
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false, // if you don't put this is, __dirname
    __filename: false, // and __filename return blank or /
  },
  externals: [nodeExternals()], // Need this to avoid error when working with Express
  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    alias: {
      react: path.join(__dirname, 'node_modules', 'react'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [],
};
