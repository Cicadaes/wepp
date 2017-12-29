var mkdirp = require('mkdirp');

module.exports = function (gulp, config, plugins, wepp) {
    // return function (callback) {
    //     console.log(callback)
    // }
    return {
        argvs: ['qq', 'rrrrr', 333],
        action: function (argv) {
            console.log(argv)
        }
    }
};