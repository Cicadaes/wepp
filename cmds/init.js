var shell = require('shelljs');

exports.command = 'init [name]';
exports.desc = 'init project';
exports.builder = function (yargs) {
    return yargs.option('name', {
            alias: 'n',
            describe: 'a directory as project name',
            type: 'string',
            demand: true
        })
        .example('$0 init wepp_demo')
        .showHelpOnFail(false, 'Specify -h for available options')
        .help('h');
};
exports.handler = function (argv) {
    argv.__proj__ = process.cwd();
    argv = wepp.unparseArgv(argv);
    shell.cd(wepp.root); // 脚本目录
    shell.exec('gulp init --unArgv ' + argv); // wepp.cwd执行wepp命令的当前目录
};