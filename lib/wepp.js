var path = require('path');
var utils = require('./utils');

var pkg = require('../package.json');

var EventEmitter = require('events').EventEmitter;

// 定义wepp全局变量
var wepp = global.wepp || {};
global.wepp = wepp;

utils.enhance(wepp, new EventEmitter());
utils.mixin(wepp, utils);
utils.mixin(wepp, {
    cwd: process.cwd(),
    root: path.resolve(__dirname, '../'),
    version: pkg.version
});
utils.mixin(wepp, new (function () {
    this.run = function () {
        wepp.emit('started');
    };
})());
console.log(wepp)
module.exports = wepp