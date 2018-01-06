var utils = require('utilities');
var mysql = require('mysql');

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
    this.init.apply(this, arguments);
};

utils.mixin(Adapter.prototype, new (function () {
    this.init = function () {
        var self = this;
        this.client = this._getClient();
        this.client.on('error', function (err) {
            console.log(err)
            self._handleError(err);
        });
        // this.client.connect();
    };

    // Pseudo-private -- utility and for testing only
    this._getClient = function () {
        return mysql.createConnection(this.config);
    };

    this._handleError = function (err) {

    }
})());

exports.Adapter = Adapter;