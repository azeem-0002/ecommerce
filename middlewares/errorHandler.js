const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error(err);
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const payload = { message };
  if (process.env.NODE_ENV !== 'production') payload.stack = err.stack;
  return res.status(status).json(payload);
}

module.exports = errorHandler;
