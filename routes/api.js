/**
 * API routes
 * Handles all /api/* endpoints
 */

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { logRomPlay, getRomStats } = require('../db');
const { AppError } = require('../middleware/errorHandler');
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
 */
router.get('/roms', async (req, res, next) => {
  try {
    const files = await fs.readdir(config.paths.romsDir);
    const roms = files.filter((name) => name.toLowerCase().endsWith('.gba'));
    res.json({ roms });
  } catch (err) {
    if (err.code === 'ENOENT') {
      // Directory doesn't exist, return empty list
      return res.json({ roms: [] });
    }
    next(new AppError('Failed to list ROMs.', 500));
  }
});

/**
 * POST /api/rom-play
 * Log a ROM play event
 */
router.post('/rom-play', (req, res, next) => {
  const { romName } = req.body || {};

  // Validate input
  if (!romName || typeof romName !== 'string') {
    return next(new AppError('ROM name is required.', 400));
  }

  if (romName.length > config.api.maxRomNameLength) {
    return next(new AppError('ROM name is too long.', 400));
  }

  // Sanitize filename to prevent directory traversal
  const sanitizedName = path.basename(romName);
  if (sanitizedName !== romName) {
    return next(new AppError('Invalid ROM name.', 400));
  }

  logRomPlay(sanitizedName);
  res.status(201).json({ ok: true });
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

