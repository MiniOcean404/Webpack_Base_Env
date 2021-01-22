// 引入webpack.common.js内容
const common = require("./webpack.common");
// 使用merge实现对配置的合并操作，因为Object.assign方法会将前面的同名属性直接覆盖，而我们只是希望添加一些插件，所以我们需要借助于webpack-merge模块来满足我们合并plugins的需求
const { merge } = require("webpack-merge");

const path = require("path");
const resolve = (dir) => path.join(__dirname, dir);

// 引入生产环境需要的插件
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  mode: "development",

  // 开发服务器 devServer：用来自动化，不用每次修改后都重新输入webpack打包一遍（自动编译，自动打开浏览器，自动刷新浏览器）
  // 特点：只会在内存中编译打包，不会有任何输出（不会像之前那样在外面看到打包输出的build包，而是在内存中，关闭后会自动删除）
  // 启动devServer指令为：npx webpack-dev-server
  devServer: {
    // 项目构建后路径
    contentBase: resolve("build"),
    // 启动gzip压缩
    compress: true,
    // 端口号
    port: 3000,
    // 自动打开浏览器
    open: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      //指定要用到的模板文件
      template: resolve("src/index.html"),
      filename: "index.html",
    }),
  ],

  module: {
    rules: [
      // scss文件的处理
      {
        test: /.scss$/,
        use: [
          // style-loader：创建style标签，将js中的样式资源插入进去，添加到head中生效
          { loader: "style-loader" },
          // css-loader：将css文件变成commonjs模块加载到js中，里面内容是样式字符串
          { loader: "css-loader" },
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
            loader: "ts-loader",
          },
        ],
      },
    ],
  },
});
