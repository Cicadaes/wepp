var _aliases = {
    mysql: 'mysql'
};
var _adapters = {
    mysql: {
        path: 'sql/mysql',
        lib: 'mysql',
        type: 'sql'
    }
};

for (var p in _adapters) {
    _adapters[p].name = p;
}

var adapters = new (function () {
    this.getAdapterInfo = function (adapter) {
        var canonical = _aliases[adapter];
        var adapter = _adapters[canonical];

        return adapter || null;
    };
})();

module.exports = adapters;