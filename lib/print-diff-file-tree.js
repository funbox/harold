const prettyBytes = require('pretty-bytes');

const colorize = require('./colorize');

module.exports = function printDiffFileTree(left, right) {
  const isEquals = Buffer.from(JSON.stringify(right))
    .equals(Buffer.from(JSON.stringify(left)));

  if (isEquals) {
    console.log('', 'No changes');
    return;
  }

  const newItems = diffByPath('+', right, left);
  const deletedItems = diffByPath('-', left, right);
  const modifiedItems = diffBySize(left, right);

  printDiff([...newItems, ...deletedItems, ...modifiedItems]);
};

function printDiff(logItems) {
  logItems
    .sort((a, b) => a.path.localeCompare(b.path))
    .forEach(item => {
      let color = 'reset';

      if (item.type === '-') {
        color = 'red';
      } else if (item.type === '+') {
        color = 'green';
      }

      console.log(
        '',
        colorize(
          item.type,
          `${item.path}:`,
          item.size,
          `(${item.gzipSize})`,
        )[color],
      );
    });
}

function diffBySize(left, right) {
  return right.reduce((acc, rightItem) => {
    const leftItem = left.find(i => i.path === rightItem.path);

    if (leftItem && rightItem.size - leftItem.size !== 0) {
      acc.push(getLogItem('m', leftItem, rightItem));
    }

    return acc;
  }, []);
}

function diffByPath(type, first, second) {
  return first.reduce((acc, firstItem) => {
    const isNotExist = !second.find(i => i.path === firstItem.path);

    if (isNotExist) {
      acc.push(getLogItem(type, firstItem));
    }

    return acc;
  }, []);
}

function getLogItem(type, left, right) {
  return {
    type,
    path: left.path,
    size: right
      ? prettyBytes(right.size - left.size, { signed: true })
      : prettyBytes(left.size),
    gzipSize: right
      ? prettyBytes(right.gzipSize - left.gzipSize, { signed: true })
      : prettyBytes(left.gzipSize),
  };
}
