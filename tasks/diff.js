const fs = require('fs');
const { EOL } = require('os');
const path = require('path');

const diffTotal = require('../lib/diff-total');
const printSnapshotInfo = require('../lib/print-snapshot-info');

module.exports = function diff(left, right) {
  const leftPath = path.resolve(left);
  const rightPath = path.resolve(right);

  const leftBuffer = fs.readFileSync(leftPath);
  const rightBuffer = fs.readFileSync(rightPath);

  if (leftBuffer.equals(rightBuffer)) {
    console.log('Snapshots are equal');
    process.exit(0);
  }

  const leftSnapshot = JSON.parse(leftBuffer.toString());
  const rightSnapshot = JSON.parse(rightBuffer.toString());

  console.log(EOL);

  // Snapshots info
  console.log('Snapshots:');
  printSnapshotInfo(leftSnapshot, 'L');
  printSnapshotInfo(rightSnapshot, 'R');

  console.log(EOL);

  // Total diff
  console.log('Overall differences by category:');
  console.log(diffTotal({
    left: leftSnapshot.total,
    right: rightSnapshot.total,
    leftCaption: path.parse(leftPath).name,
    rightCaption: path.parse(rightPath).name,
  }));
};
