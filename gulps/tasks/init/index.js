var path = require('path');

module.exports = function (gulp, config, plugins, wepp) {
    // console.log(plugins.mkdirp())
    var argv = wepp.parseArgv();
    return {
        deps: ['init:genProjDir', 'init:copyBaseFile']
    }
}