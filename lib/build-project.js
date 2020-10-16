const { execSync, spawn } = require('child_process');
const onExit = require('signal-exit');

module.exports = function buildProject(buildCommand) {
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = buildCommand ? buildCommand.split(' ') : [];

    const child = spawn(
      cmd || 'npm',
      args.length ? args : ['run', 'build-production'],
      {
        // detached here for correct stopping the whole process branch on non-Windows systems
        // for Windows `taskkill` is used
        detached: process.platform !== 'win32',
        stdio: 'ignore',
        env: buildCommand
          ? process.env
          : {
            ...process.env,
            NO_HASH: true,
          },
      },
    );

    let removeExitListener = null;

    if (child.pid) {
      removeExitListener = onExit(() => {
        if (process.platform === 'win32') {
          execSync(`taskkill /PID ${child.pid} /T /F`);
        } else {
          // `-` right before the PID is for killing not only the process itself
          // but for killing its children too
          process.kill(-child.pid);
        }
      });
    }

    child.on('error', reject);
    child.on('close', code => {
      if (code) reject(new Error(`Process exited with status code: ${code}`));
      if (removeExitListener) removeExitListener();
      resolve();
    });
  });
};
