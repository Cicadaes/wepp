var init = require('../init');

var app = function () {
    this.config = null;

    this.initialize = function (config, next) {
        var self = this;

        // Local copy the config for all
        this.config = config;
        init.initialize(this, function () {
            self.start(next);
        });
    };

    this.start = function (next) {
        var self = this;

        // Handle the requrest
        wepp.worker.server.addListener('request', function (req, res) {
            console.log(req)
        });

        next();
    };
};

module.exports = app;