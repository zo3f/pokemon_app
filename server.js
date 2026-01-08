/**
 * Main server file
 * Express.js application entry point following best practices
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const { helmetConfig, corsConfig, apiLimiter } = require('./middleware/security');
const { validateRequestBody } = require('./middleware/validation');
const apiRoutes = require('./routes/api');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();

// Ensure ROM directory exists
if (!fs.existsSync(config.paths.romsDir)) {
  fs.mkdirSync(config.paths.romsDir, { recursive: true });
  console.log('Created ROMs directory:', config.paths.romsDir);
}

// Security middleware (order matters!)
app.disable('x-powered-by');
app.use(helmetConfig);
app.use(corsConfig);

// Body parsing middleware with size limits
app.use(express.json({ 
  limit: '10mb',
  strict: true, // Only parse arrays and objects
  type: 'application/json',
}));
app.use(express.urlencoded({ 
  extended: false, // Use querystring library (more secure)
  limit: '10mb',
  parameterLimit: 100, // Limit number of parameters
}));

// Request size limiter (before routes)
const { requestSizeLimiter, sanitizeInput, postLimiter } = require('./middleware/security');
app.use(requestSizeLimiter);

// Input sanitization and validation for all routes
app.use(sanitizeInput);
app.use(validateRequestBody);

// Rate limiting for API routes
app.use('/api', apiLimiter);

// Serve static files with proper headers
app.use(
  express.static(config.paths.publicDir, {
    maxAge: config.server.env === 'production' ? '1h' : '0',
    setHeaders: (res, filePath) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
    },
  })
);

// Serve ROM files
app.use(
  '/roms',
  express.static(config.paths.romsDir, {
    immutable: true,
    maxAge: '1y',
    index: false,
    setHeaders: (res) => {
      res.setHeader('Content-Type', 'application/octet-stream');
    },
  })
);

// API routes
app.use('/api', apiRoutes);

// Apply stricter rate limiting to POST endpoints
const { postLimiter } = require('./middleware/security');
app.use('/api/rom-play', postLimiter);

// SPA fallback - serve index.html for non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(config.paths.publicDir, 'index.html'));
});

// 404 handler
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const server = app.listen(config.server.port, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║  Bulbasaur's World - GBA Playground                 ║
║  Server running at http://localhost:${config.server.port}${' '.repeat(25 - String(config.server.port).length)}║
║  Environment: ${config.server.env}${' '.repeat(40 - config.server.env.length)}║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\nSIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

module.exports = app;
