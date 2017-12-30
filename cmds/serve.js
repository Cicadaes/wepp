var shell = require('shelljs');

exports.command = 'serve [host|port]';
exports.desc = '启动项目';
exports.builder = {
    host: {
        default: 'localhost'
    },
    port: {
        alias: 'p',
        default: 6000
    }
};
exports.handler = function (argv) {
    argv = wepp.unparseArgv(argv);
    
    shell.exec('gulp serve --cwd '+ wepp.__root__ +' --unArgv ' + argv); // wepp.cwd执行wepp命令的当前目录
}