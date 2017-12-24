var browserSync = require('browser-sync');
var yargs = require('yargs');

var browser = browserSync.create();

module.exports = function (gulp, C) {
    gulp.task('serve', function () {
        var argv = yargs.argv;
        var params = eval('('+ argv.params +')');
        browser.init({
            port: params.port,
            server: argv.cwd2
        });
        gulp.watch(argv.cwd2 + '**/*.*').on('change', browserSync.reload);
    });
}