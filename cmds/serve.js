var shell = require('shelljs');

exports.command = 'serve [host|port]';
exports.desc = '启动项目';
exports.builder = {
    host: {
        default: 'localhost'
    },
    port: {
        alias: 'p',
        default: 3000
    }
};
exports.handler = function (argv) {
    shell.cd(wepp.root); // 脚本目录
    shell.exec('gulp serve --unArgv ' + wepp.unparseArgv(argv)); // wepp.cwd执行wepp命令的当前目录
}