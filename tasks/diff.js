const fs = require('fs');
const path = require('path');

module.exports = function diff(left, right) {
  const leftSnapshotPath = path.resolve(left);
  const rightSnapshotPath = path.resolve(right);

  const leftSnapshotBuffer = fs.readFileSync(leftSnapshotPath);
  const rightSnapshotBuffer = fs.readFileSync(rightSnapshotPath);

  if (leftSnapshotBuffer.equals(rightSnapshotBuffer)) {
    console.log('Snapshots are equal');
    process.exit(0);
  }
};
