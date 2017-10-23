const path = require("path");
const Webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const common = ["react-hot-loader/patch"]

const fs = require("fs");
let htmls = [];
htmls = fs.readdirSync('./src/entry')
htmls = htmls.map(item => {
  return {
    filename: item.replace('.js', '')
  }
})

const entry = {}
htmls.map(item => {
   entry[item.filename] = path.resolve('src/entry') + `/${item.filename}.js`;
})

module.exports = {
  entry: entry,
  devtool: 'eval-source-map',
  devServer: {
    hot: true
  },
  output: {
    filename: '[name]-[hash].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: "/"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
        }
      }
    ]
  },
  plugins: [
    ...htmls.map(item => {
      return new HtmlWebpackPlugin({
        title: item.filename,
        template: "./src/template.html",
        filename: `${item.filename}.html`,
        chunks: ['commons', item.filename] 
      })
    }),
    new Webpack.optimize.CommonsChunkPlugin({ name: "commons", filename: "commons.js", }),
    new BundleAnalyzerPlugin(),
    new Webpack.NamedModulesPlugin(),
    new Webpack.HotModuleReplacementPlugin()
  ]
}