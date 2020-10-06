const fg = require('fast-glob');
const gzipSize = require('gzip-size');
const path = require('path');

// eslint-disable-next-line import/no-dynamic-require
const projectPackageJson = require(path.resolve(process.cwd(), 'package.json'));

const FILTER_REGEXP = {
  CSS: /\.css$/,
  FONTS: /\.(woff|woff2|ttf|otf|eot)$/,
  IMAGES: /\.(png|jpg|jpeg|gif|svg|webp)$/,
  JS: /^((?!legacy).)*\.js$/,
  JS_LEGACY: /legacy.*\.js$/,
  VIDEOS: /\.(test)$/,
};

module.exports = function generateSnapshot(context, buildPath = 'public') {
  return new Promise(resolve => {
    const { buildTime } = context;

    const directoriesPaths = [
      buildPath,
      ...fg.sync(`${buildPath}/**/*`, { onlyDirectories: true }),
    ];

    const fileTree = generateFileTree(directoriesPaths);

    const cssFileTree = filterByType(fileTree, FILTER_REGEXP.CSS);
    const fontsFileTree = filterByType(fileTree, FILTER_REGEXP.FONTS);
    const imagesFileTree = filterByType(fileTree, FILTER_REGEXP.IMAGES);
    const jsFileTree = filterByType(fileTree, FILTER_REGEXP.JS);
    const jsLegacyFileTree = filterByType(fileTree, FILTER_REGEXP.JS_LEGACY);
    const videosFileTree = filterByType(fileTree, FILTER_REGEXP.VIDEOS);

    const total = {
      all: calculateTotal(fileTree),
      css: calculateTotal(cssFileTree),
      fonts: calculateTotal(fontsFileTree),
      images: calculateTotal(imagesFileTree),
      js: calculateTotal(jsFileTree),
      jsLegacy: calculateTotal(jsLegacyFileTree),
      videos: calculateTotal(videosFileTree),
    };

    resolve({
      name: projectPackageJson.name,
      date: new Date().toISOString(),
      buildTime,
      total,
      fileTree,
    });
  });
};

function calculateTotal(arr) {
  const init = { files: 0, size: 0, gzipSize: 0 };

  return arr.reduce((acc, item) => ({
    ...acc,
    files: acc.files + item.files.length,
    size: acc.size + item.size,
    gzipSize: acc.gzipSize + item.gzipSize,
  }), init);
}

function filterByType(arr, regexp) {
  return arr
    .map(item => {
      const files = item.files.filter(file => regexp.test(file.path));

      return files.length ? {
        path: item.path,
        size: files.reduce((acc, file) => acc + file.size, 0),
        gzipSize: files.reduce((acc, file) => acc + file.gzipSize, 0),
        files,
      } : null;
    })
    .filter(Boolean);
}

function generateFileTree(arr) {
  return arr.map(dir => {
    const dirFiles = fg.sync(`${dir}/*`, { stats: true })
      .map(file => ({
        path: file.path,
        size: file.stats.size,
        gzipSize: gzipSize.fileSync(file.path),
      }));

    return {
      path: dir,
      size: dirFiles.reduce((acc, file) => acc + file.size, 0),
      gzipSize: dirFiles.reduce((acc, file) => acc + file.gzipSize, 0),
      files: dirFiles,
    };
  });
}
