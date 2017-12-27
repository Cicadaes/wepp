var path = require('path');
var requireDirectory = require('require-directory');

function tasksLoader (options, existingGulp, wepp) {
    var gulp = existingGulp || require('gulp');

    var DEFAULT_OPTIONS = {
        path: 'gulp-tasks',
        plugins: {},
        delimiter: ':',
        config: {}
      };

    options = Object.assign({}, DEFAULT_OPTIONS, options);
    this.tasks = [];

    processTaskDirectory.call(this, options, gulp, wepp);

    return this;
}

function processTaskDirectory (options, gulp, wepp) {
    var self = this;
    requireDirectory(module, options.path, {
        visit: Visitor
    });

    /**
     * 模块访问器
     * @param {*} module 
     * @param {*} modulePath 文件路径
     */
    function Visitor (module, modulePath) {
        module = normalizeModule(module);

        var taskName = taskNameMapPath(modulePath);
        self.tasks.push(taskName);
        
        gulp.task(
            taskName,
            module.deps || [],
            module.nativeTask || taskFunction
        );

        function taskFunction (cb) {
            if ('function' !== typeof module.fn) {
                cb();
                return;
            }
            // console.log(module.fn.apply(module)())
            return module.fn.call(module, gulp, options.config, options.plugins, wepp)
        }
    }

    /**
     * 任务名称映射路径
     * @param   {*} modulePath 
     * @returns {string}
     */
    function taskNameMapPath (modulePath) {
        var relativePath = path.relative(options.path, modulePath); // 相对路径
        
        // 注册根目录下的index.js作为默认任务
        if ('index.js' === relativePath) {
            return 'default';
        }

        var pathInfo = path.parse(relativePath);
        var taskNameChain = [];

        if (pathInfo.dir) {
            taskNameChain.push.apply(taskNameChain, pathInfo.dir.split(path.sep));
        }
        if ('index' !== pathInfo.name) {
            taskNameChain.push(pathInfo.name);
        }

        return taskNameChain.join(options.delimiter);
    }

    /**
     * 统一模块定义
     * @param   {*} module 
     * @returns {object}
     */
    function normalizeModule (module) {
        if ('function' === typeof module) {
            return {
                fn: module,
                deps: []
            };
        } else {
            return module;
        }
    }
}

module.exports = tasksLoader