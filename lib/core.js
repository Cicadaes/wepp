var utils = require('utilities');

module.exports = new (function () {
    var _started = false
        , _master
        , _worker;

    /**
     * launch cluster
     */
    this.startCluster = function (options) {
        var cluster = require('cluster'),
            master,
            worker,
            app,
            appInst;

        if (_started) {
            return;
        }

        wepp.isMaster = cluster.isMaster;
        wepp.isWorker = cluster.isWorker;

        // cluster.fork() then launch Child Thread and will again "gulp serve"
        // Because of shell.exec('gulp serve --cwd '+ wepp.__root__ +' --unArgv ' + argv)
        // console.log("isMaster: " + wepp.isMaster, "isWorker: " + wepp.isWorker);
        // console.log(options);

        // Master-process, start-up workers
        if (wepp.isMaster) {
            master = require('./cluster/master');
            _master = new master.Master();

            _master.on('started', function () {
                
            });
            _master.start(options);
        } else {
            // Worker-process, start up an app
            app = require('./app');
            worker = require('./cluster/worker');

            _worker = new worker.Worker();
            wepp.worker = _worker; // {}

            _worker.initialize({clustered: true}, function () {
                utils.mixin(wepp, _worker);
                appInst = new app();
                appInst.initialize(options, function () {
                    wepp.emit('initialized');
                    utils.mixin(wepp, appInst);
                    // All ready to start http server
                    _worker.startServer(function () {
                        wepp.emit('started');
                    });
                })
            });
        }
    }
})();