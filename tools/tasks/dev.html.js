var path = require('path');

module.exports = function (gulp, C) {
    gulp.task('dev.html', function () {
        var wepp = JSON.parse(process.env.wepp);
        gulp.src(path.resolve(wepp.cwd, './*.html'))
            .pipe(C.plugins.connect.reload());
    });
}