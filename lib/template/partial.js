var path = require('path');
var utils = require('utilities');
var fs = require('fs');

var Layout = require('./layout');
var adapter = require('./adapters');
var cache = {};

var Partial = function (templatePath, data, parent) {
    var self = this;
    this.templatePath = templatePath;
    this.data = data || {}; // layout refer, `Partial.call(this, layoutPath, data, null)`
    this.content = '';
    this.id = utils.string.uuid();
    this.children = [];
    this.parent = parent;

    // Hang a `partial` method on the execution-context for the
    // template rendering (e.g.,will be EJS global `partial`)
    // function to add sub-templates
    this.data.partial = function (templatePath, data) {
        var child = new Partial(templatePath, data, self);
        self.addChild(child);
        return '###partial###' + child.id;
    };
};

Partial.prototype = new (function () {
    this.addChild = function (child) {
        this.children.push(child);
    };

    this.render = function (cb) {
        var self = this;
        var templateData = this.getTemplateData();
        var file = templateData.file;
        var ext = templateData.ext;
        var handleData = function (data) {
            self.renderSelf(data, ext);
            self.renderChildren(cb);
        };

        // Use cached template content if possible
        if (cache[file]) {
            handleData(cache[file]);
        } else {
            // Otherwise fetch off disk
            // Get the template from FS then cache it for subsequent requests
            fs.readFile(file, 'utf-8', function (err, data) {
                if (err) {
                    throw err;
                }
                if (wepp.config.env !== 'deveploment') {
                    cache[file] = data;
                }
                handleData(data);
            });
        }
    };

    this.renderSelf = function (templateContent, ext) {
        var ctor = adapter.getCtorForExt(ext);
        var templateAdapter = new ctor(templateContent);
        this.content = templateAdapter.render(this.data);
    };

    this.renderChildren = function (cb) {
        var self = this;
        var children = this.children;
        var incr = children.length;

        if (children.length) {
            children.forEach(function (child) {
                // TODO: Again render
                child.render(function (content) {
                    self.content = self.content.replace(
                        '###partial###' + child.id,
                        content
                    );
                    incr--;
                    if (!incr) {
                        cb(self.content);
                    }
                });
            });
        } else {
            cb(this.content);
        }
    }

    this.getTemplateData = function () {
        var dirs = [];
        var dir;
        var key;
        var templatePath = path.normalize(this.templatePath);
        var templateData;

        // Look for an exact match
        templateData = wepp.templateRegistry[templatePath];

        // No exact match, try with some directory prefixes
        if (!templateData) {
            // Look through dirs until a registered template path is found
            // Note: Template paths are gathered at init so we don't have to
            // touch th FS when looking for templates

            if (this.parent) {
                dirs.unshift(path.dirname(this.parent.templatePath));
            }

            // Any local template directory
            dirs.unshift(path.dirname(templatePath));

            // Last resort; look in the base views directory
            dirs.unshift(path.normalize('app/views'));

            for (var i = 0; i < dirs.length; i++) {
                dir = dirs[i];
                // Not full path (No extension)
                key = path.normalize(path.join(dir, templatePath));
                templateData = wepp.templateRegistry[key];
                if (templateData) {
                    break;
                }
            }
        }

        // Still no joy
        if (!templateData) {
            // Is this a Layout?
            // resolve Layout is Object require, by `exports.Layout = Layout` instead of `module.exports = Layout` 
            if (this instanceof Layout.Layout) {
                // Try to use the default applacation layout
                key = path.normalize('app/views/layouts/layout');
                templateData = wepp.templateRegistry[key];

                // If they've removed the default layout for some reason
                if (!templateData) {
                    throw new Error('Layout template "' + templatePath + '" not found in ' +
                        utils.array.humanize(dirs));
                }
            } else {
                // If it's a normala Partial then it does't exist, boom
                throw new Error('Partial template "' + templatePath + '" not found in ' +
                    utils.array.humanize(dirs));
            }
        }

        return templateData || null;
    };
})();

module.exports = Partial;
