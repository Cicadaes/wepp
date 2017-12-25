#!/usr/bin/env node

var yargs = require('yargs');
require('../lib/wepp');

yargs.commandDir('../cmds')
    .demandCommand()
    .help('h')
    .alias('h', 'help')
    .argv;
