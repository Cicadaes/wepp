var logger = new (function () {
    this.info = function () {
        console.log('info');
    };

    this.warn = function () {
        console.log('warn');
    };

    this.error = function () {
        console.log('error');
    };
})();

module.exports = logger;