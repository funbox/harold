const ora = require('ora');

const buildProject = require('../lib/build-project');
const generateSnapshot = require('../lib/generate-snapshot');
const writeSnapshotFile = require('../lib/write-snapshot-file');

module.exports = async function snapshot(cmdObj) {
  const spinner = ora();
  const context = {
    buildPath: cmdObj.path,
    buildTime: null,
    execCmd: cmdObj.exec,
    snapshot: null,
  };

  console.log();
  console.log('Taking a snapshot...');

  spinner.indent = 1;
  spinner.color = 'yellow';

  try {
    const buildTime = process.hrtime();

    spinner.start('Build project');
    await buildProject(context.execCmd);
    context.buildTime = process.hrtime(buildTime);
    spinner.clear();
  } catch (error) {
    spinner.fail();
    throw error;
  }

  try {
    spinner.start('Generate snapshot');
    context.snapshot = generateSnapshot(context.buildPath, context.buildTime);
    spinner.clear();
  } catch (error) {
    spinner.fail();
    throw error;
  }

  try {
    spinner.start('Save snapshot');
    await writeSnapshotFile(context.snapshot, cmdObj.output);
    spinner.clear();
  } catch (error) {
    spinner.fail();
    throw error;
  }

  spinner.succeed('Done!');
  console.log();
};
