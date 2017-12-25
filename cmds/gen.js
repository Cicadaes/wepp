exports.command = 'gen <command>';
exports.desc = 'wepp项目生成器';
exports.builder = function (yargs) {
    return yargs.example('$0 gen app', 'just test')
        .commandDir('gen_cmd');
};
exports.handler = function (arv) {
    console.log(argv);
}