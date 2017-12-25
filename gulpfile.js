var gulp = require('gulp');
var taskLoader = require('gulp-simple-task-loader');
var gulpLoadPlugins = require('gulp-load-plugins');

taskLoader({
    taskDirectory: 'tools/tasks',
    config: JSON.parse(process.env.wepp),
    configFile: '../config.js',
    plugins: gulpLoadPlugins(),
    filenameDelimiter: '-',
    tasknameDelimiter: ':'
}, gulp)

// gulp.task('default', ['serve'])