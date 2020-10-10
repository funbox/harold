const { colorize } = require('@funboxteam/diamonds');
const prettyBytes = require('pretty-bytes');

module.exports = function printDiffFileTree(left, right) {
  const isEquals = Buffer.from(JSON.stringify(right))
    .equals(Buffer.from(JSON.stringify(left)));

  if (isEquals) {
    console.log('', 'No changes');
    return;
  }

  [
    ...getNewDirs(left, right),
    ...getDeletedAndModifiedDirs(left, right),
  ]
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
          `${item.type} ${item.path}: ${item.size} (${item.gzipSize})`,
        )[color],
      );
    });
};

function getDeletedAndModifiedDirs(left, right) {
  return left.reduce((acc, leftDir) => {
    const rightDir = right.find(dir => dir.path === leftDir.path);

    if (!rightDir) {
      // Deleted
      acc.push(
        getLogItem('-', leftDir),
        ...(leftDir.files || []).map(file => getLogItem('-', file)),
      );
    } else if (leftDir.size !== rightDir.size) {
      acc.push(
        // Modified
        getLogItem('m', leftDir, rightDir),
        // Find files
        ...getDirFiles(leftDir.files, rightDir.files),
      );
    }

    return acc;
  }, []);
}

function getDirFiles(left, right) {
  const files = left.reduce((acc, leftFile) => {
    const rightFile = (right || []).find(i => i.path === leftFile.path);

    if (!rightFile) {
      // Deleted
      acc.push(getLogItem('-', leftFile));
    } else if (leftFile.size !== rightFile.size) {
      // Modified
      acc.push(getLogItem('m', leftFile, rightFile));
    }

    return acc;
  }, []);

  const newFiles = right.reduce((acc, rightFile) => {
    const isNew = !left.filter(file => file.path === rightFile.path).length;

    if (isNew) {
      // New
      acc.push(getLogItem('+', rightFile));
    }

    return acc;
  }, []);

  return [...files, ...newFiles];
}

function getNewDirs(left, right) {
  return right.reduce((acc, newDir) => {
    const isNew = !left.filter(dir => dir.path === newDir.path).length;

    if (isNew) {
      acc.push(
        getLogItem('+', newDir),
        ...(newDir.files || []).map(file => getLogItem('+', file)),
      );
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
