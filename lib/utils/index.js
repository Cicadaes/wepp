var utils = require('utilities');
var fs = require('fs');
var path = require('path');

var logger = require('./logger');

utils.logger = logger;

// Add this pseudo-private to use for grabbing
// models/controllers
utils.getConstructorsFromDirectory = function (dirname, cwd) {
    var dirList = fs.readdirSync(path.join(cwd, dirname));
    var fileName;
    var filePath;
    var ctorName;
    var ret = [];

    for (var i = 0; i < dirList.length; i++) {
        fileName = dirList[i];
        // Strip the extension from the file name
        fileName = fileName.replace(/\.js$/, '');

        // Convert underscores to camelCase with
        // initial cap, e.g., 'NeilPearts'
        ctorName = utils.string.camelize(fileName, {initialCap: true});
        filePath = path.join(cwd, dirname, fileName);
        ret.push({
            ctorName: ctorName
          , filePath: filePath
        });
    }

    return ret;
};

module.exports = utils;