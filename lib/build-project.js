const { exec } = require('child_process');

module.exports = function buildProject() {
  const buildTime = process.hrtime();

  return new Promise((resolve, reject) => {
    exec('NO_HASH=true npm run build-production', error => {
      if (error) reject(new Error(`Error: ${error}`));

      resolve(process.hrtime(buildTime));
    });
  });
};
