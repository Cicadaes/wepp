var path = require('path');
var fs = require('fs');

module.exports = function (gulp, config, plugins, wepp) {
    return function () {
        var argv = wepp.parseArgv();
        

        // plugins.connect.server({
        //     root: argv.__cwd__,
        //     host: argv.host,
        //     port: argv.port,
        //     livereload: true
        // });
        // gulp.watch([path.resolve(argv.__cwd__, './*.html')], ['dev:html']);

        wepp.start(argv);

        // console.log(wepp)
        /**
         * Exit the process with message
         */
        function die (msg) {
            console.log(msg);
            process.exit();
        }
    }
}