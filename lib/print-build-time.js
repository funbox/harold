const { colorize } = require('@funboxteam/diamonds');

const convertHrtime = require('./convert-hrtime');
const getPlural = require('./get-plural');

module.exports = function printBuildTime(left, right) {
  if (!left || !right) {
    console.log('', 'Build time is not provided');
    return;
  }

  const leftBuildTime = Math.round(convertHrtime(left).seconds);
  const rightBuildTime = Math.round(convertHrtime(right).seconds);

  const diff = rightBuildTime - leftBuildTime;

  if (diff === 0) {
    console.log('', `No changes (${formatSeconds(leftBuildTime)})`);
    return;
  }

  const diffPretty = `${formatSeconds(Math.abs(diff))} ${diff > 0 ? 'slower' : 'faster'}`;
  const color = diff > 0 ? 'red' : 'green';

  console.log(
    '',
    colorize(
      diffPretty,
      `(Left: ${formatSeconds(leftBuildTime)},`,
      `Right: ${formatSeconds(rightBuildTime)})`,
    )[color],
  );
};

function formatSeconds(num) {
  return `${num} ${getPlural(num, 'second', 'seconds')}`;
}
