const react = require('@neutrinojs/react');
// i actually like the default one
// const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { StatsWriterPlugin } = require("webpack-stats-plugin");
const path = require('path');
const glob = require('glob');

module.exports = {
  options: {
    root: __dirname,
    source: 'src',
    output: 'www/bundles',
    mains: glob.sync(__dirname + '/src/pages/**/index.js').reduce(function(obj, el){
      let parentDirName = path.basename(path.dirname(el))
      obj[parentDirName] = el;
      return obj
    },{}),
  },
  use: [

    react({
      //https://neutrinojs.org/packages/web/#deployment-path
      //this is the public path on the current work environment
      //the publicPath for the production environment is set in the
      //middleware function at the bottom of this config
      publicPath: '/studentsplanner/pinboards.it/www/bundles/',
      html: false,
      style: false,
      font: {
        name:
          process.env.NODE_ENV === 'production'
            ? '[name].[hash:8].[ext]'
            : '[name].[ext]',
      },
      image: {
        limit: 4192,
        name:
          process.env.NODE_ENV === 'production'
            ? '[name].[hash:8].[ext]'
            : '[name].[ext]',
      },
      clean: true,
      devServer: {
        port: 5000,
        open: false,
        writeToDisk: true,
        hot: true,
        // liveReload: false,
        // Redirect 404s to index.html, so that apps that use the HTML 5 History API work.
        historyApiFallback: false,
        overlay:{
          warnings: true,
          errors: true,
        },
      },
    }),


    (neutrino) => {
      //add stats-plugin
      neutrino.config
        .plugin('stats')
        .use(StatsWriterPlugin, [{
          stats: {
            all: false,
            entrypoints: true,
          }
        }]);
      //css loaders
      neutrino.config.module
        .rule('css')
        .test(/\.css$/)
          .use('style')
            .loader('style-loader')
            .end()
          .use('css')
            .loader('css-loader');
      //conditional configs
      neutrino.config
        .when(process.env.NODE_ENV === 'production',
          //PRODUCTION
          config => config
            .output
              .filename('[name].[contenthash:8].js')
              .publicPath('/bundles/'),

          //DEVELOPMENT
          config => config
            .output
              .filename('[name].js')
              .end()
            .plugin('clean')
              .use(CleanWebpackPlugin)
              .end()
            .devtool('inline-source-map')
        );
    },
  ],
};
