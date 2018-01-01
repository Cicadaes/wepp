var Handlebars = function () {
    this.engine = this.engine || require('handlebars');
};

Handlebars.prototype.render = function (data, fn) {
    // See this.fn = this.engine.compile(this.template, this.options) in Adapter
    // So fn is refer of handlebars.js's compile
    // And step into handlebars.js
    // data as context,
    return fn(data);
};

Handlebars.prototype.compile = function (template, options) {
    return this.engine.compile(template, options);
}

module.exports = Handlebars;