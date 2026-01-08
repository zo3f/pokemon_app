/**
 * API routes
 * Handles all /api/* endpoints
 */

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { logRomPlay, getRomStats } = require('../db');
const { AppError } = require('../middleware/errorHandler');
const { validateRomName } = require('../middleware/validation');
const config = require('../config');

const router = express.Router();

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.server.env,
  });
});

/**
 * GET /api/roms
 * List all available ROM files
 * Security: Path validation and file type filtering
 */
router.get('/roms', async (req, res, next) => {
  try {
    // Validate ROMs directory path to prevent directory traversal
    const resolvedPath = path.resolve(config.paths.romsDir);
    const basePath = path.resolve(require('path').join(__dirname, '..', 'data', 'roms'));
    
    if (!resolvedPath.startsWith(basePath)) {
      return next(new AppError('Invalid path configuration.', 500));
    }

    const files = await fs.readdir(resolvedPath);
    
    // Filter and sanitize filenames
    const roms = files
      .filter((name) => {
        // Only allow .gba files
        if (!name.toLowerCase().endsWith('.gba')) return false;
        // Prevent path traversal
        if (name.includes('..') || name.includes('/') || name.includes('\\')) return false;
        // Validate filename format
        return /^[a-zA-Z0-9\s._-]+\.gba$/i.test(name);
      })
      .sort(); // Sort alphabetically for consistent output

    res.json({ roms });
  } catch (err) {
    if (err.code === 'ENOENT') {
      // Directory doesn't exist, return empty list
      return res.json({ roms: [] });
    }
    // Don't leak internal error details
    console.error('Failed to list ROMs:', err.message);
    next(new AppError('Failed to list ROMs.', 500));
  }
});

/**
 * POST /api/rom-play
 * Log a ROM play event
 * Security: Input validation, sanitization, and path traversal prevention
 */
router.post('/rom-play', (req, res, next) => {
  try {
    const { romName } = req.body || {};

    // Validate using centralized validation function
    validateRomName(romName);

    // Additional sanitization
    const sanitizedName = path.basename(romName);

    logRomPlay(sanitizedName);
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/rom-stats
 * Get ROM play statistics
 */
router.get('/rom-stats', (req, res, next) => {
  getRomStats((err, rows) => {
    if (err) {
      return next(new AppError('Failed to get statistics.', 500));
    }
    res.json({ data: rows });
  });
});

module.exports = router;

