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