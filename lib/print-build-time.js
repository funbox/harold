const convertHrtime = require('convert-hrtime');

const c = require('./colorize');

module.exports = function printBuildTime(left, right) {
  const leftBuildTime = Math.round(convertHrtime(left.buildTime).seconds);
  const rightBuildTime = Math.round(convertHrtime(right.buildTime).seconds);

  const diff = rightBuildTime - leftBuildTime;
  const diffPretty = `${diff > 0 ? `+${diff}` : diff} sec`;

  const color = diff > 0 ? 'red' : 'green';

  console.log('', c(`${diffPretty} (L: ${leftBuildTime} sec, R: ${rightBuildTime} sec)`)[color]);
};
