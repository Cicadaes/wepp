var utils = require('utilities');

var config = require('../..//base_config')
var adapters = require('./adapters');

var model = {};
var _foreignKeyCreators = [];

utils.mixin(model, new (function () {
    this.config = config;
    this.adapters = {};

    this.registerDefinitions = function (defs) {
        var self = this;

        defs.forEach(function (m) {
            // Prefer 'name', accept older 'ctorName'
            var name = m.name || m.ctorName;
            // Registration may have happened in the model definition file
            // if using the old templates. Don't re-register
            if (!self[name]) {
                self.registerDefinition(name, m.ctor);
            }
        });
        this.createForeignKeys();
    };

    this.registerDefinition = function (name, ModelDefinition) {
        var origProto = ModelDefinition.prototype;
        var defined;
        var ModelCtor;

        // Execute all the definition methods to create that metadata
        ModelDefinition.prototype = new model.ModelDefinitionBase(name);
        defined = new ModelDefinition();

        // Create the constructor function to use when calling static
        // ModelCtor.create. Gives them the proper instanceof value,
        // and .valid, etc. instance-methods.
        ModelCtor = _createModelItemConstructor(defined);

        // Mix in the static methods like .create and .load
        utils.mixin(ModelCtor, _createStaticMethodsMixin(name));

        // Mix on the statics on the definition 'ctor' onto the
        // instantiated ModelDefinition instance
        utils.mixin(defined, ModelDefinition);

        // Mix ModelDefinition instance properties as static properties
        // for the model item 'ctor'
        utils.mixin(ModelCtor, defined);

        // Same with EventEmitter methods
        // utils.enhance(ModelCtor, new EventEmitter());

        // Mix any functions defined directly in the model-item definition
        // 'constructor' into the original prototype, and set it as the prototype of the
        // actual constructor
        utils.mixin(origProto, defined);

        model[name] = ModelCtor;

        return ModelCtor;
    };

    this.createForeignKeys = function () {
        var creator;
        while ((creator = _foreignKeyCreators.pop())) {
            creator();
        }
    };

    this.getAdapterInfo = function (name) {
        return adapters.getAdapterInfo(name);
    };

    this.getAdapterForModel = function (modelName) {
        var ctor = this[modelName];
        var adapter = (ctor && ctor.adapter) || this.defaultAdapter;

        if (!adapter) {
            throw new Error('No adapter found for ' + modelName +
                '. Please define one with `setAdapter`, or define a default' +
                ' adapter with `model.setDefaultAdapter`.');
        }
        return adapter;
    };
})());

model.ModelDefinitionBase = function (name) {
    var self = this;

    this.name = name;

    this.property = function (name, datatype, options) {

    };
};

function _createModelItemConstructor(def) {
    // Base constructor function for all model items
    var ModelItemConstructor = function (params) {

    }

    return ModelItemConstructor;
}

function _createStaticMethodsMixin(name) {
    var obj = {};

    obj.modelName = name;

    obj.all = function () {
        var args = Array.prototype.slice.call(arguments);
        // Important: do not stup out a callback -- if a callback is
        // defined, all result of the query will be bufferd
        var callback = typeof args[args.length - 1] === 'function' ? args.pop() : null;
        var query = args.shift() || {};
        var opts = args.shift() || {};
        var adapt;

        opts.scenario = opts.scenario || 'reify';

        query = new Query(model[name], query, opts);
        adapt = model.getAdapterForModel(name);
        if (opts.includes && adapt.type != 'sql') {
            throw new Error('Only SQL adapters support ' +
                'the "includes" option for queries.');
        }

        return adapt.load.apply(adapt, [query, callback]);

    };

    return obj;
}

module.exports = model;

// Load last, these depend on index.js
var Query = require('./query/query').Query;