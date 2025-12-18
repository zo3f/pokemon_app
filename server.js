const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const { logRomPlay, logSecurityEvent, getRomStats } = require('./db');

const app = express();
const port = process.env.PORT || 3000;
// Use a "data" folder (as you created) to store ROMs on the server.
const romsDir = path.join(__dirname, 'data');

// Ensure the ROM directory exists so the API and static hosting work as expected.
if (!fs.existsSync(romsDir)) {
  fs.mkdirSync(romsDir, { recursive: true });
}

// Basic security hardening
app.disable('x-powered-by');
app.use(helmet());

// CORS: only allow same-origin and localhost frontends
app.use(
  cors({
    origin: [/^http:\/\/localhost(:\d+)?$/, /^http:\/\/127\.0\.0\.1(:\d+)?$/],
    methods: ['GET', 'POST'],
  })
);

// Rate limiting for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(express.json());

// Apply limiter to all /api routes
app.use('/api', apiLimiter);

// Middleware to serve static files
app.use(
  express.static('public', {
    maxAge: '1h',
    setHeaders: (res, filePath) => {
      // Simple hardening: no sniffing, and basic cache control is already set above.
      res.setHeader('X-Content-Type-Options', 'nosniff');
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  })
);

// Serve static ROM files from the local "roms" folder (click-and-play)
app.use(
  '/roms',
  express.static(romsDir, {
    immutable: true,
    maxAge: '1y',
    index: false,
  })
);

// Simple healthcheck
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Log a ROM play event into the SQLite database
app.post('/api/rom-play', (req, res) => {
  const { romName } = req.body || {};

  if (!romName || typeof romName !== 'string' || romName.length > 255) {
    logSecurityEvent('invalid_rom_name', JSON.stringify(req.body || {}));
    return res.status(400).json({ error: 'Invalid ROM name.' });
  }

  logRomPlay(romName);
  return res.status(201).json({ ok: true });
});

// Get ROM play statistics
app.get('/api/rom-stats', (req, res) => {
  getRomStats((err, rows) => {
    if (err) {
      console.error('Failed to get rom stats:', err);
      return res.status(500).json({ error: 'Failed to get stats.' });
    }
    res.json({ data: rows });
  });
});

// List available ROMs in the "roms" directory
app.get('/api/roms', (req, res) => {
  fs.readdir(romsDir, (err, files) => {
    if (err) {
      // If the folder somehow doesn't exist, just return an empty list instead of erroring.
      if (err.code === 'ENOENT') {
        return res.json({ roms: [] });
      }

      console.error('Failed to read roms directory:', err.message);
      logSecurityEvent('roms_dir_error', err.message);
      return res.status(500).json({ error: 'Failed to list ROMs.' });
    }

    const roms = (files || []).filter((name) =>
      name.toLowerCase().endsWith('.gba')
    );

    res.json({ roms });
  });
});

// Fallback: serve SPA index.html for any unknown route that isn't API
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  logSecurityEvent('server_error', err.message || String(err));
  res.status(500).json({ error: 'Internal server error.' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running securely at http://localhost:${port}`);
});
