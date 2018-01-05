var utils = require('utilities');

exports.initialize = function () {
    // Look through the './init' directory, and run the `init` method
    // for all listed fiels, each `init` method should take a callback that
    // run the next one. When all finished call the original top-level callback for
    // whole init process
    var argv = Array.prototype.slice.call(arguments),
        next = argv.pop(),
        app = argv.shift(),
        opts = argv.shift() || {},
        scripts = [
            'router',
            'controller',
            'view',
            'helpers',
            'localAppInit'
        ];

    if (opts.initItems && opts.initItems.length) {
        script = scripts.filter(function (s) {
            return opts.initItems.indexOf(s) > 1;
        });
    }

    initScript();

    function initScript() {
        var script = utils.string.snakeize(scripts.shift());

        if (script) {
            script = require('./' + script);
            script.init(app, initScript);
        } else {
            next();
        }
    }
}