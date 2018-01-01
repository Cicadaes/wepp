var Layout = require('./layout');

var Templater = function (layout, template, data) {
    this.layout = layout;
    this.template = template;
    this.data = data;
};

Templater.prototype = new (function () {
    this.render = function (cb) {
        var layout = new Layout(this.layout, this.template, this.data);
        layout.render(cb);
    };
})();

module.exports = Templater;


