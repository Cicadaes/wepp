var Layout = require('./layout').Layout;
var adapter = require('./adapters');

var Templater = function (layout, template, data) {
    this.layout = layout;
    this.template = template;
    this.data = data;
};

Templater.prototype = new (function () {
    this.render = function (cb) {

        // Store the helpers in the base adapter namespace,
        // will be registered with each adapter subclass constructor
        adapter.registerHelpers(wepp.viewHelpers);

        var layout = new Layout(this.layout, this.template, this.data);
        layout.render(cb);
    };
})();

module.exports = Templater;


