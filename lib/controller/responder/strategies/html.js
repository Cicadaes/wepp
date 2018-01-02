var utils = require('utilities');
var response;

var strategy = function (content, options) {
    if (content instanceof Error) {
        // Format error for template-rendering
        response = utils.mixin({}, content);
        response.message = content.message || '';
        if (wepp.config.detailErrors) {
            // 'message' and 'stack' are not enumerable
            response.stack = content.stack || '';
        } else {
            response.stack = '';
        }
        options.statusCode = content.statusCode || 500;
        this.respond(response, options);
    } else {
        throw new Error('respondWith expects either an Error object');
    }
};

module.exports = strategy;