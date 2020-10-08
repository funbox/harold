const fs = require('fs');
const { EOL } = require('os');
const path = require('path');

const diffTotal = require('../lib/diff-total');

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
  const leftDate = new Date(leftSnapshot.date);
  const rightDate = new Date(rightSnapshot.date);

  console.log('Provided snapshots:');
  console.log(
    ' L:',
    leftDate.toLocaleDateString(),
    leftDate.toLocaleTimeString(),
    '•',
    leftSnapshot.name,
    `${leftSnapshot.branch ? `• ${leftSnapshot.branch}` : ''}`,
  );
  console.log(
    ' R:',
    rightDate.toLocaleDateString(),
    rightDate.toLocaleTimeString(),
    '•',
    rightSnapshot.name,
    `${rightSnapshot.branch ? `• ${rightSnapshot.branch}` : ''}`,
  );

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
