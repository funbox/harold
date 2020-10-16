const { exec } = require('child_process');

module.exports = function buildProject(cmd = 'NO_HASH=true npm run build-production') {
  return new Promise((resolve, reject) => {
    exec(cmd, error => {
      if (error) reject(error);
      resolve();
    });
  });
};
