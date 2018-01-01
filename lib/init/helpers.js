var helpers = require('../template/helpers');

module.exports = new (function () {
    this.init = function (app, callback) {
        var helper;

        app.viewHelpers = {};

        // Pass wepp.config to helpers
        helpers.setConfig(wepp.config);
        // Make all helpers avaiable in the view
        for (var p in helpers) {
            helper = helpers[p];
            // Assign to app.helpers
            app.viewHelpers[p] = helper.action;
        }

        callback();
    };
})();