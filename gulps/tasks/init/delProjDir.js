var shell = require('shelljs');
var path = require('path');

module.exports = function (gulp, config, plugins, wepp) {
    return function () {
        var argv = wepp.parseArgv();
        var __proj__ = path.join(process.env.INIT_CWD, argv.name);
        
        shell.rm('-rf', __proj__);
    }
}