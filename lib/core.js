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

        // Master-process, start-up workers
        if (wepp.isMaster) {
            master = require('./cluster/master');
            _master = new master.Master();

            _master.start(options);
            _master.on('started', function () {
                
            });
        }
    }
})();