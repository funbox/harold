const fs = require('fs');

module.exports = function writeSnapshotFile(snapshot, filename = null) {
  return new Promise((resolve, reject) => {
    if (!filename) {
      const currentDate = new Date();
      const date = currentDate.toISOString()
        .slice(0, 10).replace(/\D/g, '');
      const time = currentDate.toISOString()
        .slice(11, 19).replace(/\D/g, '');

      filename = `harold_snapshot_${date}_${time}.json`;
    }

    const output = JSON.stringify(snapshot, null, '  ');

    fs.writeFile(filename, output, error => {
      if (error) reject(error);

      resolve(`${filename} has been saved`);
    });
  });
};
