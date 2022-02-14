#!/usr/bin/env node

const program = require('commander');

const pkg = require('./package.json');

const diff = require('./tasks/diff');
const snapshot = require('./tasks/snapshot');

// Take snapshot
program
  .command('snapshot')
  .option(
    '-o, --output <path>',
    'output filepath (default: "harold_snapshot_<date>_<time>.json")',
  )
  .option(
    '-e, --exec <cmd>',
    'build command (will be run with NO_HASH=true env variable set)',
    'npm run build-production',
  )
  .option(
    '-p, --path <path>',
    'build path',
    'public',
  )
  .description('build project and take snapshot')
  .action(snapshot);

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

process.on('unhandledRejection', error => {
  console.error(error);
});
