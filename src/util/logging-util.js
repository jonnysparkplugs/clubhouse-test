const versionDetails = require('../../package.json');

const { name, version } = versionDetails;

const LogLevels = {
  info: 'info',
  warn: 'warn',
  error: 'error'
};

let logger = console;

const logMessage = (logLevel, message, extraProps = {}, errorProps = {}) => {
  let logFn = logLevel;
  if (!Object.prototype.hasOwnProperty.call(LogLevels, logLevel)) {
    logFn = logLevel.info;
  }
  const extra = Object.create(null, {});
  Object.keys(extraProps).forEach((key) => {
    extra[`data-${key}`] = extraProps[key];
  });
  const error = Object.create(null, {});
  Object.keys(errorProps).forEach((key) => {
    error[`error-${key}`] = errorProps[key];
  });
  const logOutput = {
    timestamp: new Date().toISOString(),
    message,
    name,
    version,
    logLevel,
    ...extra,
    ...error
  };
  logger[logFn](`${JSON.stringify(logOutput)}`);
};

module.exports = { LogLevels, logMessage };
