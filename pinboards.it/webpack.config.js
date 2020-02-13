
//https://webpack.js.org/configuration
//https://atendesigngroup.com/blog/managing-dev-and-production-builds-webpack


module.exports =(env) => {
  if(!env) env = 'dev';
  return require(`./webpack.${env}.js`);
}
