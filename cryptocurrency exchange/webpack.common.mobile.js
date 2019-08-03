const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'build')
  },
  resolve: {
    extensions: ['.js', '.css']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [ "@babel/preset-env", {
                  useBuiltIns: "entry"
                }
              ],
              "@babel/preset-react",
              "@babel/preset-flow"
            ],
            plugins: [
              "@babel/plugin-proposal-class-properties"
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              // importLoaders: 1,
              // localIdentName: '[name]_[local]_[hash:base64]',
              localIdentName: '[name]_[local]',
              sourceMap: true,
              minimize: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './images/[name].[hash].[ext]'
            }
          }
        ]
      },      
    ]
  },
  plugins: [
    new webpack.ProvidePlugin({
      'fetch': 'exports-loader?self.fetch!whatwg-fetch/dist/fetch.umd'
    }),
    new HtmlWebPackPlugin({
      template: './src/index.mobile.html',
      filename: './index.html',
      inject: false,
      hash: true
    }),
    new CopyWebpackPlugin([
        {from: './public/charting_library', to: 'charting_library'}
      ],
      {copyUnmodified: false}
    ),
    new CopyWebpackPlugin([
        {from: './public/css', to: 'css'}
      ],
      {copyUnmodified: false}
    ),
    new CopyWebpackPlugin([
        {from: './public/images', to: 'images'}
      ],
      {copyUnmodified: false}
    )     
  ]
}
