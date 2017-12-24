var argv = require('yargs').argv;

var wepp = {
    log: function (str) {
        console.log(str)
    }
}
Object.defineProperty(global, 'wepp', {
    enumerable: true,
    writable: false,
    configurable: false,
    value: wepp
});

// 执行子命令
wepp.run = function (argv) {
    wepp.cmd = process.argv[2]; // 当前命令
    wepp.cwd = argv.path || process.cwd(); // 执行路径

    var c = require('./lib/' + wepp.cmd)

    //每个命令都应该有run方法
    c.run && c.run(argv);
};

module.exports = wepp;