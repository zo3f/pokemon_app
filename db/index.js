/**
 * Database module
 * Handles SQLite database operations with proper error handling
 */

const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const config = require('../config');

const dbPath = config.paths.dbPath;
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to database:', err.message);
    process.exit(1);
  }
  console.log('Connected to SQLite database:', dbPath);
});

// Enable foreign keys and other SQLite optimizations
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');
  db.run('PRAGMA journal_mode = WAL'); // Write-Ahead Logging for better concurrency
});

/**
 * Initialize database tables
 */
const initializeTables = () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run(
        `CREATE TABLE IF NOT EXISTS rom_plays (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          rom_name TEXT NOT NULL,
          played_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        (err) => {
          if (err) {
            console.error('Failed to create rom_plays table:', err.message);
            reject(err);
          }
        }
      );

      db.run(
        `CREATE TABLE IF NOT EXISTS security_events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          event_type TEXT NOT NULL,
          details TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        (err) => {
          if (err) {
            console.error('Failed to create security_events table:', err.message);
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });
  });
};

/**
 * Log a ROM play event
 * @param {string} romName - Name of the ROM file
 * Note: This function is designed to not throw errors to avoid breaking the app,
 * but logs errors for debugging purposes in development mode.
 */
const logRomPlay = (romName) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO rom_plays (rom_name) VALUES (?)',
      [romName],
      function (err) {
        if (err) {
          // Log error with context for debugging
          const errorMessage = `Failed to log rom play for "${romName}": ${err.message}`;
          console.error(errorMessage);
          
          // In development, also log stack trace for better debugging
          if (config.server.env === 'development') {
            console.error('Stack trace:', err.stack);
          }
          
          // Log to security events for monitoring
          logSecurityEvent('rom_play_log_error', errorMessage);
          
          reject(err);
        } else {
          if (config.server.env === 'development') {
            console.log(`Successfully logged rom play: ${romName} (ID: ${this.lastID})`);
          }
          resolve(this.lastID);
        }
      }
    );
  }).catch((err) => {
    // Don't break the app if logging fails, but ensure error is visible for debugging
    // This is intentional - logging failures shouldn't prevent gameplay
    if (config.server.env === 'development') {
      console.warn('ROM play logging failed (non-critical):', err.message);
    }
    // Return undefined to indicate failure without throwing
    return undefined;
  });
};

/**
 * Log a security event
 * @param {string} type - Type of security event
 * @param {string} details - Additional details
 */
const logSecurityEvent = (type, details) => {
  db.run(
    'INSERT INTO security_events (event_type, details) VALUES (?, ?)',
    [type, details || null],
    (err) => {
      if (err) {
        console.error('Failed to log security event:', err.message);
      }
    }
  );
};

/**
 * Get ROM play statistics
 * @param {Function} callback - Callback function (err, rows)
 */
const getRomStats = (callback) => {
  db.all(
    `SELECT 
      rom_name, 
      COUNT(*) as play_count,
      MAX(played_at) as last_played
    FROM rom_plays 
    GROUP BY rom_name 
    ORDER BY play_count DESC`,
    (err, rows) => {
      if (err) {
        callback(err);
      } else {
        callback(null, rows);
      }
    }
  );
};

// Initialize tables on module load
initializeTables().catch((err) => {
  console.error('Failed to initialize database:', err);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

module.exports = {
  logRomPlay,
  logSecurityEvent,
  getRomStats,
  db, // Export db for advanced use cases
};

