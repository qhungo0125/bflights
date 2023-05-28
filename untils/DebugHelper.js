const debug = require('debug');

const createDebug = function (moduleName) {
  return debug(`blights::${moduleName}`);
};

module.exports = { createDebug };
