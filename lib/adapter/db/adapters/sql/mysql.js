var utils = require('utilities');

var _baseConfig = {
    host: 'localhost',
    user: null,
    password: null,
    database: null,
}

var Adapter = function (options) {
    var opts = options || {};

    this.name = 'mysql';
    this.type = 'sql';
    this.config = utils.mixin(_baseConfig, opts);
};

exports.Adapter = Adapter;