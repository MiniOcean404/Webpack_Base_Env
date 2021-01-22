const path = require("path");
const resolve = (dir) => path.join(__dirname, dir);
// 引入webpack.common.js内容
const common = require("./webpack.common");
// 使用merge实现对配置的合并操作，因为Object.assign方法会将前面的同名属性直接覆盖，而我们只是希望添加一些插件，所以我们需要借助于webpack-merge模块来满足我们合并plugins的需求
const { merge } = require("webpack-merge");
// 引入生产环境需要的插件
const MiniCssExtractorPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OptimizeCssAssetsWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const commonCssLoader = [
  // css-loader：将css文件整合到js文件中
  // 经过css-loader处理后，样式文件是在js文件中的
  // 问题：1.js文件体积会很大2.需要先加载js再动态创建style标签，样式渲染速度就慢，会出现闪屏现象
  // 这个loader取代style-loader。作用：提取js中的css成单独文件然后通过link加载
  MiniCssExtractorPlugin.loader,
  { loader: "css-loader" },
  { loader: "postcss-loader" },
];

module.exports = merge(common, {
  mode: "production",

  output: {
    environment: {
      // 兼容IE11取消webpack中箭头函数——可选
      arrowFunction: false,
      // 兼容IE10取消webpack中const——可选
      const: false,
    },
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html",
      // 压缩html代码
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true,
      },
    }),
    new MiniCssExtractorPlugin({
      // 对输出的css文件进行重命名
      filename: "css/built.css",
    }),
    // 压缩css
    new OptimizeCssAssetsWebpackPlugin(),
    new CleanWebpackPlugin(),
  ],

  module: {
    rules: [
      // css文件处理
      {
        test: /\.css$/,
        use: [...commonCssLoader],
      },
      // scss文件的处理
      {
        test: /.scss$/,
        use: [
          ...commonCssLoader,
          { loader: "sass-loader" },
          // 处理全局变量的加载器
          {
            loader: "sass-resources-loader",
            options: {
              resources: [
                resolve("src/css/_var.scss"),
                resolve("src/css/_minxin.scss"),
              ],
            },
          },
        ],
      },

      // Ts文件的处理
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    useBuiltIns: "usage", //按需加载
                    corejs: { version: 3 }, // 指定core-js版本
                    targets: {
                      // 指定兼容到什么版本的浏览器
                      chrome: "58",
                      ie: "11",
                    },
                  },
                ],
              ],
            },
          },
          {
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
});
