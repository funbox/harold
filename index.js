#!/usr/bin/env node

const program = require('commander');

const pkg = require('./package');

const diff = require('./tasks/diff');
const takeSnapshot = require('./tasks/take-snapshot');

// Take snapshot
program
  .command('snapshot')
  .description('build project and take snapshot')
  .action(takeSnapshot);

// Compare snapshots
program
  .command('diff <left> <right>')
  .description('compare snapshots')
  .action(diff);

program
  .usage('[options]')
  .version(pkg.version, '-V, --version')
  .description(pkg.description)
  .parse(process.argv);

if (!program.args.length) program.help();
