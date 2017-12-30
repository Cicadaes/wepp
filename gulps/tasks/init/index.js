var path = require('path');

module.exports = function (gulp, config, plugins, wepp) {
    // console.log(plugins.mkdirp())
    return {
        deps: ['init:delProjDir', 'init:genProjDir', 'init:copyBaseFile']
    }
}