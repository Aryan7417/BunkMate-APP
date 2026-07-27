import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("bunkmate.db");

export function initDatabase() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS subjects (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      day TEXT NOT NULL,
      room TEXT,
      time TEXT,
      timeRange TEXT,
      period TEXT,
      present INTEGER DEFAULT 0,
      absent INTEGER DEFAULT 0,
      target INTEGER DEFAULT 75
    );
  `);
}