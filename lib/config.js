var utils = require('utilities');

var config;

config = new (function () {
    this.readConfig = function (options) {
        var conf = {},
            baseConfig;
        
        baseConfig = utils.mixin({}, require('./base_config'), true);

        utils.mixin(conf, baseConfig);

        return conf;
    };
})();

module.exports = config;