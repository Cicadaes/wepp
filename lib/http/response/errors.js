var response = require('./index')
    , errors;

errors = new function () {

    var self = this
        , errorType
        , errorText
        , createConstructor;

    this.errorTypes = {
        400: 'Bad Request'
        , 401: 'Unauthorized'
        , 403: 'Forbidden'
        , 404: 'Not Found'
        , 405: 'Method Not Allowed'
        , 406: 'Not Acceptable'
        , 407: 'Proxy Authentication Required'
        , 408: 'Request Timeout'
        , 409: 'Conflict'
        , 410: 'Gone'
        , 411: 'Length Required'
        , 412: 'Precondition Failed'
        , 413: 'Request Entity Too Large'
        , 414: 'Request-URI Too Long'
        , 415: 'Unsupported Media Type'
        , 416: 'Requested Range Not Satisfiable'
        , 417: 'Expectation Failed'
        , 500: 'Internal Server Error'
        , 501: 'Not Implemented'
        , 502: 'Bad Gateway'
        , 503: 'Service Unavailable'
        , 504: 'Gateway Timeout'
        , 505: 'HTTP Version Not Supported'
    };

    createConstructor = function (code, errorType) {
        var errorConstructor = function (message, stack) {
            this.statusCode = code;
            this.statusText = errorType;
            this.name = this.constructor.name;
            this.message = message || errorType;

            if (stack) {
                this.stack = stack;
            }
            else {
                Error.captureStackTrace(this, this.constructor);
            }
        };
        errorConstructor.prototype = new Error();
        errorConstructor.prototype.constructor = errorConstructor;

        return errorConstructor;
    };

    for (var code in this.errorTypes) {
        // Strip spaces
        errorText = this.errorTypes[code];
        errorType = errorText.replace(/ /g, '');

        this[errorType + 'Error'] = createConstructor(code, errorText);
    }
    // Avoid repetitively redundant name
    this.InternalServerError = this.InternalServerErrorError;
    delete this.InternalServerErrorError;

    this.respond = function (err, res) {
        // The no-error error ... whoa, meta!
        if (!err) {
            throw new Error('No error to respond with.');
        }
        var r = new response.Response(res)
            , code = err.statusCode || 500
            , msg = '';

        if (wepp.config.detailedErrors) {
            msg = err.stack || err.message || String(err);
            // FIXME this wrapping bullshit sucks
            if (res.resp) {
                res.resp._stack = msg;
            }
            else {
                res._stack = msg;
            }
        }

        msg = msg.replace(/\n/g, '<br/>');
        msg = '<h3>Error: ' + code + ' ' + self.errorTypes[code] + '</h3>' + msg;
        r.send(msg, code, { 'Content-Type': 'text/html' });
    };

}();

module.exports = errors;


