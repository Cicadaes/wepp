var gulpLoadPlugins = require('gulp-load-plugins');
var packageJson = require('../package.json');

// 创建common对象
var common = {};

common.plugins = gulpLoadPlugins();
common.package = packageJson;

module.exports = common;