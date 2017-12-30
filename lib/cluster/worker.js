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

        this.config = {};
        this.server = null;
        this.addListeners();
    };

    this.addListeners = function () {
        var self = this;

        // Master-process and Worker-process communicate each others by worker.send(msg)
        process.addListener('message', function (data) {
            console.log(data);
        });
    }
})();

module.exports.Worker = Worker;