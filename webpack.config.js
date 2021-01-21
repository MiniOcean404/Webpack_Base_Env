const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "production",

  entry: {
    entry: "./src/js/index.ts",
  },
  //出口文件的配置项
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },

  resolve: {
    extensions: [".ts", ".js", "scss", "css"],
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      //指定要用到的模板文件
      template: "./src/index.html",
      filename: "index.html",
    }),
  ],

  module: {
    rules: [
      { test: "/.scss$/", use: ["style-loader", "css-loader", "sass-loader"] },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-env"]],
            },
          },
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
};
