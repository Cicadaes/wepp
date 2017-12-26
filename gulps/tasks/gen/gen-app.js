var path = require('path');

module.exports = function (gulp, config, plugins) {
    return {
        deps: [],                   // an array of task names to execute before this task
        params: [],                 // an array of parameters to send to `fn`
        fn: function() {} // the task functionality -- callback optional
    };
}