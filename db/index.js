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
 */
const logRomPlay = (romName) => {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO rom_plays (rom_name) VALUES (?)',
      [romName],
      function (err) {
        if (err) {
          console.error('Failed to log rom play:', err.message);
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  }).catch(() => {
    // Fail silently for logging - don't break the app if logging fails
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

