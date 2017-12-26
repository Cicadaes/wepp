var path = require('path');

module.exports = function (gulp, config, plugins) {
    plugins.connect.server({
        root: config.cwd,
        host: config.argv.host,
        port: config.argv.port,
        livereload: true
    });
    gulp.watch([path.resolve(config.cwd, './*.html')], ['dev:html']);
}