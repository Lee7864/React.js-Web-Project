const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const Dotenv = require('dotenv-webpack');

module.exports = merge(common, {
  devtool: 'source-map',
  mode: 'development',
  optimization: {
    minimize: false
  },  
  plugins: [
    new Dotenv({
      path: './.env.development'
    })
  ]  
});