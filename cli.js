#!/usr/bin/env node

const program = require('commander');
const app = require('.');

program
  .usage('[options]')
  .version(require('./package').version, '-V, --version')
  .description(require('./package').description)
  .parse(process.argv);

app();
