var BaseController = require('./base_controller').BaseController;
var StaticFileController;

StaticFileController = function (req, res, params) {
    this.request = req;
    this.response = res;
    this.params = params;
};

StaticFileController.prototype = new BaseController();
StaticFileController.prototype.contructor = StaticFileController;

StaticFileController.prototype.respond = function (opts) {
    this.response.sendFile(opts.path);
};

module.exports.StaticFileController = StaticFileController;