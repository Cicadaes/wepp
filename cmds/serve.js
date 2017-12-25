var shell = require('shelljs');

exports.command = 'serve [host|port]';
exports.desc = '启动wepp项目';
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
    var cmd = argv['_'][0];
    
    wepp.argv = argv;
    process.env.wepp = JSON.stringify(wepp);
    shell.cd(wepp.dirname); // 脚本目录
    shell.exec('gulp '+ cmd); // wepp.cwd执行wepp命令的当前目录
}