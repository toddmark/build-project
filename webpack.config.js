const path = require("path");
const Webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const common = ["react-hot-loader/patch"]

const fs = require("fs");
let htmls = [];
htmls = fs.readdirSync('./src/entry')
htmls = htmls.map(item => {
  return {
    filename: item.replace('.js', '')
  }
})

const entry = htmls.map(item => {
  return {
    [item.filename]: path.resolve('src/entry/') + `${item.filename}.js`
  }
})

console.log(...entry);


module.exports = {
  entry: {entry},
  devtool: 'inline-source-map',
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
        template: "./src/template.html",
        filename: `${item.filename}.html`
      })  
    }),
    new Webpack.NamedModulesPlugin(),
    new Webpack.HotModuleReplacementPlugin()
  ]
}