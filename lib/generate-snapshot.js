const fg = require('fast-glob');
const gzipSize = require('gzip-size');
const path = require('path');

module.exports = function generateSnapshot(context) {
  return new Promise(resolve => {
    const { buildTime = [] } = context;
    const buildPath = 'public';

    const directories = [
      buildPath,
      ...fg.sync(`${buildPath}/**/*`, { onlyDirectories: true }),
    ];

    const files = directories.map(dir => {
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

    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    const totalGzipSize = files.reduce((acc, file) => acc + file.gzipSize, 0);
    const totalFiles = files.reduce((acc, file) => acc + file.files.length, 0);

    // eslint-disable-next-line import/no-dynamic-require
    const projectPackageJson = require(path.resolve(process.cwd(), 'package.json'));

    resolve({
      name: projectPackageJson.name,
      buildTimeNs: buildTime[1],
      size: totalSize,
      gzipSize: totalGzipSize,
      filesCount: totalFiles,
      files,
    });
  });
};
