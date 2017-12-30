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
    argv.__cwd__ = process.cwd();
    argv = wepp.unparseArgv(argv);
    
    shell.cd(wepp.__root__); // 脚本目录
    shell.exec('gulp serve --unArgv ' + argv); // wepp.cwd执行wepp命令的当前目录
}