/*
Logger class for easy and aesthetically pleasing console logging
*/
const chalk = require('chalk');
const moment = require('moment');

exports.log = (content, type = 'log') => {
  const timestamp = `[${moment().format('YYYY-MM-DD HH:mm:ss')}]:`;

  const types = {
    log: `${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content}`,
    warn: `${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${content}`,
    error: `${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content}`,
    debug: `${timestamp} ${chalk.green(type.toUpperCase())} ${content}`,
    cmd: `${timestamp} ${chalk.black.bgWhite(type.toUpperCase())} ${content}`,
    ready: `${timestamp} ${chalk.black.bgGreen(type.toUpperCase())} ${content}`
  };

  const log = types[type];

  if (!log) {
    throw new Error('Logger type must be either log, warn, error, debug, cmd or ready.');
  }

  console.log(log);
};

exports.warn = (...args) => this.log(...args, 'warn');
exports.error = (...args) => this.log(...args, 'error');
exports.debug = (...args) => this.log(...args, 'debug');
exports.cmd = (...args) => this.log(...args, 'cmd');
exports.ready = (...args) => this.log(...args, 'ready');
