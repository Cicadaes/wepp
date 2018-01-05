var domain = require('domain');
var path = require('path');
var fs = require('fs');

var init = require('../init');
var requestHelper = require('../http/request_helper');
var logging = require('./logging');
var errors = require('../http/response/errors');
var ErrorController = require('../controller/error_controller');
var StaticFileController = require('../controller/static_file_controller').StaticFileController;
var controller = require('../controller');

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
                var controllerInst;

                if (caught) {
                    return errors.respond(err, resObj);
                }
                caught = true;

                if (err.statusCode) {
                    serverErr = err;
                } else {
                    serverErr = new errors.InternalServerError(err.message, err.stack);
                }

                try {
                    controllerInst = new ErrorController(reqObj, resObj);
                    controllerInst.respondWith(serverErr);
                } catch (e) {
                    // Catch sync errors in the error-rendering process
                    // Respond with a low-fi fool-proof err
                    // Async ones will be handled by re-entering this domain
                    // on-error handler
                    errors.respond(e, resObj);
                }
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
                    accessTime,
                    params;

                // Passe out some needed request properties
                reqUrl = requestHelper.normalizeUrl(req);
                urlParams = requestHelper.getUrlParams(reqUrl);
                urlPath = requestHelper.getBasePath(reqUrl);
                method = requestHelper.getMethod(reqUrl, urlParams, req);
                accessTime = requestHelper.getAccessTime();

                // TODO: Allow custom formats
                logging.initRequestLogger(reqUrl, reqObj, resObj, method, accessTime);

                params = requestHelper.getParams(self.router, urlPath, method);
                if (params) {
                    controllerInst = controller.create(params.controller);
                    // Valid controller?
                    if (controllerInst) {
                        // Enhance the parsed params with URL params
                        // wepp.mixin(params, urlParams);

                        if (typeof controllerInst[params.action] == 'function') {

                        } else {
                            // No action, 500 error
                            self.handleNoAction(params);
                        }
                    } else {
                        // No controller, 500 error
                        self.handleNoController(params);
                    }
                } else {
                    // Either 405, static, or 404
                    self.handleNoMatchedRoute(method, reqUrl, null, reqObj, resObj);
                }
            });
        });

        next();
    };

    this.handleNoMatchedRoute = function (method, reqUrl, params, reqObj, resObj) {
        var staticPath;

        // Get the path to the file, decoding the request URI
        staticPath = path.resolve(path.join(this.config.staticFilePath, decodeURIComponent(reqUrl)));

        // Ignore querystring
        staticPath = staticPath.split('?')[0];

        // Static?
        if (fs.existsSync(staticPath)) {
            this.handleStaticFile(staticPath, params, reqUrl, reqObj, resObj);
        } else {
            // Nada, 404
            this.handleNotFound(reqUrl);
        }
    };

    this.handleStaticFile = function (staticPath, params, reqUrl, reqObj, resObj) {
        var controllerInst;

        // May be a path to a directory, with or without a trailing
        // slash -- any trailing slash has already been stripped by
        // this point
        if (fs.statSync(staticPath).isDirectory()) {
            // TODO: Make the name of any index file configurable
            staticPath = path.join(staticPath, 'index.html');
            if (fs.existsSync(staticPath) && fs.statSync(staticPath).isFile()) {
                controllerInst = new StaticFileController(reqObj, resObj, params);
                controllerInst.respond({
                    path: staticPath
                });
            } else {
                // Directory with no index file
                this.handleNotFound(reqUrl, params, reqObj, resObj);
            }
        } else if (fs.statSync(staticPath).isFile()) {
            // Path to an actual file. Just serve it up
            controllerInst = new StaticFileController(reqObj, resObj, params);
            controllerInst.respond({
                path: staticPath
            });
        }
    };

    this.handleNotFound = function (reqUrl) {
        throw new errors.NotFoundError(reqUrl + 'not found.');
    };

    this.handleNoController = function (params) {
        throw new errors.InternalServerError('controller ' +
            params.controller + ' not found.');
      };

    this.handleNoAction = function (params) {
        throw new errors.InternalServerError('No ' + params.action +
        ' action on ' + params.controller + ' controller.');
    };
};

module.exports = app;