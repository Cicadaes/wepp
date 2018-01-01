var utils = require('utilities');
var util = require('util');

var adapter = {};
var Adapter;
var engines;
var adapterExtMap = {};
var createAdapterCtor;

// Engines and their associated file-extensions
engines = {
    'ejs': 'ejs',
    'handlebars': ['hbs', 'handlebars']
};


adapter = {
    helpers: {},
    getCtorForExt: function (ext) {
        return adapterExtMap[ext.replace('.', '')];
    },
    registerHelpers: function (helpers) {
        utils.mixin(this.helpers, helpers);
    }
};

createAdapterCtor = function (engine, extensions) {
    var ext;
    var adapterName = utils.string.capitalize(engine) + 'Adapter';
    var ctor = function (template, options) {
        this.engineName = engine;
        this.template = template;
        this.options = options;
        this.fn = null;

        this.engine = new (require('./' + engine))();
    };

    util.inherits(ctor, Adapter);
    adapter[adapterName] = ctor;
    ext = Array.isArray(extensions) ? extensions : [extensions];
    ext.forEach(function (e) {
        adapterExtMap[e] = ctor;
    });
};

Adapter = function () {};

Adapter.prototype = new (function () {
    this.render = function (data) {
        var data = data || {};

        return this.engine.render(data, this.comiple());
    };

    this.comiple = function () {
        if (this.fn) {
            return this.fn;
        }
        return (this.fn = this.engine.compile(this.template, this.options));
    };
})();

// Create the various subclassed constructors, map their filenames to them
for (var p in engines) {
    createAdapterCtor(p, engines[p]);
}

adapter.Adapter = Adapter;

module.exports = adapter;