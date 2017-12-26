var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');

var taskLoader = require('./gulps/plugins/task-loader');

taskLoader({
    taskDirectory: 'gulps/tasks',
    config: JSON.parse(process.env.wepp),
    configFile: '../config.js',
    plugins: gulpLoadPlugins(),
    filenameDelimiter: '-',
    tasknameDelimiter: ':'
}, gulp)

// gulp.task('default', ['serve'])