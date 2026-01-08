/**
 * Main server file
 * Express.js application entry point following best practices
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const { helmetConfig, corsConfig, apiLimiter } = require('./middleware/security');
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

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
