var gulp = require('gulp');
var glob = require('glob');
var common = require('./tools/common')

// 载入任务
var tasks = glob.sync('**/*.js', {cwd: './tools/tasks', absolute: true})
tasks.forEach(function (t) {
    require(t)(gulp, common)
});

gulp.task('default', ['serve'])