var url = require('url');

var Request = require('./request');

var requestHelper = {
    enhanceRequest: function (req) {
        req.query = Request.parseQuery(req.url);
        return req;
    }
};

module.exports = requestHelper;