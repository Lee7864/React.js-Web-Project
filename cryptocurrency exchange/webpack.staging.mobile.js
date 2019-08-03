const merge = require('webpack-merge');
const common = require('./webpack.common.mobile.js');
const Dotenv = require('dotenv-webpack');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true
  },  
  plugins: [
    new Dotenv({
      path: './.env.staging'
    })
  ]  
});
