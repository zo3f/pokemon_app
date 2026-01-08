/**
 * Input validation middleware
 * Provides reusable validation functions following security best practices
 */

const { AppError } = require('./errorHandler');

/**
 * Validate ROM filename
 * Prevents path traversal, XSS, and injection attacks
 */
const validateRomName = (romName) => {
  if (!romName || typeof romName !== 'string') {
    throw new AppError('ROM name is required.', 400);
  }

  if (romName.length === 0 || romName.length > 255) {
    throw new AppError('ROM name length is invalid.', 400);
  }

  // Prevent path traversal
  if (romName.includes('..') || romName.includes('/') || romName.includes('\\')) {
    throw new AppError('Invalid ROM name format.', 400);
  }

  // Only allow safe characters: alphanumeric, spaces, hyphens, underscores, dots
  if (!/^[a-zA-Z0-9\s._-]+\.gba$/i.test(romName)) {
    throw new AppError('ROM name contains invalid characters.', 400);
  }

  return true;
};

/**
 * Sanitize string input
 * Removes potentially dangerous content
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/<iframe/gi, '')
    .replace(/<object/gi, '')
    .replace(/<embed/gi, '')
    .trim();
};

/**
 * Validate and sanitize request body
 */
const validateRequestBody = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    // Ensure body is a plain object, not an array
    if (Array.isArray(req.body)) {
      return next(new AppError('Invalid request format.', 400));
    }

    // Limit object depth to prevent deep nesting attacks
    const checkDepth = (obj, depth = 0) => {
      if (depth > 5) {
        throw new AppError('Request structure too complex.', 400);
      }
      if (obj && typeof obj === 'object') {
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            checkDepth(obj[key], depth + 1);
          }
        }
      }
    };

    try {
      checkDepth(req.body);
    } catch (err) {
      return next(err);
    }
  }

  next();
};

module.exports = {
  validateRomName,
  sanitizeString,
  validateRequestBody,
};

