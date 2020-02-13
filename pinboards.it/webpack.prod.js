
const path = require('path');
const glob = require('glob');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { StatsWriterPlugin } = require("webpack-stats-plugin");

module.exports = {
  mode: 'production',
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
      // filename: 'bundles.php',
      // transform(data, opts) {
      //   return "<?php echo 2; ?>"
      //   // return JSON.stringify({
      //   //   main: data.assetsByChunkName.main[0],
      //   //   css: data.assetsByChunkName.main[1]
      //   // }, null, 2);
      // },
      stats: {
        all: false,
        entrypoints: true,
      }
    })
  ],
  output: {
    filename: '[name].[contenthash].bundle.js',
    path: path.resolve(__dirname, 'public/bundles'),
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
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
    ],
  },
  //https://webpack.js.org/guides/caching/
  //https://medium.com/hackernoon/the-100-correct-way-to-split-your-chunks-with-webpack-f8a9df5b7758
  optimization: {
    moduleIds: 'hashed',
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },

};
