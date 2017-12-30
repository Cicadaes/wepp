var path = require('path');
var fs = require('fs');

module.exports = function (gulp, config, plugins, wepp) {
    return function () {
        var argv = wepp.parseArgv();
        var configPath = path.join(argv.__cwd__, 'config');
        
        try {
            fs.statSync(configPath);
        } catch (error) {
            console.log('The app isn\'t wepp\'s app. See "wepp -h" for help.');
            process.exit();
        }

        plugins.connect.server({
            root: argv.__cwd__,
            host: argv.host,
            port: argv.port,
            livereload: true
        });
        gulp.watch([path.resolve(argv.__cwd__, './*.html')], ['dev:html']);
    }
}