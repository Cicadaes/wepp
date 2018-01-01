var Handlebars = function () {
    this.engine = this.engine || require('handlebars');
};

Handlebars.prototype.render = function (data, fn) {
    return fn(data);
};

Handlebars.prototype.compile = function (template, options) {
    return this.engine.compile(template, options);
}

module.exports = Handlebars;