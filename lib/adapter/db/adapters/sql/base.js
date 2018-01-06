var utils = require('utilities');

var Adapter = function () {

};

utils.mixin(Adapter.prototype, new (function () {
    this.FETCH_METHOD = 'exec';

    this.load = function (query, callback) {
        var self = this;
        var sql = 'SELECT * FROM mock_project';

        this.exec(sql, callback);
    };
})());

module.exports.Adapter = Adapter;