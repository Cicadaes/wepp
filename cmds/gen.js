exports.command = 'gen <command>';
exports.desc = '项目生成器';
exports.builder = function (yargs) {
    return yargs.example('$0 gen app', 'just test')
        .commandDir('gen');
};
exports.handler = function (arv) {
    console.log(argv);
}