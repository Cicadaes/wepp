module.exports = function (worker) {
    var self = this,
        types = [
            'access',
            'debug',
            'info',
            'notice',
            'warning',
            'error',
        ],
        type,
        loggerCreator = function (t) {
            return function (msg) {
                self.worker.sendMessage({method: 'log', logType: t, message: msg});
            };
        };
  
    this.worker = worker;
  
    for (var i = 0; i < types.length; i++) {
        type = types[i];
        this[type] = loggerCreator(type);
    }
  };