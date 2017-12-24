var path = require('path');

module.exports = function (gulp, C) {
    gulp.task('dev.html', function () {
        gulp.src(path.resolve(C.cwd, './*.html'))
            .pipe(C.plugins.connect.reload());
    });
}