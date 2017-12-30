var cluster = require('cluster');
var events = require('events');
var path = require('path');
var utils = require('utilities');
var fs = require('fs');

var config = require('../config');

var Master;

Master = function () {
    var self = this,
        handleExit = function (worker) {
            console.log(worker)
        };

    self.init();

    cluster.addListener('exit', handleExit);
};

Master.prototype = new (function () {
    this.init = function () {
        var self = this;

        self.options = null;
        self.config = {};
        self.workers = new utils.SortedCollection();
    };

    this.start = function (options) {
        var self = this,
            items,
            chain;

        self.options = options || {};

        var configPath = path.join(process.env.INIT_CWD, 'config');

        try {
            fs.statSync(configPath);
        } catch (error) {
            console.log('The app isn\'t wepp\'s app. See "wepp -h" for help.');
            process.exit();
        }

        items = [
            _readConfig
        ];
        chain = new utils.async.SimpleAsyncChain(items, self);
        chain.last = function () {
            console.log('chain complete...');
        };
        chain.run();
    };

    function _readConfig (next) {
        this.config = config.readConfig(this.options);
        next();
    }
})();

utils.enhance(Master.prototype, new events.EventEmitter());

module.exports.Master = Master;