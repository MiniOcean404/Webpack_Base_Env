module.exports = {
  plugins: [
    require("autoprefixer")({
      //市场占有大于百分之1 最后两个版本 不兼容ie8
      overrideBrowserslist: ["> 1%", "last 2 versions", "not ie <= 8"],
    }),
  ],
};
