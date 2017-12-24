#!/usr/bin/env node

var shell = require('shelljs');
var yargs = require('yargs');
var _ = require('lodash');
var wepp = require('../index');

var cmd = process.argv[2]
var cmds = {
    serve: 'serve'
}
if (cmds[cmd]) {
    var c = require('../lib/' + cmd);
    if (c && c.name && c.desc) {
        // 设置子命令
        var argv = yargs.command(c.name, c.desc, function (yargs) {
            c.usage && yargs.usage(c.usage);
            c.param && _.forEach(c.param, function (p, i) {
                yargs.option(p.short, {
                    alias: p.full,
                    describe: p.describe,
                    default: p.default,
                    demand: p.demand // 是否必须
                });
                yargs.help('h').alias('h', 'help');
            });
        }).argv; // yargs.command().argv才会执行回调，否则yargs.command()是不执行的
        if (argv.h || argv.help) {
            yargs.help('h').argv;
            return;
        }

        // 执行子命令
        wepp.run(argv);
    }
} else {
    if (yargs.argv.h || yargs.argv.help) {
        yargs.usage('Usage: wepp [option]')
            .example('wepp serve', '启动服务')
            .help('h')
            .alias('h', 'help').argv;
    } else {
        shell.exec('wepp -h');
    }
}