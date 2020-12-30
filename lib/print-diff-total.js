const Table = require('cli-table3');
const { EOL } = require('os');
const prettyBytes = require('pretty-bytes');

const c = require('./colorize');
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
    style: {
      compact: false,
      head: [],
      ...process.stdout.isTTY ? {} : { border: [] },
    },
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
    generateTableRow('JS', left.js, right.js),
    generateTableRow('JS (legacy)', left.jsLegacy, right.jsLegacy),
    generateTableRow('CSS', left.css, right.css),
    generateTableRow('Images', left.images, right.images),
    generateTableRow('Fonts', left.fonts, right.fonts),
    generateTableRow('Videos', left.videos, right.videos),
    generateTableRow('Other', left.other, right.other),
    generateTableRow(`${EOL}Total`, left.all, right.all),
  );

  console.log(table.toString());
};

function generateTableRow(name, left, right) {
  const sizeDiff = right.size - left.size;
  const gzipSizeDiff = right.gzipSize - left.gzipSize;
  const filesDiff = right.files - left.files;

  const sizeDiffPretty = prettyBytes(sizeDiff, { signed: true });
  const gzipSizeDiffPretty = prettyBytes(gzipSizeDiff, { signed: true });
  const filesDiffPretty = `${filesDiff > 0 ? '+' : ''}${filesDiff} \
${getPlural(filesDiff, 'item', 'items')}`;

  const result = `${sizeDiffPretty} (${gzipSizeDiffPretty})\
${filesDiff === 0 ? '' : `, ${filesDiffPretty}`}`;
  const resultColor = sizeDiff > 0 || gzipSizeDiff > 0 ? 'red' : 'green';

  const hasChanges = left.size !== right.size
    || left.gzipSize !== right.gzipSize
    || left.files !== right.files;

  return {
    [c(name).dim]: [
      { content: getPrettySizes(left), vAlign: 'center' },
      { content: getPrettySizes(right), vAlign: 'center' },
      { content: hasChanges ? c(result)[resultColor] : c('No changes').dim, vAlign: 'center' },
    ],
  };
}

function getPrettySizes(total) {
  return total.size !== total.gzipSize
    ? `${prettyBytes(total.size)} (${prettyBytes(total.gzipSize)})`
    : prettyBytes(total.size);
}
