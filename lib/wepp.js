var path = require('path');
var argv = require('yargs').argv;
var yargsParser = require('yargs-parser');
var yargsUnparser = require('yargs-unparser');

var utils = require('./utils');
var pkg = require('../package.json');
var core = require('./core');

var EventEmitter = require('events').EventEmitter;

// 定义wepp全局变量
var wepp = global.wepp || {};
global.wepp = wepp;
wepp.utils = wepp.utils || {};

utils.enhance(wepp, new EventEmitter());
utils.mixin(wepp.utils, utils);
utils.mixin(wepp, {
    __root__: path.join(__dirname, '../'),
    __template__: path.join(__dirname, '../', 'template'),
    version: pkg.version
});
utils.mixin(wepp, core);
utils.mixin(wepp, new (function () {
    this.start = function (options) {
        wepp.emit('started');
        this.startCluster(options); // core
    };

    /**
     * unpack argvs
     */
    this.unparseArgv = function (argv) {
        return yargsUnparser(argv);
    };

    /**
     * parse argvs
     */
    this.parseArgv = function () {
        var unArgv = {};
        if (typeof argv.unArgv === 'string') {
            unArgv = argv.unArgv.split(',');
            unArgv = yargsParser(unArgv);
        }
        return unArgv;
    };
})());

module.exports = wepp