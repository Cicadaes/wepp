var dispatch = require('./worker_dispatch');
var logger = require('./worker_logger')

var Worker = function () {

}

Worker.prototype = new (function () {
    this.initialize = function () {
        var self = this,
            argv = Array.prototype.slice.call(arguments),
            param,
            opts = {},
            callback;

        while (param = argv.pop()) {
            if (typeof param == 'function') {
                callback = param;
            } else {
                opts = param;
            }
        }

        this._afterConfigure = function () {
            this.createServer();
            callback();
        };

        this.config = {};
        this.server = null;
        this.log = new logger(this);
        this.addListeners();
    };

    this.addListeners = function () {
        var self = this;

        // Master-process and Worker-process communicate each others by worker.send(msg)
        process.addListener('message', function (msg) {
            self.receiveMessage(msg);
        });
    };

    this.createServer = function () {
        // Create http server
        this.server = require('http').createServer();
    };

    this.startServer= function (callback) {
        var self = this,
            config = self.config,
            server = self.server,
            argv = [],
            msg,
            cb = function () {
                self.log.info(msg);
                callback();
            };


        config.port = isNaN(config.port) ? config.port : parseInt(config.port, 10);
        msg = 'Server worker running in ' + config.env + ' on port ' + config.port +
            ' with a PID of: ' + process.pid;
        
        // server.listen([port][, host][, backlog][, callback])
        argv.push(config.port);
        if (config.host) {
            argv.push(config.host);
        }
        argv.push(cb);
        server.listen.apply(server, argv);
    };

    this.receiveMessage = function (msg) {
        if (msg && msg.method && dispatch[msg.method]) {
            dispatch[msg.method].call(this, msg);
        }
    };

    this.configure = function (config) {
        this.config = config;
        this._afterConfigure();
    };

    this.sendMessage = function (msg) {
        if (typeof process.send == 'function') {
            process.send(msg);
        }
    };
})();

module.exports.Worker = Worker;