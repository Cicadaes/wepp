var domain = require('domain');

var init = require('../init');
var requestHelper = require('../http/request_helper');
var logging = require('./logging');
var errors = require('../http/response/errors');
var ErrorController = require('../controller/error_controller')

var app = function () {
    this.config = null;
    this.router = null;
    this.templateRegistry = {};

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
                resObj,
                caught = false;

            domainInst.on('error', function (err) {
                var serverErr;

                if (caught) {
                    return errors.respond(err, resObj);
                }
                caught = true;

                if (err.statusCode) {
                    serverErr = err;
                } else {
                    serverErr = new errors.InternalServerError(err.message, err.stack);
                }
                controllerInst = new ErrorController(reqObj, resObj);
                controllerInst.respondWith(serverErr);
                // try {
                //     controllerInst = new ErrorController(reqObj, resObj);
                //     controllerInst.respondWith(serverErr);
                // }
                // // Catch sync errors in the error-rendering process
                // // Respond with a low-fi fool-proof err
                // // Async ones will be handled by re-entering this domain
                // // on-error handler
                // catch (e) {
                //     errors.respond(e, resObj);
                // }
            });

            domainInst.add(req);
            domainInst.add(res);

            reqObj = requestHelper.enhanceRequest(req);
            resObj = requestHelper.enhanceResponse(res);

            domainInst.add(reqObj);
            domainInst.add(resObj);

            domainInst.run(function () {
                var reqUrl,
                    urlParams,
                    urlPath,
                    method,
                    accessTime;

                // Passe out some needed request properties
                reqUrl = requestHelper.normalizeUrl(req);
                urlParams = requestHelpers.getUrlParams(reqUrl);
                urlPath = requestHelper.getBasePath(reqUrl);
                method = requestHelper.getMethod(reqUrl, urlParams, req);
                accessTime = requestHelper.getAccessTime();

                // TODO: Allow custom formats
                // logging.initRequestLogger(reqUrl, reqObj, resObj, method, accessTime);
            });
        });

        next();
    };
};

module.exports = app;