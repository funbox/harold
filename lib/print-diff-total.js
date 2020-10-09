const { colorize: c, getPlural } = require('@funboxteam/diamonds');
const Table = require('cli-table3');
const prettyBytes = require('pretty-bytes');

module.exports = function printDiffTotal({ left, right, leftCaption = 'Left', rightCaption = 'Right' } = {}) {
  const table = new Table({
    wordWrap: true,
    style: { compact: false, head: [] },
    head: [
      '',
      c(leftCaption).dim,
      c(rightCaption).dim,
      c('Changes').dim,
    ],
    chars: {
      top: '—',
      'top-mid': '—',
      'top-left': ' ',
      'top-right': ' ',
      bottom: '—',
      'bottom-mid': '—',
      'bottom-left': ' ',
      'bottom-right': ' ',
      left: ' ',
      'left-mid': ' ',
      mid: '—',
      'mid-mid': '—',
      right: ' ',
      'right-mid': ' ',
      middle: ' ',
    },
  });

  table.push(
    getTableRow('All', left.all, right.all),
    getTableRow('JS', left.js, right.js),
    getTableRow('JS (legacy)', left.jsLegacy, right.jsLegacy),
    getTableRow('CSS', left.css, right.css),
    getTableRow('Images', left.images, right.images),
    getTableRow('Fonts', left.fonts, right.fonts),
    getTableRow('Videos', left.videos, right.videos),
  );

  console.log(table.toString());
};

function getTableRow(name, left, right) {
  const sizeResult = right.size - left.size;
  const gzipSizeResult = right.gzipSize - left.gzipSize;
  const filesResult = right.files - left.files;

  const sizeResultPretty = prettyBytes(sizeResult, { signed: true });
  const gzipSizeResultPretty = prettyBytes(gzipSizeResult, { signed: true });
  const filesResultPretty = `${filesResult > 0 ? '+' : ''}${filesResult} \
${getPlural(filesResult, 'item', 'items', 'items')}`;

  const result = `${sizeResultPretty} (${gzipSizeResultPretty})\
${filesResult === 0 ? '' : `, ${filesResultPretty}`}`;
  const resultColor = sizeResult > 0 || filesResult > 0 ? 'red' : 'green';

  const hasChanges = left.size !== right.size
    || left.gzipSize !== right.gzipSize
    || left.files !== right.files;

  return {
    [c(name).dim]: [
      getPrettySizes(left),
      getPrettySizes(right),
      hasChanges ? c(result)[resultColor] : c('No changes').dim,
    ],
  };
}

function getPrettySizes(total) {
  return total.size !== total.gzipSize
    ? `${prettyBytes(total.size)} (${prettyBytes(total.gzipSize)})`
    : prettyBytes(total.size);
}
