/**
 * 生成项目目录
 */

var path = require('path');
var mkdirp = require('mkdirp');

module.exports = function (gulp, config, plugins, wepp) {
    return function () {
        var argv = wepp.parseArgv();
        var __proj__ = path.join(process.env.INIT_CWD, argv.name);
        var projDir = [
            'config',
            'app',
            'lib',
            'log',
            'test'
        ];

        projDir.forEach(function (dir) {
            var folder = path.join(__proj__, dir);
            mkdirp.sync(folder);
        });
    }
};