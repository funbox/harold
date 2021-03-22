const { execSync } = require('child_process');
const fg = require('fast-glob');
const fs = require('fs');
const gzipSize = require('gzip-size');
const path = require('path');

const projectPackageJsonPath = path.resolve(process.cwd(), 'package.json');
const projectPackageJson = fs.existsSync(projectPackageJsonPath)
  // eslint-disable-next-line import/no-dynamic-require
  ? require(projectPackageJsonPath)
  : {};

const FILTER_REGEXP = {
  CSS: /\.css$/,
  FONTS: /\.(woff|woff2|ttf|otf|eot)$/,
  IMAGES: /\.(png|jpg|jpeg|gif|svg|webp)$/,
  JS: /^((?!legacy).)*\.js$/,
  JS_LEGACY: /legacy.*\.js$/,
  VIDEOS: /\.(mp4|webm)$/,
};

module.exports = function generateSnapshot(buildPath, buildTime) {
  if (!fs.statSync(buildPath).isDirectory()) {
    throw new Error(`'${buildPath}' is not a directory`);
  }

  const dirPaths = [
    path.join(buildPath, '/'),
    ...fg.sync(`${buildPath}**/**/*`, {
      onlyDirectories: true,
      markDirectories: true,
    }),
  ];

  const dirsWithFiles = getDirsWithFiles(dirPaths);

  const dirsWithCssFiles = filterByRegexp(dirsWithFiles, FILTER_REGEXP.CSS);
  const dirsWithFontFiles = filterByRegexp(dirsWithFiles, FILTER_REGEXP.FONTS);
  const dirsWithImageFiles = filterByRegexp(dirsWithFiles, FILTER_REGEXP.IMAGES);
  const dirsWithJsFiles = filterByRegexp(dirsWithFiles, FILTER_REGEXP.JS);
  const dirsWithJsLegacyFiles = filterByRegexp(dirsWithFiles, FILTER_REGEXP.JS_LEGACY);
  const dirsWithVideoFiles = filterByRegexp(dirsWithFiles, FILTER_REGEXP.VIDEOS);

  const total = {
    all: calculateTotal(dirsWithFiles),
    css: calculateTotal(dirsWithCssFiles),
    fonts: calculateTotal(dirsWithFontFiles),
    images: calculateTotal(dirsWithImageFiles),
    js: calculateTotal(dirsWithJsFiles),
    jsLegacy: calculateTotal(dirsWithJsLegacyFiles),
    videos: calculateTotal(dirsWithVideoFiles),
  };

  total.other = calculateTotalOther(total);

  const currentGitRef = getCurrentGitRef();

  return {
    project: projectPackageJson.name || 'unknown',
    ...currentGitRef ? { gitRef: currentGitRef } : {},
    date: new Date().toISOString(),
    buildTime,
    total,
    fsEntries: flattenDirs(dirsWithFiles),
  };
};

function flattenDirs(dirs) {
  return dirs.reduce((acc, dir) => {
    acc.push(
      {
        path: dir.path,
        size: dir.size,
        gzipSize: dir.gzipSize,
      },
      ...dir.files,
    );

    return acc;
  }, []);
}

function getCurrentGitRef() {
  try {
    const gitBranch = execSync('git branch --show-current');
    const currentBranch = gitBranch.toString().trim();

    if (currentBranch) return currentBranch;

    const gitRevParse = execSync('git rev-parse HEAD');

    return gitRevParse.toString().trim().substring(0, 6);
  } catch (error) {
    return null;
  }
}

function calculateTotalOther(total) {
  const categoriesTotal = Object.keys(total).reduce((acc, key) => {
    if (key === 'all') return acc;

    acc.files += total[key].files;
    acc.size += total[key].size;
    acc.gzipSize += total[key].gzipSize;

    return acc;
  }, { files: 0, size: 0, gzipSize: 0 });

  return {
    files: total.all.files - categoriesTotal.files,
    size: total.all.size - categoriesTotal.size,
    gzipSize: total.all.gzipSize - categoriesTotal.gzipSize,
  };
}

function calculateTotal(dirs) {
  const init = { files: 0, size: 0, gzipSize: 0 };

  return dirs.reduce((acc, dir) => ({
    ...acc,
    files: acc.files + dir.files.length,
    size: acc.size + dir.size,
    gzipSize: acc.gzipSize + dir.gzipSize,
  }), init);
}

function filterByRegexp(dirs, regexp) {
  return dirs
    .map(dir => {
      const files = dir.files.filter(file => regexp.test(file.path));

      return files.length ? generateDirectoryObject(dir.path, files) : null;
    })
    .filter(Boolean);
}

function getDirsWithFiles(dirs) {
  return dirs.map(dir => {
    const dirFiles = fg.sync(`${dir}**/**/*`, { stats: true })
      .map(file => ({
        path: file.path,
        size: file.stats.size,
        gzipSize: gzipSize.fileSync(file.path),
      }));

    return generateDirectoryObject(dir, dirFiles);
  });
}

function generateDirectoryObject(dirPath, files) {
  return {
    path: dirPath,
    size: files.reduce((acc, file) => acc + file.size, 0),
    gzipSize: files.reduce((acc, file) => acc + file.gzipSize, 0),
    files,
  };
}
