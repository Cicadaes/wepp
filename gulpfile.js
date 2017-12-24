var gulp = require('gulp');
var glob = require('glob');
var argv = require('yargs').argv;
var common = require('./tools/common');

common.cwd = argv.cwd2;
common.argv = eval('('+ argv.params +')');

// 载入任务
var tasks = glob.sync('**/*.js', {cwd: './tools/tasks', absolute: true})
tasks.forEach(function (t) {
    require(t)(gulp, common)
});

gulp.task('default', ['serve'])