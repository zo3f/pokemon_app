/**
 * Application configuration
 * Centralizes all configuration values and environment variables
 */

require('dotenv').config();

module.exports = {
  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },

  // Paths configuration
  paths: {
    romsDir: process.env.ROMS_DIR || require('path').join(__dirname, '..', 'data', 'roms'),
    publicDir: process.env.PUBLIC_DIR || require('path').join(__dirname, '..', 'public'),
    dbPath: process.env.DB_PATH || require('path').join(__dirname, '..', 'data.sqlite'),
  },

  // Security configuration
  security: {
    cors: {
      origin: process.env.CORS_ORIGIN 
        ? process.env.CORS_ORIGIN.split(',')
        : [/^http:\/\/localhost(:\d+)?$/, /^http:\/\/127\.0\.0\.1(:\d+)?$/],
      methods: ['GET', 'POST'],
    },
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    },
  },

  // API configuration
  api: {
    maxRomNameLength: 255,
  },
};

