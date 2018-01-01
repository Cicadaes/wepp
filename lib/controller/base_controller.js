var utils = require('utilities');

var Negotiator = require('./responder/negotiator');
var Responder = require('./responder').Responder;
var response = require('../http/response');
var Templater = require('../template');

/**
  @name controller
  @namespace controller
*/
var controller = {};

/**
  @name controller.BaseController
  @constructor
*/
controller.BaseController = function () {
    /**
     * @name controller.BaseController#responder
     * @public
     * @type controller.Responder
     * @description Provides strategies for responding based on desired
     * format
    */
    this.responder = new Responder();


    /**
     * @name controller.BaseController#negotiator
     * @public
     * @type controller.Negotiator
     * @description Handles content-negotiation for the response
    */
    this.negotiator = new Negotiator();

    /**
     * @name controller.BaseController#request
     * @public
     * @type http.ServerRequest
     * @description The raw http.ServerRequest object for this request/response
     *cycle.
    */
    this.request = null;

    // The template root to look in for partials when rendering templates
    // Gets created programmatically based on controller name -- see renderTemplate
    this.template = null;

    /**
     * @name controller.BaseController#respondWith
     * @public
     * @description Responds with a model or collection
     * @param {Object} content - The model, collection, or hash of values
     * @param {Object} [opts] Options.
    */
    this.respondWith = function (content, options) {
        var opts = options || {},
            negotiated = this._doContentNegotiation(opts.format);

        utils.mixin(opts, negotiated);
        this._handleWithResponder(content, opts);
    };

    this._doContentNegotiation = function (formatOverride, options) {
        var opts = options || {};
        var supportedFormats = opts.supportedFormats ||
            this.respondsWith || this.formats;

        this.negotiator.init(this.request.headers.accept, supportedFormats,
            this.params.format);
        return this.negotiator.negotiate(formatOverride) || {};
    };

    this._handleWithResponder = function (content, options) {
        var responder = this.responder
            , opts = options || {};

        if (typeof responder == 'function') {
            responder(this, content, opts);
        }
        else {
            responder.respond(this, content, opts);
        }
    };

    /**
     * @name controller.BaseController#respond
     * @public
     * @function
     * @description Performs content-negotiation, and renders a response.
     * @param {Object|String} content The content to use in the response.
     * @param {Object} [opts] Options.
     * @param {String} [options.format] The desired format for the response.
     * @param {String} [options.template] The path (without file extensions)
     * to the template to use to render this response.
     * @param {String} [options.layout] The path (without file extensions)
     * to the layout to use to render the template for this response.
     * @param {Number} [options.statusCode] The HTTP status-code to use
     * for the response.
    */
    this.respond = function (content, options) {
        var self = this
            , opts = options || {}
            , negotiated
            , cb = function (formattedContent) {
                var headers = { 'Content-Type': opts.contentType }
                    , statusCode = opts.statusCode || 200
                    , params = self.params;;
                utils.mixin(headers, opts.headers);

                self.output(statusCode, headers, formattedContent);
            }
            , cached
            , formatted;

        if (!(opts.format && opts.contentType)) {
            negotiated = this._doContentNegotiation(opts.format);
            if (Object.keys(negotiated).length) {
                utils.mixin(opts, negotiated);
            }
            else {
                throw new Error(
                    'This format is not supported.');
            }
        }

        // HTML is special case, needs opts, is async
        if (opts.format == 'html') {
            this.setTemplateAndLayout(opts);
            this.renderTemplate(content, cb)
        } else {
            formatted = response.formatContent(this, content, opts);
            cb(formatted);
        }
    };

    this.canRespondTo = function (formats) {
        this.formats = [].concat(formats); // Accept string or array param
    };

    /**
     * @name controller.BaseController#output
     * @public
     * @function
     * @description Lowest-level response function, actually outputs the response
     * @param {Number} statusCode Either an URL, or an object literal containing
     *     controller/action/format attributes to base the redirect on.
     * @param {Object} headers HTTP headers to include in the response
     * @param {String} content The response-body
    */
    this.output = function (statusCode, headers, content) {
        var self = this;

        this.beginOutput(statusCode, headers, function () {
            if (self.method == 'HEAD' || self.method == 'OPTIONS') {
                self.finishOutput();
            }
            else {
                self.write(content);
                self.finishOutput();
            }
        });
    };

    this.write = function (content) {
        this.response.writeBody(content.stack);
    };

    this.finishOutput = function () {
        this.response.finish();
    };

    this.beginOutput = function (statusCode, headersParam, callback) {
        var headers;
        // No repeatsies
        if (this.completed) {
            return;
        }

        this.completed = true;

        headers = headersParam || {};
        headers['Content-Type'] = headers['Content-Type'] || 'application/octet-stream';

        var self = this;

        self.response.setHeaders(statusCode, headers);
        callback();
    };

    this.setTemplateAndLayout = function (opts) {
        var controllerFilename = utils.string.getInflection(this.name, 'filename', 'plural');
        var actionFileName = utils.string.snakeize(this.params.action);

        // Set template and layout paths
        if (opts.template) {
            // If template includes full views path just use it
            if (opts.template.match('app/views/')) {
                this.template = opts.template;
            } else if (opts.template.match('/')) {
                // If it includes a '/' and it isn't the full path
                // Assume they are using the `controller/action` style
                // and prepend views dir
                this.template = 'app/views/' + opts.template;
            } else {
                // Assume they only included the action, so add the controller path
                this.template = 'app/views/' + controllerFilename + '/' + opts.template;
            }
        } else {
            this.template = 'app/views/' + controllerFilename + '/' + actionFileName;
        }

        if (opts.layout) {
            // If layout includes `app/views` just return it
            if (opts.layout.match('app/views')) {
                this.layout = opts.layout;
            } else if (opts.layout.match('/')) {
                // If it includes a '/' and it isn't the full path
                // Assume they are using the `controller/action` style
                // and prepend views dir
                this.layout = 'app/views/' + opts.layout;
            } else {
                // Assume they only included the controller, so append it to
                // the layouts path
                this.layout = 'app/views/layouts/' + opts.layout;
            }
        } else {
            // If options.layout is explicitly set to false, use custom
            // Wepp empty template in `lib/template/templates`
            if (opts.layout === false) {
                this.layout = 'wepp/empty';
            } else {
                this.layout = 'app/views/layouts/' + controllerFilename;
            }
        }
    };

    this.renderTemplate = function (d, callback) {
        var self = this;
        var data = utils.mixin({}, d); // Prevent mixin-polution
        var templater;

        // Mix in controller instance-vars (props only, no methods)
        // Don't overwrite existing same-name properties
        for (var p in this) {
            if (!(data[p] || typeof this[p] == 'function')) {
                data[p] = this[p];
            }
        };
        
        templater = new Templater(this.layout, this.template, data);
        templater.render(callback);
    }
}

exports.BaseController = controller.BaseController;