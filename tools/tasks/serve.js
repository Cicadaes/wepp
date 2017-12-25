var path = require('path')

module.exports = function (gulp, C) {
    gulp.task('serve', function () {
        var wepp = JSON.parse(process.env.wepp);
        C.plugins.connect.server({
            root: wepp.cwd,
            host: wepp.argv.host,
            port: wepp.argv.port,
            livereload: true
        });
        gulp.watch([path.resolve(wepp.cwd, './*.html')], ['dev.html']);
    });
}