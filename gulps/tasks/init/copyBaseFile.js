var path = require('path');
var shell = require('shelljs');

module.exports = function (gulp, config, plugins, wepp) {
    return function () {
        var argv = wepp.parseArgv();
        var __proj__ = path.join(argv.__cwd__, argv.name);
        var __template__ = wepp.__template__;
        var copyFiles = [
            ['favicon.ico', 'app'],
            ['config', ''],
            ['views/'+ argv.engine, 'app/views']
        ];
        copyFiles.forEach(function (cf) {
            shell.cp('-R', path.join(__template__, cf[0]), path.join(__proj__, cf[1]));
        });
    }
}