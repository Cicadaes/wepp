var shell = require('shelljs');

exports.command = 'app [name]';
exports.describe = '创建项目';
exports.builder = function (yargs) {
    return yargs.option('name', {
            alias: 'n',
            describe: 'a directory as app name',
            type: 'string',
            demand: true
        })
        .example('$0 gen app --name demo', 'generate app named demo')
        .showHelpOnFail(false, 'Specify -h for available options')
        .help('h');
};
exports.handler = function (argv) {
    shell.cd(wepp.root); // 脚本目录
    shell.exec('gulp gen:app'); // wepp.cwd执行wepp命令的当前目录
};