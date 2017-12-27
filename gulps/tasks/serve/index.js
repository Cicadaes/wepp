var path = require('path');

module.exports = function (gulp, config, plugins, wepp) {
    plugins.connect.server({
        root: wepp.cwd,
        host: wepp.argv.host,
        port: wepp.argv.port,
        livereload: true
    });
    gulp.watch([path.resolve(wepp.cwd, './*.html')], ['dev:html']);
}