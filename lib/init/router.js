var path = require('path');
var RegExpRouter = require('barista').Router;

wepp.RegExpRouter = RegExpRouter;

module.exports = new (function () {
    this.init = function (app, next) {
        var router = require(path.join(app.config.__App__, 'config/router'));

        app.router = router.router || router;

        next();
    };
})();