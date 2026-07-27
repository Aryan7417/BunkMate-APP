import { TimetableEntry } from "@/context/TimetableContext.tsx";
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



export function getSubjectsFromDB() {
  return db.getAllSync("SELECT * FROM subjects");
}

export function addSubjectToDB(subject: TimetableEntry, day: string) {
  try {
    db.runSync(
      `INSERT INTO subjects
      (id,name,day,room,time,timeRange,period,present,absent,target)
      VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        subject.id,
        subject.name,
        day,
        subject.room,
        subject.time,
        subject.timeRange,
        subject.period,
        subject.present,
        subject.absent,
        subject.target,
      ]
    );

    console.log("✅ Saved to SQLite");

    const rows = db.getAllSync("SELECT * FROM subjects");
    console.log("📦 Database:", rows);

  } catch (e) {
    console.error("❌ SQLite Error:", e);
  }
}



export function deleteSubjectFromDB(id: string) {
  db.runSync(
    `DELETE FROM subjects WHERE id = ?`,
    [id]
  );

  console.log("🗑️ Deleted:", id);
}



export function updateSubjectInDB(subject: TimetableEntry, day: string) {
  db.runSync(
    `UPDATE subjects
     SET
       name = ?,
       day = ?,
       room = ?,
       time = ?,
       timeRange = ?,
       period = ?,
       present = ?,
       absent = ?,
       target = ?
     WHERE id = ?`,
    [
      subject.name,
      day,
      subject.room,
      subject.time,
      subject.timeRange,
      subject.period,
      subject.present,
      subject.absent,
      subject.target,
      subject.id,
    ]
  );

  console.log("✏️ Updated:", subject.id);
}


export function markPresentInDB(id: string) {
  db.runSync(
    `UPDATE subjects
     SET present = present + 1
     WHERE id = ?`,
    [id]
  );
}

export function markAbsentInDB(id: string) {
  db.runSync(
    `UPDATE subjects
     SET absent = absent + 1
     WHERE id = ?`,
    [id]
  );
}