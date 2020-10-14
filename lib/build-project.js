const { exec } = require('child_process');

module.exports = function buildProject() {
  return new Promise((resolve, reject) => {
    exec('NO_HASH=true npm run build-production', error => {
      if (error) reject(error);
      resolve();
    });
  });
};
