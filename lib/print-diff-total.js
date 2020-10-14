const { colorize: c } = require('@funboxteam/diamonds');
const Table = require('cli-table3');
const prettyBytes = require('pretty-bytes');

const getPlural = require('./get-plural');

module.exports = function printDiffTotal({ left, right, leftCaption, rightCaption } = {}) {
  const isEqual = Buffer.from(JSON.stringify(right))
    .equals(Buffer.from(JSON.stringify(left)));

  if (isEqual) {
    console.log('', 'No changes');
    return;
  }

  const table = new Table({
    wordWrap: true,
    style: { compact: false, head: [] },
    head: ['', c(leftCaption).dim, c(rightCaption).dim, c('Changes').dim],
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
    generateTableRow('All', left.all, right.all),
    generateTableRow('JS', left.js, right.js),
    generateTableRow('JS (legacy)', left.jsLegacy, right.jsLegacy),
    generateTableRow('CSS', left.css, right.css),
    generateTableRow('Images', left.images, right.images),
    generateTableRow('Fonts', left.fonts, right.fonts),
    generateTableRow('Videos', left.videos, right.videos),
  );

  console.log(table.toString());
};

function generateTableRow(name, left, right) {
  const sizeResult = right.size - left.size;
  const gzipSizeResult = right.gzipSize - left.gzipSize;
  const filesResult = right.files - left.files;

  const sizeResultPretty = prettyBytes(sizeResult, { signed: true });
  const gzipSizeResultPretty = prettyBytes(gzipSizeResult, { signed: true });
  const filesResultPretty = `${filesResult > 0 ? '+' : ''}${filesResult} \
${getPlural(filesResult, 'item', 'items')}`;

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
