var path = require('path');
var shell = require('shelljs');

module.exports = function (gulp, config, plugins, wepp) {
    return function () {
        var argv = wepp.parseArgv();
        var __proj__ = path.join(process.env.INIT_CWD, argv.name);
        var __template__ = wepp.__template__;
        var copyFiles = [
            ['public', ''],
            ['favicon.ico', 'public'],
            ['config', ''],
            ['model', 'app'],
            ['controller', 'app'],
            ['views/'+ argv.engine, 'app/views']
        ];
        copyFiles.forEach(function (cf) {
            shell.cp('-R', path.join(__template__, cf[0]), path.join(__proj__, cf[1]));
        });
    }
}