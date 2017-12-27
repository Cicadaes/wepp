var path = require('path');
var gulp = require('gulp');
var chai = require('chai');

var tasksLoader = require('../gulps/plugins/tasks-loader');

chai.should();

describe('tasks', function () {
    var inst = new tasksLoader({
        path: path.resolve(__dirname, '..','gulps/tasks'),
        delimiter: ':'
    }, gulp);

    it('should have four task', function () {
        inst.tasks.should.with.lengthOf(4);
    });

    it('should include serve and dev:html task', function () {
        inst.tasks.should.include('serve');
        inst.tasks.should.include('dev:html');
    });
});