var cluster = require('cluster');
var events = require('events');
var path = require('path');
var utils = require('utilities');
var fs = require('fs');

var log = require('../../vendor/log');
var config = require('../config');

var Master,
    WorkerData;

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
            _readConfig,
            _initLogging,
            _monitorProcesses
        ];
        chain = new utils.async.SimpleAsyncChain(items, self);
        chain.last = function () {
            console.log('chain complete...');
        };
        chain.run();
    };

    this.createWorkers = function () {
        var configCount = this.config.workers,
            currentCount = this.workers.count,
            needed,
            rotationWindow = this.config.rotationWindow,
            staggerInterval,
            retirement = (new Date()).getTime() + rotationWindow,
            msg;

        needed = configCount - currentCount;
        staggerInterval = rotationWindow / needed;

        if (needed) {
            msg = 'Creating ' + needed + ' worker process';
            msg += needed > 1 ? 'es.' : '.';
            this.stdoutLog.info(msg);
            while (currentCount < configCount) {
                currentCount++;
                this.createWorker(retirement);
                retirement -= staggerInterval;
            }
        }
    }

    this.createWorker = function (retirement) {
        var self = this,
            retirAt = retirement || (new Date()).getTime() + this.config.rotationWindow ,
            fork = cluster.fork(),
            process = fork.process,
            id = process.pid.toString(),
            data = new WorkerData(id, fork, retirAt);

        this.workers.addItem(id, data);
    }

    function _readConfig (next) {
        this.config = config.readConfig(this.options);
        next();
    }

    function _initLogging (next) {
        var self = this,
            types = ['stdout', 'stderr', 'access'],
            now = utils.date.strftime(new Date(), '%FT%T'),
            logPath = this.config.logPath,
            levelsByType = {access: 'access', stderr: 'error', stdout: 0},
            writing = logPath != null,
            printSync = this.config.env === 'development';

        // Colon is not valid filepath char in Win
        // Use percent, that seems to be hunky-dory
        if (process.platform === 'win32') {
            now = now.replace(/:/g, '%');
        }
        
        if (this.config.debug) {
            levelsByType.stdout = log.DEBUG;
        } else if (this.config.logLevel) {
            // If a custom log level is given, then
            // get the level from log
            levelsByType.stdout = log[this.config.logLevel];
        } else {
            // Default to info
            levelsByType.stdout = log.INFO;
        }

        // If we are writing, then attempt to create the directory
        // if it does't exist
        if (writing) {
            utils.file.mkdirP(logPath);
        }

        // Create a new logger for the type and give it a name
        // on this with appended 'Log
        // e.g., stdoutLog
        types.forEach(function (type) {
            var currentLog,
                archivedLog;

            // Write to file
            if (writing) {
                currentLog = path.join(logPath, type + '.log');
                archivedLog = path.join(logPath, type + '.' + now + '.log');

                // If the main log file exists, then rename it to the archived log file
                if (fs.existsSync(currentLog)) {
                    try {
                        fs.renameSync(currentLog, archivedLog);
                    } catch (error) {
                        // renameSync doesn't work correctly here for some reason,
                        // fall back to copy/delete
                        utils.file.cpR(currentLog, archivedLog);
                        fs.unlinkSync(currentLog);
                    }
                }
                self[type + 'Log'] = new log(
                    levelsByType[type],
                    fs.createWriteStream(currentLog),
                    printSync
                );
            } else {
                // No logfile
                self[type + 'Log'] = new log(
                    levelsByType[type],
                    null,
                    printSync
                )
            }
            self[type + 'Log'].type = type;
        });

        // self[type + 'Log'] 
        self.stdoutLog.info('Server starting with config: ' +
            JSON.stringify(self.config, true, 2)
        );

        next();
    }

    function _monitorProcesses(next) {
        var self = this,
            workers = this.workers,
            count = this.config.workers,
            now = (new Date()).getTime();

        this.createWorkers();

        next();
    }
})();

utils.enhance(Master.prototype, new events.EventEmitter());

WorkerData = function (id, worker, retirAt) {
    this.id = id;
    this.process = null;
    this.pid = null;
    this.worker = worker;
    this.retirAt = retirAt;
}

module.exports.Master = Master;
module.exports.WorkerData = WorkerData;