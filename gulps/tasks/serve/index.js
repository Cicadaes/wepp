var path = require('path');

module.exports = function (gulp, config, plugins, wepp) {
    var argv = wepp.parseArgv();
    plugins.connect.server({
        root: wepp.cwd,
        host: argv.host,
        port: argv.port,
        livereload: true
    });
    gulp.watch([path.resolve(wepp.cwd, './*.html')], ['dev:html']);
}