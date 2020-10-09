const { colorize, getPlural } = require('@funboxteam/diamonds');
const convertHrtime = require('convert-hrtime');

module.exports = function printBuildTime(left, right) {
  const leftBuildTime = Math.round(convertHrtime(left.buildTime).seconds);
  const rightBuildTime = Math.round(convertHrtime(right.buildTime).seconds);

  const diff = rightBuildTime - leftBuildTime;
  const diffPretty = diff > 0
    ? `${Math.abs(diff)} ${getPluralSeconds(diff)} slower`
    : `${Math.abs(diff)} ${getPluralSeconds(diff)} faster`;

  const color = diff > 0 ? 'red' : 'reset';

  console.log('', colorize(`${diffPretty} (L: ${leftBuildTime} \
${getPluralSeconds(leftBuildTime)}, R: ${rightBuildTime} \
${getPluralSeconds(rightBuildTime)})`)[color]);
};

function getPluralSeconds(num) {
  return getPlural(num, 'second', 'seconds', 'seconds');
}
