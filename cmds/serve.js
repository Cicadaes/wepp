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
    wepp.argv = argv;
    process.env.wepp = JSON.stringify(wepp);
    shell.cd(wepp.root); // 脚本目录
    shell.exec('gulp serve'); // wepp.cwd执行wepp命令的当前目录
}