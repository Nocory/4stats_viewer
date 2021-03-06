const webpack = require("webpack")

const path = require("path")
//const glob = require('glob')

const HtmlWebpackPlugin = require("html-webpack-plugin")
//const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const VueLoaderPlugin = require("vue-loader/lib/plugin")

const devMode = process.env.NODE_ENV !== "production"

module.exports = {
  entry: {
    app: ["js/main.js"]
  },
  output: {
    filename: "[name].js",
    path: path.resolve("dist")
  },
  externals: {
    moment: "moment"
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          devMode ? "vue-style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          //'sass-loader',
          {
            loader: "sass-loader",
            options: {
              prependData: `
							@import "~css/injected/mixins.scss";
						`
            }
          }
        ]
      },
      {
        test: /\.(ttf|eot|woff|woff2|svg)$/,
        //loader: "url-loader?limit=1024&name=fonts/[name]_[hash:8].[ext]",
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              esModule: false
            }
          }
        ]
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              esModule: false
            }
          }
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.vue$/,
        loader: "vue-loader"
      }
    ]
  },
  resolve: {
    alias: {
      //"vue$": 'vue/dist/vue.esm.js',
      //"vue-router$": 'vue-router/dist/vue-router.esm.js'
    },
    modules: [path.resolve("src"), path.resolve("node_modules")]
  },
  plugins: [
    new VueLoaderPlugin(),
    new CleanWebpackPlugin(),

    new webpack.EnvironmentPlugin(["NODE_ENV"]),

    new HtmlWebpackPlugin({
      //inlineSource: '\.(js|css)$',
      //inlineSource: '.css$',
      manifest: "manifest.json",
      template: "src/index.html"
    }),
    //new HtmlWebpackInlineSourcePlugin(),
    new CopyWebpackPlugin([
      //{ from: 'src/static/_headers', to: '_headers', toType: 'file'}, // hints for netlify http2 push
      { from: "src/static", to: "" }
    ]),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ],
  stats: {
    maxModules: Infinity,
    optimizationBailout: true
  }
}
