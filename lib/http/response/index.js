var utils = require('utilities');
var ServerResponse = require('http').OutgoingMessage;
var mime = require('mime');
var fs = require('fs');

var format = require('../format');

var Response;

var response = new function () {
    // From Paperboy, http://github.com/felixge/node-paperboy
    this.charsets = {
        'application/json': 'UTF-8',
        'text/javascripit': 'UTF-8',
        'text/html': 'UTF-8'
    };

    this.getContentTypeForFormat = function (f) {
        var formatObj = format.formats[f];
        if (formatObj) {
            return formatObj.preferredContentType;
        }
    };

    this.formatContent = function (controller, content, opts) {
        var formatObj = format.formats[opts.format];
        return formatObj.formatter.call(controller, content);
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

    this.sendFile = function (filepath) {
        var self = this;
        var contentType = mime.lookup(filepath);
        var encoding = 'binary';

        fs.stat(filepath, function (err, stat) {
            var headers;

            if (err) {
                throw err;
            } else {
                headers = utils.mixin({
                    'Content-Type': contentType,
                    'Last-Modified': stat.mtime.toUTCString(),
                    'Content-Length': stat.size || (stat.blksize * stat.blocks)
                });

                self.setHeaders(200, headers);

                fs.open(filepath, 'r', parseInt(666, 8), function (err, fd) {
                    var pos = 0;
                    var len = 0;

                    var streamChunk = function () {
                        fs.read(fd, 16 * 1024, pos, encoding, function (err, chunk, bytesRead) {
                            if (!chunk) {
                                fs.close(fd);
                                self.res._length = len;
                                self.res.end();
                                return;
                            }
                            len += Buffer.byteLength(chunk);
                            self.res.write(chunk, encoding);
                            pos += bytesRead;

                            streamChunk();
                        });
                    };
                    streamChunk();
                });
            }
        });
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