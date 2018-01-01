var Layout;
var Partial = require('./partial');

// Subclass of Partial
Layout = function (layoutPath, templatePath, data) {
    var self = this;
    // Call the ctor on 'this' -- the the layoutPath will be our
    // templatePath
    Partial.call(this, layoutPath, data, null);

    // `render` is just a special case of `partial` using the template-path
    // that the layout wraps -- just hard-code the path and pass along
    // the same data
    // Guess Handlebar pass {{{}}} in .hbs file, then excute this.data.render
    this.data.render = function () {
        // TODO: Why and Where execute `this.data.render`, May Handlebars runtime
        return self.data.partial(templatePath, data);
    };
};

Layout.prototype = Object.create(Partial.prototype);
Layout.prototype.constructor = Layout;

exports.Layout = Layout;
