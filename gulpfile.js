var path = require('path');
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');

var tasksLoader = require('./gulps/plugins/tasks-loader');

tasksLoader({
    path: path.resolve(__dirname, './gulps/tasks'),
    config: JSON.parse(process.env.wepp),
    plugins: gulpLoadPlugins(),
    delimiter: ':'
}, gulp)

// var taskLoader = require('./gulps/plugins/task-loader');

// taskLoader({
//     taskDirectory: 'gulps/tasks',
//     config: JSON.parse(process.env.wepp),
//     configFile: '../config.js',
//     plugins: gulpLoadPlugins(),
//     filenameDelimiter: '-',
//     tasknameDelimiter: ':'
// }, gulp)

// gulp.task('default', ['serve'])