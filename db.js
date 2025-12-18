const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'data.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize simple tables for demonstration: rom play history + security logs.
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS rom_plays (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rom_name TEXT NOT NULL,
      played_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS security_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT NOT NULL,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
});

function logRomPlay(romName) {
  db.run(
    'INSERT INTO rom_plays (rom_name) VALUES (?)',
    [romName],
    (err) => {
      if (err) {
        console.error('Failed to log rom play:', err.message);
      }
    }
  );
}

function logSecurityEvent(type, details) {
  db.run(
    'INSERT INTO security_events (event_type, details) VALUES (?, ?)',
    [type, details || null],
    (err) => {
      if (err) {
        console.error('Failed to log security event:', err.message);
      }
    }
  );
}

function getRomStats(callback) {
  db.all(
    'SELECT rom_name, COUNT(*) as play_count FROM rom_plays GROUP BY rom_name ORDER BY play_count DESC',
    (err, rows) => {
      if (err) {
        callback(err);
      } else {
        callback(null, rows);
      }
    }
  );
}

module.exports = {
  logRomPlay,
  logSecurityEvent,
  getRomStats,
};



