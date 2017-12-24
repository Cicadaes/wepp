var path = require('path')

module.exports = function (gulp, C) {
    gulp.task('serve', function () {
        C.plugins.connect.server({
            root: C.cwd,
            port: C.argv.port,
            livereload: true
        });
        gulp.watch([path.resolve(C.cwd, './*.html')], ['dev.html']);
    });
}