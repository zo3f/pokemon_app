/**
 * Security middleware configuration
 * Centralizes all security-related Express middleware
 */

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const config = require('../config');

/**
 * Configure Helmet with sensible defaults
 */
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Required for Babel standalone
        'https://unpkg.com',
        'https://cdn.emulatorjs.org',
      ],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", 'data:'],
      frameSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Required for EmulatorJS iframe
});

/**
 * Configure CORS
 */
const corsConfig = cors(config.security.cors);

/**
 * Rate limiting middleware for API routes
 */
const apiLimiter = rateLimit({
  windowMs: config.security.rateLimit.windowMs,
  max: config.security.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests. Please try again later.',
    });
  },
});

module.exports = {
  helmetConfig,
  corsConfig,
  apiLimiter,
};

