var utils = require('utilities');
var url = require('url');

var BaseController = require('./base_controller').BaseController;

var ErrorController = function (req, resp) {
    this.request = req;
    this.response = resp;
    this.params = {
        format: this._getFormat(req)
    };
    this.name = 'Error';
    // Stub out flash for templates
    // TODO: Figure out integration with real session and flash
    this.flash = { messages: {} };
    this.canRespondTo(['html', 'json', 'xml', 'txt']);
};

ErrorController.prototype = new BaseController();
ErrorController.prototype.constructor = ErrorController;

utils.mixin(ErrorController.prototype, new (function () {
    this._getFormat = function (req) {
        // FIXME: WTF require
        var format = require('../http/format');

        var path = url.parse(req.url).pathname
            , match = path.match(/\.([^.]+)$/)
            , ext = (match && match.length && match[1]) || null
            , format = format.formats[ext] ? ext : wepp.config.defaultErrorFormat;
        return format;
    };
})());

module.exports = ErrorController;