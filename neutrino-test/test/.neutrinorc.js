const react = require('@neutrinojs/react');
const ErrorOverlayPlugin = require('error-overlay-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { StatsWriterPlugin } = require("webpack-stats-plugin");

module.exports = {
  options: {
    root: __dirname,
    source: 'src',
    output: 'www/bundles',
    mains: {
      index: 'index',
    }
  },
  use: [

    react({
      //https://neutrinojs.org/packages/web/#deployment-path
      publicPath: '',
      html: false,
      style: false,
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
          //fix bundles output path
          config => config.output.filename('[name].[contenthash:8].js'),
          //DEVELOPMENT
          config => config
            .output
              .filename('[name].js')
              .end()
            .plugin('clean')
              .use(CleanWebpackPlugin)
              .end()
            .plugin('error-overlay')
              .use(ErrorOverlayPlugin)
              .end()
            .devtool('inline-source-map')
        );
      //neutrino.config
      //  .when(process.env.NODE_ENV === 'development',
      //    //fix bundles output path
      //    //clean plugin also in development mode
      //    config => config.plugin('clean').use(CleanWebpackPlugin),
      //    //devtools
      //    config => config.devtool('eval-source-map'),
      //  );

    },

  ],
};
