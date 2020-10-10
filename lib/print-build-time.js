const { colorize } = require('@funboxteam/diamonds');
const convertHrtime = require('convert-hrtime');

const getPlural = require('./get-plural');

module.exports = function printBuildTime(left, right) {
  if (!left || !right) {
    console.log('', 'Build time is not provided');
    return;
  }

  const leftBuildTime = Math.round(convertHrtime(left).seconds);
  const rightBuildTime = Math.round(convertHrtime(right).seconds);

  const diff = rightBuildTime - leftBuildTime;
  const diffPretty = `${getSeconds(Math.abs(diff))} ${diff > 0 ? 'slower' : 'faster'}`;

  const color = diff > 0 ? 'red' : 'reset';

  console.log(
    '',
    diff === 0
      ? `No changes (${getSeconds(leftBuildTime)})`
      : colorize(
        diffPretty,
        `(Left: ${getSeconds(leftBuildTime)},`,
        `Right: ${getSeconds(rightBuildTime)})`,
      )[color],
  );
};

function getSeconds(num) {
  return `${num} ${getPlural(num, 'second')}`;
}
