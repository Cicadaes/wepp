var path = require('path');
var pkg = require('../package.json');

var EventEmitter = require('events').EventEmitter;

// 定义wepp全局变量
var wepp = global.wepp = new EventEmitter();

wepp.cwd = process.cwd();
wepp.dirname = path.resolve(__dirname, '../');
wepp.pkg = pkg;

module.exports = wepp