var path = require('path');

module.exports = function (gulp, config, plugins) {
    return function () {
        gulp.src(path.resolve(config.cwd, './*.html'))
            .pipe(plugins.connect.reload());
    }
}