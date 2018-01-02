var utils = require('utilities');

var htmlStrategy = require('./strategies/html');

var responder = {};

responder.strategies = {
    html: htmlStrategy
}

responder.Responder = function () {
    this.strategies = utils.mixin({}, responder.strategies);
};

responder.Responder.prototype = new (function () {
    /**
     * Responds with a model or collection
     * @param {Object} content - The model, collection, or hash of values
     * @param {Object} [options] Options.
     * @param {String|Object} [options.status] The desired flash message,
     * can be a string or an errors hash
     * @param {Boolean} [options.silent] Disables flash messages if set to true
     * @param {Function} [cb] - An optional callback where the first argument
     * is the response buffer
    */
    this.respond = function (controller, content, options) {
        var opts = options || {}
            , strategies = opts.strategies || this.strategies ||
                utils.mixin({}, responder.strategies);

        // Was the negotiated type a user-defined strategy?
        if (typeof strategies[opts.format] === 'function') {
            // Invoke the strategy on the controller instance
            strategies[opts.format].call(controller, content, opts);
        }
        else {
            // The default action is just to output the content in the right format
            controller.respond(content, opts);
        }
    };
})();

module.exports = responder;