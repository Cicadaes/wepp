/**
 * 生成项目目录
 */

var path = require('path');
var mkdirp = require('mkdirp');

module.exports = function (gulp, config, plugins, wepp) {
    return function () {
        var argv = wepp.parseArgv();
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
            var dirPath = path.join(argv.__proj__, argv.name, dir);
            mkdirp(dirPath, function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log('generate ' + dirPath + ' success...');
                }
            })
        });
    }
};