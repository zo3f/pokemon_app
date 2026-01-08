/**
 * Global error handler middleware
 * Follows Express.js best practices for error handling
 */

const { logSecurityEvent } = require('../db');
const config = require('../config');

/**
 * Custom error class for application-specific errors
 */
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global error handler middleware
 * Must be placed after all routes
 */
const errorHandler = (err, req, res, next) => {
  const { statusCode = 500, message } = err;

  // Log non-operational errors (programming errors)
  if (!err.isOperational) {
    console.error('Unexpected error:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  }

  // Log security-relevant errors
  if (statusCode >= 400) {
    logSecurityEvent('http_error', JSON.stringify({
      statusCode,
      path: req.path,
      method: req.method,
      message: err.message,
    }));
  }

  // Don't leak error details in production
  const errorMessage = config.server.env === 'production' && statusCode === 500
    ? 'Internal server error.'
    : message;

  res.status(statusCode).json({
    error: errorMessage,
    ...(config.server.env === 'development' && { stack: err.stack }),
  });
};

/**
 * 404 handler for undefined routes
 */
const notFoundHandler = (req, res, next) => {
  const err = new AppError(`Route ${req.originalUrl} not found`, 404);
  next(err);
};

module.exports = {
  AppError,
  errorHandler,
  notFoundHandler,
};

