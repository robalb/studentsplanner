const react = require('@neutrinojs/react');
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
      neutrino.config
        .when(process.env.NODE_ENV === 'production',
          //fix bundles output path
          config => config.output.filename('[name].[contenthash:8].js'),
        );
      neutrino.config
        .when(process.env.NODE_ENV === 'development',
          //fix bundles output path
          config => config.output.filename('[name].js'),
          //devtools
          config => config.devtool('eval-source-map'),
        );

    },

  ],
};
