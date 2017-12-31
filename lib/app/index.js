var domain = require('domain');

var init = require('../init');
var requestHelper = require('../http/request_helper');

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
            var domainInst = domain.create(),
                reqObj,
                resObj;
            
            domainInst.on('error', function (err) {

            });

            domainInst.add(req);
            domainInst.add(res);

            reqObj = requestHelper.enhanceRequest(req);
        });

        next();
    };
};

module.exports = app;