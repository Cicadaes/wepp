var url = require('url');
var utils = require('utilities');

var Request = require('./request');
var Response = require('./response').Response;

var requestHelper = {
    enhanceRequest: function (req) {
        req.query = Request.parseQuery(req.url);
        return req;
    },
    enhanceResponse: function (res) {
        return new Response(res);
    },
    normalizeUrl: function (req) {
        var reqUrl = req.url;
        // Sanitize URL; reduce multiple slashes to single slash
        reqUrl = reqUrl.replace(/\/{2,}/g, '/');
        // Strip trailing slash for the purpose of looking for a matching
        // route (will still check for directory + index on statics)
        // Don't strip if the entire path is just '/'
        reqUrl = reqUrl.replace(/(.+)\/$/, '$1');
        return reqUrl;
    },
    getUrlParams: function (reqUrl) {
        return url.parse(reqUrl, true).query;
    },
    getBasePath: function (reqUrl) {
        return url.parse(reqUrl).pathname;
    },
    getMethod: function (reqUrl, urlParams, req) {
        var method;
        if (req.method.toUpperCase() === 'POST') {
            // POSTs may be overridden by the _method param
            if (urlParams._method) {
                method = urlParams._method;
            } else if (req.headers['x-http-method-override']) {
                // Or x-http-method-override header
                method = req.headers['x-http-method-override'];
            } else {
                method = req.method;
            }
        } else {
            method = req.method;
        }

        // let's be anal and force all the HTTP verbs uppercase
        method = method.toUpperCase();
        return method;
    },
    getAccessTime: function () {
        return (new Date()).getTime();
    },
    getParams: function (router, reqUrl, method) {
        var params = router.first(reqUrl, method);
        params.controller = utils.string.camelize(params.controller,
            {initialCap: true});
        return params;
    },
    getParams: function (router, reqUrl, method) {
        var params = router.first(reqUrl, method);

        params.controller = utils.string.camelize(params.controller, {
            initialCap: true
        });

        return params;
    }
};

module.exports = requestHelper;