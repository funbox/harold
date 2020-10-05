const Listr = require('listr');

const buildProject = require('../lib/build-project');
const generateSnapshot = require('../lib/generate-snapshot');
const writeSnapshotFile = require('../lib/write-snapshot-file');

module.exports = function takeSnapshot() {
  const tasks = new Listr([
    {
      title: 'Taking a snapshot...',
      task: () => new Listr([
        {
          title: 'Build project',
          task: context => buildProject()
            .then(buildTime => (context.buildTime = buildTime)),
        },
        {
          title: 'Generate snapshot',
          task: context => generateSnapshot(context)
            .then(snapshot => (context.snapshot = snapshot)),
        },
        {
          title: 'Save snapshot',
          task: context => writeSnapshotFile(context),
        },
      ]),
    },
  ]);

  tasks.run()
    // .then(context => console.log(context))
    .catch(error => console.error(error));
};
