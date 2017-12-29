/**
 * 生成项目目录
 */

var path = require('path');
var mkdirp = require('mkdirp');

module.exports = function (gulp, config, plugins, wepp) {
    return function () {
        var argv = wepp.parseArgv();
        var __proj__ = path.join(argv.__cwd__, argv.name);
        var projDir = [
            'config',
            'app',
            'app/public/js',
            'app/public/assets',
            'app/public/css',
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