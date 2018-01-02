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

Handlebars.prototype.registerHelpers = function (helpers) {
    if (!helpers) {
        return false;
    }

    for (var h in helpers) {
        this.registerHelper(h, helpers[h]);
    }
};

/*
 * We have to have these helper functions because
 * Handlebars requires them to create helpers
 *
 * Usually we can just send in functions as data to render and compile
 * and those are helpers but not here, it just ignores functions.
 *
 * Also it's really strict about only allowing functions to be registered
 * as helpers so we have to type check everything to ensure it's the correct
 * way..
*/

Handlebars.prototype.registerHelper = function (name, helper) {
    if (!name || !helper || {}.toString.call(helper) !== '[object Function]') {
        return false;
    }

    this.engine.registerHelper(name, this.wrapOptions(helper));
};

/*
 * In erj we can simple call function passing options hash
 * as argument in template, but for for handlebars it's impossible,
 * cause object hash is not mustache expression
 *
 * We can use optional has arguments in handlerbars for this,
 * but will be passed inside wrapped option object {hash : { foo : 'bar', baz : 'bla' }}
 * and template helpers in /template/helpers like urlFor
 * is not intended to work with this. So we just unpack options and pass them
 * to regular helper function and we can keep one set helpers with optional arguments
 * for handlebars and other engines
 */

Handlebars.prototype.wrapOptions = function (helper) {
    return function () {
      var argsLen = arguments.length
        , options = argsLen ? arguments[argsLen - 1] : null
        , i, newArgs;
  
      if (options && options.hash) {
        newArgs = [];
  
        for (i = 0; i<argsLen - 1; i++) {
          newArgs.push(arguments[i]);
        }
  
        newArgs.push(options.hash);
        return helper.apply(this, newArgs);
      } else {
        return helper.apply(this, arguments);
      }
    }
  }

module.exports = Handlebars;