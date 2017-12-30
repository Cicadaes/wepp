var utils = require('utilities');
var fs = require('fs');
var path = require('path');

var config;

config = new (function () {
    this.readConfig = function (options) {
        var conf = {},
            env,
            fileName,
            fileExt,
            fileBaseName,
            cwd = process.env.INIT_CWD,
            configs = fs.readdirSync(path.join(cwd, 'config')),
            baseConfig,
            appBaseConfig,
            appEnvConfig;
        
        baseConfig = utils.mixin({}, require('./base_config'), true);

        // Fallbacks for determining the environment
        env = options.env|| process.env.NODE_ENV || baseConfig.env

        // Base config for workers-count should be 1 in dev-mode
        // Cycle based on filesystem changes, not keep-alive
        // Process-rotation not possible in this mode
        if (env === 'development') {
            baseConfig.workers = 1;
            baseConfig.rotateWorkers = false;
        }

        configs.forEach(function (c) {
            fileName = c;
            fileExt = path.extname(fileName);
            fileBaseName = path.basename(fileName, fileExt);

            // Require the environment configuration and the base configuration file
            if (fileBaseName === env || fileBaseName === 'environment') {
                appBaseConfig = require(path.join(cwd, 'config/environment'));
                appEnvConfig = require(path.join(cwd, 'config', env));
            }
        });

        // Mixin everything in
        utils.mixin(conf, baseConfig, true);
        utils.mixin(conf, appBaseConfig, true);
        utils.mixin(conf, appEnvConfig, true);
        utils.mixin(conf, options, true);

        return conf;
    };
})();

module.exports = config;