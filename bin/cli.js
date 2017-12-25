#!/usr/bin/env node

var yargs = require('yargs');
require('../lib/wepp');

yargs.commandDir('../cmds')
    .usage('wepp [domain/namespace] <command> [--args]')
    .demandCommand(1, 'You must specify a domain/namespace and a command')
    .help('h')
    .alias('h', 'help')
    .version()
    .epilog('for more information visit')
    .argv;
