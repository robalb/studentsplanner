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
        port: 5002,
        // open: false,
        writeToDisk: true,
        hot: true,
        // Redirect 404s to index.html, so that apps that use the HTML 5 History API work.
        historyApiFallback: false,
        overlay:{
          warnings: true,
          errors: true,
        },
      },
    }),


    (neutrino) => {
      neutrino.config
        .plugin('stats')
        .use(StatsWriterPlugin, [{
          stats: {
            all: false,
            entrypoints: true,
          }
        }]);
    },

  ],
};
