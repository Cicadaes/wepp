var path = require('path');
var fs = require('fs');
var utils = require('utilities');

var controller = require('../controller');

module.exports = new (function () {
    this.init = function (app, next) {
        var controllerDir = 'app/controller';
        var appCtroPath = path.join(app.config.__App__, controllerDir, 'application.js');
        var ctor;
        var dirList = _getDirList(path.join(app.config.__App__, controllerDir));
        var item;

        if (fs.existsSync(appCtroPath)) {
            ctor = require(appCtroPath).Application;
            ctor.origPrototype = ctor.prototype;
            controller.Application = ctor;
        }

        // Dynamically create controller constructors
        // from files in app/controller
        for (var i = 0; i < dirList.length; i++) {
            item = dirList[i];
            ctor = require(item.filePath)[item.ctorName];
            ctor.origPrototype = ctor.prototype;
            if (item.ctorName != 'Application') {
                controller.register(item.ctorName, ctor);
            }
        }

        next();

        function _getDirList(dirname) {
            var dirList = fs.readdirSync(dirname);
            var filename;
            var ctorName;
            var filePath;
            var ret = [];

            for (var i = 0; i < dirList.length; i++) {
                filename = dirList[i];
                // Strip the extension from the file name
                filename = filename.replace('.js', '');
                // Convert underscores to camelCase with
                // initial cap, e.g., 'ProductClass'
                ctorName = utils.string.camelize(filename, {
                    initialCap: true
                });
                filePath = path.join(dirname, filename);
                ret.push({
                    ctorName: ctorName,
                    filePath: filePath
                });
            }

            return ret;
        }
    };
})();