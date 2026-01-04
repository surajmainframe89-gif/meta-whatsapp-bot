const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./whatsapp.db");

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS whatsapp_events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_type TEXT,
      message_id TEXT,
      from_number TEXT,
      to_number TEXT,
      text TEXT,
      status TEXT,
      parentMessageId TEXT,
      timestamp TEXT
    )
  `);
});

module.exports = db;
