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
        .option('engine', {
            alias: 'e',
            describe: 'template engine',
            type: 'string',
            default: 'handlebars'
        })
        .example('$0 init wepp_demo')
        .showHelpOnFail(false, 'Specify -h for available options')
        .help('h');
};
exports.handler = function (argv) {
    argv = wepp.unparseArgv(argv);
    
    shell.exec('gulp init --cwd '+ wepp.__root__ +' --unArgv ' + argv); // wepp.cwd执行wepp命令的当前目录
};