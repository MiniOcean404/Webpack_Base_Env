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
    // 监视contentBase，目录下所有文件，一但更改就会重载
    watchContentBase: "true",
    // 忽略监视的文件
    watchOptions: {
      ignored: "/node_modules/",
    },
    // 启动gzip压缩
    compress: true,
    // 域名
    host: "127.0.0.1",
    // 端口号
    port: 3000,
    // 自动打开浏览器
    open: true,
    // 开启HRM功能
    hot: false,
    // 控制台，不显示启动服务器的日志信息
    clientLogLevel: "none",
    // 控制台，出了一些基本启动信息以外，其他内容都不要显示
    quiet: true,
    // 出错误了不要全屏提示
    overlay: false,
    proxy: {
      //一旦 devServer(5000)服务器接受到/api/xxx的请求,就会把请求转发到另外一个服务器(3800)
      "/api": {
        target: "http://lovalhost:3000",
        //′发送请求时,请求路径重写:将/api/xxx-->/xxx(去掉/api)
        pathRewrite: {
          "^/api": "",
        },
      },
    },
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
