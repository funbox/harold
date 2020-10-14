const ora = require('ora');

const buildProject = require('../lib/build-project');
const generateSnapshot = require('../lib/generate-snapshot');
const writeSnapshotFile = require('../lib/write-snapshot-file');

module.exports = async function snapshot() {
  const spinner = ora();
  const context = {
    buildTime: null,
    snapshot: null,
  };

  console.log('Taking a snapshot...');
  spinner.indent = 1;

  try {
    const buildTime = process.hrtime();

    spinner.start('Build project');
    await buildProject();
    context.buildTime = process.hrtime(buildTime);
    spinner.clear();
  } catch (error) {
    spinner.fail();
    throw error;
  }

  try {
    spinner.start('Generate snapshot');
    context.snapshot = generateSnapshot(context.buildTime);
    spinner.clear();
  } catch (error) {
    spinner.fail();
    throw error;
  }

  try {
    spinner.start('Save snapshot');
    await writeSnapshotFile(context.snapshot);
    spinner.clear();
  } catch (error) {
    spinner.fail();
    throw error;
  }

  spinner.succeed('Done!');
};
