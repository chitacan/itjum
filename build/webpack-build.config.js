var webpack = require('webpack');
var html = require('html-webpack-plugin');

module.exports = {
  entry: './lib/client/index.js',
  output: {
    path: './dist',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: ["react-hot", "babel-loader"]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loaders: ["eslint-loader"]
      },
      {
        test: /\.scss$/,
        loaders: [
          "style-loader",
          "css-loader?sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]",
          "sass-loader"
        ]
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          "file?hash=sha512&digest=hex&name=[hash].[ext]",
          "image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false"
        ]
      }
    ],
    noParse: /\.min\.js$/
  },
  devtool: 'source-map',
  eslint: {
    failOnWarning: false,
    failOnError: false
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new html({
      title: 'itjum',
      template: 'build/tmpl.html'
    })
  ]
};
