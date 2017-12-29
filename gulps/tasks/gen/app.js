var path = require('path');

module.exports = function (gulp, config, plugins, wepp) {
    // console.log(plugins.mkdirp())
    var argv = wepp.parseArgv();
    return function(argv) {
        console.log(argv)
        gulp.src('test/')
            .pipe(plugins.mkdirp());
    }
}