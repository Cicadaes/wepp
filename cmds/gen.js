exports.command = 'gen <command>';
exports.desc = '项目生成器';
exports.builder = function (yargs) {
    return yargs.example('$0 gen app', 'just test')
        .commandDir('gen')
        .showHelpOnFail(false, 'Specify -h for available options')
        .help('h');
};
exports.handler = function (argv) {
    // console.log(argv);
}