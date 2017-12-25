exports.command = 'app [name]';
exports.describe = '创建wepp项目';
exports.builder = {
    name: {
        demand: true
    }
};
exports.handler = function (argv) {
    console.log(argv);
};