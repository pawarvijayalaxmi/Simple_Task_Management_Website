const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'data', 'db.sqlite');
const db = new Database(dbPath);

// Use WAL for better concurrency
try{ db.pragma('journal_mode = WAL'); }catch(e){}

function init(){
  db.prepare(`CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    created_at INTEGER,
    updated_at INTEGER
  )`).run();
}

init();

module.exports = {
  getAll: () => db.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all(),
  getById: (id) => db.prepare('SELECT * FROM tasks WHERE id = ?').get(id),
  create: (task) => db.prepare('INSERT INTO tasks (id, title, description, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)').run(task.id, task.title, task.description, task.status, task.created_at, task.updated_at),
  update: (task) => db.prepare('UPDATE tasks SET title = ?, description = ?, status = ?, updated_at = ? WHERE id = ?').run(task.title, task.description, task.status, task.updated_at, task.id),
  remove: (id) => db.prepare('DELETE FROM tasks WHERE id = ?').run(id)
};
