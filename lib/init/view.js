var path = require('path');
var utils = require('utilities');

module.exports = new (function () {
    this.init = function (app, next) {
        var viewPath = path.join(wepp.config.__App__, 'app/views');
        var weppTemplatesPath = path.join(wepp.config.__Root__, 'template/templates');

        // If viewPath does't exist they're running viewless
        if (!utils.file.existsSync(viewPath)) {
            next();
        } else {
            var files = utils.file.readdirR(viewPath);
            var weppTemplatesFiles = utils.file.readdirR(weppTemplatesPath);
            var noExtFile;
            var origFile;
            var fileExt;
            var fileBaseName;
            var file;
            var pat = /\.(ejs|hbs)$/;
            var templates = {};

            // Loop through template files and add it them to registry
            createTemplates(files);
            // Add custom templates from `lib/template/templates`
            createTemplates(weppTemplatesFiles, true);

            app.templateRegistry = templates;

            next();

            function createTemplates(files, isWepp) {
                for (var i = 0; i < files.length; i++) {
                    file = files[i];
                    fileExt = path.extname(file);
                    fileBaseName = path.basename(file, fileExt).replace(/\.html$/, '');

                    if (isWepp) {
                        origFile = path.normalize('wepp/' + fileBaseName);
                    }

                    if (pat.test(file)) {
                        noExtFile = file.replace(/\.html.*$/, '');
                        // origFile.replace(wepp.config.__App__, '');
                        addTemplate(noExtFile, file, origFile, fileExt, fileBaseName);
                    }
                }
            }

            // Adds a template object to templates
            function addTemplate (noExtFile, file, origFile, fileExt, fileBaseName) {
                if (!origFile) origFile = noExtFile;
                // Get realtive path,
                // .e.g
                // full path E:\workspace\project\app\views\errors\default
                // relative path app\views\errors\default
                origFile = path.relative(wepp.config.__App__, origFile);
                templates[origFile] = {
                    file: file
                    , ext: fileExt
                    , baseName: fileBaseName
                    , baseNamePath: noExtFile
                };
            };
        }
    };
})();