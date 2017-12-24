var shell = require('shelljs');

module.exports = {
    name: 'serve',
    desc: '浏览器同步刷新',
    usage: 'Usage: weppp serve',
    param: [
        {
            short: 'p',
            full: 'port',
            describe: '端口号',
            default: 3000
        }
    ],
    run: function (argv) {
        delete argv['_'];
        delete argv['$0'];
        shell.cd(__dirname + '/../'); // 脚本目录
        shell.exec('gulp serve --cwd2=' + wepp.cwd + ' --params=' + JSON.stringify(argv)); // wepp.cwd执行wepp命令的当前目录
    }
}