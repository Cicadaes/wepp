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

ErrorController.prototype._respond = ErrorController.prototype.respond;
ErrorController.prototype._setTemplateAndLayout =
    ErrorController.prototype.setTemplateAndLayout;

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

    // Override, need to figure out the action based on what type of error
    this.respond = function (err, opts) {
        this.params.action = this._getAction(err);
        if (parseInt(err.statusCode, 10) > 499) {
            this.response.res._stack = err.stack || err.message;
        }
        this._respond(err, opts);
    };

    // Set an action based on the error-type
    this._getAction = function (err) {
        var action;

        if (err.statusText) {
            // e.g., Not Found => NotFound
            action = err.statusText.replace(/ /g, '');
            // e.g., NotFound => notFound
            action = utils.string.getInflection(action, 'property', 'singular');
        }
        else {
            action = 'internalServerError';
        }
        return action;
    };

    // Override, fall back to erros/default view if no action-specific
    this.setTemplateAndLayout = function (opts) {
        var controllerFilename;
        this._setTemplateAndLayout(opts);
        // Errors will fall back to a single default error view
        if (!wepp.templateRegistry[this.template]) {
            this.template = 'app/views/errors/default'
        }
    };
})());

module.exports = ErrorController;