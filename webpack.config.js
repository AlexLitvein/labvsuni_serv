const path = require('path');

module.exports = {
  entry: {
    // client: path.resolve(__dirname, 'src/client', 'index.js'),
    client: path.resolve(__dirname, 'src/server', 'server.js'),
    // server: path.resolve(__dirname, 'src/server', 'server.js'),
    // server: {
    //   import: './src/server/server.js',
    //   filename: './bin/[name].[ext]',
    // },
    // server: { import: './about.js', filename: 'pages/[name][ext]' },
  },
  output: {
    path: path.resolve(__dirname, 'bin'),
    filename: 'bundle.js',
    assetModuleFilename: 'media/[name][ext][query]',
    clean: true,
  },
  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    alias: {
      react: path.join(__dirname, 'node_modules', 'react'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },

    ],
  },
  plugins: [],
};
