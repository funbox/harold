module.exports = function colorize(...args) {
  const str = args.join(' ');
  const isTTY = Boolean(process.stdout.isTTY);

  return {
    dim: `${isTTY ? '\x1b[2m' : ''}${str}${isTTY ? '\x1b[22m' : ''}`,
    reset: `${isTTY ? '\x1b[0m' : ''}${str}${isTTY ? '\x1b[0m' : ''}`,

    black: `${isTTY ? '\x1b[30m' : ''}${str}${isTTY ? '\x1b[39m' : ''}`,
    blue: `${isTTY ? '\x1b[34m' : ''}${str}${isTTY ? '\x1b[39m' : ''}`,
    cyan: `${isTTY ? '\x1b[36m' : ''}${str}${isTTY ? '\x1b[39m' : ''}`,
    green: `${isTTY ? '\x1b[32m' : ''}${str}${isTTY ? '\x1b[39m' : ''}`,
    magenta: `${isTTY ? '\x1b[35m' : ''}${str}${isTTY ? '\x1b[39m' : ''}`,
    red: `${isTTY ? '\x1b[31m' : ''}${str}${isTTY ? '\x1b[39m' : ''}`,
    white: `${isTTY ? '\x1b[37m' : ''}${str}${isTTY ? '\x1b[39m' : ''}`,
    yellow: `${isTTY ? '\x1b[33m' : ''}${str}${isTTY ? '\x1b[39m' : ''}`,

    bgBlack: `${isTTY ? '\x1b[40m' : ''}${str}${isTTY ? '\x1b[0m' : ''}`,
    bgBlue: `${isTTY ? '\x1b[44m' : ''}${str}${isTTY ? '\x1b[0m' : ''}`,
    bgCyan: `${isTTY ? '\x1b[46m' : ''}${str}${isTTY ? '\x1b[0m' : ''}`,
    bgGreen: `${isTTY ? '\x1b[42m' : ''}${str}${isTTY ? '\x1b[0m' : ''}`,
    bgMagenta: `${isTTY ? '\x1b[45m' : ''}${str}${isTTY ? '\x1b[0m' : ''}`,
    bgRed: `${isTTY ? '\x1b[41m' : ''}${str}${isTTY ? '\x1b[0m' : ''}`,
    bgWhite: `${isTTY ? '\x1b[47m' : ''}${str}${isTTY ? '\x1b[0m' : ''}`,
    bgYellow: `${isTTY ? '\x1b[43m' : ''}${str}${isTTY ? '\x1b[0m' : ''}`,
  };
};
