module.exports = new (function () {
    var _started = false
        , _master
        , _worker;

    /**
     * launch cluster
     */
    this.startCluster = function (options) {
        var cluster = require('cluster'),
            master;

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
        }
    }
})();