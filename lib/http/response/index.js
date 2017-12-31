var utils = require('utilities');
var ServerResponse = require('http').OutgoingMessage;

var Response;

var response = new function () {
    // From Paperboy, http://github.com/felixge/node-paperboy
    this.charsets = {
        'application/json': 'UTF-8',
        'text/javascripit': 'UTF-8',
        'text/html': 'UTF-8'
    };
};

Response = function (res) {
    this.res = res;
    // Copy has-own props over from original
    utils.mixin(this, res);
};
// Inherit from actual ServerResponse
Response.prototype = new ServerResponse();
Response.prototype.constructor = Response;

utils.mixin(Response.prototype, new (function () {
    // Override, delegate
    this.setHeaders = function (statusCode, headers) {
        var contentType = headers['Content-Type'];
        var charset = response.charsets[contentType];
        if (charset) {
            contentType += '; charset=' + charset;
            headers['Content-Type'] = contentType;
        }
        this.res.statusCode = statusCode;
        for (var p in headers) {
            this.res.setHeader(p, headers[p]);
        }
    };
    // Custom methods
    this.send = function (content, statusCode, headers) {
        // Hacky
        if (this.res._ended) {
            return;
        }
        //var success = !errors.errorTypes[statusCode];
        var s = statusCode || 200;
        var h = headers || {};
        this.setHeaders(s, h);
        this.finalize(content);
    };
    this.finalize = function (content) {
        this.writeBody(content);
        this.finish();
    };
    this.writeBody = function (c) {
        var content = c || '';
        var res = this.res;

        res._length = res._length || 0;
        res._length += Buffer.byteLength(content);
        res.write(content);
    };
    this.finish = function () {
        this.res.end();
        this.res._ended = true;
    };
})());

response.Response = Response;

module.exports = response;