const path = require("path");
const resolve = (dir) => path.join(__dirname, dir);

module.exports = {
  entry: {
    entry: resolve("src/js/index.ts"),
  },
  //出口文件的配置项
  output: {
    path: resolve("dist"),
    filename: "bundle.js",
  },

  resolve: {
    extensions: [".ts", ".js", "scss", "css"],
    alias: {
      "@": resolve("src"),
      "@css": resolve("src/css"),
    },
  },

  module: {
    rules: [
      // 打包其他资源(除了html/js/css资源以外的资源)
      {
        // 排除html|js|css|less|jpg|png|gif文件
        exclude: /\.(html|js|ts|css|scss|less|jpg|png|gif)/,
        // file-loader：处理其他文件
        loader: "file-loader",
        options: {
          name: "[hash:10].[ext]",
          outputPath: "media",
        },
      },

      // 图片文件处理
      {
        // url-loader：处理图片资源，问题：默认处理不了html中的img图片
        test: /\.(jpg|png|gif|bmp|ttf|eot|svg|woff|woff2)$/,
        // 需要下载 url-loader file-loader
        loader: "url-loader",
        options: {
          // 图片大小小于8kb，就会被base64处理，优点：减少请求数量（减轻服务器压力），缺点：图片体积会更大（文件请求速度更慢）
          // base64在客户端本地解码所以会减少服务器压力，如果图片过大还采用base64编码会导致cpu调用率上升，网页加载时变卡
          limit: 8 * 1024,
          // 给图片重命名，[hash:10]：取图片的hash的前10位，[ext]：取文件原来扩展名
          name: "[hash:10].[ext]",
          // 问题：因为url-loader默认使用es6模块化解析，而html-loader引入图片是conmonjs，解析时会出问题：[object Module]
          // 解决：关闭url-loader的es6模块化，使用commonjs解析
          esModule: false,
          outputPath: "imgs",
        },
      },

      {
        test: /\.html$/,
        // 处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
        loader: "html-loader",
      },
      // css文件处理
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
