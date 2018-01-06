var path = require('path');
var fs = require('fs');
var utils = require('utilities');

var model = require('../adapter/db');

module.exports = new (function () {
    this.init = function (app, next) {
        var self = this;
        var modelDir = path.join('app/model');
        var models;
        var cwd = app.config.__App__;

        // check: ensures models exist in model directory
        // configuration check: models are disabled if boolean value is false (model: false)
        if (!fs.existsSync(path.join(cwd, modelDir)) ||
            false === app.config.model) {
            return next();
        }

        // Set any model properties from the app config
        utils.mixin(model.config, app.config.model);

        models = utils.getConstructorsFromDirectory(modelDir, app.config.__App__);

        models.forEach(function (m) {
            // Requiring the file will register the model def if using the old way
            var mod = require(m.filePath);
            // Otherwise, look for an exported constructor with the right name
            m.ctor = mod[m.ctorName];
        });

        // Register all the models
        // ModelDefinition.prototype = new model.ModelDefinitionBase(name);
        // defined = new ModelDefinition();
        // So, model have properties of ModelDefinitionBase
        model.registerDefinitions(models);

        doIt();

        function doIt() {
            var m = models.shift();
            var modelItem;
            var name;

            if (m) {
                // If the model doesn't exist, something is fucked up
                name = m.ctorName;
                if (!model[name]) {
                    throw new Error('Model ' + name + ' did not get registered properly.');
                }
                modelItem = model[name];
                self.loadAdapterForModel(app, modelItem, doIt);
            } else {
                next();
            }
        }
    };

    this.loadAdapterForModel = function (app, modelItem, next) {
        var builtinAdaptersPath = path.join(__dirname, '../adapter/db/adapters');
        var cwd = app.config.__App__;
        var modelDir = path.join('app/model');
        var appAdaptersPath = path.join(cwd, modelDir, 'adapter');
        var name = modelItem.modelName;
        var adapterName;
        var adapterPath;
        var adapterInfo;
        var adapter;
        var config;
        var adapterCtor;

        adapterName = modelItem.adapter && modelItem.adapter.name;
        // Is there a specific adapter defined for this model item?
        if (adapterName) {
            // See if it's a custom in-app adapter
            adapterPath = _getAdapterPath(appAdaptersPath, adapterName);
            // Try again, see if there's a built-in adapter
            if (!adapterPath) {
                adapterInfo = model.getAdapterInfo(adapterName);
                if (adapterInfo) {
                    adapterName = adapterInfo.name;
                    adapterPath = _getAdapterPath(builtinAdaptersPath, adapterInfo.path);
                }
            }
        } else {
            // Look for a defaut adapter
            adapterName = model.config.defaultAdapter;
            if (adapterName) {
                adapterInfo = model.getAdapterInfo(adapterName);
                if (adapterInfo) {
                    adapterName = adapterInfo.name; // Get canonical name
                    adapterPath = _getAdapterPath(builtinAdaptersPath, adapterInfo.path);
                }
            }
        }

        // No adapter, log an error
        if (!adapterPath) {
            wepp.log.info('Model adapter not found for ' + name + '. Set .adapter for this model, or set model.config.defaultAdapter.');
        } else {
            adapter = model.adapters[adapterName];
            if (!adapter) {
                config = _getAdapterConfig(app.config.db, adapterName);
                adapterCtor = require(adapterPath).Adapter;
                adapter = new adapterCtor(config);

                if (typeof adapter.connect == 'function') {
                    adapter.connect(function () {
                        return done(adapter);
                    })
                } else {
                    return done(adapter);
                }
            } else {
                return done(adapter);
            }
        }

        function done (adapter) {
            model[name].adapter = adapter; // e.g. model.Todo.adapter
            model.adapters[adapterName] = adapter; // e.g. model.adapters.myql
            next();
        }
    };
})();

function _getAdapterPath (base, name) {
    var p = path.join(base, utils.string.snakeize(name));
    if (fs.existsSync(p + '.js')) {
        return p + '.js';
    }
    return null;
}

function _getAdapterConfig (dbConfig, adapterName) {
    var info;
    for (var p in dbConfig) {
        // Return the first alias key recognized whose
        // canonical name is the same
        info = model.getAdapterInfo(p);
        if (info && info.name == adapterName) {
            return dbConfig[p];
        }
    }
}