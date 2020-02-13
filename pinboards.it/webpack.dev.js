
const path = require('path');
const glob = require('glob');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { StatsWriterPlugin } = require("webpack-stats-plugin");

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  //we only need the the webserver for its websocket connection.
  //the hosting is handled by apache, that has php support and stuff.
  //TODO: have a look into this https://www.npmjs.com/package/webpack-livereload-plugin
  devServer: {
    contentBase: './public',
    host: 'localhost',
    port: 8081,
    open: false,
    hot: true,
    //since we are using our own webserver, we need the bundles to be written on disk.
    writeToDisk: true,
    overlay:{
      warnings: true,
      errors: true,
    },
  },
  watchOptions: {
    ignored: /node_modules/
  },
  // entry: {
  //   index: './src/pages/index/index.js',
  //   about: './src/pages/about/index.js',
  //   hello: './src/pages/hello/index.js',
  // },
  entry: glob.sync('./src/pages/**/index.js').reduce(function(obj, el){
    let parentDirName = path.basename(path.dirname(el))
    obj[parentDirName] = el;
    return obj
  },{}),
  plugins: [
    new CleanWebpackPlugin(),
    new StatsWriterPlugin({
      stats: {
        all: false,
        entrypoints: true,
      }
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, './public/bundles'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },

};
