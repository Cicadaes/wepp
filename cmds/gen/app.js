var shell = require('shelljs');

exports.command = 'app [name]';
exports.describe = '创建项目';
exports.builder = {
    name: {
        demand: true
    }
};
exports.handler = function (argv) {
    wepp.argv = argv;
    // console.log(wepp)
    process.env.wepp = JSON.stringify(wepp);
    shell.cd(wepp.root); // 脚本目录
    shell.exec('gulp gen:app'); // wepp.cwd执行wepp命令的当前目录
};